import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  isValidId,
  insertResource,
  findAllResources,
  findResourceById,
  findResourceByProperty,
  updateResource,
  deleteResource,
} from "../services/mongoServices";

// @desc create a user
// @route POST /api/v1/user
// @access Private
const createUser = async ({ body }: Request, res: Response) => {
  //check if the school id is valid
  const { school: school_id } = body;
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school Id");
  }
  // check if the email is already in use
  const searchCriteria = { email: body.email };
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
  // check if the school exists
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
  // create the user
  const userCreated = await insertResource(body, model);
  if (!userCreated) {
    throw new BadRequestError("User not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "User created successfully!" });
};

// @desc get all the users
// @route GET /api/v1/user
// @access Private
const getUsers = async (req: Request, res: Response) => {
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const usersFound = await findAllResources(fieldsToReturn, model);
  if (!usersFound || usersFound.length === 0) {
    throw new NotFoundError("No users found");
  }
  res.status(StatusCodes.OK).json(usersFound);
};

// @desc get the user by Id
// @route GET /api/v1/user/:id
// @access Private
const getUser = async ({ params }: Request, res: Response) => {
  // check if the user id is valid
  const { id: userId } = params;
  const isValidUserId = isValidId(userId);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user Id");
  }
  // find the user
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const userFound = await findResourceById(userId, fieldsToReturn, model);
  if (!userFound) {
    throw new NotFoundError("User not found");
  }
  res.status(StatusCodes.OK).json(userFound);
};

// @desc update a user
// @route PUT /api/v1/user/:id
// @access Private
const updateUser = async ({ body, params }: Request, res: Response) => {
  // check if the user and school id are valid
  const { id: userId } = params;
  const isValidUserId = isValidId(userId);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user Id");
  }
  const { school: school_id } = body;
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school Id");
  }
  // check if the user email is already in use by another user
  const searchCriteria = { email: body.email };
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "user";
  const duplicatedEmail = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedEmail && duplicatedEmail?._id.toString() !== userId) {
    throw new ConflictError("Please try a different email address");
  }
  // check if the user's school already exists
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
  // update the user info
  const userUpdated = await updateResource(userId, body, model);
  if (!userUpdated) {
    throw new NotFoundError("User not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "User updated" });
};

// @desc delete a user
// @route DELETE /api/v1/user/:id
// @access Private
const deleteUser = async ({ params }: Request, res: Response) => {
  // check if the user id in the url is valid
  const { id: userId } = params;
  const isValidUserId = isValidId(userId);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user Id");
  }
  // delete the user
  const model = "user";
  const userDeleted = await deleteResource(userId, model);
  if (!userDeleted) {
    throw new NotFoundError("User not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "User deleted" });
};

export { createUser, getUsers, getUser, updateUser, deleteUser };
