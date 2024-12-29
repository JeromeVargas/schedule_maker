import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import NotFoundError from "../../errors/not-found";

import {
  insertSession,
  findSessionByProperty,
  findFilterAllSessions,
  modifyFilterSession,
  removeFilterSession,
  findPopulateGroupCoordinatorById,
  findPopulateSubjectById,
  findPopulateTeacherFieldById,
  findPopulateTeacherCoordinatorById,
} from "./sessions.services";

/* controller global variables */
const maxMinutesInDay = 1439;

export const createSession = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const {
    school_id,
    level_id,
    group_id,
    groupCoordinator_id,
    teacherCoordinator_id,
    teacherField_id,
    subject_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  // find if the start time is later than the 23:59 hours
  if (startTime > maxMinutesInDay) {
    throw new BadRequestError("The session start time must not exceed 23:00");
  }
  /* find if the groupCoordinator already exists */
  const fieldsToReturnGroupCoordinator = "-createdAt -updatedAt";
  const fieldsToPopulateGroupCoordinator = "school_id group_id coordinator_id";
  const fieldsToReturnPopulateGroupCoordinator = "-createdAt -updatedAt";
  const groupCoordinatorFound = await findPopulateGroupCoordinatorById(
    groupCoordinator_id,
    fieldsToReturnGroupCoordinator,
    fieldsToPopulateGroupCoordinator,
    fieldsToReturnPopulateGroupCoordinator
  );
  if (!groupCoordinatorFound) {
    throw new NotFoundError(
      "Please make sure the group_coordinator assignment exists"
    );
  }
  // find if the school exists for the groupCoordinator and matches the school in the body
  if (groupCoordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group_coordinator belongs to the school"
    );
  }
  // find if the level exists for group and matches the level in the body
  if (groupCoordinatorFound?.group_id?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the level"
    );
  }
  // find if the group is the same as the one passed in the body
  if (groupCoordinatorFound?.group_id?._id?.toString() !== group_id) {
    throw new BadRequestError(
      "Please make sure the group is the same assigned to the coordinator"
    );
  }
  // find if the coordinator is an actual coordinator and the role active
  if (groupCoordinatorFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupCoordinatorFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the teacherCoordinator already exists */
  const fieldsToReturnTeacherCoordinator = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherCoordinator =
    "school_id teacher_id coordinator_id";
  const fieldsToReturnPopulateTeacherCoordinator = "-createdAt -updatedAt";
  const teacherCoordinatorFound = await findPopulateTeacherCoordinatorById(
    teacherCoordinator_id,
    fieldsToReturnTeacherCoordinator,
    fieldsToPopulateTeacherCoordinator,
    fieldsToReturnPopulateTeacherCoordinator
  );
  if (!teacherCoordinatorFound) {
    throw new NotFoundError(
      "Please make sure the teacher_coordinator assignment exists"
    );
  }
  // find if the school exists for the teacherCoordinator and matches the school in the body
  if (teacherCoordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the teacher_coordinator belongs to the school"
    );
  }
  /* find if the coordinator for the teacher and group is the same */
  // other checks such as the existence, status and role have already been taken care of by the group checks
  if (
    teacherCoordinatorFound?.coordinator_id?._id?.toString() !==
    groupCoordinatorFound?.coordinator_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the coordinator has been assigned to both the group and the teacher"
    );
  }
  /* find if the teacherField already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateTeacherFieldById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField
  );
  if (!teacherFieldFound) {
    throw new NotFoundError(
      "Please make sure the field_teacher assignment exists"
    );
  }
  // find if the school exists for field_teacher assignment and matches the school in the body
  if (teacherFieldFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field assigned to the teacher belongs to the school"
    );
  }
  // find if the teacher in teacher_coordinator is the same as the teacher in teacher_field
  if (
    teacherCoordinatorFound?.teacher_id?._id?.toString() !==
    teacherFieldFound?.teacher_id?._id.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the teacher assigned to the coordinator is also assigned to the field"
    );
  }
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id level_id field_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
  const subjectFound = await findPopulateSubjectById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject
  );
  if (!subjectFound) {
    throw new NotFoundError("Please make sure the subject exists");
  }
  // find if the school exists for subject and matches the school in the body
  if (subjectFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the school"
    );
  }
  // find if the level exists for the subject and matches the level in the body
  if (subjectFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the level"
    );
  }
  /* find if the field for the teacher is the same in parent subject */
  if (
    subjectFound?.field_id?._id?.toString() !==
    teacherFieldFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* create session */
  const newSession = {
    school_id: school_id,
    level_id: level_id,
    group_id: group_id,
    groupCoordinator_id: groupCoordinator_id,
    teacherCoordinator_id: teacherCoordinator_id,
    teacherField_id: teacherField_id,
    subject_id: subject_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const sessionCreated = await insertSession(newSession);
  if (!sessionCreated) {
    throw new BadRequestError("Session not created");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Session created!", success: true });
};

export const getSessions = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const sessionsFound = await findFilterAllSessions(filters, fieldsToReturn);
  /* get all fields */
  if (sessionsFound?.length === 0) {
    throw new NotFoundError("No sessions found");
  }
  res.status(StatusCodes.OK).json({
    payload: sessionsFound,
    success: true,
  });
};

export const getSession = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the session */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const sessionFound = await findSessionByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!sessionFound) {
    throw new NotFoundError("Session not found");
  }
  res.status(StatusCodes.OK).json({ payload: sessionFound, success: true });
};

