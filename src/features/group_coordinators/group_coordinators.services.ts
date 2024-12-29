import GroupCoordinatorModel from "./group_coordinators.model";
import {
  NewGroup,
  NewGroupCoordinator,
  NewSchool,
  NewUser,
} from "../../typings/types";
import GroupModel from "../groups/groups.model";
import UserModel from "../users/users.model";
import SchoolModel from "../schools/schools.model";

/* GroupCoordinators */
export const insertGroupCoordinator = (
  groupCoordinator: NewGroupCoordinator
) => {
  return GroupCoordinatorModel.create(groupCoordinator);
};

export const insertManyGroupCoordinators = (
  groupCoordinators: NewGroupCoordinator[]
) => {
  return GroupCoordinatorModel.insertMany(groupCoordinators);
};

export const findFilterAllGroupCoordinators = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return GroupCoordinatorModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
};

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

export const modifyFilterGroupCoordinator = (
  filters: { _id: string; school_id: string; group_id: string },
  groupCoordinator: NewGroupCoordinator
) => {
  return GroupCoordinatorModel.findOneAndUpdate(filters, groupCoordinator, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterGroupCoordinator = (filters: {
  school_id: string;
  _id: string;
}) => {
  return GroupCoordinatorModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllGroupCoordinators = () => {
  return GroupCoordinatorModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Groups */
export const insertGroup = (group: NewGroup) => {
  const groupInsert = GroupModel.create(group);
  return groupInsert;
};

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

export const removeAllGroups = () => {
  return GroupModel.deleteMany();
};

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

/* Users */
export const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};
