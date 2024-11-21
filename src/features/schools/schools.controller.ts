import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  findAllSchools,
  findSchoolById,
  findSchoolByProperty,
  insertSchool,
  modifySchool,
  removeSchool,
} from "./schools.services";

export const createSchool = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { name, groupMaxNumStudents, status } = body;
  /* find if the school name already exists */
  const searchCriteria = { name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateSchool = await findSchoolByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateSchool) {
    throw new ConflictError("This school name already exists");
  }
  /* create school */
  const newSchool = {
    name: name,
    groupMaxNumStudents: groupMaxNumStudents,
    status: status,
  };
  const schoolCreated = await insertSchool(newSchool);
  if (!schoolCreated) {
    throw new BadRequestError("School not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "School created successfully!", success: true });
};

export const getSchools = async (req: Request, res: Response) => {
  /* get all schools */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolsFound = await findAllSchools(fieldsToReturn);
  if (schoolsFound?.length === 0) {
    throw new NotFoundError("No schools found");
  }
  res.status(StatusCodes.OK).json({ payload: schoolsFound, success: true });
};

export const getSchool = async ({ params }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  /* get the school */
  const fieldsToReturn = "-createdAt -updatedAt";
  const schoolFound = await findSchoolById(schoolId, fieldsToReturn);
  if (!schoolFound) {
    throw new NotFoundError("School not found");
  }
  res.status(StatusCodes.OK).json({ payload: schoolFound, success: true });
};

export const updateSchool = async (
  { body, params }: Request,
  res: Response
) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  const { name, groupMaxNumStudents, status } = body;
  /* check if there is a name duplicate that belongs to someone else */
  const searchCriteria = { name: name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicate = await findSchoolByProperty(searchCriteria, fieldsToReturn);
  if (duplicate && duplicate?._id.toString() !== schoolId) {
    throw new ConflictError("This school name already exists");
  }
  /* update school */
  const newSchool = {
    name: name,
    groupMaxNumStudents: groupMaxNumStudents,
    status: status,
  };
  const schoolUpdated = await modifySchool(schoolId, newSchool);
  if (!schoolUpdated) {
    throw new BadRequestError("School not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "School updated", success: true });
};

export const deleteSchool = async ({ params }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: schoolId } = params;
  /* delete school */
  const schoolDeleted = await removeSchool(schoolId);
  if (!schoolDeleted) {
    throw new NotFoundError("School not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "School deleted", success: true });
};
