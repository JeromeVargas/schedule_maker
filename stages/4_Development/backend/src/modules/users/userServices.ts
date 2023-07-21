import { User } from "../../typings/types";
import SchoolModel from "../schools/schoolModel";
import UserModel from "./userModel";

// CRUD services
// @desc insert a user in the database
// @params user
const insertUser = (user: User) => {
  const userInserted = UserModel.create(user);
  return userInserted;
};

// @desc find all users by school id
// @params filters, fieldsToReturn
const findFilterAllUsers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const userFound = UserModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return userFound;
};

// @desc find a user by school id and email or school id and user id
// @params filters, fieldsToReturn
const findUserByProperty = (
  filters:
    | { school_id: string; email: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const userFound = UserModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return userFound;
};

// @desc update a user by school id and other property
// @params filters, user
const modifyFilterUser = (
  filters: {
    school_id: string;
    _id: string;
  },
  user: User
) => {
  const userUpdated = UserModel.findOneAndUpdate(filters, user, {
    new: true,
    runValidators: true,
  });
  return userUpdated;
};

// @desc delete a user by school id and other property
// @params filters
const removeFilterUser = (filters: { school_id: string; _id: string }) => {
  const userDeleted = UserModel.findOneAndDelete(filters).lean().exec();
  return userDeleted;
};

/* Services from other entities */
// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  const schoolFound = SchoolModel.findById(schoolId)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return schoolFound;
};

export {
  insertUser,
  findFilterAllUsers,
  findUserByProperty,
  modifyFilterUser,
  removeFilterUser,
  /* Services from other entities */
  findSchoolById,
};
