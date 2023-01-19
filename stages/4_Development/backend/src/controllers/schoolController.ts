import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ConflictError from "../errors/conflict";

import {
  insertResource,
  findAllResources,
  findResourceById,
  findResourceByProperty,
  updateResource,
  deleteResource,
} from "../services/mongoServices";

// continue here --> work on the controllers features validation
// @desc create a school
const createSchool = async ({ body }: Request, res: Response) => {
  const duplicate = await findResourceByProperty(body, "school");
  if (duplicate) {
    throw new ConflictError("This school already exists");
  }
  const schoolCreated = await insertResource(body, "school");
  res.status(StatusCodes.CREATED).json(schoolCreated);
};

// @desc get all the schools
const getSchools = async (req: Request, res: Response) => {
  const schoolsFound = await findAllResources("school");
  res.status(StatusCodes.OK).json(schoolsFound);
};

// @desc get the school by name
const getSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const schoolFound = await findResourceById(schoolId, "school");
  res.status(StatusCodes.OK).json(schoolFound);
};

// @desc update a school
const updateSchool = async ({ body, params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const schoolUpdated = await updateResource(schoolId, body, "school");
  return res.status(StatusCodes.OK).json(schoolUpdated);
};

// @desc delete a school
const deleteSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const schoolDeleted = await deleteResource(schoolId, "school");
  res.status(StatusCodes.OK).json(schoolDeleted);
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
