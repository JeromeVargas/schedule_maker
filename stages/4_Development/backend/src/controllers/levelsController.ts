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
  findPopulateResourceById,
} from "../services/mongoServices";

/* models */
const levelModel = "level";
const scheduleModel = "schedule";

// @desc create a level
// @route POST /api/v1/levels
// @access Private
// @fields: body {school_id:[string] , schedule_id:[string], name:[string]}
const createLevel = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, schedule_id, name } = body;
  /* check if the level name already exists for this school */
  const levelFilters = [{ school_id: school_id }, { name: name }];
  const levelFieldsToReturn = "-createdAt -updatedAt";
  const duplicatedName = await findFilterResourceByProperty(
    levelFilters,
    levelFieldsToReturn,
    levelModel
  );
  if (duplicatedName?.length !== 0) {
    throw new ConflictError("This group name already exists");
  }
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
  /* create level */
  const newLevel = body;
  const levelCreated = await insertResource(newLevel, levelModel);
  if (!levelCreated) {
    throw new BadRequestError("Level not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Level created!" });
};

// @desc get all the Levels
// @route GET /api/v1/Levels
// @access Private
// @fields: body {fieldOne:[string]}
const getLevels = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const levelsFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    levelModel
  );
  /* get all fields */
  if (levelsFound?.length === 0) {
    throw new NotFoundError("No levels found");
  }
  res.status(StatusCodes.OK).json(levelsFound);
};

// @desc get the Level by id
// @route GET /api/v1/Levels/:id
// @access Private
// @fields: params: {id:[string]},  body: {fieldOne:[string]}
const getLevel = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: levelId } = params;
  const { school_id } = body;
  /* get the field */
  const filters = [{ _id: levelId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const levelFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    levelModel
  );
  if (levelFound?.length === 0) {
    throw new NotFoundError("Level not found");
  }
  res.status(StatusCodes.OK).json(levelFound);
};

// @desc update a Level
// @route PUT /api/v1/Levels/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], name:[string]}
const updateLevel = async ({ params, body }: Request, res: Response) => {
  // /* destructure the fields */
  const { id: levelId } = params;
  const { school_id, schedule_id, name } = body;
  /* check if the level name already exist for the school */
  const filters = [{ school_id: school_id }, { name: name }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicatedLevelNameFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    levelModel
  );
  // if there is at least one record with that name and a different level id, it returns true and triggers an error
  const duplicatedLevelName = duplicatedLevelNameFound?.some(
    (level: any) => level._id.toString() !== levelId
  );
  if (duplicatedLevelName) {
    throw new ConflictError("This level name already exists!");
  }

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
  /* update level */
  const newLevel = body;
  const filtersUpdate = [{ _id: levelId }, { school_id: school_id }];
  const levelUpdated = await updateFilterResource(
    filtersUpdate,
    newLevel,
    levelModel
  );
  if (!levelUpdated) {
    throw new NotFoundError("Level not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Level updated!" });
};

// @desc delete a Level
// @route DELETE /api/v1/Levels/:id
// @access Private
// @fields: params: {id:[string]},  body: {fieldOne:[string]}
const deleteLevel = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: levelId } = params;
  const { school_id } = body;
  /* delete level */
  const filtersDelete = { _id: levelId, school_id: school_id };
  const levelDeleted = await deleteFilterResource(filtersDelete, levelModel);
  if (!levelDeleted) {
    throw new NotFoundError("Level not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Level deleted" });
};

export { createLevel, getLevels, getLevel, updateLevel, deleteLevel };
