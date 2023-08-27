import { NewTeacher } from "../../typings/types";
import UserModel from "../users/userModel";
import TeacherModel from "./teacherModel";

// CRUD services
// @desc insert a teacher in database
// @params teacher
const insertTeacher = (teacher: NewTeacher) => {
  const teacherInserted = TeacherModel.create(teacher);
  return teacherInserted;
};

// @desc find all teachers by school id
// @params filters, fieldsToReturn
const findFilterAllTeachers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const teacherFound = TeacherModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return teacherFound;
};

// @desc find a teacher by school id and user id or school id and teacher id
// @params filters, fieldsToReturn
const findTeacherByProperty = (
  filters:
    | { school_id: string; user_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const teacherFound = TeacherModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return teacherFound;
};

// @desc update a teacher by teacher id, school id and user id
// @params filters, teacher
const modifyFilterTeacher = (
  filters: { _id: string; school_id: string; user_id: string },
  teacher: NewTeacher
) => {
  const teacherUpdated = TeacherModel.findOneAndUpdate(filters, teacher, {
    new: true,
    runValidators: true,
  });
  return teacherUpdated;
};

// @desc delete a teacher by school id and teacher id
// @params teacherId, filters
const removeFilterTeacher = (filters: { school_id: string; _id: string }) => {
  const teacherDeleted = TeacherModel.findOneAndDelete(filters).lean().exec();
  return teacherDeleted;
};

/* Services from other entities */
// @desc find a user by coordinator and used id, also populate the school
// @params filters, fields to return, fields to populate, fields to return populate, resourceName
const findPopulateFilterAllUsers = (
  filters: string[],
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const resourceFound = UserModel.find({ _id: { $in: filters } })
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a user by id and school id properties
// @params filters, fields to return
const findUserByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const userFound = UserModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return userFound;
};

export {
  insertTeacher,
  findTeacherByProperty,
  findFilterAllTeachers,
  modifyFilterTeacher,
  removeFilterTeacher,
  /* Services from other entities */
  findPopulateFilterAllUsers,
  findUserByProperty,
};
