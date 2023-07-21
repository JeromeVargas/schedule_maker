import { NextFunction, Request, Response } from "express";

import { CustomAPIError } from "../errors";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // The error is part of the set custom error
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  // The error is part of a JSON badly formatted req body
  // refactor here --> check extending classes and work on missing initializer
  if (err instanceof SyntaxError) {
    const error = { status: undefined, type: undefined, ...err };
    if (
      error.status === 400 &&
      error.type === "entity.parse.failed" &&
      "body" in err
    ) {
      return res
        .status(400)
        .json({ msg: "Please make sure the submission is properly formatted" });
    }
  }
  // Fall out error
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ err, msg: "Something unexpected happened, please try again" });
};

export default errorHandlerMiddleware;
