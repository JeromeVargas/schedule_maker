import SchoolModel from "../schools/schools.model";
import ScheduleModel from "./schedules.model";
import { NewLevel, NewSchedule, NewSchool } from "../../typings/types";
import LevelModel from "../levels/levels.model";

/* Schedules */
export const insertSchedule = (schedule: NewSchedule) => {
  const scheduleInsert = ScheduleModel.create(schedule);
  return scheduleInsert;
};

export const insertManySchedules = (schedules: NewSchedule[]) => {
  return ScheduleModel.insertMany(schedules);
};

export const findFilterAllSchedules = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return ScheduleModel.find(filters).select(fieldsToReturn).lean().exec();
};

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

export const modifyFilterSchedule = (
  filters: { _id: string; school_id: string },
  schedule: NewSchedule
) => {
  return ScheduleModel.findOneAndUpdate(filters, schedule, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterSchedule = (filters: {
  _id: string;
  school_id: string;
}) => {
  return ScheduleModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllSchedules = () => {
  return ScheduleModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Levels */
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
};

export const findAllLevels = (filters: {
  school_id: string;
  schedule_id: string;
}) => {
  return LevelModel.find(filters).lean().exec();
};
