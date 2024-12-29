import TeacherFieldModel from "./teacher_fields.model";
import TeacherModel from "../teachers/teachers.model";
import FieldModel from "../fields/fields.model";
import {
  NewField,
  NewSchool,
  NewTeacher,
  NewTeacherField,
  NewUser,
} from "../../typings/types";
import SchoolModel from "../schools/schools.model";
import UserModel from "../users/users.model";

/* TeacherFields */
export const insertTeacherField = (teacherField: NewTeacherField) => {
  return TeacherFieldModel.create(teacherField);
};

export const insertManyTeacherFields = (teacherFields: NewTeacherField[]) => {
  return TeacherFieldModel.insertMany(teacherFields);
};

export const findFilterAllTeacherFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherFieldModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findTeacherFieldByProperty = (
  filters:
    | { school_id: string; teacher_id: string; field_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return TeacherFieldModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const findFilterTeacherFieldByProperty = (
  filters: { school_id: string; teacher_id: string; field_id: string },
  fieldsToReturn: string
) => {
  return TeacherFieldModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterTeacherField = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherField: NewTeacherField
) => {
  return TeacherFieldModel.findOneAndUpdate(filters, teacherField, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterTeacherField = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherFieldModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllTeacherFields = () => {
  return TeacherFieldModel.deleteMany();
};

/* Users */
export const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};

/* Teachers */
export const insertTeacher = (teacher: NewTeacher) => {
  return TeacherModel.create(teacher);
};

export const findPopulateTeacherById = (
  teacherId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return TeacherModel.findById(teacherId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

export const removeAllTeachers = () => {
  return TeacherModel.deleteMany();
};

/* Fields */
export const insertField = (field: NewField) => {
  return FieldModel.create(field);
};

export const removeAllFields = () => {
  return FieldModel.deleteMany();
};

export const findPopulateFieldById = (
  fieldId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return FieldModel.findById(fieldId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

// @desc delete all schools
export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};
