import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertField,
  findFilterAllFields,
  findFieldByProperty,
  findFilterFieldByProperty,
  modifyFilterField,
  removeFilterField,
  /* Services from other entities */
  findSchoolById,
} from "./fields.services";

import { Field } from "../../typings/types";

// @desc create a field
// @route POST /api/v?/fields
// @access Private
// @fields: body {school_id:[string] , name:[string]}
export const createField = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, name } = body;
  /* find if the school already exists */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolFound = await findSchoolById(school_id, fieldsToReturn);
  if (!schoolFound) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* find if the field name already exists for the school */
  const searchCriteria = { school_id, name };
  const duplicateField = await findFieldByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateField) {
    throw new ConflictError("This field name already exists");
  }
  /* create school */
  const newField = {
    school_id: school_id,
    name: name,
  };
  const fieldCreated = await insertField(newField);
  if (!fieldCreated) {
    throw new BadRequestError("Field not created!");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Field created successfully!", success: true });
};

// @desc get all the fields
// @route GET /api/v?/fields
// @access Private
// @fields: body {school_id:[string]}
export const getFields = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldsFound = await findFilterAllFields(filters, fieldsToReturn);
  /* get all fields */
  if (fieldsFound?.length === 0) {
    throw new NotFoundError("No fields found");
  }
  const response = {
    payload: fieldsFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc get the field by id
// @route GET /api/v?/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const getField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the field */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldFound = await findFieldByProperty(searchCriteria, fieldsToReturn);
  if (!fieldFound) {
    throw new NotFoundError("Field not found");
  }
  const response = {
    payload: fieldFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc update a field
// @route PUT /api/v?/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], name:[string]}
export const updateField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: fieldId } = params;
  const { school_id, name } = body;
  /* check if the field name already exist for the school */
  const filters = { school_id: school_id, name: name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateFieldNameFound = await findFilterFieldByProperty(
    filters,
    fieldsToReturn
  );
  // if there is at least one record with that name and a different field id, it returns true and triggers an error
  const duplicateFieldName = duplicateFieldNameFound?.some(
    (field: Field) => field?._id?.toString() !== fieldId
  );
  if (duplicateFieldName) {
    throw new ConflictError("This field name already exists!");
  }
  /* update if the field and school ids are the same one as the one passed and update the field */
  const filtersUpdate = { _id: fieldId, school_id: school_id };
  const newField = {
    school_id: school_id,
    name: name,
  };
  const fieldUpdated = await modifyFilterField(filtersUpdate, newField);
  if (!fieldUpdated) {
    throw new BadRequestError("Field not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Field updated", success: true });
};

// @desc delete a field
// @route DELETE /api/v?/field/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const deleteField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: fieldId } = params;
  const { school_id } = body;
  /* delete field */
  const filtersDelete = { school_id: school_id, _id: fieldId };
  const fieldDeleted = await removeFilterField(filtersDelete);
  if (!fieldDeleted) {
    throw new NotFoundError("Field not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Field deleted", success: true });
};
