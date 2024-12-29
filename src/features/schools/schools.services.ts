import { NewSchool } from "../../typings/types";
import SchoolModel from "./schools.model";

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const insertManySchools = (schools: NewSchool[]) => {
  return SchoolModel.insertMany(schools);
};

export const findAllSchools = (fieldsToReturn: string) => {
  return SchoolModel.find().select(fieldsToReturn).lean().exec();
};

export const findSchoolById = (schoolId: string, fieldsToReturn: string) => {
  return SchoolModel.findById(schoolId).select(fieldsToReturn).lean().exec();
};

export const findSchoolByProperty = (
  filters: { name: string },
  fieldsToReturn: string
) => {
  return SchoolModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifySchool = (schoolId: string, school: NewSchool) => {
  return SchoolModel.findByIdAndUpdate(schoolId, school, {
    new: true,
    runValidators: true,
  });
};

export const removeSchool = (schoolId: string) => {
  return SchoolModel.findOneAndRemove({ _id: schoolId }).lean().exec();
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};
