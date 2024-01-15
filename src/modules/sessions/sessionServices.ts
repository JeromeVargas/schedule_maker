import SessionModel from "./sessionModel";
import GroupModel from "../groups/groupModel";
import SubjectModel from "../subjects/subjectModel";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";

import { NewSession } from "../../typings/types";

// CRUD services
// @desc insert a session in database
// @params session
const insertSession = (sessionSession: NewSession) => {
  const sessionInsert = SessionModel.create(sessionSession);
  return sessionInsert;
};

// @desc find all sessions by school id
// @params filters, fields to return
const findFilterAllSessions = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  const sessionsFound = SessionModel.find(filters)
    .select(fieldsToReturn)
    .lean()
    .exec();
  return sessionsFound;
};

// @desc find a session by school id and session id
// @params sessionProperty, fields to return
const findSessionByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  const sessionFound = SessionModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
  return sessionFound;
};

// @desc update a session by session id and school id
// @params sessionId, session
const modifyFilterSession = (
  filters: { _id: string; school_id: string },
  sessionSession: NewSession
) => {
  const sessionUpdated = SessionModel.findOneAndUpdate(
    filters,
    sessionSession,
    {
      new: true,
      runValidators: true,
    }
  );
  return sessionUpdated;
};

// @desc delete a session by school id and session id
// @params sessionId, filters
const removeFilterSession = (filters: { school_id: string; _id: string }) => {
  const sessionDeleted = SessionModel.findOneAndDelete(filters).lean().exec();
  return sessionDeleted;
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
  insertSession,
  findFilterAllSessions,
  findSessionByProperty,
  modifyFilterSession,
  removeFilterSession,
  /* Services from other entities */
  findPopulateGroupById,
  findPopulateSubjectById,
  findPopulateTeacherFieldById,
};
