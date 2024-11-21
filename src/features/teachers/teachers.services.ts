import { NewTeacher } from "../../typings/types";
import UserModel from "../users/users.model";
import TeacherModel from "./teachers.model";

// CRUD services
// @desc insert a teacher in database
export const insertTeacher = (teacher: NewTeacher) => {
  return TeacherModel.create(teacher);
};

// @desc find all teachers by school id
export const findFilterAllTeachers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a teacher by school id and user id or school id and teacher id
export const findTeacherByProperty = (
  filters:
    | { school_id: string; user_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return TeacherModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a teacher by teacher id, school id and user id
export const modifyFilterTeacher = (
  filters: { _id: string; school_id: string; user_id: string },
  teacher: NewTeacher
) => {
  return TeacherModel.findOneAndUpdate(filters, teacher, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher by school id and teacher id
export const removeFilterTeacher = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a user by coordinator and used id, also populate the school
export const findPopulateFilterAllUsers = (
  filters: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return UserModel.findOne({ _id: filters })
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a user by id and school id properties
export const findUserByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return UserModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};
