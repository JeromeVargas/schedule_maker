import { NextFunction, Request, Response } from "express";

import { CustomAPIError } from "../errors";
import { StatusCodes } from "http-status-codes";
import { ValidationError } from "express-validator";

interface ExpressError extends Error {
  statusCode?: number;
  type?: string;
  errors?: ValidationError;
}

const errorHandlerMiddleware = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The error is part of the set custom error
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  // The error is part express validation error
  if (err?.errors) {
    return res.status(StatusCodes.BAD_REQUEST).json(err?.errors);
  }
  // The error is part of a JSON badly formatted req body
  if (
    err instanceof SyntaxError &&
    err.statusCode === 400 &&
    err.type === "entity.parse.failed" &&
    "body" in err
  ) {
    return res
      .status(400)
      .json({ msg: "Please make sure the submission is properly formatted" });
  }
  // Fall out error
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ err, msg: "Something unexpected happened, please try again" });
};

export default errorHandlerMiddleware;
