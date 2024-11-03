import LevelModel from "../levels/level.model";
import GroupModel from "./groups.Model";
import UserModel from "../users/users.model";

import { NewGroup } from "../../typings/types";

// CRUD services
// @desc insert a group in database
// @params group
export const insertGroup = (group: NewGroup) => {
  return GroupModel.create(group);
};

// @desc find all groups by school id
// @params filters, fields to return
export const findFilterAllGroups = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a group by school id and name
// @params filters, fields to return
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
// @params filters, fields to return
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
// @params groupId, group
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
// @params groupId, filters
export const removeFilterGroup = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a level by id and populate the embedded entities
// @params levelId, fields to return, fields to populate, fields to return populate
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
// @params userId, fields to return, fields to populate, fields to return populate
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
