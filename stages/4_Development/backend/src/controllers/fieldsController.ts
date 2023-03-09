import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  isValidId,
  insertResource,
  findResourceById,
  findFilterAllResources,
  deleteFilterResource,
  findFilterResourceByProperty,
  updateFilterResource,
} from "../services/mongoServices";

// @desc create a field
// @route POST /api/v1/fields
// @access Private
// @fields: body {school_id:[string] , name:[string]}
const createField = async ({ body }: Request, res: Response) => {
  /* Destructure the fields */
  const { school_id, name } = body;
  /* check if the school is valid */
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* find if the school already exists */
  const schoolModel = "school";
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolFound = await findResourceById(
    school_id,
    fieldsToReturn,
    schoolModel
  );
  if (!schoolFound) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* find if the field already exists */
  const filters = [{ school_id: school_id }, { name: name }];
  const model = "field";
  const duplicatedSchool = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    model
  );
  if (duplicatedSchool?.length !== 0) {
    throw new ConflictError("This field name already exists");
  }
  /* create school */
  const schoolCreated = await insertResource(body, model);
  if (!schoolCreated) {
    throw new BadRequestError("Field not created!");
  }
  res.status(StatusCodes.CREATED).json({ msg: "Field created successfully!" });
};

// @desc get all the fields
// @route GET /api/v1/fields
// @access Private
// @fields: body {school_id:[string]}
const getFields = async ({ body }: Request, res: Response) => {
  /* Destructure the fields */
  const { school_id } = body;
  /* check if the school is valid */
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* filter by school id */
  const filters = { school_id: school_id };
  const model = "field";
  const fieldsToReturn = "-createdAt -updatedAt";

  const fieldsFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    model
  );
  /* get all fields */
  if (fieldsFound?.length === 0) {
    throw new NotFoundError("No fields found");
  }
  res.status(StatusCodes.OK).json(fieldsFound);
};

// @desc get the field by id
// @route GET /api/v1/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getField = async ({ params, body }: Request, res: Response) => {
  /* check if ids are valid */
  const { id: fieldId } = params;
  const isValidFieldId = isValidId(fieldId);
  if (isValidFieldId === false) {
    throw new BadRequestError("Invalid field id");
  }
  const { school_id } = body;
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* get the field */
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "field";
  const fieldFound = await findResourceById(fieldId, fieldsToReturn, model);
  /* check if the field exists */
  if (!fieldFound) {
    throw new NotFoundError("Field not found");
  }
  /* check if the field belongs to the school */
  if (fieldFound?.school_id?.toString() !== school_id) {
    throw new ConflictError("The school id is not correct!");
  }
  res.status(StatusCodes.OK).json(fieldFound);
};

// @desc update a field
// @route PUT /api/v1/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string], prevName:[string]}
const updateField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: fieldId } = params;
  const { school_id, name, prevName } = body;
  /* check if the field and school ids are valid */
  const isValidFieldId = isValidId(fieldId);
  if (isValidFieldId === false) {
    throw new BadRequestError("Invalid field id");
  }
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* check if the field already exist for the school */
  const filters = [{ school_id: school_id }, { name: name }];
  const model = "field";
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    model
  );
  if (fieldFound?.length !== 0) {
    throw new ConflictError("This field name already exists!");
  }
  /* update if the field and school ids are the same one as the one passed and update the field */
  const filtersUpdate = [
    { _id: fieldId },
    { school_id: school_id },
    { name: prevName },
  ];
  const newField = { school_id: school_id, name: name };
  const fieldUpdated = await updateFilterResource(
    filtersUpdate,
    newField,
    model
  );
  if (!fieldUpdated) {
    throw new NotFoundError("Field not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Field updated" });
};

// @desc delete a field
// @route DELETE /api/v1/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: fieldId } = params;
  const { school_id } = body;
  /* check if ids are valid */
  const isValidFieldId = isValidId(fieldId);
  if (isValidFieldId === false) {
    throw new BadRequestError("Invalid field id");
  }
  const isValidSchoolId = isValidId(school_id);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  /* delete field */
  const filtersDelete = [{ _id: fieldId }, { school_id: school_id }];
  const model = "field";
  const fieldDeleted = await deleteFilterResource(filtersDelete, model);
  if (!fieldDeleted) {
    throw new NotFoundError("Field not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Field deleted" });
};

export { getFields, getField, createField, updateField, deleteField };
