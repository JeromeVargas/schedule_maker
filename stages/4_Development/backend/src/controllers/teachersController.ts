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
const createTeacher = async ({ body }: Request, res: Response) => {
  /*  check if the user id is valid */
  const { user_id } = body;
  const isValidUserId = isValidId(user_id);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user Id");
  }
  /* check if the coordinator id is valid */
  const { coordinator_id } = body;
  const isValidCoordinatorId = isValidId(coordinator_id);
  if (isValidCoordinatorId === false) {
    throw new BadRequestError("Invalid coordinator Id");
  }
  /* check if the teacher already exists */
  const teacherModel = "teacher";
  const teacherSearchCriteria = { user_id };
  const teacherFieldsToReturn = "-password -createdAt -updatedAt";
  const existingTeacher = await findResourceByProperty(
    teacherSearchCriteria,
    teacherFieldsToReturn,
    teacherModel
  );
  if (existingTeacher) {
    throw new ConflictError("User is already a teacher");
  }
  /* check if the user exists */
  const userModel = "user";
  const userSearchCriteria = user_id;
  const userFieldsToReturn = "-password -createdAt -updatedAt";
  const existingUser = await findResourceById(
    userSearchCriteria,
    userFieldsToReturn,
    userModel
  );
  if (!existingUser) {
    throw new BadRequestError("Please create the base user first");
  }
  if (existingUser.status !== "active") {
    throw new BadRequestError("The user is not active");
  }
  if (existingUser.hasTeachingFunc !== true) {
    throw new BadRequestError(
      "The user does not have teaching functions assigned"
    );
  }
  /* check if the coordinator exists */
  const coordinatorSearchCriteria = coordinator_id;
  const coordinatorFieldsToReturn = "-password -createdAt -updatedAt";
  const existingCoordinator = await findResourceById(
    coordinatorSearchCriteria,
    coordinatorFieldsToReturn,
    userModel
  );
  if (!existingCoordinator) {
    throw new BadRequestError("Please pass an existent coordinator");
  }
  if (existingCoordinator?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (existingCoordinator?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* create the teacher */
  const teacherCreated = await insertResource(body, teacherModel);
  if (!teacherCreated) {
    throw new BadRequestError("Teacher not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Teacher created successfully!" });
};

// @desc get all the users
// @route GET /api/v1/user
// @access Private
const getTeachers = async (req: Request, res: Response) => {
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "teacher";
  const teachersFound = await findAllResources(fieldsToReturn, model);
  if (!teachersFound || teachersFound?.length === 0) {
    throw new NotFoundError("No teachers found");
  }
  res.status(StatusCodes.OK).json(teachersFound);
};

// @desc get the user by Id
// @route GET /api/v1/user/:id
// @access Private
const getTeacher = async ({ params }: Request, res: Response) => {
  /* check if the id is valid */
  const { id: teacher_id } = params;
  const isValidTeacherId = isValidId(teacher_id);
  if (isValidTeacherId === false) {
    throw new BadRequestError("Invalid teacher user Id");
  }
  /* get the teacher */
  const fieldsToReturn = "-password -createdAt -updatedAt";
  const model = "teacher";
  const teacherFound = await findResourceById(
    teacher_id,
    fieldsToReturn,
    model
  );
  if (!teacherFound) {
    throw new NotFoundError("Teacher not found");
  }
  res.status(StatusCodes.OK).json(teacherFound);
};

// @desc update a user
// @route PUT /api/v1/user/:id
// @access Private
const updateTeacher = async ({ body, params }: Request, res: Response) => {
  /* param and body user id check */
  if (params.id !== body.user_id) {
    throw new BadRequestError("Param id does not match user id");
  }
  /* ids check */
  const { id: user_id } = params;
  const isValidUserId = isValidId(user_id);
  if (isValidUserId === false) {
    throw new BadRequestError("Invalid user Id");
  }
  const { coordinator_id } = body;
  const isValidCoordinatorId = isValidId(coordinator_id);
  if (isValidCoordinatorId === false) {
    throw new BadRequestError("Invalid coordinator Id");
  }
  /* check if teacher exists */
  const teacherModel = "teacher";
  const teacherSearchCriteria = { user_id };
  const teacherFieldsToReturn = "-password -createdAt -updatedAt";
  const existingTeacher = await findResourceByProperty(
    teacherSearchCriteria,
    teacherFieldsToReturn,
    teacherModel
  );
  if (!existingTeacher) {
    throw new BadRequestError("Please create the teacher first");
  }
  /* check if coordinator exists  */
  const userModel = "user";
  const coordinatorSearchCriteria = coordinator_id;
  const coordinatorFieldsToReturn = "-password -createdAt -updatedAt";
  const existingCoordinator = await findResourceById(
    coordinatorSearchCriteria,
    coordinatorFieldsToReturn,
    userModel
  );
  if (!existingCoordinator) {
    throw new BadRequestError("Please pass an existent coordinator");
  }
  if (existingCoordinator?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (existingCoordinator?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* update user */
  const userUpdated = await updateResource(
    existingTeacher._id,
    body,
    teacherModel
  );
  console.log(userUpdated);
  if (!userUpdated) {
    throw new NotFoundError("Teacher not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher updated" });
};

// @desc delete a user
// @route DELETE /api/v1/user/:id
// @access Private
const deleteTeacher = async ({ params }: Request, res: Response) => {
  // check if the id is valid
  const { id: teacher_id } = params;
  const isValidTeacherId = isValidId(teacher_id);
  if (isValidTeacherId === false) {
    throw new BadRequestError("Invalid user teacher Id");
  }
  const model = "teacher";
  const userDeleted = await deleteResource(teacher_id, model);
  if (!userDeleted) {
    throw new NotFoundError("Teacher not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher deleted" });
};

export { createTeacher, getTeachers, getTeacher, updateTeacher, deleteTeacher };
