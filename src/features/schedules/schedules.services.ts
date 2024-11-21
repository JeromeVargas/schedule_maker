import SchoolModel from "../schools/schools.model";
import ScheduleModel from "./schedules.model";
import { NewSchedule } from "../../typings/types";
import LevelModel from "../levels/levels.model";

// CRUD services
// @desc insert a schedule in database
export const insertSchedule = (schedule: NewSchedule) => {
  const scheduleInsert = ScheduleModel.create(schedule);
  return scheduleInsert;
};

// @desc find all schedule by school id
export const findFilterAllSchedules = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return ScheduleModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a schedule by school id and name
export const findScheduleByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return ScheduleModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a schedule and filter by school id and name
export const findFilterScheduleByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  return ScheduleModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a schedule by schedule id and school id
export const modifyFilterSchedule = (
  filters: { _id: string; school_id: string },
  schedule: NewSchedule
) => {
  return ScheduleModel.findOneAndUpdate(filters, schedule, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a schedule
export const removeFilterSchedule = (filters: {
  _id: string;
  school_id: string;
}) => {
  return ScheduleModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a school by id
export const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

// @desc find a school by id
export const findAllLevels = (filters: {
  school_id: string;
  schedule_id: string;
}) => {
  return LevelModel.find(filters).lean().exec();
};
