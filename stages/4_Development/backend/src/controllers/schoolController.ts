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
const createSchool = async ({ body }: Request, res: Response) => {
  const searchCriteria = { name: body.name };
  const fieldsToReturn = "-_id -createdAt -updatedAt";
  const model = "school";
  const duplicate = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    model
  );
  if (duplicate) {
    throw new ConflictError("This school name already exists");
  }
  const schoolCreated = await insertResource(body, model);
  if (!schoolCreated) {
    throw new BadRequestError("School not created");
  }
  res.status(StatusCodes.CREATED).json({ msg: "School created successfully!" });
};

// @desc get all the schools
// @route GET /api/v1/school
// @access Private
const getSchools = async (req: Request, res: Response) => {
  const fieldsToReturn = "-createdAt -updatedAt";
  const model = "school";
  const schoolsFound = await findAllResources(fieldsToReturn, model);
  if (!schoolsFound || schoolsFound.length === 0) {
    throw new NotFoundError("No schools found");
  }
  res.status(StatusCodes.OK).json(schoolsFound);
};

// @desc get the school by Id
// @route GET /api/v1/school/:id
// @access Private
const getSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school Id");
  }
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
const updateSchool = async ({ body, params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school Id");
  }
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
  const schoolUpdated = await updateResource(schoolId, body, model);
  if (!schoolUpdated) {
    throw new NotFoundError("School not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "School updated" });
};

// @desc delete a school
// @route DELETE /api/v1/school/:id
// @access Private
const deleteSchool = async ({ params }: Request, res: Response) => {
  const { id: schoolId } = params;
  const isValidSchoolId = isValidId(schoolId);
  if (isValidSchoolId === false) {
    throw new BadRequestError("Invalid school Id");
  }
  const model = "school";
  const schoolDeleted = await deleteResource(schoolId, model);
  if (!schoolDeleted) {
    throw new NotFoundError("School not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "School deleted" });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
