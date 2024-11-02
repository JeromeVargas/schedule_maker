import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertTeacher,
  findTeacherByProperty,
  findFilterAllTeachers,
  modifyFilterTeacher,
  removeFilterTeacher,
  /* Services from other entities */
  findPopulateFilterAllUsers,
} from "./teacherServices";

/* global controller reference */
const maxHours = 70; // number of hours in a week

// @desc create a user
// @route POST /api/v1/teachers
// @access Private
// @fields: body: {user_id: [string],  coordinator_id: [string],  contractType: [string], teachingHoursAssignable: [number],  teachingHoursAssigned: [number], adminHoursAssignable: [number], adminHoursAssigned: [number], monday: [boolean], tuesday: [boolean], wednesday: [boolean], thursday: [boolean], friday: [boolean], saturday: [boolean], sunday: [boolean]}
const createTeacher = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    user_id,
    contractType,
    teachingHoursAssignable,
    teachingHoursAssigned,
    adminHoursAssignable,
    adminHoursAssigned,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if hours assignable do not exceed the max allowed number of hours */
  if (adminHoursAssignable + teachingHoursAssignable > maxHours) {
    throw new BadRequestError(
      `total hours assignable must not exceed ${maxHours} hours`
    );
  }
  /* check if admin hours assigned do not exceed the admin hours assignable */
  if (adminHoursAssigned > adminHoursAssignable) {
    throw new BadRequestError(
      `admin hours assigned must not exceed the admin hours assignable, ${adminHoursAssignable} hours`
    );
  }
  /* check if teaching hours assigned do not exceed the teaching hours assignable */
  if (teachingHoursAssigned > teachingHoursAssignable) {
    throw new BadRequestError(
      `teaching hours assigned must not exceed the teaching hours assignable, ${teachingHoursAssignable} hours`
    );
  }
  /* check if the user is already a teacher */
  const teacherSearchCriteria = { school_id, user_id };
  const teacherFieldsToReturn = "-createdAt -updatedAt";
  const existingTeacher = await findTeacherByProperty(
    teacherSearchCriteria,
    teacherFieldsToReturn
  );
  if (existingTeacher) {
    throw new ConflictError("User is already a teacher");
  }
  /* check if the user and  exist */
  const userSearchCriteria = user_id;
  const userFieldsToReturn = "-password -createdAt -updatedAt";
  const userFieldsToPopulate = "school_id";
  const userFieldsToReturnPopulate = "-createdAt -updatedAt";
  const existingUser = await findPopulateFilterAllUsers(
    userSearchCriteria,
    userFieldsToReturn,
    userFieldsToPopulate,
    userFieldsToReturnPopulate
  );
  if (!existingUser) {
    throw new BadRequestError("Please create the base user first");
  }
  if (existingUser.status !== "active") {
    throw new BadRequestError(`The user is ${existingUser.status}`);
  }
  // make sure the user has the correct role to be a teacher, either teacher, coordinator or headmaster
  if (
    (existingUser?.role as String) !== "teacher" &&
    (existingUser?.role as String) !== "coordinator" &&
    (existingUser?.role as String) !== "headmaster"
  ) {
    throw new BadRequestError(
      "Please pass a user with a teacher function assignable role such as: teacher, coordinator or headmaster"
    );
  }
  // check if the user school exists/
  if (existingUser?.school_id?._id.toString() !== school_id) {
    throw new BadRequestError("Please make sure the user's school is correct");
  }
  /* create the teacher */
  const newTeacher = {
    school_id: school_id,
    user_id: user_id,
    contractType: contractType,
    teachingHoursAssignable: teachingHoursAssignable,
    teachingHoursAssigned: teachingHoursAssigned,
    adminHoursAssignable: adminHoursAssignable,
    adminHoursAssigned: adminHoursAssigned,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const teacherCreated = await insertTeacher(newTeacher);
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
  const filters = { school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teachersFound = await findFilterAllTeachers(filters, fieldsToReturn);
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
  const { id: _id } = params;
  const { school_id } = body;
  /* get the teacher */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherFound = await findTeacherByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!teacherFound) {
    throw new NotFoundError("Teacher not found");
  }
  res.status(StatusCodes.OK).json(teacherFound);
};

