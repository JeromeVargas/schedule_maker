import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  insertResource,
  findResourceById,
  findResourceByProperty,
  findFilterAllResources,
  findPopulateFilterAllResources,
  findFilterResourceByProperty,
  updateFilterResource,
  deleteFilterResource,
} from "../services/mongoServices";

// @desc create a user
// @route POST /api/v1/teachers
// @access Private
// @fields: body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: number;  hoursAssigned: number}
const createTeacher = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { user_id, coordinator_id } = body;
  /* check if the user exists, is active and has teaching functions */
  const userSearchCriteria = [user_id, coordinator_id];
  const userFieldsToReturn = "-password -createdAt -updatedAt";
  const userFieldsToPopulate = "school_id";
  const userFieldsToReturnPopulate = "-_id -createdAt -updatedAt";
  const userModel = "user";
  const existingUserSchoolCoordinator = await findPopulateFilterAllResources(
    userSearchCriteria,
    userFieldsToReturn,
    userFieldsToPopulate,
    userFieldsToReturnPopulate,
    userModel
  );
  const existingUser = existingUserSchoolCoordinator.find(
    (user: any) => user?._id == user_id
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
  /* check if the school exists*/
  if (!existingUser?.school_id) {
    throw new BadRequestError("Please create the school first");
  }
  /* check if the coordinator exists, has a coordinator role and it is active */
  const existingCoordinator = existingUserSchoolCoordinator.find(
    (user: any) => user?._id == coordinator_id
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
  /* check if the user is already a teacher */
  const teacherModel = "teacher";
  const teacherSearchCriteria = { user_id };
  const teacherFieldsToReturn = "-createdAt -updatedAt";
  const existingTeacher = await findResourceByProperty(
    teacherSearchCriteria,
    teacherFieldsToReturn,
    teacherModel
  );
  if (existingTeacher) {
    throw new ConflictError("User is already a teacher");
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
// @route GET /api/v1/teachers
// @access Private
// @fields: body: {school_id:[string]}
const getTeachers = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const model = "teacher";
  const fieldsToReturn = "-createdAt -updatedAt";
  const teachersFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    model
  );
  /* get all fields */
  if (teachersFound?.length === 0) {
    throw new NotFoundError("No teachers found");
  }
  res.status(StatusCodes.OK).json(teachersFound);
};

// @desc get the user by id
// @route GET /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getTeacher = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const { school_id } = body;
  /* get the teacher */
  const filters = [{ _id: teacherId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "teacher";
  const teacherFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    model
  );
  if (teacherFound?.length === 0) {
    throw new NotFoundError("Teacher not found");
  }
  res.status(StatusCodes.OK).json(teacherFound);
};

// @desc update a user
// @route PUT /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {user_id: [string];  coordinator_id: [string];  contractType: [string];  hoursAssignable: number;  hoursAssigned: number}
const updateTeacher = async ({ body, params }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const { school_id, user_id, coordinator_id } = body;
  /* check if coordinator exists, has the role and is active  */
  const coordinatorSearchCriteria = coordinator_id;
  const coordinatorFieldsToReturn = "-password -createdAt -updatedAt";
  const userModel = "user";
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
  /* update if the teacher, user and school ids are the same one as the one passed and update the field */
  const filtersUpdate = [
    { _id: teacherId },
    { user_id: user_id },
    { school_id: school_id },
  ];
  const newTeacher = body;
  const teacherModel = "teacher";
  const teacherUpdated = await updateFilterResource(
    filtersUpdate,
    newTeacher,
    teacherModel
  );
  if (!teacherUpdated) {
    throw new NotFoundError("Teacher not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher updated" });
};

// @desc delete a user
// @route DELETE /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteTeacher = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const { school_id } = body;
  /* delete teacher */
  const filtersDelete = { _id: teacherId, school_id: school_id };
  const model = "teacher";
  const fieldDeleted = await deleteFilterResource(filtersDelete, model);
  if (!fieldDeleted) {
    throw new NotFoundError("Teacher not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher deleted" });
};

export { createTeacher, getTeachers, getTeacher, updateTeacher, deleteTeacher };
