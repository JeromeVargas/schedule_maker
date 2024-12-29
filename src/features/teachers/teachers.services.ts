import { NewSchool, NewTeacher, NewUser } from "../../typings/types";
import SchoolModel from "../schools/schools.model";
import UserModel from "../users/users.model";
import TeacherModel from "./teachers.model";

/* Teachers */
export const insertTeacher = (teacher: NewTeacher) => {
  return TeacherModel.create(teacher);
};

export const insertManyTeachers = (teachers: NewTeacher[]) => {
  return TeacherModel.insertMany(teachers);
};

export const findFilterAllTeachers = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherModel.find(filters).select(fieldsToReturn).lean().exec();
};

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

export const modifyFilterTeacher = (
  filters: { _id: string; school_id: string; user_id: string },
  teacher: NewTeacher
) => {
  return TeacherModel.findOneAndUpdate(filters, teacher, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterTeacher = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllTeachers = () => {
  return TeacherModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  const schoolInsert = SchoolModel.create(school);
  return schoolInsert;
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Users */
export const insertUser = (user: NewUser) => {
  const userInsert = UserModel.create(user);
  return userInsert;
};

export const findPopulateFilterUser = (
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

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};
