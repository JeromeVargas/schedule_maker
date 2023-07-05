import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertResource,
  findResourceById,
  findFilterAllResources,
  deleteFilterResource,
  findFilterResourceByProperty,
  findResourceByProperty,
  updateFilterResource,
} from "../../services/mongoServices";

import { Field } from "../../typings/types";

/* models */
const schoolModel = "school";
const fieldModel = "field";

// @desc create a field
// @route POST /api/v1/fields
// @access Private
// @fields: body {school_id:[string] , name:[string]}
const createField = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, name } = body;
  /* find if the school already exists */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolFound = await findResourceById(
    school_id,
    fieldsToReturn,
    schoolModel
  );
  if (!schoolFound) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* find if the field name already exists for the school */
  const searchCriteria = { school_id, name };
  const duplicateField = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    fieldModel
  );
  if (duplicateField) {
    throw new ConflictError("This field name already exists");
  }
  /* create school */
  const newField = {
    school_id: school_id,
    name: name,
  };
  const fieldCreated = await insertResource(newField, fieldModel);
  if (!fieldCreated) {
    throw new BadRequestError("Field not created!");
  }
  res.status(StatusCodes.CREATED).json({ msg: "Field created successfully!" });
};

// @desc get all the fields
// @route GET /api/v1/fields
// @access Private
// @fields: body {school_id:[string]}
const getFields = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldsFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    fieldModel
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
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the field */
  const searchCriteria = { _id, school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    fieldModel
  );
  if (!fieldFound) {
    throw new NotFoundError("Field not found");
  }
  res.status(StatusCodes.OK).json(fieldFound);
};

// @desc update a field
// @route PUT /api/v1/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string]}
const updateField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: fieldId } = params;
  const { school_id, name } = body;
  /* check if the field name already exist for the school */
  const filters = [{ school_id: school_id }, { name: name }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateFieldNameFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    fieldModel
  );
  // if there is at least one record with that name and a different field id, it returns true and triggers an error
  const duplicateFieldName = duplicateFieldNameFound?.some(
    (field: Field) => field?._id?.toString() !== fieldId
  );
  if (duplicateFieldName) {
    throw new ConflictError("This field name already exists!");
  }
  /* update if the field and school ids are the same one as the one passed and update the field */
  const filtersUpdate = [{ _id: fieldId }, { school_id: school_id }];
  const newField = {
    school_id: school_id,
    name: name,
  };
  const fieldUpdated = await updateFilterResource(
    filtersUpdate,
    newField,
    fieldModel
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
  /* delete field */
  const filtersDelete = { _id: fieldId, school_id: school_id };
  const fieldDeleted = await deleteFilterResource(filtersDelete, fieldModel);
  if (!fieldDeleted) {
    throw new NotFoundError("Field not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Field deleted" });
};

export { getFields, getField, createField, updateField, deleteField };