// @desc update a user
// @route PUT /api/v1/teachers/:id
// @access Private
// @fields: params: {id:[string]}, body: {user_id: [string], coordinator_id: [string], contractType: [string], teachingHoursAssignable: [number],  teachingHoursAssigned: [number], adminHoursAssignable: [number],  adminHoursAssigned: [number],monday: [boolean], tuesday: [boolean], wednesday: [boolean], thursday: [boolean], friday: [boolean], saturday: [boolean], sunday: [boolean]}
const updateTeacher = async ({ body, params }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherId } = params;
  const {
    school_id,
    user_id,
    contractType,
    teachingHoursAssignable,
    teachingHoursAssigned,
    adminHoursAssignable,
    adminHoursAssigned,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if hours assignable do not exceed the max allowed number of hours */
  if (adminHoursAssignable + teachingHoursAssignable > maxHours) {
    throw new BadRequestError(
      `total hours assignable must not exceed ${maxHours} hours`
    );
  }
  /* check if admin hours assigned do not exceed the admin hours assignable */
  if (adminHoursAssigned > adminHoursAssignable) {
    throw new BadRequestError(
      `admin hours assigned must not exceed the admin hours assignable, ${adminHoursAssignable} hours`
    );
  }
  /* check if teaching hours assigned do not exceed the teaching hours assignable */
  if (teachingHoursAssigned > teachingHoursAssignable) {
    throw new BadRequestError(
      `teaching hours assigned must not exceed the teaching hours assignable, ${teachingHoursAssignable} hours`
    );
  }
  /* check if the user exist */
  const userSearchCriteria = user_id;
  const userFieldsToReturn = "-password -createdAt -updatedAt";
  const userFieldsToPopulate = "school_id";
  const userFieldsToReturnPopulate = "-createdAt -updatedAt";
  const existingUser = await findPopulateFilterAllUsers(
    userSearchCriteria,
    userFieldsToReturn,
    userFieldsToPopulate,
    userFieldsToReturnPopulate
  );
  if (!existingUser) {
    throw new BadRequestError("Please create the base user first");
  }
  if (existingUser.status !== "active") {
    throw new BadRequestError(`The user is ${existingUser.status}`);
  }
  // make sure the user has the correct role to be a teacher, either teacher, coordinator or headmaster
  if (
    existingUser?.role !== "teacher" &&
    existingUser?.role !== "coordinator" &&
    existingUser?.role !== "headmaster"
  ) {
    throw new BadRequestError(
      "Please pass a user with a teacher function assignable role such as: teacher, coordinator or headmaster"
    );
  }
  // check if the user school exists/
  if (existingUser?.school_id?._id.toString() !== school_id) {
    throw new BadRequestError("Please make sure the user's school is correct");
  }
  /* update if the teacher, user and school ids are the same one as the one passed and update the field */
  const filtersUpdate = {
    _id: teacherId,
    school_id: school_id,
    user_id: user_id,
  };
  const newTeacher = {
    school_id: school_id,
    user_id: user_id,
    contractType: contractType,
    teachingHoursAssignable: teachingHoursAssignable,
    teachingHoursAssigned: teachingHoursAssigned,
    adminHoursAssignable: adminHoursAssignable,
    adminHoursAssigned: adminHoursAssigned,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const teacherUpdated = await modifyFilterTeacher(filtersUpdate, newTeacher);
  if (!teacherUpdated) {
    throw new BadRequestError("Teacher not updated");
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
  const fieldDeleted = await removeFilterTeacher(filtersDelete);
  if (!fieldDeleted) {
    throw new NotFoundError("Teacher not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher deleted" });
};

export { createTeacher, getTeachers, getTeacher, updateTeacher, deleteTeacher };
