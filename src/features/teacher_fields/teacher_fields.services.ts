import TeacherFieldModel from "./teacher_fields.model";
import TeacherModel from "../teachers/teachers.model";
import FieldModel from "../fields/fields.model";
import { NewTeacher_Field } from "../../typings/types";

// CRUD services
// @desc insert a teacher_field in database
export const insertTeacherField = (teacherField: NewTeacher_Field) => {
  return TeacherFieldModel.create(teacherField);
};

// @desc find all teacher_fields by school id
export const findFilterAllTeacherFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherFieldModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a teacher_field by teacher id, field id and school id
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

// @desc find a teacher_field and filter by school_id, teacher_id and field_id
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

// @desc update a teacher_field by some properties _id, school_id and teacher_id
export const modifyFilterTeacherField = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherField: NewTeacher_Field
) => {
  return TeacherFieldModel.findOneAndUpdate(filters, teacherField, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher_field by school_id and teacher field id
export const removeFilterTeacherField = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherFieldModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a teacher by id and populate the embedded entities
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

// @desc find a field by id and populate the embedded entities
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
