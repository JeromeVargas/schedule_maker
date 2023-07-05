import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

const validateResult = (req: Request, res: Response, next: NextFunction) => {
  // refactor here --> the try catch might not be necessary, this is what might prevent the errors from being passed, try to move the cath to the error handler middleware
  try {
    req.body = matchedData(req, { locations: ["body"] });
    validationResult(req).throw();
    return next();
  } catch (error: any) {
    res.status(400);
    res.json(error.array());
  }
};

export default validateResult;
