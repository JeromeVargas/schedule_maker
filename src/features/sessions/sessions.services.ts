import SessionModel from "./sessions.model";
import SubjectModel from "../subjects/subjects.model";
import TeacherFieldModel from "../teacher_fields/teacher_fields.model";
import GroupCoordinatorModel from "../group_coordinators/group_coordinators.model";

import { NewSession } from "../../typings/types";
import TeacherCoordinatorModel from "../teacher_coordinators/teacher_coordinators.model";

// CRUD services
// @desc insert a session in database
export const insertSession = (sessionSession: NewSession) => {
  const sessionInsert = SessionModel.create(sessionSession);
  return sessionInsert;
};

// @desc find all sessions by school id
export const findFilterAllSessions = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return SessionModel.find(filters).select(fieldsToReturn).lean().exec();
};

// @desc find a session by school id and session id
export const findSessionByProperty = (
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
export const modifyFilterSession = (
  filters: { _id: string; school_id: string },
  sessionSession: NewSession
) => {
  return SessionModel.findOneAndUpdate(filters, sessionSession, {
    new: true,
    runValidators: true,
  });
};

// @desc delete a session by school id and session id
export const removeFilterSession = (filters: {
  school_id: string;
  _id: string;
}) => {
  return SessionModel.findOneAndDelete(filters).lean().exec();
};

/* Services from other entities */
// @desc find a group_coordinator by id and populate the embedded entities
export const findPopulateGroupCoordinatorById = (
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
export const findPopulateTeacherCoordinatorById = (
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
export const findPopulateTeacherFieldById = (
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
export const findPopulateSubjectById = (
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
