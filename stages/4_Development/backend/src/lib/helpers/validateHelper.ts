import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
  // continue here, the try catch might not be necessary, this is what might prevent the errors from being passed
  try {
    validationResult(req).throw();
    return next();
  } catch (error: any) {
    res.status(400);
    res.json(error.array());
  }
};

export default validateResult;
