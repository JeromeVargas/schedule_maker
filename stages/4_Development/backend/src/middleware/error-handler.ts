// 5.0 create a custom error handler

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
  return (
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      // .json({ msg: "Something went wrong, please try again" });
      .json({ err })
  );
};

export default errorHandlerMiddleware;
