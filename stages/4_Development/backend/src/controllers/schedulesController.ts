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
const schoolModel = "school";
const scheduleModel = "schedule";

// @desc create a schedule
// @route POST /api/v1/schedules
// @access Private
// @fields: body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], classUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const createSchedule = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, name } = body;
  /* check if the school exists */
  const schoolSearchCriteria = school_id;
  const schoolFieldsToReturn = "-createdAt -updatedAt";
  const existingSchool = await findResourceById(
    schoolSearchCriteria,
    schoolFieldsToReturn,
    schoolModel
  );
  if (!existingSchool) {
    throw new ConflictError("Please create the school first");
  }
  /* check if the schedule name already exists for this school */
  const scheduleFilters = [{ school_id: school_id }, { name: name }];
  const scheduleFieldsToReturn = "-createdAt -updatedAt";
  const duplicatedName = await findFilterResourceByProperty(
    scheduleFilters,
    scheduleFieldsToReturn,
    scheduleModel
  );
  if (duplicatedName?.length !== 0) {
    throw new ConflictError("This schedule name already exists");
  }
  /* create the schedule  */
  const newSchedule = body;
  const scheduleCreated = await insertResource(newSchedule, scheduleModel);
  if (!scheduleCreated) {
    throw new BadRequestError("Schedule not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Schedule created successfully!" });
};

// @desc get all the Schedules
// @route GET /api/v1/schedules
// @access Private
// @fields: body {school_id:[string]}
const getSchedules = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const schedulesFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    scheduleModel
  );
  /* get all fields */
  if (schedulesFound?.length === 0) {
    throw new NotFoundError("No schedules found");
  }
  res.status(StatusCodes.OK).json(schedulesFound);
};

// @desc get the Schedule by id
// @route GET /api/v1/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: scheduleId } = params;
  const { school_id } = body;
  /* get the field */
  const filters = [{ _id: scheduleId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const scheduleFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    scheduleModel
  );
  if (scheduleFound?.length === 0) {
    throw new NotFoundError("Schedule not found");
  }
  res.status(StatusCodes.OK).json(scheduleFound);
};

// @desc update a Schedule
// @route PUT /api/v1/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , name:[string], dayStart:[number], shiftNumberMinutes:[number], classUnitMinutes:[number], monday:[boolean], tuesday:[boolean], wednesday:[boolean], thursday:[boolean], friday:[boolean], saturday:[boolean], sunday:[boolean],}
const updateSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields*/
  const { id: scheduleId } = params;
  const { school_id, name } = body;
  /* check if the schedule name already exist for the school */
  const filters = [{ school_id: school_id }, { name: name }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicatedScheduleNameFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    scheduleModel
  );
  // if there is at least one record with that name and a different schedule id, it returns true and triggers an error
  const duplicatedScheduleName = duplicatedScheduleNameFound?.some(
    (schedule: any) => schedule._id.toString() !== scheduleId
  );
  if (duplicatedScheduleName) {
    throw new ConflictError("This schedule name already exists!");
  }
  /* update if the schedule and school ids are the same one as the one passed and update the field */
  const filtersUpdate = [{ _id: scheduleId }, { school_id: school_id }];
  const newSchedule = body;
  const scheduleUpdated = await updateFilterResource(
    filtersUpdate,
    newSchedule,
    scheduleModel
  );
  if (!scheduleUpdated) {
    throw new NotFoundError("Schedule not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Schedule updated" });
};

// @desc delete a Schedule
// @route DELETE /api/v1/schedules/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteSchedule = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: scheduleId } = params;
  const { school_id } = body;
  /* delete schedule */
  const filtersDelete = { _id: scheduleId, school_id: school_id };
  const scheduleDeleted = await deleteFilterResource(
    filtersDelete,
    scheduleModel
  );
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
