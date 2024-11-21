import LevelModel from "../levels/levels.model";
import GroupModel from "./groups.model";
import UserModel from "../users/users.model";

import { NewGroup } from "../../typings/types";

// CRUD services
// @desc insert a group in database
export const insertGroup = (group: NewGroup) => {
  return GroupModel.create(group);
};

// @desc find all groups by school id
export const findFilterAllGroups = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a group by school id and name
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

// @desc find a resource and filter by school id and name
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

// @desc update a group by group id and school id
export const modifyFilterGroup = (
  filters: { _id: string; school_id: string },
  group: NewGroup
) => {
  return GroupModel.findOneAndUpdate(filters, group, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a group by school id and group id
export const removeFilterGroup = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a level by id and populate the embedded entities
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

// @desc find a user by id and populate the embedded entities
export const findPopulateUserById = (
  userId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return UserModel.findById(userId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};
