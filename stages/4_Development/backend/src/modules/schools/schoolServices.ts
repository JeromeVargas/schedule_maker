import { School } from "../../typings/types";
import SchoolModel from "./schoolModel";

// CRUD services
// @desc insert a school in database
// @params school
const insertSchool = (school: School) => {
  const schoolInserted = SchoolModel.create(school);
  return schoolInserted;
};

// @desc find all schools
// @params fieldsToReturn
const findAllSchools = (fieldsToReturn: string) => {
  const schoolFound = SchoolModel.find().select(fieldsToReturn).lean().exec();
  return schoolFound;
};

// @desc find a school by id
// @params schoolId, fieldsToReturn
const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  const schoolFound = SchoolModel.findById(schoolId)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return schoolFound;
};

// @desc find a school by name
// @params filters, fieldsToReturn
const findSchoolByProperty = (
  filters: { name: string },
  fieldsToReturn: string
) => {
  const schoolFound = SchoolModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return schoolFound;
};

// @desc update a school by id
// @params schoolId, school
const modifySchool = (schoolId: string, school: School) => {
  const schoolUpdated = SchoolModel.findByIdAndUpdate(schoolId, school, {
    new: true,
    runValidators: true,
  });

  return schoolUpdated;
};

// @desc delete a school by id
// @params schoolId
const removeSchool = (schoolId: string) => {
  const schoolDeleted = SchoolModel.findOneAndRemove({ _id: schoolId })
    .lean()
    .exec();
  return schoolDeleted;
};

export {
  insertSchool,
  findAllSchools,
  findSchoolById,
  findSchoolByProperty,
  modifySchool,
  removeSchool,
};
