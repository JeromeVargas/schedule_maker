import SubjectModel from "./subjectModel";
import LevelModel from "../levels/levelModel";
import FieldModel from "../fields/fieldModel";
import { NewSubject } from "../../typings/types";

// CRUD services
// @desc insert a subject in the database
// @params subject
const insertSubject = (subject: NewSubject) => {
  const subjectInsert = SubjectModel.create(subject);
  return subjectInsert;
};

// @desc find all subjects by school id
// @params filters, fields to return
const findFilterAllSubjects = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const subjectFound = SubjectModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return subjectFound;
};

// @desc find a subject by level id and name or school id and subject id
// @params filters, fields to return
const findSubjectByProperty = (
  filters:
    | { level_id: string; name: string }
    | { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const subjectFound = SubjectModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return subjectFound;
};

// @desc find a subject by level id and name
// @params filters, fields to return
const findFilterSubjectByProperty = (
  filters: { level_id: string; name: string },
  fieldsToReturn: string
) => {
  const subjectsFound = SubjectModel.find(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return subjectsFound;
};

// @desc update a resource by subject id and school name
// @params resourceId, resource
const modifyFilterSubject = (
  filters: { _id: string; school_id: string },
  resource: NewSubject
) => {
  const resourceUpdated = SubjectModel.findOneAndUpdate(filters, resource, {
    new: true,
    runValidators: true,
  });
  return resourceUpdated;
};

// @desc delete a resource by school id and subject id
// @params resourceId, filters
const removeFilterSubject = (filters: { school_id: string; _id: string }) => {
  const resourceDeleted = SubjectModel.findOneAndDelete(filters).lean().exec();
  return resourceDeleted;
};

/* Services from other entities */
// @desc find a level by id and populate the embedded entities
// @params levelId, fields to return, fields to populate, fields to return populate
const findPopulateLevelById = (
  levelId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const levelFound = LevelModel.findById(levelId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return levelFound;
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
  insertSubject,
  findFilterAllSubjects,
  findSubjectByProperty,
  findFilterSubjectByProperty,
  modifyFilterSubject,
  removeFilterSubject,
  /* Services from other entities */
  findPopulateLevelById,
  findPopulateFieldById,
};
