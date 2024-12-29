import ScheduleModel from "../schedules/schedules.model";
import BreakModel from "./breaks.model";
import SchoolModel from "../schools/schools.model";
import { NewBreak, NewSchedule, NewSchool } from "../../typings/types";

/* Breaks */
export const insertBreak = (scheduleBreak: NewBreak) => {
  return BreakModel.create(scheduleBreak);
};

export const insertManyBreaks = (breaks: NewBreak[]) => {
  return BreakModel.insertMany(breaks);
};

export const findAllBreaks = (fieldsToReturn: string) => {
  return BreakModel.find().select(fieldsToReturn).lean().exec();
};

export const findFilterAllBreaks = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return BreakModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findBreakByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return BreakModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterBreak = (
  filters: { _id: string; school_id: string },
  scheduleBreak: NewBreak
) => {
  return BreakModel.findOneAndUpdate(filters, scheduleBreak, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterBreak = (filters: {
  school_id: string;
  _id: string;
}) => {
  return BreakModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllBreaks = () => {
  return BreakModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

export const removeAllSchedules = () => {
  return ScheduleModel.deleteMany();
};

/* Schedules */
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

export const insertSchedule = (schedule: NewSchedule) => {
  const scheduleInsert = ScheduleModel.create(schedule);
  return scheduleInsert;
};
