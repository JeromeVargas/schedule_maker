import LevelModel from "./levels.model";
import ScheduleModel from "../schedules/schedule.model";
import { NewLevel } from "../../typings/types";

// CRUD services
// @desc insert a level in database
// @params level
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
};

// @desc find all levels by school id
// @params filters, fields to return
export const findFilterAllLevels = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return LevelModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a level by id and populate the embedded entities
// @params levelId, fields to return, fields to populate, fields to return populate
export const findPopulateLevelById = (
  levelId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return LevelModel.findById(levelId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a level by school id and name
// @params filters, fields to return
export const findLevelByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return LevelModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a level and filter by some school id and name
// @params filters, fields to return
export const findFilterLevelByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  return LevelModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a level by level id and school id
// @params levelId, level
export const modifyFilterLevel = (
  filters: { _id: string; school_id: string },
  level: NewLevel
) => {
  return LevelModel.findOneAndUpdate(filters, level, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a level by property
// @params filters, filters
export const removeFilterLevel = (filters: {
  school_id: string;
  _id: string;
}) => {
  return LevelModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a schedule by id and populate the embedded entities
// @params scheduleId, fields to return, fields to populate, fields to return populate
export const findPopulateScheduleById = (
  scheduleId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return ScheduleModel.findById(scheduleId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};
