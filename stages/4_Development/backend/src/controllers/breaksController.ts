import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import NotFoundError from "../errors/not-found";

import {
  insertResource,
  findPopulateResourceById,
  findFilterAllResources,
  deleteFilterResource,
  findFilterResourceByProperty,
  updateFilterResource,
} from "../services/mongoServices";

/* models */
const breakModel = "break";
const scheduleModel = "schedule";

// @desc create a break
// @route POST /api/v1/breaks
// @access Private
// @fields: body {school_id:[string] , schedule_id:[string], breakStart:[number], numberMinutes:[number]}
const createBreak = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, schedule_id, numberMinutes, breakStart } = body;
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateResourceById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule,
    scheduleModel
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
  }
  /* check if the school exists*/
  if (scheduleFound?.school_id?.toString() == null) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* check if the passed school id is the same as the schedule school id*/
  if (scheduleFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the schedule belongs to the school"
    );
  }
  /* check if the break start starts earlier than the day shift start */
  if (scheduleFound.dayStart > breakStart) {
    throw new BadRequestError(
      "Please take into account that the break start time cannot be earlier than the schedule start time"
    );
  }
  /* check if the break fits within the schedule shift leaving room for at least a one-unit class before and after */
  if (
    scheduleFound.shiftNumberMinutes <
    scheduleFound.classUnitMinutes * 2 + numberMinutes
  ) {
    throw new BadRequestError(
      "Please make sure there is enough time to have at least 2 one-unit classes one before and one after the break"
    );
  }
  /* create break */
  const newBreak = body;
  const breakCreated = await insertResource(newBreak, breakModel);
  if (!breakCreated) {
    throw new BadRequestError("Break not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Break created!" });
};

// @desc get all the Breaks
// @route GET /api/v1/breaks
// @access Private
// @fields: body {school_id:[string]}
const getBreaks = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const breaksFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    breakModel
  );
  /* get all fields */
  if (breaksFound?.length === 0) {
    throw new NotFoundError("No breaks found");
  }
  res.status(StatusCodes.OK).json(breaksFound);
};

// @desc get the Break by id
// @route GET /api/v1/breaks/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: breakId } = params;
  const { school_id } = body;
  /* get the field */
  const filters = [{ _id: breakId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const breakFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    breakModel
  );
  if (breakFound?.length === 0) {
    throw new NotFoundError("Break not found");
  }
  res.status(StatusCodes.OK).json(breakFound);
};

// @desc update a Break
// @route PUT /api/v1/breaks/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], breakStart:[number], numberMinutes:[number]}
const updateBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: breakId } = params;
  const { school_id, schedule_id, numberMinutes, breakStart } = body;
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateResourceById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule,
    scheduleModel
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
  }
  /* check if the school exists*/
  if (scheduleFound?.school_id?.toString() == null) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* check if the passed school id is the same as the schedule school id*/
  if (scheduleFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the schedule belongs to the school"
    );
  }
  /* check if the break start starts earlier than the day shift start */
  if (scheduleFound.dayStart > breakStart) {
    throw new BadRequestError(
      "Please take into account that the break start time cannot be earlier than the schedule start time"
    );
  }
  /* check if the break fits within the schedule shift leaving room for at least a one-unit class before and after */
  if (
    scheduleFound.shiftNumberMinutes <
    scheduleFound.classUnitMinutes * 2 + numberMinutes
  ) {
    throw new BadRequestError(
      "Please make sure there is enough time to have at least 2 one-unit classes one before and one after the break"
    );
  }
  /* update break */
  const filtersUpdate = [{ _id: breakId }, { school_id: school_id }];
  const newBreak = body;
  const breakUpdated = await updateFilterResource(
    filtersUpdate,
    newBreak,
    breakModel
  );
  if (!breakUpdated) {
    throw new NotFoundError("Break not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Break updated!" });
};

// @desc delete a Break
// @route DELETE /api/v1/breaks/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: breakId } = params;
  const { school_id } = body;
  /* delete break */
  const filtersDelete = { _id: breakId, school_id: school_id };
  const breakDeleted = await deleteFilterResource(filtersDelete, breakModel);
  if (!breakDeleted) {
    throw new NotFoundError("Break not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Break deleted" });
};

export { createBreak, getBreaks, getBreak, updateBreak, deleteBreak };
