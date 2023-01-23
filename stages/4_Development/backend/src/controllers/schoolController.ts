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

// continue here --> create the user end point and its crud operations
// @desc create a school
// @route POST /api/v1/school
// @access Private
const createSchool = async ({ body }: Request, res: Response) => {
  const duplicate = await findResourceByProperty(body, "school");
  if (duplicate) {
    throw new ConflictError("This school name already exists");
  }
  const schoolCreated = await insertResource(body, "school");
  if (!schoolCreated) {
    throw new BadRequestError("School not created");
  }
  res.status(StatusCodes.CREATED).json(schoolCreated);
};

// @desc get all the schools
// @route GET /api/v1/school
// @access Private
const getSchools = async (req: Request, res: Response) => {
  const schoolsFound = await findAllResources("school");
  res.status(StatusCodes.OK).json(schoolsFound);
};

// @desc get the school by Id
// @route GET /api/v1/school/:id
// @access Private
const getSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValid = isValidId(schoolId);
  if (isValid === false) {
    throw new BadRequestError("Invalid Id");
  }
  const schoolFound = await findResourceById(schoolId, "school");
  if (!schoolFound) {
    throw new NotFoundError("School not found");
  }
  res.status(StatusCodes.OK).json(schoolFound);
};

// @desc update a school
// @route PUT /api/v1/school/:id
// @access Private
const updateSchool = async ({ body, params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValid = isValidId(schoolId);
  if (isValid === false) {
    throw new BadRequestError("Invalid Id");
  }
  const schoolUpdated = await updateResource(schoolId, body, "school");
  if (!schoolUpdated) {
    throw new NotFoundError("School not updated");
  }
  res.status(StatusCodes.OK).json(schoolUpdated);
};

// @desc delete a school
// @route DELETE /api/v1/school/:id
// @access Private
const deleteSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValid = isValidId(schoolId);
  if (isValid === false) {
    throw new BadRequestError("Invalid Id");
  }
  const schoolDeleted = await deleteResource(schoolId, "school");
  if (!schoolDeleted) {
    throw new NotFoundError("School not deleted");
  }
  res.status(StatusCodes.OK).json(schoolDeleted);
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
