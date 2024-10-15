import SessionModel from "./sessionModel";
import GroupModel from "../groups/groupModel";
import SubjectModel from "../subjects/subjectModel";
import TeacherFieldModel from "../teacher_fields/teacherFieldModel";
import GroupCoordinatorModel from "../group_coordinators/groupCoordinatorModel";

import { NewSession } from "../../typings/types";
import TeacherCoordinatorModel from "../teacher_coordinators/teacherCoordinatorModel";

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
  return SessionModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a session by school id and session id
// @params sessionProperty, fields to return
const findSessionByProperty = (
  filters: { school_id: string; _id: string },
  fieldsToReturn: string
) => {
  return SessionModel.findOne(filters)
    .collation({ locale: "en", strength: 2 })
    .select(fieldsToReturn)
    .lean()
    .exec();
};

// @desc update a session by session id and school id
// @params sessionId, session
const modifyFilterSession = (
  filters: { _id: string; school_id: string },
  sessionSession: NewSession
) => {
  return SessionModel.findOneAndUpdate(filters, sessionSession, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a session by school id and session id
// @params sessionId, filters
const removeFilterSession = (filters: { school_id: string; _id: string }) => {
  return SessionModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a group_coordinator by id and populate the embedded entities
// @params groupId, fields to return, fields to populate, fields to return populate
const findPopulateGroupCoordinatorById = (
  groupCoordinatorId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return GroupCoordinatorModel.findById(groupCoordinatorId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a teacher_coordinator by id and populate the embedded entities
// @params groupId, fields to return, fields to populate, fields to return populate
const findPopulateTeacherCoordinatorById = (
  teacherCoordinatorId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return TeacherCoordinatorModel.findById(teacherCoordinatorId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a teacher_filed by id and populate the embedded entities
// @params teacherFieldId, fields to return, fields to populate, fields to return populate
const findPopulateTeacherFieldById = (
  teacherFieldId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return TeacherFieldModel.findById(teacherFieldId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

// @desc find a subject by id and populate the embedded entities
// @params subjectId, fields to return, fields to populate, fields to return populate
const findPopulateSubjectById = (
  subjectId: string,
  fieldsToReturn: string,
  fieldsToPopulate: string,
  fieldsToReturnPopulate: string
) => {
  return SubjectModel.findById(subjectId)
    .select(fieldsToReturn)
    .populate(fieldsToPopulate, fieldsToReturnPopulate)
    .lean()
    .exec();
};

export {
  insertSession,
  findFilterAllSessions,
  findSessionByProperty,
  modifyFilterSession,
  removeFilterSession,
  /* Services from other entities */
  findPopulateGroupCoordinatorById,
  findPopulateTeacherCoordinatorById,
  findPopulateTeacherFieldById,
  findPopulateSubjectById,
};
