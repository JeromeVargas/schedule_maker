import { Break } from "../../typings/types";
import ScheduleModel from "../schedules/scheduleModel";
import BreakModel from "./breakModel";

// CRUD services
// @desc insert a break in database
// @params break
const insertBreak = (scheduleBreak: Break) => {
  const breakInsert = BreakModel.create(scheduleBreak);
  return breakInsert;
};

// @desc find all breaks by school id
// @params filters, fields to return
const findFilterAllBreaks = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const breakFound = BreakModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return breakFound;
};

// @desc find a break by school id and break id
// @params breakProperty, fields to return
const findBreakByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const breakFound = BreakModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return breakFound;
};

// @desc update a break by school id and break id
// @params filters, break
const modifyFilterBreak = (
  filters: { _id: string; school_id: string },
  scheduleBreak: Break
) => {
  const breakUpdated = BreakModel.findOneAndUpdate(filters, scheduleBreak, {
    new: true,
    runValidators: true,
  });
  return breakUpdated;
};

// @desc delete a break by school id and break id
// @params filters
const removeFilterBreak = (filters: { school_id: string; _id: string }) => {
  const breakDeleted = BreakModel.findOneAndDelete(filters).lean().exec();
  return breakDeleted;
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
  insertBreak,
  findFilterAllBreaks,
  findBreakByProperty,
  modifyFilterBreak,
  removeFilterBreak,
  /* Services from other entities */
  findPopulateScheduleById,
};
