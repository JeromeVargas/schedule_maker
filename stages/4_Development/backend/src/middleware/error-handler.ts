import { NextFunction, Request, Response } from "express";

import { CustomAPIError } from "../errors";
import { StatusCodes } from "http-status-codes";

const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ err, msg: "Something unexpected happened, please try again" });
};

export default errorHandlerMiddleware;
