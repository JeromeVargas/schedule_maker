import SchoolModel from "../schools/schoolModel";
import ScheduleModel from "./scheduleModel";
import { NewSchedule } from "../../typings/types";

// CRUD services
// @desc insert a schedule in database
// @params schedule
const insertSchedule = (schedule: NewSchedule) => {
  const scheduleInsert = ScheduleModel.create(schedule);
  return scheduleInsert;
};

// @desc find all schedule by school id
// @params filters, fields to return
const findFilterAllSchedules = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return ScheduleModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a schedule by school id and name
// @params filters, fields to return
const findScheduleByProperty = (
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
// @params filters, fields to return
const findFilterScheduleByProperty = (
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
// @params filter, schedule
const modifyFilterSchedule = (
  filters: { _id: string; school_id: string },
  schedule: NewSchedule
) => {
  return ScheduleModel.findOneAndUpdate(filters, schedule, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a schedule
// @params filters
const removeFilterSchedule = (filters: { _id: string; school_id: string }) => {
  return ScheduleModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
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
