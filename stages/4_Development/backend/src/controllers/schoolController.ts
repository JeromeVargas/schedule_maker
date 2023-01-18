import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import {
  insertResource,
  findAllResources,
  findResourceById,
  // findResourceByProperty,
  updateResource,
  deleteResource,
} from "../services/mongoServices";

// work on mocks for testing and the controllers features validation  ------------------------------------------ --> continue here --> --------------------------------------
// @desc create a school
const createSchool = async ({ body }: Request, res: Response) => {
  // const duplicate = await findResourceByProperty(body, "school");
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
  const { id } = params;
  const schoolFound = await findResourceById(id, "school");
  res.status(StatusCodes.OK).json(schoolFound);
};

// @desc update a school
const updateSchool = async ({ body, params }: Request, res: Response) => {
  const { id } = params;
  const schoolUpdated = await updateResource(id, body, "school");
  return res.status(StatusCodes.OK).json(schoolUpdated);
};

// @desc delete a school
const deleteSchool = async ({ params }: Request, res: Response) => {
  const { id } = params;
  const schoolDeleted = await deleteResource(id, "school");
  res.status(StatusCodes.OK).json({ schoolDeleted, id });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
