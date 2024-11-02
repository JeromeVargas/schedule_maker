import ScheduleModel from "../schedules/schedule.model";
import BreakModel from "./breaks.model";
import { NewBreak } from "../../typings/types";

// CRUD services
// @desc insert a break in database
// @params break
const insertBreak = (scheduleBreak: NewBreak) => {
  return BreakModel.create(scheduleBreak);
};

// @desc find all breaks by school id
// @params filters, fields to return
const findFilterAllBreaks = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return BreakModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a break by school id and break id
// @params breakProperty, fields to return
const findBreakByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return BreakModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a break by school id and break id
// @params filters, break
const modifyFilterBreak = (
  filters: { _id: string; school_id: string },
  scheduleBreak: NewBreak
) => {
  return BreakModel.findOneAndUpdate(filters, scheduleBreak, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a break by school id and break id
// @params filters
const removeFilterBreak = (filters: { school_id: string; _id: string }) => {
  return BreakModel.findOneAndDelete(filters).lean().exec();
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
  return ScheduleModel.findById(scheduleId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
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
