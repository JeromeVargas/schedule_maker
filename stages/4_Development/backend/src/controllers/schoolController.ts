import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";

import { insertSchool } from "../services/schoolService";

// @desc get all the schools
const getSchools = (req: Request, res: Response) => {
  res.json({ data: "testing the get schools endpoint" });
};

// @desc get the school name
const getSchool = (req: Request, res: Response) => {
  res.send({ data: "testing the get a school endpoint" });
};

// @desc create a school
const createSchool = async ({ body }: Request, res: Response) => {
  // work on express validator  ------------------------------------------ --> continue here --> --------------------------------------
  if (!body.name) {
    throw new BadRequestError("Please add a school name");
  }
  const schoolCreated = await insertSchool(body);
  res.status(StatusCodes.CREATED).json(schoolCreated);
};

// @desc update a school
const updateSchool = (req: Request, res: Response) => {
  res.send({ data: "testing the update school endpoint" });
};

// @desc delete a school
const deleteSchool = (req: Request, res: Response) => {
  res.send({ data: "testing the delete school endpoint" });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
