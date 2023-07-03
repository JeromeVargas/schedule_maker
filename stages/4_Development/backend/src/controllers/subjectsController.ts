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
  findResourceByProperty,
  insertResource,
  updateFilterResource,
} from "../services/mongoServices";
import { Subject } from "../typings/types";

/* models */
const subjectModel = "subject";
const groupModel = "group";
const fieldModel = "field";

// @desc create a subject
// @route POST /api/v1/subjects
// @access Private
// @fields: body: {school_id:[string], coordinator_id:[string], group_id:[string], coordinator_id:[string], field_id:[string], name:[string], classUnits:[number], frequency:[number]}
const createSubject = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    coordinator_id,
    group_id,
    field_id,
    name,
    classUnits,
    frequency,
  } = body;
  /* check if the subject name already exists for this school */
  const searchCriteria = { school_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    subjectModel
  );
  if (duplicateName) {
    throw new ConflictError("This subject name already exists");
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id coordinator_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateResourceById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup,
    groupModel
  );
  if (!groupFound) {
    throw new BadRequestError("Please make sure the group exists");
  }
  // find if the school exists for the group and matches the school in the body
  if (groupFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  // find if the coordinator is the same in the body, it is an actual coordinator and the role is active
  if (groupFound?.coordinator_id?._id?.toString() !== coordinator_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the subject parent group"
    );
  }
  if (groupFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the field already exists */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateResourceById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField,
    fieldModel
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
    coordinator_id: coordinator_id,
    group_id: group_id,
    field_id: field_id,
    name: name,
    classUnits: classUnits,
    frequency: frequency,
  };
  const subjectCreated = await insertResource(newSubject, subjectModel);
  if (!subjectCreated) {
    throw new BadRequestError("Subject not created!");
  }
  res.status(StatusCodes.CREATED).json({ msg: "Subject created!" });
};

// @desc get all the Subjects
// @route GET /api/v1/Subjects
// @access Private
// @fields: body: {school_id:[string]}
const getSubjects = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const subjectsFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    subjectModel
  );
  /* get all fields */
  if (subjectsFound?.length === 0) {
    throw new NotFoundError("No subjects found");
  }
  res.status(StatusCodes.OK).json(subjectsFound);
};

// @desc get the Subject by id
// @route GET /api/v1/Subjects/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], coordinator_id:[string], group_id:[string], coordinator_id:[string], field_id:[string], name:[string], classUnits:[number], frequency:[number]}
const getSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the subject */
  const searchCriteria = { _id, school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const subjectFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    subjectModel
  );
  if (!subjectFound) {
    throw new NotFoundError("Subject not found");
  }
  res.status(StatusCodes.OK).json(subjectFound);
};

// @desc update a Subject
// @route PUT /api/v1/Subjects/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], coordinator_id:[string], group_id:[string], coordinator_id:[string], field_id:[string], name:[string], classUnits:[number], frequency:[number]}
const updateSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: subjectId } = params;
  const {
    school_id,
    coordinator_id,
    group_id,
    field_id,
    name,
    classUnits,
    frequency,
  } = body;
  /* check if the subject name already exists for this school */
  const subjectFilters = [{ school_id: school_id }, { name: name }];
  const subjectFieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findFilterResourceByProperty(
    subjectFilters,
    subjectFieldsToReturn,
    subjectModel
  );
  const duplicateSubjectName = duplicateName?.some(
    (subject: Subject) => subject?._id?.toString() !== subjectId
  );
  if (duplicateSubjectName) {
    throw new ConflictError("This subject name already exists");
  }
  /* find group by id, and populate its properties */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id coordinator_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateResourceById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup,
    groupModel
  );
  if (!groupFound) {
    throw new NotFoundError("Please make sure the group exists");
  }
  // find if the school exists for the group and matches the school in the body
  if (groupFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  // find if the coordinator for the group is the same in the body, it is an actual coordinator and the role is active
  if (groupFound?.coordinator_id?._id?.toString() !== coordinator_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the subject parent group"
    );
  }
  if (groupFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find field by id, and populate its properties */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateResourceById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField,
    fieldModel
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
    coordinator_id: coordinator_id,
    group_id: group_id,
    field_id: field_id,
    name: name,
    classUnits: classUnits,
    frequency: frequency,
  };
  const filtersUpdate = [{ _id: subjectId }, { school_id: school_id }];
  const subjectUpdated = await updateFilterResource(
    filtersUpdate,
    newSubject,
    subjectModel
  );
  if (!subjectUpdated) {
    throw new NotFoundError("Subject not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Subject updated!" });
};

// @desc delete a Subject
// @route DELETE /api/v1/Subjects/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteSubject = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: subjectId } = params;
  const { school_id } = body;
  /* delete subject */
  const filtersDelete = { _id: subjectId, school_id: school_id };
  const subjectDeleted = await deleteFilterResource(
    filtersDelete,
    subjectModel
  );
  if (!subjectDeleted) {
    throw new NotFoundError("Subject not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Subject deleted" });
};

export { createSubject, getSubjects, getSubject, updateSubject, deleteSubject };
