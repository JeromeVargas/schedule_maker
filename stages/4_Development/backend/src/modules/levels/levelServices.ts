import LevelModel from "./levelModel";
import ScheduleModel from "../schedules/scheduleModel";
import { Level } from "../../typings/types";

// CRUD services
// @desc insert a level in database
// @params level
const insertLevel = (level: Level) => {
  const levelInsert = LevelModel.create(level);
  return levelInsert;
};

// @desc find all levels by school id
// @params filters, fields to return
const findFilterAllLevels = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const levelFound = LevelModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return levelFound;
};

// @desc find a level by id and populate the embedded entities
// @params levelId, fields to return, fields to populate, fields to return populate
const findPopulateLevelById = (
  levelId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const levelFound = LevelModel.findById(levelId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return levelFound;
};

// @desc find a level by school id and name
// @params filters, fields to return
const findLevelByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const levelFound = LevelModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return levelFound;
};

// @desc find a level and filter by some school id and name
// @params filters, fields to return
const findFilterLevelByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  const levelsFound = LevelModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return levelsFound;
};

// @desc update a level by level id and school id
// @params levelId, level
const modifyFilterLevel = (
  filters: { _id: string; school_id: string },
  level: Level
) => {
  const levelUpdated = LevelModel.findOneAndUpdate(filters, level, {
    new: true,
    runValidators: true,
  });

  return levelUpdated;
};

// @desc delete a level by property
// @params filters, filters
const removeFilterLevel = (filters: { school_id: string; _id: string }) => {
  const resourceDeleted = LevelModel.findOneAndDelete(filters).lean().exec();
  return resourceDeleted;
};

/* Services from other entities */
// @desc find a schedule by id and populate the embedded entities
// @params scheduleId, fields to return, fields to populate, fields to return populate
const findPopulateScheduleById = (
  scheduleId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const scheduleFound = ScheduleModel.findById(scheduleId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return scheduleFound;
};

export {
  insertLevel,
  findFilterAllLevels,
  findLevelByProperty,
  findFilterLevelByProperty,
  findPopulateLevelById,
  modifyFilterLevel,
  removeFilterLevel,
  /* Services from other entities */
  findPopulateScheduleById,
};
