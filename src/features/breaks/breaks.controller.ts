import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import NotFoundError from "../../errors/not-found";

import {
  insertBreak,
  findBreakByProperty,
  findFilterAllBreaks,
  modifyFilterBreak,
  removeFilterBreak,
  /* Services from other entities */
  findPopulateScheduleById,
} from "./breaks.services";

/* global controllers reference */
const maxMinutesInDay = 1439;

export const createBreak = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, schedule_id, breakStart, numberMinutes } = body;
  /* check if the shift starts within a day */
  if (breakStart > maxMinutesInDay) {
    throw new BadRequestError("The school shift start must exceed 11:59 p.m.");
  }
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateScheduleById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
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
  /* create break */
  const newBreak = {
    school_id: school_id,
    schedule_id: schedule_id,
    breakStart: breakStart,
    numberMinutes: numberMinutes,
  };
  const breakCreated = await insertBreak(newBreak);
  if (!breakCreated) {
    throw new BadRequestError("Break not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Break created!", success: true });
};

export const getBreaks = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const breaksFound = await findFilterAllBreaks(filters, fieldsToReturn);
  /* get all fields */
  if (breaksFound?.length === 0) {
    throw new NotFoundError("No breaks found");
  }
  res.status(StatusCodes.OK).json({
    payload: breaksFound,
    success: true,
  });
};

export const getBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the break */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const breakFound = await findBreakByProperty(searchCriteria, fieldsToReturn);
  if (!breakFound) {
    throw new NotFoundError("Break not found");
  }
  res.status(StatusCodes.OK).json({
    payload: breakFound,
    success: true,
  });
};

export const updateBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: breakId } = params;
  const { school_id, schedule_id, breakStart, numberMinutes } = body;
  /* check if the shift starts within a day */
  if (breakStart > maxMinutesInDay) {
    throw new BadRequestError("The school shift start must exceed 11:59 p.m.");
  }
  /* find schedule by id, and populate its properties */
  const fieldsToReturnSchedule = "-createdAt -updatedAt";
  const fieldsToPopulateSchedule = "school_id";
  const fieldsToReturnPopulateSchedule = "-createdAt -updatedAt";
  const scheduleFound = await findPopulateScheduleById(
    schedule_id,
    fieldsToReturnSchedule,
    fieldsToPopulateSchedule,
    fieldsToReturnPopulateSchedule
  );
  if (!scheduleFound) {
    throw new NotFoundError("Please make sure the schedule exists");
  }
  /* check if the passed school id is the same as the schedule school id*/
  if (scheduleFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the schedule belongs to the school"
    );
  }
  /* check if the break start begins earlier than the day shift start */
  if (scheduleFound.dayStart > breakStart) {
    throw new BadRequestError(
      "Please take into account that the break start time cannot be earlier than the schedule start time"
    );
  }
  /* update break */
  const filtersUpdate = { _id: breakId, school_id: school_id };
  const newBreak = {
    school_id: school_id,
    schedule_id: schedule_id,
    breakStart: breakStart,
    numberMinutes: numberMinutes,
  };
  const breakUpdated = await modifyFilterBreak(filtersUpdate, newBreak);
  if (!breakUpdated) {
    throw new BadRequestError("Break not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Break updated!", success: true });
};

export const deleteBreak = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: breakId } = params;
  const { school_id } = body;
  /* delete break */
  const filtersDelete = { school_id: school_id, _id: breakId };
  const breakDeleted = await removeFilterBreak(filtersDelete);
  if (!breakDeleted) {
    throw new NotFoundError("Break not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Break deleted", success: true });
};
