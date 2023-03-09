import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  isValidId,
  insertResource,
  findAllResources,
  findResourceById,
  findResourceByProperty,
  updateResource,
  deleteResource,
} from "../services/mongoServices";

// @desc create a school
// @route POST /api/v1/school
// @access Private
// @fields: body {name:[string]}
const createSchool = async ({ body }: Request, res: Response) => {
  /* find if the school already exists */
  const searchCriteria = { name: body.name };
  const fieldsToReturn = "-_id -createdAt -updatedAt";
  const model = "school";
  const duplicatedSchool = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicatedSchool) {
    throw new ConflictError("This school name already exists");
  }
  /* create school */
  const schoolCreated = await insertResource(body, model);
  if (!schoolCreated) {
    throw new BadRequestError("School not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "School created successfully!" });
};

// @desc get all the schools
// @route GET /api/v1/school
// @access Private
// @fields: no fields
const getSchools = async (req: Request, res: Response) => {
  // get all schools
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "school";
  const schoolsFound = await findAllResources(fieldsToReturn, model);
  if (!schoolsFound || schoolsFound.length === 0) {
    throw new NotFoundError("No schools found");
  }
  res.status(StatusCodes.OK).json(schoolsFound);
};

// @desc get the school by id
// @route GET /api/v1/school/:id
// @access Private
// @fields: params: {id:[string]}
const getSchool = async ({ params }: Request, res: Response) => {
  // check if id is valid //
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  // get the school
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "school";
  const schoolFound = await findResourceById(schoolId, fieldsToReturn, model);
  if (!schoolFound) {
    throw new NotFoundError("School not found");
  }
  res.status(StatusCodes.OK).json(schoolFound);
};

// @desc update a school
// @route PUT /api/v1/school/:id
// @access Private
// @fields: params: {id:[string]},  body: {name:[string]}
const updateSchool = async ({ body, params }: Request, res: Response) => {
  // check if id is valid
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  // check if there is a duplicate that belongs to someone else
  const searchCriteria = { name: body.name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "school";
  const duplicate = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicate && duplicate?._id.toString() !== schoolId) {
    throw new ConflictError("This school name already exists");
  }
  // update school
  const schoolUpdated = await updateResource(schoolId, body, model);
  if (!schoolUpdated) {
    throw new NotFoundError("School not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "School updated" });
};

// @desc delete a school
// @route DELETE /api/v1/school/:id
// @access Private
// @fields: params: {id:[string]}}
const deleteSchool = async ({ params }: Request, res: Response) => {
  // check if the id is valid
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school id");
  }
  // delete school
  const model = "school";
  const schoolDeleted = await deleteResource(schoolId, model);
  if (!schoolDeleted) {
    throw new NotFoundError("School not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "School deleted" });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
