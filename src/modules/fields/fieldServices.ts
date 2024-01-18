import { NewField } from "../../typings/types";
import SchoolModel from "../schools/schoolModel";
import FieldModel from "./fieldModel";

// CRUD services
// @desc insert a field in database
// @params Field
const insertField = (field: NewField) => {
  return FieldModel.create(field);
};

// @desc find all fields by school id
// @params filters, fields to return
const findFilterAllFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return FieldModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a field by school id and name or school id and field id
// @params Field, fields to return
const findFieldByProperty = (
  filters:
    | { school_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return FieldModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc find and filter a field by school id and name
// @params filters, fields to return
const findFilterFieldByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  return FieldModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a field by school id and field id
// @params resourceId, Field
const modifyFilterField = (
  filters: { school_id: string; _id: string },
  field: NewField
) => {
  return FieldModel.findOneAndUpdate(filters, field, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a field by school id and field id
// @params filters
const removeFilterField = (filters: { school_id: string; _id: string }) => {
  return FieldModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a school by id
// @params schoolId, fields to return
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export {
  insertField,
  findFilterAllFields,
  findFieldByProperty,
  removeFilterField,
  modifyFilterField,
  findFilterFieldByProperty,
  /* Services from other entities */
  findSchoolById,
};
