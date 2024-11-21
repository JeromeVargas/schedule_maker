import GroupCoordinatorModel from "./group_coordinators.model";
import { NewGroup_Coordinator } from "../../typings/types";
import GroupModel from "../groups/groups.model";
import UserModel from "../users/users.model";

// CRUD services
// @desc insert a teacher_field in database
export const insertGroupCoordinator = (
  groupCoordinator: NewGroup_Coordinator
) => {
  return GroupCoordinatorModel.create(groupCoordinator);
};

// @desc find all teacher_fields by school id
export const findFilterAllGroupCoordinators = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupCoordinatorModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find a teacher_field by teacher id, field id and school id
export const findGroupCoordinatorByProperty = (
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
export const findFilterGroupCoordinatorByProperty = (
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
export const modifyFilterGroupCoordinator = (
  filters: { _id: string; school_id: string; group_id: string },
  groupCoordinator: NewGroup_Coordinator
) => {
  return GroupCoordinatorModel.findOneAndUpdate(filters, groupCoordinator, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher_field by school_id and teacher field id
export const removeFilterGroupCoordinator = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupCoordinatorModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a group by id and populate the embedded entities
export const findPopulateGroupById = (
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
export const findPopulateCoordinatorById = (
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
