import LevelModel from "../levels/levels.model";
import GroupModel from "./groups.model";

import { NewGroup, NewLevel, NewSchool } from "../../typings/types";
import SchoolModel from "../schools/schools.model";

/* Groups */
export const insertGroup = (group: NewGroup) => {
  return GroupModel.create(group);
};

export const insertManyGroups = (groups: NewGroup[]) => {
  return GroupModel.insertMany(groups);
};

export const findFilterAllGroups = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findGroupByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return GroupModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const findFilterGroupByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  return GroupModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterGroup = (
  filters: { _id: string; school_id: string },
  group: NewGroup
) => {
  return GroupModel.findOneAndUpdate(filters, group, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterGroup = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllGroups = () => {
  return GroupModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Levels */
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
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

export const removeAllLevels = () => {
  return LevelModel.deleteMany();
};
