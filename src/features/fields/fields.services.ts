import { NewField, NewSchool } from "../../typings/types";
import SchoolModel from "../schools/schools.model";
import FieldModel from "./fields.model";

/* Fields */
export const insertField = (field: NewField) => {
  return FieldModel.create(field);
};

export const insertManyFields = (fields: NewField[]) => {
  return FieldModel.insertMany(fields);
};

export const findFilterAllFields = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return FieldModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findFieldByProperty = (
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

export const findFilterFieldByProperty = (
  filters: { school_id: string; name: string },
  fieldsToReturn: string
) => {
  return FieldModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterField = (
  filters: { school_id: string; _id: string },
  field: NewField
) => {
  return FieldModel.findOneAndUpdate(filters, field, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterField = (filters: {
  school_id: string;
  _id: string;
}) => {
  return FieldModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllFields = () => {
  return FieldModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};
