import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import NotFoundError from "../../errors/not-found";

import {
  deleteFilterResource,
  findFilterAllResources,
  findPopulateResourceById,
  findResourceByProperty,
  insertResource,
  updateFilterResource,
} from "../../services/mongoServices";

/* models */
const classModel = "class";
const subjectModel = "subject";
const teacherFieldModel = "teacherField";

// @desc create a class
// @route POST /api/v1/classes
// @access Private
// @fields: body {school_id:[string], coordinator_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const createClass = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    coordinator_id,
    subject_id,
    teacherField_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id coordinator_id group_id field_id";
  const fieldsToReturnPopulateSubject =
    "-createdAt -updatedAt -password -email";
  const subjectFound = await findPopulateResourceById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject,
    subjectModel
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
  // find if the coordinator for the subject is the same in the body, it is an actual coordinator and the role is active
  if (subjectFound?.coordinator_id?._id?.toString() !== coordinator_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the class parent subject"
    );
  }
  if (subjectFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (subjectFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the teacher_field already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateResourceById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField,
    teacherFieldModel
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
  // find if the coordinator for the teacher is the same in the body, the coordinator being an actual coordinator and the role active has already been taken care of by the previous checks for the subject
  if (
    teacherFieldFound?.teacher_id?.coordinator_id?.toString() !== coordinator_id
  ) {
    throw new BadRequestError(
      "Please make sure the teacher has been assigned to the coordinator being passed"
    );
  }
  // find if the field for the teacher is the same in parent subject
  if (
    teacherFieldFound?.field_id?.toString() !==
    subjectFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* create class */
  const newClass = {
    school_id: school_id,
    coordinator_id: coordinator_id,
    subject_id: subject_id,
    teacherField_id: teacherField_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const classCreated = await insertResource(newClass, classModel);
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
  const classesFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    classModel
  );
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
  const searchCriteria = { _id, school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const classFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    classModel
  );
  if (!classFound) {
    throw new NotFoundError("Class not found");
  }
  res.status(StatusCodes.OK).json(classFound);
};

// @desc update a Class
// @route PUT /api/v1/classes/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string], coordinator_id:[string], subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const updateClass = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: classId } = params;
  const {
    school_id,
    coordinator_id,
    subject_id,
    teacherField_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  /* find subject by id, and populate its properties */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id coordinator_id group_id field_id";
  const fieldsToReturnPopulateSubject =
    "-createdAt -updatedAt -password -email";
  const subjectFound = await findPopulateResourceById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject,
    subjectModel
  );
  if (!subjectFound) {
    throw new NotFoundError("Please make sure the subject exists");
  }
  // find if the school exists for subject and matches the school in the body
  if (subjectFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the school"
    );
  }
  // find if the coordinator for the subject is the same in the body, it is an actual coordinator and the role is active
  if (subjectFound?.coordinator_id?._id?.toString() !== coordinator_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the class parent subject"
    );
  }
  if (subjectFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (subjectFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find teacher_field by id, and populate its properties */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateResourceById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField,
    teacherFieldModel
  );
  if (!teacherFieldFound) {
    throw new NotFoundError("Please make sure the teacherField exists");
  }
  // find if the school exists for field_teacher assignment and matches the school in the body
  if (teacherFieldFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field assigned to the teacher belongs to the school"
    );
  }
  // find if the coordinator for the teacher is the same in the body, the coordinator being an actual coordinator and the role active has already been taken care of by the previous checks for the subject
  if (
    teacherFieldFound?.teacher_id?.coordinator_id?.toString() !== coordinator_id
  ) {
    throw new BadRequestError(
      "Please make sure the teacher has been assigned to the coordinator being passed"
    );
  }
  // find if the field for the teacher is the same in parent subject
  if (
    teacherFieldFound?.field_id?.toString() !==
    subjectFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* update class */
  const newClass = {
    school_id: school_id,
    coordinator_id: coordinator_id,
    subject_id: subject_id,
    teacherField_id: teacherField_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const filtersUpdate = [{ _id: classId }, { school_id: school_id }];
  const classUpdated = await updateFilterResource(
    filtersUpdate,
    newClass,
    classModel
  );
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
  const classDeleted = await deleteFilterResource(filtersDelete, classModel);
  if (!classDeleted) {
    throw new NotFoundError("Class not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Class deleted" });
};

export { createClass, getClasses, getClass, updateClass, deleteClass };
