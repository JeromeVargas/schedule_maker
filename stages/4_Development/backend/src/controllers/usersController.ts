import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  isValidId,
  insertResource,
  findFilterAllResources,
  findResourceById,
  findResourceByProperty,
  updateFilterResource,
  deleteFilterResource,
} from "../services/mongoServices";

// @desc create a user
// @route POST /api/v1/user
// @access Private
// @fields: body: {firstName:[string], lastName:[string], school_id:[string], email:[string], password:[string], password:[string], role:[string], status:[string], hasTeachingFunc:[boolean]}
const createUser = async ({ body }: Request, res: Response) => {
  /* check if the school id is valid */
  const { school_id, email } = body;
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* check if the school exists */
  const schoolModel = "school";
  const schoolSearchCriteria = school_id;
  const schoolFieldsToReturn = "-password -createdAt -updatedAt";
  const existingSchool = await findResourceById(
    schoolSearchCriteria,
    schoolFieldsToReturn,
    schoolModel
  );
  if (!existingSchool) {
    throw new ConflictError("Please create the school first");
  }
  /* check if the email is already in use */
  const searchCriteria = { email: email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const duplicatedUserEmailFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedUserEmailFound) {
    throw new ConflictError("Please try a different email address");
  }
  /* create the user */
  const userCreated = await insertResource(body, model);
  if (!userCreated) {
    throw new BadRequestError("User not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "User created successfully!" });
};

// @desc get all the users
// @route GET /api/v1/user
// @access Private
// @fields: body: {school_id:[string]}
const getUsers = async ({ body }: Request, res: Response) => {
  /* Destructure the fields */
  const { school_id } = body;
  /* check if the school is valid */
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* filter by school id */
  const filters = { school_id: school_id };
  const model = "user";
  const fieldsToReturn = "-createdAt -updatedAt";

  const usersFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    model
  );
  /* get all fields */
  if (usersFound?.length === 0) {
    throw new NotFoundError("No users found");
  }
  res.status(StatusCodes.OK).json(usersFound);
};

// @desc get the user by id
// @route GET /api/v1/user/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string], prevName:[string]}
const getUser = async ({ params, body }: Request, res: Response) => {
  /* check if ids are valid */
  const { id: UserId } = params;
  const isValidFieldId = isValidId(UserId);
  if (isValidFieldId === false) {
    throw new BadRequestError("Invalid user id");
  }
  const { school_id } = body;
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* get the user */
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "field";
  const userFound = await findResourceById(UserId, fieldsToReturn, model);
  /* check if the field exists */
  if (!userFound) {
    throw new NotFoundError("User not found");
  }
  /* check if the field belongs to the school */
  if (userFound?.school_id?.toString() !== school_id) {
    throw new ConflictError("The school id is not correct!");
  }
  res.status(StatusCodes.OK).json(userFound);
};

// @desc update a user
// @route PUT /api/v1/user/:id
// @access Private
// @fields: params: {id:[string]},  body: {firstName:[string], lastName:[string], school_id:[string], email:[string], password:[string], password:[string], role:[string], status:[string], hasTeachingFunc:[boolean]}
const updateUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the body */
  const { id: userId } = params;
  const { school_id, email } = body;
  /* check if the user and school ids are valid */
  const isValidUserId = isValidId(userId);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user id");
  }
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* check if the user email is already in use by another user */
  const searchCriteria = { email: email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const duplicatedEmail = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedEmail && duplicatedEmail?._id?.toString() !== userId) {
    throw new ConflictError("Please try a different email address");
  }
  /* check if the field is the same as the one passed and update the field */
  const filtersUpdate = [{ _id: userId }, { school: school_id }];
  const newUser = body;
  const fieldUpdated = await updateFilterResource(
    filtersUpdate,
    newUser,
    model
  );
  if (!fieldUpdated) {
    throw new NotFoundError("User not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "User updated" });
};

// @desc delete a user
// @route DELETE /api/v1/user/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string], prevName:[string]}
const deleteUser = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: userId } = params;
  const { school_id } = body;
  /* check if the ids are valid */
  const isValidUserId = isValidId(userId);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user id");
  }
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* delete the user */
  const filtersDelete = [{ _id: userId }, { school: school_id }];
  const model = "user";
  const userDeleted = await deleteFilterResource(filtersDelete, model);
  if (!userDeleted) {
    throw new NotFoundError("User not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
