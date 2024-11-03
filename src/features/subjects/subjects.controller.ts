import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import { Subject } from "../../typings/types";
import {
  insertSubject,
  findFilterAllSubjects,
  findSubjectByProperty,
  findFilterSubjectByProperty,
  modifyFilterSubject,
  removeFilterSubject,
  /* Services from other entities */
  findPopulateLevelById,
  findPopulateFieldById,
} from "./subjects.services";

// @desc create a subject
// @route POST /api/v?/subjects
// @access Private
// @fields body: {school_id:[string], level_id:[string], field_id:[string], name:[string], sessionUnits:[number], frequency:[number]}
const createSubject = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, level_id, field_id, name, sessionUnits, frequency } = body;
  /* check if the subject name already exists for this level */
  const searchCriteria = { level_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findSubjectByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateName) {
    throw new ConflictError("This subject name already exists for this level");
  }
  /* find if the level already exists */
  const fieldsToReturnLevel = "-createdAt -updatedAt";
  const fieldsToPopulateLevel = "school_id";
  const fieldsToReturnPopulateLevel = "-createdAt -updatedAt";
  const levelFound = await findPopulateLevelById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel
  );
  if (!levelFound) {
    throw new BadRequestError("Please make sure the level exists");
  }
  // find if the school exists for the level and matches the school in the body
  if (levelFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  /* find if the field already exists */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateFieldById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField
  );
  if (!fieldFound) {
    throw new BadRequestError("Please make sure the field exists");
  }
  // find if the school exists for the field and matches the school in the body
  if (fieldFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field belongs to the school"
    );
  }
  /* create subject */
  const newSubject = {
    school_id: school_id,
    level_id: level_id,
    field_id: field_id,
    name: name,
    sessionUnits: sessionUnits,
    frequency: frequency,
  };
  const subjectCreated = await insertSubject(newSubject);
  if (!subjectCreated) {
    throw new BadRequestError("Subject not created!");
  }
  res.status(StatusCodes.CREATED).json({ msg: "Subject created!" });
};

// @desc get all the Subjects
// @route GET /api/v?/Subjects
// @access Private
// @fields: body: {school_id:[string]}
const getSubjects = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const subjectsFound = await findFilterAllSubjects(filters, fieldsToReturn);
  /* get all fields */
  if (subjectsFound?.length === 0) {
    throw new NotFoundError("No subjects found");
  }
  res.status(StatusCodes.OK).json(subjectsFound);
};

// @desc get the Subject by id
// @route GET /api/v?/Subjects/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the subject */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const subjectFound = await findSubjectByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!subjectFound) {
    throw new NotFoundError("Subject not found");
  }
  res.status(StatusCodes.OK).json(subjectFound);
};

// @desc update a Subject
// @route PUT /api/v?/Subjects/:id
// @access Private
// @fields: params: {id:[string]}, body: {school_id:[string], level_id:[string], field_id:[string], name:[string], sessionUnits:[number], frequency:[number]}
const updateSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: subjectId } = params;
  const { school_id, level_id, field_id, name, sessionUnits, frequency } = body;
  /* check if the subject name already exists for this school */
  const subjectFilters = { level_id: level_id, name: name };
  const subjectFieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findFilterSubjectByProperty(
    subjectFilters,
    subjectFieldsToReturn
  );
  const duplicateSubjectName = duplicateName?.some(
    (subject: Subject) => subject?._id?.toString() !== subjectId
  );
  if (duplicateSubjectName) {
    throw new ConflictError("This subject name already exists for this level");
  }
  /* find level by id, and populate its properties */
  const fieldsToReturnLevel = "-createdAt -updatedAt";
  const fieldsToPopulateLevel = "school_id";
  const fieldsToReturnPopulateLevel = "-createdAt -updatedAt";
  const levelFound = await findPopulateLevelById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel
  );
  if (!levelFound) {
    throw new NotFoundError("Please make sure the level exists");
  }
  // find if the school exists for the level and matches the school in the body
  if (levelFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  /* find field by id, and populate its properties */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateFieldById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField
  );
  if (!fieldFound) {
    throw new NotFoundError("Please make sure the field exists");
  }
  // find if the school exists for the field and matches the school in the body
  if (fieldFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field belongs to the school"
    );
  }
  /* update subject */
  const newSubject = {
    school_id: school_id,
    level_id: level_id,
    field_id: field_id,
    name: name,
    sessionUnits: sessionUnits,
    frequency: frequency,
  };
  const filtersUpdate = {
    _id: subjectId,
    school_id: school_id,
    level_id: level_id,
  };
  const subjectUpdated = await modifyFilterSubject(filtersUpdate, newSubject);
  if (!subjectUpdated) {
    throw new BadRequestError("Subject not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Subject updated!" });
};

// @desc delete a Subject
// @route DELETE /api/v?/Subjects/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: subjectId } = params;
  const { school_id } = body;
  /* delete subject */
  const filtersDelete = { _id: subjectId, school_id: school_id };
  const subjectDeleted = await removeFilterSubject(filtersDelete);
  if (!subjectDeleted) {
    throw new NotFoundError("Subject not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Subject deleted" });
};

export { createSubject, getSubjects, getSubject, updateSubject, deleteSubject };
