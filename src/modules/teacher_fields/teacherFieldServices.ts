import TeacherFieldModel from "./teacherFieldModel";
import TeacherModel from "../teachers/teacherModel";
import FieldModel from "../fields/fieldModel";
import { NewTeacher_Field } from "../../typings/types";

// CRUD services
// @desc insert a teacher_field in database
// @params teacherField
const insertTeacherField = (teacherField: NewTeacher_Field) => {
  const resourceInserted = TeacherFieldModel.create(teacherField);
  return resourceInserted;
};

// @desc find all teacher_fields by school id
// @params filters, fields to return
const findFilterAllTeacherFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const teacherFieldFound = TeacherFieldModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return teacherFieldFound;
};

// @desc find a teacher_field by teacher id, field id and school id
// @params filters, fields to return
const findTeacherFieldByProperty = (
  filters:
    | { school_id: string; teacher_id: string; field_id: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const resourceFound = TeacherFieldModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourceFound;
};

// @desc find a teacher_field and filter by school_id, teacher_id and field_id
// @params filters, fields to return
const findFilterTeacherFieldByProperty = (
  filters: { school_id: string; teacher_id: string; field_id: string },
  fieldsToReturn: string
) => {
  const resourcesFound = TeacherFieldModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return resourcesFound;
};

// @desc update a teacher_field by some properties _id, school_id and teacher_id
// @params filters, teacherField
const modifyFilterTeacherField = (
  filters: { _id: string; school_id: string; teacher_id: string },
  teacherField: NewTeacher_Field
) => {
  const resourceUpdated = TeacherFieldModel.findOneAndUpdate(
    filters,
    teacherField,
    {
      new: true,
      runValidators: true,
    }
  );
  return resourceUpdated;
};

// @desc delete a teacher_field by school_id and teacher field id
// @params filters
const removeFilterTeacherField = (filters: {
  school_id: string;
  _id: string;
}) => {
  const resourceDeleted = TeacherFieldModel.findOneAndDelete(filters)
    .lean()
    .exec();
  return resourceDeleted;
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
  const teacherFound = TeacherModel.findById(teacherId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return teacherFound;
};

// @desc find a field by id and populate the embedded entities
// @params fieldId, fields to return, fields to populate, fields to return populate
const findPopulateFieldById = (
  fieldId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const fieldFound = FieldModel.findById(fieldId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return fieldFound;
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
