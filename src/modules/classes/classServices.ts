import ClassModel from "./classModel";
import GroupModel from "../groups/groupModel";
import SubjectModel from "../subjects/subjectModel";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";

import { NewClass } from "../../typings/types";

// CRUD services
// @desc insert a class in database
// @params class
const insertClass = (classSession: NewClass) => {
  const classInsert = ClassModel.create(classSession);
  return classInsert;
};

// @desc find all classes by school id
// @params filters, fields to return
const findFilterAllClasses = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const classesFound = ClassModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return classesFound;
};

// @desc find a class by school id and class id
// @params classProperty, fields to return
const findClassByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const classFound = ClassModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return classFound;
};

// @desc update a class by class id and school id
// @params classId, class
const modifyFilterClass = (
  filters: { _id: string; school_id: string },
  classSession: NewClass
) => {
  const classUpdated = ClassModel.findOneAndUpdate(filters, classSession, {
    new: true,
    runValidators: true,
  });
  return classUpdated;
};

// @desc delete a class by school id and class id
// @params classId, filters
const removeFilterClass = (filters: { school_id: string; _id: string }) => {
  const classDeleted = ClassModel.findOneAndDelete(filters).lean().exec();
  return classDeleted;
};

/* Services from other entities */
// @desc find a group by id and populate the embedded entities
// @params groupId, fields to return, fields to populate, fields to return populate
const findPopulateGroupById = (
  groupId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const groupFound = GroupModel.findById(groupId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return groupFound;
};

// @desc find a subject by id and populate the embedded entities
// @params subjectId, fields to return, fields to populate, fields to return populate
const findPopulateSubjectById = (
  subjectId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const subjectFound = SubjectModel.findById(subjectId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return subjectFound;
};

// @desc find a teacher_filed by id and populate the embedded entities
// @params teacherFieldId, fields to return, fields to populate, fields to return populate
const findPopulateTeacherFieldById = (
  teacherFieldId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  const teacherFieldFound = TeacherFieldModel.findById(teacherFieldId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
  return teacherFieldFound;
};

export {
  insertClass,
  findFilterAllClasses,
  findClassByProperty,
  modifyFilterClass,
  removeFilterClass,
  /* Services from other entities */
  findPopulateGroupById,
  findPopulateSubjectById,
  findPopulateTeacherFieldById,
};
