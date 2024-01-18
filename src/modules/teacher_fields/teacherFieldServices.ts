import TeacherFieldModel from "./teacherFieldModel";
import TeacherModel from "../teachers/teacherModel";
import FieldModel from "../fields/fieldModel";
import { NewTeacher_Field } from "../../typings/types";

// CRUD services
// @desc insert a teacher_field in database
// @params teacherField
const insertTeacherField = (teacherField: NewTeacher_Field) => {
  return TeacherFieldModel.create(teacherField);
};

// @desc find all teacher_fields by school id
// @params filters, fields to return
const findFilterAllTeacherFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return TeacherFieldModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a teacher_field by teacher id, field id and school id
// @params filters, fields to return
const findTeacherFieldByProperty = (
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
// @params filters, fields to return
const findFilterTeacherFieldByProperty = (
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
// @params filters, teacherField
const modifyFilterTeacherField = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherField: NewTeacher_Field
) => {
  return TeacherFieldModel.findOneAndUpdate(filters, teacherField, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a teacher_field by school_id and teacher field id
// @params filters
const removeFilterTeacherField = (filters: {
  school_id: string;
  _id: string;
}) => {
  return TeacherFieldModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a teacher by id and populate the embedded entities
// @params teacherId, fields to return, fields to populate, fields to return populate
const findPopulateTeacherById = (
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
// @params fieldId, fields to return, fields to populate, fields to return populate
const findPopulateFieldById = (
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

export {
  insertTeacherField,
  findFilterAllTeacherFields,
  findTeacherFieldByProperty,
  findFilterTeacherFieldByProperty,
  modifyFilterTeacherField,
  removeFilterTeacherField,
  /* Services from other entities */
  findPopulateTeacherById,
  findPopulateFieldById,
};
