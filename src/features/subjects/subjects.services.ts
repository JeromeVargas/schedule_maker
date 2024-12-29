import SubjectModel from "./subjects.model";
import LevelModel from "../levels/levels.model";
import FieldModel from "../fields/fields.model";
import { NewField, NewLevel, NewSchool, NewSubject } from "../../typings/types";
import SchoolModel from "../schools/schools.model";

/* Subjects */
export const insertSubject = (subject: NewSubject) => {
  return SubjectModel.create(subject);
};

export const insertManySubjects = (subjects: NewSubject[]) => {
  return SubjectModel.insertMany(subjects);
};

export const findFilterAllSubjects = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return SubjectModel.find(filters).select(fieldsToReturn).lean().exec();
};

export const findSubjectByProperty = (
  filters:
    | { level_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return SubjectModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const findFilterSubjectByProperty = (
  filters: { level_id: string; name: string },
  fieldsToReturn: string
) => {
  return SubjectModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

export const modifyFilterSubject = (
  filters: { _id: string; school_id: string },
  resource: NewSubject
) => {
  return SubjectModel.findOneAndUpdate(filters, resource, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterSubject = (filters: {
  school_id: string;
  _id: string;
}) => {
  return SubjectModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllSubjects = () => {
  return SubjectModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* Levels */
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
};

export const findPopulateLevelById = (
  levelId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return LevelModel.findById(levelId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

export const removeAllLevels = () => {
  return LevelModel.deleteMany();
};

/* Fields */
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

export const insertField = (field: NewField) => {
  return FieldModel.create(field);
};

export const removeAllFields = () => {
  return FieldModel.deleteMany();
};
