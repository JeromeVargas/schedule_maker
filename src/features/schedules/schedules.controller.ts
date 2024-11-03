import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertSchedule,
  findScheduleByProperty,
  findFilterAllSchedules,
  findFilterScheduleByProperty,
  modifyFilterSchedule,
  removeFilterSchedule,
  /* Services from other entities */
  findSchoolById,
  findAllLevels,
} from "./schedules.services";

import { Schedule } from "../../typings/types";

/* global controller reference */
const maxMinutesInDay = 1439;

// @desc create a schedule
// @route POST /api/v?/schedules
// @access Private
// @fields: body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], sessionUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const createSchedule = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    name,
    dayStart,
    shiftNumberMinutes,
    sessionUnitMinutes,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if the shift starts within a day */
  if (dayStart > maxMinutesInDay) {
    throw new BadRequestError("The school shift start must exceed 11:59 p.m.");
  }
  /* check if the school exists */
  const schoolSearchCriteria = school_id;
  const schoolFieldsToReturn = "-createdAt -updatedAt";
  const existingSchool = await findSchoolById(
    schoolSearchCriteria,
    schoolFieldsToReturn
  );
  if (!existingSchool) {
    throw new ConflictError("Please create the school first");
  }
  /* check if the schedule name already exists for this school */
  const searchCriteria = { school_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findScheduleByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateName) {
    throw new ConflictError("This schedule name already exists");
  }
  /* create the schedule  */
  const newSchedule = {
    school_id: school_id,
    name: name,
    dayStart: dayStart,
    shiftNumberMinutes: shiftNumberMinutes,
    sessionUnitMinutes: sessionUnitMinutes,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const scheduleCreated = await insertSchedule(newSchedule);
  if (!scheduleCreated) {
    throw new BadRequestError("Schedule not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Schedule created successfully!" });
};

// @desc get all the Schedules
// @route GET /api/v?/schedules
// @access Private
// @fields: body {school_id:[string]}
const getSchedules = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const schedulesFound = await findFilterAllSchedules(filters, fieldsToReturn);
  /* get all fields */
  if (schedulesFound?.length === 0) {
    throw new NotFoundError("No schedules found");
  }
  res.status(StatusCodes.OK).json(schedulesFound);
};

// @desc get the Schedule by id
// @route GET /api/v?/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the schedule */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const scheduleFound = await findScheduleByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!scheduleFound) {
    throw new NotFoundError("Schedule not found");
  }
  res.status(StatusCodes.OK).json(scheduleFound);
};

// @desc update a Schedule
// @route PUT /api/v?/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], sessionUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const updateSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: scheduleId } = params;
  const {
    school_id,
    name,
    dayStart,
    shiftNumberMinutes,
    sessionUnitMinutes,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
  } = body;
  /* check if the shift fits within a day */
  if (dayStart > maxMinutesInDay) {
    throw new BadRequestError("The school shift start must exceed 11:59 p.m.");
  }
  /* check if the schedule name already exist for the school */
  const filters = { school_id: school_id, name: name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateScheduleNameFound = await findFilterScheduleByProperty(
    filters,
    fieldsToReturn
  );
  // if there is at least one record with that name and a different schedule id, it returns true and triggers an error
  const duplicateScheduleName = duplicateScheduleNameFound?.some(
    (schedule: Schedule) => schedule?._id?.toString() !== scheduleId
  );
  if (duplicateScheduleName) {
    throw new ConflictError("This schedule name already exists!");
  }
  /* update if the schedule and school ids are the same one as the one passed and update the field */
  const filtersUpdate = { _id: scheduleId, school_id: school_id };
  const newSchedule = {
    school_id: school_id,
    name: name,
    dayStart: dayStart,
    shiftNumberMinutes: shiftNumberMinutes,
    sessionUnitMinutes: sessionUnitMinutes,
    monday: monday,
    tuesday: tuesday,
    wednesday: wednesday,
    thursday: thursday,
    friday: friday,
    saturday: saturday,
    sunday: sunday,
  };
  const scheduleUpdated = await modifyFilterSchedule(
    filtersUpdate,
    newSchedule
  );
  if (!scheduleUpdated) {
    throw new BadRequestError("Schedule not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Schedule updated" });
};

// @desc delete a Schedule
// @route DELETE /api/v?/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: scheduleId } = params;
  const { school_id } = body;
  /* make sure the schedule does not have any levels extending from it */
  const filtersExtendingLevels = {
    school_id: school_id,
    schedule_id: scheduleId,
  };
  const extendingLevels = await findAllLevels(filtersExtendingLevels);
  if (extendingLevels.length > 0) {
    throw new ConflictError(
      "Schedule cannot be deleted because there are levels extending from it"
    );
  }
  /* delete schedule */
  const filtersDelete = { school_id: school_id, _id: scheduleId };
  const scheduleDeleted = await removeFilterSchedule(filtersDelete);
  if (!scheduleDeleted) {
    throw new NotFoundError("Schedule not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Schedule deleted" });
};

export {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
};
