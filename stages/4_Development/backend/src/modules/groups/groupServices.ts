import LevelModel from "../levels/levelModel";
import GroupModel from "./groupModel";
import UserModel from "../users/userModel";

import { NewGroup } from "../../typings/types";

// CRUD services
// @desc insert a group in database
// @params group
const insertGroup = (group: NewGroup) => {
  const groupInsert = GroupModel.create(group);
  return groupInsert;
};

// @desc find all groups by school id
// @params filters, fields to return
const findFilterAllGroups = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const groupFound = GroupModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return groupFound;
};

// @desc find a group by school id and name
// @params filters, fields to return
const findGroupByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const groupFound = GroupModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return groupFound;
};

// @desc find a resource and filter by school id and name
// @params filters, fields to return
const findFilterGroupByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  const resourcesFound = GroupModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourcesFound;
};

// @desc update a group by group id and school id
// @params groupId, group
const modifyFilterGroup = (
  filters: { _id: string; school_id: string },
  group: NewGroup
) => {
  const groupUpdated = GroupModel.findOneAndUpdate(filters, group, {
    new: true,
    runValidators: true,
  });
  return groupUpdated;
};

// @desc delete a group by school id and group id
// @params groupId, filters
const removeFilterGroup = (filters: { school_id: string; _id: string }) => {
  const groupDeleted = GroupModel.findOneAndDelete(filters).lean().exec();
  return groupDeleted;
};

/* Services from other entities */
// @desc find a level by id and populate the embedded entities
// @params levelId, fields to return, fields to populate, fields to return populate
const findPopulateLevelById = (
  levelId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const levelFound = LevelModel.findById(levelId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return levelFound;
};

// @desc find a user by id and populate the embedded entities
// @params userId, fields to return, fields to populate, fields to return populate
const findPopulateUserById = (
  userId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const userFound = UserModel.findById(userId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return userFound;
};

export {
  insertGroup,
  findFilterAllGroups,
  findGroupByProperty,
  findFilterGroupByProperty,
  modifyFilterGroup,
  removeFilterGroup,
  /* Services from other entities */
  findPopulateLevelById,
  findPopulateUserById,
};
