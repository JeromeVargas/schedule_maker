import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import NotFoundError from "../../errors/not-found";

import {
  insertClass,
  findClassByProperty,
  findFilterAllClasses,
  modifyFilterClass,
  removeFilterClass,
  /* Services from other entities */
  findPopulateGroupById,
  findPopulateSubjectById,
  findPopulateTeacherFieldById,
} from "./classServices";

/* global controller reference */
const maxMinutesInDay = 1439;

// @desc create a class
// @route POST /api/v1/classes
// @access Private
// @fields: body {school_id:[string], level_id:[string], group_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const createClass = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    level_id,
    group_id,
    subject_id,
    teacherField_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  // find if the start time is later than the 23:59 hours
  if (startTime > maxMinutesInDay) {
    throw new BadRequestError("The class start time must not exceed 23:00");
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id level_id coordinator_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateGroupById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup
  );
  if (!groupFound) {
    throw new BadRequestError("Please make sure the group exists");
  }
  // find if the school exists for the group and matches the school in the body
  if (groupFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  // find if the level exists for group and matches the level in the body
  if (groupFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the level"
    );
  }
  // find if the school exists for the coordinator and matches the school in the body
  if (groupFound?.coordinator_id?.school_id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the school"
    );
  }
  // the coordinator being an actual coordinator and the role active
  if (groupFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id level_id field_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
  const subjectFound = await findPopulateSubjectById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject
  );
  if (!subjectFound) {
    throw new BadRequestError("Please make sure the subject exists");
  }
  // find if the school exists for subject and matches the school in the body
  if (subjectFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the school"
    );
  }
  // find if the level exists for subject and matches the level in the body
  if (subjectFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the level"
    );
  }
  /* find if the teacher_field already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateTeacherFieldById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField
  );
  if (!teacherFieldFound) {
    throw new BadRequestError(
      "Please make sure the field_teacher assignment exists"
    );
  }
  // find if the school exists for field_teacher assignment and matches the school in the body
  if (teacherFieldFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field assigned to the teacher belongs to the school"
    );
  }
  /* find if the coordinator for the teacher and group is the same */
  // other checks such as the existence, status and role have already been taken care of by the group checks
  if (
    groupFound?.coordinator_id?._id?.toString() !==
    teacherFieldFound?.teacher_id?.coordinator_id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the teacher has been assigned to the coordinator being passed in the group"
    );
  }
  /* find if the field for the teacher is the same in parent subject */
  if (
    subjectFound?.field_id?._id?.toString() !==
    teacherFieldFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* create class */
  const newClass = {
    school_id: school_id,
    level_id: level_id,
    group_id: group_id,
    subject_id: subject_id,
    teacherField_id: teacherField_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const classCreated = await insertClass(newClass);
  if (!classCreated) {
    throw new BadRequestError("Class not created!");
  }
  res.status(StatusCodes.CREATED).json({ msg: "Class created!" });
};

// @desc get all the classes
// @route GET /api/v1/classes
// @access Private
// @fields: body {school_id:[string]}
const getClasses = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const classesFound = await findFilterAllClasses(filters, fieldsToReturn);
  /* get all fields */
  if (classesFound?.length === 0) {
    throw new NotFoundError("No classes found");
  }
  res.status(StatusCodes.OK).json(classesFound);
};

// @desc get the Class by id
// @route GET /api/v1/classes/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getClass = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the class */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const classFound = await findClassByProperty(searchCriteria, fieldsToReturn);
  if (!classFound) {
    throw new NotFoundError("Class not found");
  }
  res.status(StatusCodes.OK).json(classFound);
};

// @desc update a Class
// @route PUT /api/v1/classes/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string], level_id:[string], group_id:[string], subject_id:[string],  teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const updateClass = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: classId } = params;
  const {
    school_id,
    level_id,
    group_id,
    subject_id,
    teacherField_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  // find if the start time is later than the 23:59 hours
  if (startTime > maxMinutesInDay) {
    throw new BadRequestError("The class start time must not exceed 23:00");
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id level_id coordinator_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateGroupById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup
  );
  if (!groupFound) {
    throw new BadRequestError("Please make sure the group exists");
  }
  // find if the school exists for group and matches the school in the body
  if (groupFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  // find if the level exists for group and matches the level in the body
  if (groupFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the level"
    );
  }
  // find if the school exists for the coordinator and matches the school in the body
  if (groupFound?.coordinator_id?.school_id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the school"
    );
  }
  // the coordinator being an actual coordinator and the role active has already been taken care of by the previous checks for the subject
  if (groupFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id level_id field_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
  const subjectFound = await findPopulateSubjectById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject
  );
  if (!subjectFound) {
    throw new BadRequestError("Please make sure the subject exists");
  }
  // find if the school exists for subject and matches the school in the body
  if (subjectFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the school"
    );
  }
  // find if the level exists for subject and matches the level in the body
  if (subjectFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the level"
    );
  }
  /* find if the teacher_field already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateTeacherFieldById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField
  );
  if (!teacherFieldFound) {
    throw new BadRequestError(
      "Please make sure the field_teacher assignment exists"
    );
  }
  // find if the school exists for field_teacher assignment and matches the school in the body
  if (teacherFieldFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field assigned to the teacher belongs to the school"
    );
  }
  /* find if the coordinator for the teacher and group is the same */
  // other checks such as the existence, status and role have already been taken care of by the group checks
  if (
    groupFound?.coordinator_id?._id?.toString() !==
    teacherFieldFound?.teacher_id?.coordinator_id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the teacher has been assigned to the coordinator being passed in the group"
    );
  }
  /* find if the field for the teacher is the same in parent subject */
  if (
    subjectFound?.field_id?._id?.toString() !==
    teacherFieldFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* update class */
  const filtersUpdate = { _id: classId, school_id: school_id };
  const newClass = {
    school_id: school_id,
    level_id: level_id,
    group_id: group_id,
    subject_id: subject_id,
    teacherField_id: teacherField_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const classUpdated = await modifyFilterClass(filtersUpdate, newClass);
  if (!classUpdated) {
    throw new NotFoundError("Class not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Class updated!" });
};

// @desc delete a Class
// @route DELETE /api/v1/classes/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteClass = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: classId } = params;
  const { school_id } = body;
  /* delete class */
  const filtersDelete = { _id: classId, school_id: school_id };
  const classDeleted = await removeFilterClass(filtersDelete);
  if (!classDeleted) {
    throw new NotFoundError("Class not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Class deleted" });
};

export { createClass, getClasses, getClass, updateClass, deleteClass };