export const updateSession = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: sessionId } = params;
  const {
    school_id,
    level_id,
    group_id,
    groupCoordinator_id,
    teacherCoordinator_id,
    teacherField_id,
    subject_id,
    startTime,
    groupScheduleSlot,
    teacherScheduleSlot,
  } = body;
  // find if the start time is later than the 23:59 hours
  if (startTime > maxMinutesInDay) {
    throw new BadRequestError("The session start time must not exceed 23:00");
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id group_id coordinator_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupCoordinatorFound = await findPopulateGroupCoordinatorById(
    groupCoordinator_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup
  );
  if (!groupCoordinatorFound) {
    throw new NotFoundError(
      "Please make sure the group_coordinator assignment exists"
    );
  }
  // find if the school exists for group_coordinator and matches the school in the body
  if (groupCoordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group_coordinator belongs to the school"
    );
  }
  // find if the level exists for group and matches the level in the body
  if (groupCoordinatorFound?.group_id?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the level"
    );
  }
  // find if the group is the same as the one passed in the body
  if (groupCoordinatorFound?.group_id?._id?.toString() !== group_id) {
    throw new BadRequestError(
      "Please make sure the group is the same assigned to the coordinator"
    );
  }
  // the coordinator being an actual coordinator and the role active has already been taken care of by the previous checks for the subject
  if (groupCoordinatorFound?.coordinator_id?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (groupCoordinatorFound?.coordinator_id?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* find if the teacherCoordinator already exists */
  const fieldsToReturnTeacherCoordinator = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherCoordinator =
    "school_id teacher_id coordinator_id";
  const fieldsToReturnPopulateTeacherCoordinator = "-createdAt -updatedAt";
  const teacherCoordinatorFound = await findPopulateTeacherCoordinatorById(
    teacherCoordinator_id,
    fieldsToReturnTeacherCoordinator,
    fieldsToPopulateTeacherCoordinator,
    fieldsToReturnPopulateTeacherCoordinator
  );
  if (!teacherCoordinatorFound) {
    throw new NotFoundError(
      "Please make sure the teacher_coordinator assignment exists"
    );
  }
  // find if the school exists for the teacherCoordinator and matches the school in the body
  if (teacherCoordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the teacher_coordinator belongs to the school"
    );
  }
  /* find if the coordinator for the teacher and group is the same */
  // other checks such as the existence, status and role have already been taken care of by the group checks
  if (
    teacherCoordinatorFound?.coordinator_id?._id?.toString() !==
    groupCoordinatorFound?.coordinator_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the coordinator has been assigned to both the group and the teacher"
    );
  }
  /* find if the teacherField already exists */
  const fieldsToReturnTeacherField = "-createdAt -updatedAt";
  const fieldsToPopulateTeacherField = "school_id teacher_id field_id";
  const fieldsToReturnPopulateTeacherField = "-createdAt -updatedAt";
  const teacherFieldFound = await findPopulateTeacherFieldById(
    teacherField_id,
    fieldsToReturnTeacherField,
    fieldsToPopulateTeacherField,
    fieldsToReturnPopulateTeacherField
  );
  if (!teacherFieldFound) {
    throw new NotFoundError(
      "Please make sure the field_teacher assignment exists"
    );
  }
  // find if the school exists for field_teacher assignment and matches the school in the body
  if (teacherFieldFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field assigned to the teacher belongs to the school"
    );
  }
  // find if the teacher in teacher_coordinator is the same as the teacher in teacher_field
  if (
    teacherCoordinatorFound?.teacher_id?._id?.toString() !==
    teacherFieldFound?.teacher_id?._id.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the teacher assigned to the coordinator is also assigned to the field"
    );
  }
  /* find if the subject already exists */
  const fieldsToReturnSubject = "-createdAt -updatedAt";
  const fieldsToPopulateSubject = "school_id level_id field_id";
  const fieldsToReturnPopulateSubject = "-createdAt -updatedAt";
  const subjectFound = await findPopulateSubjectById(
    subject_id,
    fieldsToReturnSubject,
    fieldsToPopulateSubject,
    fieldsToReturnPopulateSubject
  );
  if (!subjectFound) {
    throw new BadRequestError("Please make sure the subject exists");
  }
  // find if the school exists for subject and matches the school in the body
  if (subjectFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the school"
    );
  }
  // find if the level exists for the subject and matches the level in the body
  if (subjectFound?.level_id?._id?.toString() !== level_id) {
    throw new BadRequestError(
      "Please make sure the subject belongs to the level"
    );
  }
  /* find if the field for the teacher is the same in parent subject */
  if (
    subjectFound?.field_id?._id?.toString() !==
    teacherFieldFound?.field_id?._id?.toString()
  ) {
    throw new BadRequestError(
      "Please make sure the field assigned to teacher is the same in the parent subject"
    );
  }
  /* update session */
  const filtersUpdate = {
    _id: sessionId,
    school_id: school_id,
    level_id: level_id,
  };
  const newSession = {
    school_id: school_id,
    level_id: level_id,
    group_id: group_id,
    groupCoordinator_id: groupCoordinator_id,
    teacherCoordinator_id: teacherCoordinator_id,
    teacherField_id: teacherField_id,
    subject_id: subject_id,
    startTime: startTime,
    groupScheduleSlot: groupScheduleSlot,
    teacherScheduleSlot: teacherScheduleSlot,
  };
  const sessionUpdated = await modifyFilterSession(filtersUpdate, newSession);
  if (!sessionUpdated) {
    throw new BadRequestError("Session not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Session updated!", success: true });
};

export const deleteSession = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields from the params and body */
  const { id: sessionId } = params;
  const { school_id } = body;
  /* delete session */
  const filtersDelete = { _id: sessionId, school_id: school_id };
  const sessionDeleted = await removeFilterSession(filtersDelete);
  if (!sessionDeleted) {
    throw new NotFoundError("Session not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Session deleted", success: true });
};
