import { Request, Response } from "express";

// @desc get the school name and id
const getSchool = (req: Request, res: Response) => {
  res.send({ data: "testing the school endpoint" });
};

export { getSchool };
