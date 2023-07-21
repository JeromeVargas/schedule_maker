import { Schedule } from "../../typings/types";
import SchoolModel from "../schools/schoolModel";
import ScheduleModel from "./scheduleModel";

// CRUD services
// @desc insert a schedule in database
// @params schedule
const insertSchedule = (schedule: Schedule) => {
  const scheduleInsert = ScheduleModel.create(schedule);
  return scheduleInsert;
};

// @desc find all schedule by school id
// @params filters, fields to return
const findFilterAllSchedules = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const resourceFound = ScheduleModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a schedule by school id and name
// @params filters, fields to return
const findScheduleByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const scheduleFound = ScheduleModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return scheduleFound;
};

// @desc find a schedule and filter by school id and name
// @params filters, fields to return
const findFilterScheduleByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  const schedulesFound = ScheduleModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return schedulesFound;
};

// @desc update a schedule by schedule id and school id
// @params filter, schedule
const modifyFilterSchedule = (
  filters: { _id: string; school_id: string },
  schedule: Schedule
) => {
  const scheduleUpdated = ScheduleModel.findOneAndUpdate(filters, schedule, {
    new: true,
    runValidators: true,
  });
  return scheduleUpdated;
};

// @desc delete a schedule
// @params filters
const removeFilterSchedule = (filters: { _id: string; school_id: string }) => {
  const resourceDeleted = ScheduleModel.findOneAndDelete(filters).lean().exec();
  return resourceDeleted;
};

/* Services from other entities */
// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  const schoolFound = SchoolModel.findById(schoolId)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return schoolFound;
};

export {
  insertSchedule,
  findScheduleByProperty,
  findFilterAllSchedules,
  findFilterScheduleByProperty,
  modifyFilterSchedule,
  removeFilterSchedule,
  /* Services from other entities */
  findSchoolById,
};
