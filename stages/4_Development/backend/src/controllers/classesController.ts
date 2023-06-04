import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  deleteFilterResource,
  findFilterAllResources,
  findFilterResourceByProperty,
  findPopulateResourceById,
  insertResource,
  updateFilterResource,
} from "../services/mongoServices";

/* models */
const classModel = "class";
const subjectModel = "subject";
const teacherFieldModel = "teacherField";

// @desc create a class
// @route POST /api/v1/classes
// @access Private
// @fields: body {school_id:[string] , subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const createClass = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, subject_id, teacherField_id } = body;
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
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
  /* find if the teacher_field already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateResourceById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField,
    teacherFieldModel
  );
  if (!teacherFieldFound) {
    throw new BadRequestError("Please make sure the teacher_field exists");
  }
  /* find if the school exists and matches the school in the body */
  if (
    subjectFound.school_id?._id?.toString() !== school_id ||
    teacherFieldFound.school_id?._id?.toString() !== school_id
  ) {
    throw new BadRequestError("The resources do not belong to this school");
  }
  /* create class */
  const newClass = body;
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
  const { id: classId } = params;
  const { school_id } = body;
  /* get the field */
  const filters = [{ _id: classId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const classFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    classModel
  );
  if (classFound?.length === 0) {
    throw new NotFoundError("Class not found");
  }
  res.status(StatusCodes.OK).json(classFound);
};

// @desc update a Class
// @route PUT /api/v1/classes/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , subject_id:[string], teacherField_id:[string], startTime:[number], groupScheduleSlot:[number], teacherScheduleSlot:[number]}
const updateClass = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: classId } = params;
  const { school_id, subject_id, teacherField_id } = body;
  /* find subject by id, and populate its properties */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
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

  /* find teacher_field by id, and populate its properties */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id";
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
  /* find if the school exists and matches the school in the body */
  if (
    subjectFound.school_id?._id?.toString() !== school_id ||
    teacherFieldFound.school_id?._id?.toString() !== school_id
  ) {
    throw new BadRequestError("The resources do not belong to this school");
  }
  /* update class */
  const newClass = body;
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
