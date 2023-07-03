import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  insertResource,
  findAllResources,
  findResourceById,
  findResourceByProperty,
  updateResource,
  deleteResource,
} from "../services/mongoServices";

/* models */
const schoolModel = "school";

// @desc create a school
// @route POST /api/v1/schools
// @access Private
// @fields: body {name:[string]}
const createSchool = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { name, groupMaxNumStudents } = body;
  /* find if the school name already exists */
  const searchCriteria = { name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateSchool = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    schoolModel
  );
  if (duplicateSchool) {
    throw new ConflictError("This school name already exists");
  }
  /* create school */
  const newSchool = {
    name: name,
    groupMaxNumStudents: groupMaxNumStudents,
  };
  const schoolCreated = await insertResource(newSchool, schoolModel);
  if (!schoolCreated) {
    throw new BadRequestError("School not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "School created successfully!" });
};

// @desc get all the schools
// @route GET /api/v1/schools
// @access Private
// @fields: no fields
const getSchools = async (req: Request, res: Response) => {
  /* get all schools */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolsFound = await findAllResources(fieldsToReturn, schoolModel);
  if (schoolsFound?.length === 0) {
    throw new NotFoundError("No schools found");
  }
  res.status(StatusCodes.OK).json(schoolsFound);
};

// @desc get the school by id
// @route GET /api/v1/schools/:id
// @access Private
// @fields: params: {id:[string]}
const getSchool = async ({ params }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  /* get the school */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolFound = await findResourceById(
    schoolId,
    fieldsToReturn,
    schoolModel
  );
  if (!schoolFound) {
    throw new NotFoundError("School not found");
  }
  res.status(StatusCodes.OK).json(schoolFound);
};

// @desc update a school
// @route PUT /api/v1/schools/:id
// @access Private
// @fields: params: {id:[string]},  body: {name:[string]}
const updateSchool = async ({ body, params }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  const { name, groupMaxNumStudents } = body;
  /* check if there is a duplicate that belongs to someone else */
  const searchCriteria = { name: name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicate = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    schoolModel
  );
  if (duplicate && duplicate?._id.toString() !== schoolId) {
    throw new ConflictError("This school name already exists");
  }
  /* update school */
  const newSchool = {
    name: name,
    groupMaxNumStudents: groupMaxNumStudents,
  };
  const schoolUpdated = await updateResource(schoolId, newSchool, schoolModel);
  if (!schoolUpdated) {
    throw new NotFoundError("School not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "School updated" });
};

// @desc delete a school
// @route DELETE /api/v1/schools/:id
// @access Private
// @fields: params: {id:[string]}}
const deleteSchool = async ({ params }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  /* delete school */
  const schoolDeleted = await deleteResource(schoolId, schoolModel);
  if (!schoolDeleted) {
    throw new NotFoundError("School not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "School deleted" });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
