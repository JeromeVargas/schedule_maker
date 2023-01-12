import { Request, Response } from "express";
import { insertSchool } from "../services/schoolService";
import SchoolModel from "../models/schoolModel";

// @desc get all the schools
const getSchools = (req: Request, res: Response) => {
  res.send({ data: "testing the get schools endpoint" });
};

// @desc get the school name
const getSchool = (req: Request, res: Response) => {
  res.send({ data: "testing the get a school endpoint" });
};

// @desc create a school
const createSchool = async ({ body }: Request, res: Response) => {
  // work on the async wrapper, use coding addict suggested async errors library  ------------------------------------------ --> continue here --> --------------------------------------
  try {
    const responseInsert = await insertSchool(body);
    res.send(responseInsert);
  } catch (error) {
    console.log(error);
  }
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
