import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { insertResource } from "../services/mongoServices";

// @desc get all the schools
// work on the features  ------------------------------------------ --> continue here --> --------------------------------------

const getSchools = (req: Request, res: Response) => {
  res.json({ data: "testing the get schools endpoint" });
};

// @desc get the school name
const getSchool = (req: Request, res: Response) => {
  res.json({ data: "testing the get a school endpoint" });
};

// @desc create a school
const createSchool = async ({ body }: Request, res: Response) => {
  const schoolCreated = await insertResource(body, "school");

  res.status(StatusCodes.CREATED).json(schoolCreated);
};

// @desc update a school
const updateSchool = (req: Request, res: Response) => {
  res.json({ data: "testing the update school endpoint" });
};

// @desc delete a school
const deleteSchool = (req: Request, res: Response) => {
  res.json({ data: "testing the delete school endpoint" });
};

export { getSchools, getSchool, createSchool, updateSchool, deleteSchool };
