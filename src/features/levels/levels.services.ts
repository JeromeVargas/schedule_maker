import LevelModel from "./levels.model";
import ScheduleModel from "../schedules/schedules.model";
import { NewLevel, NewSchedule, NewSchool } from "../../typings/types";
import SchoolModel from "../schools/schools.model";

/* Levels */
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
};

export const insertManyLevels = (levels: NewLevel[]) => {
  return LevelModel.insertMany(levels);
};

export const findFilterAllLevels = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return LevelModel.find(filters).select(fieldsToReturn).lean().exec();
};

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

export const modifyFilterLevel = (
  filters: { _id: string; school_id: string },
  level: NewLevel
) => {
  return LevelModel.findOneAndUpdate(filters, level, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterLevel = (filters: {
  school_id: string;
  _id: string;
}) => {
  return LevelModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllLevels = () => {
  return LevelModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Schedules */

export const insertSchedule = (schedule: NewSchedule) => {
  return ScheduleModel.create(schedule);
};

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

export const removeAllSchedules = () => {
  return ScheduleModel.deleteMany();
};
