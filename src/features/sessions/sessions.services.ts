import SessionModel from "./sessions.model";
import SubjectModel from "../subjects/subjects.model";
import TeacherFieldModel from "../teacher_fields/teacher_fields.model";
import GroupCoordinatorModel from "../group_coordinators/group_coordinators.model";

import {
  NewField,
  NewGroup,
  NewGroupCoordinator,
  NewLevel,
  NewSchool,
  NewSession,
  NewSubject,
  NewTeacher,
  NewTeacherCoordinator,
  NewTeacherField,
  NewUser,
} from "../../typings/types";
import TeacherCoordinatorModel from "../teacher_coordinators/teacher_coordinators.model";
import SchoolModel from "../schools/schools.model";
import LevelModel from "../levels/levels.model";
import GroupModel from "../groups/groups.model";
import UserModel from "../users/users.model";
import FieldModel from "../fields/fields.model";
import TeacherModel from "../teachers/teachers.model";

/* Sessions */
export const insertSession = (sessionSession: NewSession) => {
  const sessionInsert = SessionModel.create(sessionSession);
  return sessionInsert;
};

export const insertManySessions = (sessions: NewSession[]) => {
  return SessionModel.insertMany(sessions);
};

export const findFilterAllSessions = (
  filters: { school_id: string },
  fieldsToReturn: string
) => {
  return SessionModel.find(filters).select(fieldsToReturn).lean().exec();
};

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

export const modifyFilterSession = (
  filters: { _id: string; school_id: string },
  sessionSession: NewSession
) => {
  return SessionModel.findOneAndUpdate(filters, sessionSession, {
    new: true,
    runValidators: true,
  });
};

export const removeFilterSession = (filters: {
  school_id: string;
  _id: string;
}) => {
  return SessionModel.findOneAndDelete(filters).lean().exec();
};

export const removeAllSessions = () => {
  return SessionModel.deleteMany();
};

/* Schools */
export const insertSchool = (school: NewSchool) => {
  return SchoolModel.create(school);
};

export const removeAllSchools = () => {
  return SchoolModel.deleteMany();
};

/* GroupCoordinators */
export const insertGroupCoordinator = (
  groupCoordinator: NewGroupCoordinator
) => {
  return GroupCoordinatorModel.create(groupCoordinator);
};

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

export const removeAllGroupCoordinators = () => {
  return GroupCoordinatorModel.deleteMany();
};

/* TeacherCoordinators */
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

export const insertTeacherCoordinator = (
  teacherCoordinator: NewTeacherCoordinator
) => {
  return TeacherCoordinatorModel.create(teacherCoordinator);
};

export const removeAllTeacherCoordinators = () => {
  return TeacherCoordinatorModel.deleteMany();
};

/* TeacherFields */
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

export const insertTeacherField = (teacherField: NewTeacherField) => {
  return TeacherFieldModel.create(teacherField);
};

export const removeAllTeacherFields = () => {
  return TeacherFieldModel.deleteMany();
};

/* Subjects */
export const insertSubject = (subject: NewSubject) => {
  return SubjectModel.create(subject);
};

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

export const removeAllSubjects = () => {
  return SubjectModel.deleteMany();
};

/* Fields */
export const insertField = (field: NewField) => {
  return FieldModel.create(field);
};

export const removeAllFields = () => {
  return FieldModel.deleteMany();
};

/* Users */
export const insertUser = (user: NewUser) => {
  return UserModel.create(user);
};

export const removeAllUsers = () => {
  return UserModel.deleteMany();
};

/* Levels */
export const insertLevel = (level: NewLevel) => {
  return LevelModel.create(level);
};

export const removeAllLevels = () => {
  return LevelModel.deleteMany();
};

/* Groups */
export const insertGroup = (group: NewGroup) => {
  return GroupModel.create(group);
};

export const removeAllGroups = () => {
  return GroupModel.deleteMany();
};

/* Teachers */
export const insertTeacher = (teacher: NewTeacher) => {
  return TeacherModel.create(teacher);
};

export const removeAllTeachers = () => {
  return TeacherModel.deleteMany();
};
