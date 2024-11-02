import { NewSchool } from "../../typings/types";
import SchoolModel from "./schoolModel";

// CRUD services
// @desc insert a school in database
// @params school
const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

// @desc find all schools
// @params fieldsToReturn
const findAllSchools = (fieldsToReturn: string) => {
  return SchoolModel.find().select(fieldsToReturn).lean().exec();
};

// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

// @desc find a school by name
// @params filters, fieldsToReturn
const findSchoolByProperty = (
  filters: { name: string },
  fieldsToReturn: string
) => {
  return SchoolModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a school by id
// @params schoolId, school
const modifySchool = (schoolId: string, school: NewSchool) => {
  return SchoolModel.findByIdAndUpdate(schoolId, school, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a school by id
// @params schoolId
const removeSchool = (schoolId: string) => {
  return SchoolModel.findOneAndRemove({ _id: schoolId }).lean().exec();
};

export {
  insertSchool,
  findAllSchools,
  findSchoolById,
  findSchoolByProperty,
  modifySchool,
  removeSchool,
};
