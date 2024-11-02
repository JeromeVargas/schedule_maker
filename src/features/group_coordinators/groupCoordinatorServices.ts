import GroupCoordinatorModel from "./groupCoordinatorModel";
import { NewGroup_Coordinator } from "../../typings/types";
import GroupModel from "../groups/groupModel";
import UserModel from "../users/userModel";

// CRUD services
// @desc insert a teacher_field in database
// @params groupCoordinator
const insertGroupCoordinator = (groupCoordinator: NewGroup_Coordinator) => {
  return GroupCoordinatorModel.create(groupCoordinator);
};

// @desc find all teacher_fields by school id
// @params filters, fields to return
const findFilterAllGroupCoordinators = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupCoordinatorModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a teacher_field by teacher id, field id and school id
// @params filters, fields to return
const findGroupCoordinatorByProperty = (
  filters:
    | { school_id: string; group_id: string; coordinator_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return GroupCoordinatorModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a teacher_field and filter by school_id, teacher_id and field_id
// @params filters, fields to return
const findFilterGroupCoordinatorByProperty = (
  filters: { school_id: string; teacher_id: string; field_id: string },
  fieldsToReturn: string
) => {
  return GroupCoordinatorModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a teacher_field by some properties _id, school_id and teacher_id
// @params filters, groupCoordinator
const modifyFilterGroupCoordinator = (
  filters: { _id: string; school_id: string; group_id: string },
  groupCoordinator: NewGroup_Coordinator
) => {
  return GroupCoordinatorModel.findOneAndUpdate(filters, groupCoordinator, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher_field by school_id and teacher field id
// @params filters
const removeFilterGroupCoordinator = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupCoordinatorModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a group by id and populate the embedded entities
// @params groupId, fields to return, fields to populate, fields to return populate
const findPopulateGroupById = (
  groupId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return GroupModel.findById(groupId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a field by id and populate the embedded entities
// @params coordinatorId, fields to return, fields to populate, fields to return populate
const findPopulateCoordinatorById = (
  coordinatorId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return UserModel.findById(coordinatorId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

export {
  insertGroupCoordinator,
  findFilterAllGroupCoordinators,
  findGroupCoordinatorByProperty,
  findFilterGroupCoordinatorByProperty,
  modifyFilterGroupCoordinator,
  removeFilterGroupCoordinator,
  /* Services from other entities */
  findPopulateGroupById,
  findPopulateCoordinatorById,
};
