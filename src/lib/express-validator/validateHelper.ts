import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";

export default function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body = matchedData(req);
  validationResult(req).throw();
  return next();
}
