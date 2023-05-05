import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  insertResource,
  findResourceById,
  findFilterAllResources,
  deleteFilterResource,
  findFilterResourceByProperty,
  updateFilterResource,
} from "../services/mongoServices";

/* models */
const breakModel = "break";

// @desc create a break
// @route POST /api/v1/breaks
// @access Private
// @fields: body {fieldOne:[string] , fieldTwo:[string], fieldThree:[string]}
const createBreak = async ({ body }: Request, res: Response) => {
  /* destructure the fields */

  // code
  res.status(StatusCodes.OK).json({ msg: "Break endpoint working!" });
};

// @desc get all the Breaks
// @route GET /api/v1/Breaks
// @access Private
// @fields: body {fieldOne:[string]}
const getBreaks = async ({ body }: Request, res: Response) => {
  /* destructure the fields */

  // code
  res.sendStatus(StatusCodes.OK);
};

// @desc get the Break by id
// @route GET /api/v1/Breaks/:id
// @access Private
// @fields: params: {id:[string]},  body: {field:[string]}
const getBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */

  // code
  res.sendStatus(StatusCodes.OK);
};

// @desc update a Break
// @route PUT /api/v1/Breaks/:id
// @access Private
// @fields: params: {id:[string]},  body {fieldOne:[string] , fieldTwo:[string], fieldThree:[string]}
const updateBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */

  //code
  res.sendStatus(StatusCodes.OK);
};

// @desc delete a Break
// @route DELETE /api/v1/Breaks/:id
// @access Private
// @fields: params: {id:[string]},  body: {fieldOne:[string]}
const deleteBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */

  // code
  res.sendStatus(StatusCodes.OK);
};

export { createBreak, getBreaks, getBreak, updateBreak, deleteBreak };
