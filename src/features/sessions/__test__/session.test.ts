import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as sessionServices from "../sessions.services";

import { Session } from "../../../typings/types";

type Service =
  | "insertSession"
  | "findSessionByProperty"
  | "findFilterAllSessions"
  | "modifyFilterSession"
  | "removeFilterSession"
  | "findPopulateGroupCoordinatorById"
  | "findPopulateTeacherCoordinatorById"
  | "findPopulateTeacherFieldById"
  | "findPopulateSubjectById";

describe("Resource => Session", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(sessionServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/sessions/";

  /* inputs */
  const validMockSessionId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockGroupCoordinatorId = new Types.ObjectId().toString();
  const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const validMockSubjectId = new Types.ObjectId().toString();
  const validMockTeacherFieldId = new Types.ObjectId().toString();
  const validMockScheduleId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
  const validMockUserId = new Types.ObjectId().toString();
  const validMockGroupId = new Types.ObjectId().toString();
  const validMockFieldId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newSession = {
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    group_id: validMockGroupId,
    groupCoordinator_id: validMockGroupCoordinatorId,
    teacherCoordinator_id: validMockTeacherCoordinatorId,
    teacherField_id: validMockTeacherFieldId,
    subject_id: validMockSubjectId,
    startTime: 420,
    groupScheduleSlot: 2,
    teacherScheduleSlot: 2,
  };
  const newSessionMissingValues = {
    school_i: validMockSchoolId,
    level_i: validMockLevelId,
    group_i: validMockGroupId,
    groupCoordinator_i: validMockGroupId,
    teacherCoordinator_i: validMockGroupId,
    teacherField_i: validMockTeacherFieldId,
    subject_i: validMockSubjectId,
    startTim: 420,
    groupScheduleSlo: 2,
    teacherScheduleSlo: 2,
  };
  const newSessionEmptyValues = {
    school_id: "",
    level_id: "",
    group_id: "",
    groupCoordinator_id: "",
    teacherCoordinator_id: "",
    teacherField_id: "",
    subject_id: "",
    startTime: "",
    groupScheduleSlot: "",
    teacherScheduleSlot: "",
  };
  const newSessionNotValidDataTypes = {
    school_id: invalidMockId,
    level_id: invalidMockId,
    group_id: invalidMockId,
    groupCoordinator_id: invalidMockId,
    teacherCoordinator_id: invalidMockId,
    teacherField_id: invalidMockId,
    subject_id: invalidMockId,
    startTime: "hello",
    groupScheduleSlot: "hello",
    teacherScheduleSlot: "hello",
  };
  const newSessionWrongLengthValues = {
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    group_id: validMockGroupId,
    groupCoordinator_id: validMockGroupCoordinatorId,
    teacherCoordinator_id: validMockTeacherCoordinatorId,
    teacherField_id: validMockTeacherFieldId,
    subject_id: validMockSubjectId,
    startTime: 1234567890,
    groupScheduleSlot: 1234567890,
    teacherScheduleSlot: 1234567890,
  };

  /* payloads */
  const sessionPayload = {
    _id: validMockSessionId,
    school_id: validMockSchoolId,
    level_id: validMockSchoolId,
    groupCoordinator_id: validMockCoordinatorId,
    group_id: validMockGroupId,
    subject_id: validMockSubjectId,
    teacherField_id: validMockTeacherFieldId,
    startTime: 420,
    groupScheduleSlot: 2,
    teacherScheduleSlot: 2,
  };
  const sessionNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "school 001",
    groupMaxNumStudents: 40,
  };
  const levelPayload = {
    _id: validMockLevelId,
    school_id: validMockSchoolId,
    schedule_id: validMockScheduleId,
    name: "Level 101",
  };
  const groupPayload = {
    _id: validMockGroupId,
    school_id: schoolPayload,
    level_id: levelPayload,
    name: "Group 101",
    numberStudents: 40,
  };
  const coordinatorPayload = {
    _id: validMockCoordinatorId,
    school_id: schoolPayload,
    firstName: "Dave",
    lastName: "Gray",
    role: "coordinator",
    status: "active",
  };
  const groupCoordinatorPayload = {
    _id: validMockGroupCoordinatorId,
    school_id: schoolPayload,
    group_id: groupPayload,
    coordinator_id: coordinatorPayload,
  };
  const groupCoordinatorNullPayload = null;
  const teacherPayload = {
    _id: validMockTeacherId,
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    coordinator_id: validMockCoordinatorId,
    contractType: "full-time",
    teachingHoursAssignable: 60,
    teachingHoursAssigned: 60,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };
  const teacherCoordinatorPayload = {
    _id: validMockTeacherCoordinatorId,
    school_id: schoolPayload,
    teacher_id: teacherPayload,
    coordinator_id: coordinatorPayload,
  };
  const teacherCoordinatorNullPayload = null;
  const fieldPayload = {
    _id: validMockFieldId,
    school_id: validMockSchoolId,
    name: "Mathematics",
  };
  const subjectPayload = {
    _id: validMockSubjectId,
    school_id: schoolPayload,
    level_id: levelPayload,
    field_id: fieldPayload,
    name: "Mathematics 101",
    sessionUnits: 30,
    frequency: 2,
  };
  const subjectNullPayload = null;
  const teacherFieldPayload = {
    _id: validMockTeacherFieldId,
    school_id: schoolPayload,
    teacher_id: teacherPayload,
    field_id: fieldPayload,
  };
  const teacherFieldNullPayload = null;
  const sessionsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      groupCoordinator_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacherField_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      groupCoordinator_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacherField_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      groupCoordinator_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacherField_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
  ];
  const sessionsNullPayload: Session[] = [];

  // test blocks
  describe("POST /session ", () => {
    describe("session::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionMissingValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the level id",
            param: "level_id",
          },
          {
            location: "body",
            msg: "Please add the group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add the groupCoordinator id",
            param: "groupCoordinator_id",
          },
          {
            location: "body",
            msg: "Please add the teacherCoordinator id",
            param: "teacherCoordinator_id",
          },
          {
            location: "body",
            msg: "Please add the teacher_field id",
            param: "teacherField_id",
          },
          {
            location: "body",
            msg: "Please add the subject id",
            param: "subject_id",
          },
          {
            location: "body",
            msg: "Please add the start time for the session",
            param: "startTime",
          },
          {
            location: "body",
            msg: "Please add the group schedule slot number for this session",
            param: "groupScheduleSlot",
          },
          {
            location: "body",
            msg: "Please add the teacher schedule slot number for this session",
            param: "teacherScheduleSlot",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id level_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionMissingValues.teacherField_i,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionMissingValues.subject_i,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSessionMissingValues);
      });
    });
    describe("session::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionEmptyValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The level id field is empty",
            param: "level_id",
            value: "",
          },
          {
            location: "body",
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The groupCoordinator id field is empty",
            param: "groupCoordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The teacherCoordinator id field is empty",
            param: "teacherCoordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The teacherField id teacher_field is empty",
            param: "teacherField_id",
            value: "",
          },
          {
            location: "body",
            msg: "The subject id field is empty",
            param: "subject_id",
            value: "",
          },
          {
            location: "body",
            msg: "The start time field is empty",
            param: "startTime",
            value: "",
          },
          {
            location: "body",
            msg: "The group schedule slot number field is empty",
            param: "groupScheduleSlot",
            value: "",
          },
          {
            location: "body",
            msg: "The teacher schedule slot number field is empty",
            param: "teacherScheduleSlot",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionEmptyValues.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id level_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionEmptyValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionEmptyValues.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSessionEmptyValues);
      });
    });
    describe("session::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id is not valid",
            param: "school_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The level id is not valid",
            param: "level_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The groupCoordinator id is not valid",
            param: "groupCoordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The teacherCoordinator id is not valid",
            param: "teacherCoordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The teacher_field id is not valid",
            param: "teacherField_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The subject id is not valid",
            param: "subject_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "start time value is not valid",
            param: "startTime",
            value: "hello",
          },
          {
            location: "body",
            msg: "group schedule slot number value is not valid",
            param: "groupScheduleSlot",
            value: "hello",
          },
          {
            location: "body",
            msg: "teacher schedule slot number value is not valid",
            param: "teacherScheduleSlot",
            value: "hello",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id level_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes
        );
      });
    });
    describe("session::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The start time must not exceed 9 digits",
            param: "startTime",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The group schedule slot number must not exceed 9 digits",
            param: "groupScheduleSlot",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The teacher schedule slot number must not exceed 9 digits",
            param: "teacherScheduleSlot",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id level_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues
        );
      });
    });
    describe("session::post::05 - Passing a start time past the 23:59 hours", () => {
      it("should return a invalid start time error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newSession, startTime: 1440 });

        // assertions
        expect(body).toStrictEqual({
          msg: "The session start time must not exceed 23:00",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::06 - Passing a non-existent group_coordinator in the body", () => {
      it("should return a non-existent group_coordinator error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::07 - Passing a non-matching school for the group_coordinator in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::08 - Passing a non-matching level for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            group_id: {
              _id: validMockGroupId,
              school_id: schoolPayload,
              level_id: otherValidMockId,
              name: "Group 101",
              numberStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the level",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::09 - Passing a non-matching group for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            group_id: {
              _id: otherValidMockId,
              school_id: schoolPayload,
              level_id: levelPayload,
              name: "Group 101",
              numberStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group is the same assigned to the coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::10 - Passing a coordinator with a role different from coordinator", () => {
      it("should return a not valid coordinator role error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "teacher",
              status: "active",
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::11 - Passing a coordinator with a status different from active", () => {
      it("should return an invalid status error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "inactive",
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::12 - Passing a non-existing teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::13 - Passing a non-matching school for the teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          {
            ...teacherCoordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::14 - Passing a non-matching coordinator for the group and the teacher", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          {
            ...teacherCoordinatorPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "active",
            },
          },
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator has been assigned to both the group and the teacher",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::15 - Passing a non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field_teacher assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::16 - Passing a non-matching school for the teacher_field in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::17 - Passing a non-matching teacher for the coordinator and the field", () => {
      it("should return a non-matching teacher error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            teacher_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              user_id: validMockUserId,
              coordinator_id: validMockCoordinatorId,
              contractType: "full-time",
              teachingHoursAssignable: 60,
              teachingHoursAssigned: 60,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
          },
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher assigned to the coordinator is also assigned to the field",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::18 - Passing a non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::19 - Passing a non-matching school for the subject in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          {
            ...subjectPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::20 - Passing a non-matching level for the subject in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          {
            ...subjectPayload,
            level_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              schedule_id: validMockScheduleId,
              name: "Level 101",
            },
          },
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the level",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::21 - Passing a non-matching id field for the teacher_field and parent subject field in the body", () => {
      it("should return a non-matching field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          {
            ...subjectPayload,
            field_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              name: "Mathematics",
            },
          },
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).not.toHaveBeenCalled();
        expect(insertSession).not.toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::22 - Passing a session but not being created", () => {
      it("should not create a session", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionNullPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session not created",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).toHaveBeenCalled();
        expect(insertSession).toHaveBeenCalledWith(newSession);
      });
    });
    describe("session::post::23 - Passing a session correctly to create", () => {
      it("should create a session", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const insertSession = mockService(sessionPayload, "insertSession");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session created!",
        });
        expect(statusCode).toBe(201);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(insertSession).toHaveBeenCalled();
        expect(insertSession).toHaveBeenCalledWith(newSession);
      });
    });
  });

  describe("GET /session ", () => {
    describe("session - GET", () => {
      describe("session::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSessions = mockService(
            sessionsNullPayload,
            "findFilterAllSessions"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_i: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSessions).not.toHaveBeenCalled();
          expect(findSessions).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSessions = mockService(
            sessionsNullPayload,
            "findFilterAllSessions"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: "" });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSessions).not.toHaveBeenCalled();
          expect(findSessions).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSessions = mockService(
            sessionsNullPayload,
            "findFilterAllSessions"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: invalidMockId });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSessions).not.toHaveBeenCalled();
          expect(findSessions).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get::04 - Requesting all sessions but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findSessions = mockService(
            sessionsNullPayload,
            "findFilterAllSessions"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({ msg: "No sessions found" });
          expect(statusCode).toBe(404);
          expect(findSessions).toHaveBeenCalled();
          expect(findSessions).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get::05 - Requesting all sessions correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findSessions = mockService(
            sessionsPayload,
            "findFilterAllSessions"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual([
            {
              _id: expect.any(String),
              school_id: expect.any(String),
              level_id: expect.any(String),
              groupCoordinator_id: expect.any(String),
              group_id: expect.any(String),
              subject_id: expect.any(String),
              teacherField_id: expect.any(String),
              startTime: 420,
              groupScheduleSlot: 2,
              teacherScheduleSlot: 2,
            },
            {
              _id: expect.any(String),
              school_id: expect.any(String),
              level_id: expect.any(String),
              groupCoordinator_id: expect.any(String),
              group_id: expect.any(String),
              subject_id: expect.any(String),
              teacherField_id: expect.any(String),
              startTime: 420,
              groupScheduleSlot: 2,
              teacherScheduleSlot: 2,
            },
            {
              _id: expect.any(String),
              school_id: expect.any(String),
              level_id: expect.any(String),
              groupCoordinator_id: expect.any(String),
              group_id: expect.any(String),
              subject_id: expect.any(String),
              teacherField_id: expect.any(String),
              startTime: 420,
              groupScheduleSlot: 2,
              teacherScheduleSlot: 2,
            },
          ]);
          expect(statusCode).toBe(200);
          expect(findSessions).toHaveBeenCalled();
          expect(findSessions).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("session - GET/:id", () => {
      describe("session::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSession = mockService(
            sessionNullPayload,
            "findSessionByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSessionId}`)
            .send({ school_i: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSession).not.toHaveBeenCalled();
          expect(findSession).not.toHaveBeenCalledWith(
            { _id: validMockSessionId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSession = mockService(
            sessionNullPayload,
            "findSessionByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSessionId}`)
            .send({ school_id: "" });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSession).not.toHaveBeenCalled();
          expect(findSession).not.toHaveBeenCalledWith(
            { _id: validMockSessionId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSession = mockService(
            sessionNullPayload,
            "findSessionByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The session id is not valid",
              param: "id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSession).not.toHaveBeenCalled();
          expect(findSession).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get/:id::04 - Requesting a session but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findSession = mockService(
            sessionNullPayload,
            "findSessionByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSessionId}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Session not found",
          });
          expect(statusCode).toBe(404);
          expect(findSession).toHaveBeenCalled();
          expect(findSession).toHaveBeenCalledWith(
            { _id: validMockSessionId, school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("session::get/:id::05 - Requesting a session correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findSession = mockService(
            sessionPayload,
            "findSessionByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSessionId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            _id: expect.any(String),
            school_id: expect.any(String),
            level_id: expect.any(String),
            groupCoordinator_id: expect.any(String),
            group_id: expect.any(String),
            subject_id: expect.any(String),
            teacherField_id: expect.any(String),
            startTime: 420,
            groupScheduleSlot: 2,
            teacherScheduleSlot: 2,
          });
          expect(statusCode).toBe(200);
          expect(findSession).toHaveBeenCalled();
          expect(findSession).toHaveBeenCalledWith(
            { _id: validMockSessionId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /session ", () => {
    describe("session::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionMissingValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the level id",
            param: "level_id",
          },
          {
            location: "body",
            msg: "Please add the group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add the groupCoordinator id",
            param: "groupCoordinator_id",
          },
          {
            location: "body",
            msg: "Please add the teacherCoordinator id",
            param: "teacherCoordinator_id",
          },
          {
            location: "body",
            msg: "Please add the teacher_field id",
            param: "teacherField_id",
          },
          {
            location: "body",
            msg: "Please add the subject id",
            param: "subject_id",
          },
          {
            location: "body",
            msg: "Please add the start time for the session",
            param: "startTime",
          },
          {
            location: "body",
            msg: "Please add the group schedule slot number for this session",
            param: "groupScheduleSlot",
          },
          {
            location: "body",
            msg: "Please add the teacher schedule slot number for this session",
            param: "teacherScheduleSlot",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionMissingValues.groupCoordinator_i,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionMissingValues.teacherField_i,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionMissingValues.subject_i,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          {
            _id: validMockSessionId,
            school_id: newSessionMissingValues.school_i,
          },
          newSessionMissingValues
        );
      });
    });
    describe("session::put::02 - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionEmptyValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The level id field is empty",
            param: "level_id",
            value: "",
          },
          {
            location: "body",
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The groupCoordinator id field is empty",
            param: "groupCoordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The teacherCoordinator id field is empty",
            param: "teacherCoordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The teacherField id teacher_field is empty",
            param: "teacherField_id",
            value: "",
          },
          {
            location: "body",
            msg: "The subject id field is empty",
            param: "subject_id",
            value: "",
          },
          {
            location: "body",
            msg: "The start time field is empty",
            param: "startTime",
            value: "",
          },
          {
            location: "body",
            msg: "The group schedule slot number field is empty",
            param: "groupScheduleSlot",
            value: "",
          },
          {
            location: "body",
            msg: "The teacher schedule slot number field is empty",
            param: "teacherScheduleSlot",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionEmptyValues.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionEmptyValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionEmptyValues.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          {
            _id: validMockSessionId,
            school_id: newSessionEmptyValues.school_id,
          },
          newSessionEmptyValues
        );
      });
    });
    describe("session::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSessionNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The session id is not valid",
            param: "id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The school id is not valid",
            param: "school_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The level id is not valid",
            param: "level_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The groupCoordinator id is not valid",
            param: "groupCoordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The teacherCoordinator id is not valid",
            param: "teacherCoordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The teacher_field id is not valid",
            param: "teacherField_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The subject id is not valid",
            param: "subject_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "start time value is not valid",
            param: "startTime",
            value: "hello",
          },
          {
            location: "body",
            msg: "group schedule slot number value is not valid",
            param: "groupScheduleSlot",
            value: "hello",
          },
          {
            location: "body",
            msg: "teacher schedule slot number value is not valid",
            param: "teacherScheduleSlot",
            value: "hello",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionNotValidDataTypes.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          {
            _id: invalidMockId,
            school_id: newSessionNotValidDataTypes.school_id,
          },
          newSessionNotValidDataTypes
        );
      });
    });
    describe("session::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The start time must not exceed 9 digits",
            param: "startTime",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The group schedule slot number must not exceed 9 digits",
            param: "groupScheduleSlot",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The teacher schedule slot number must not exceed 9 digits",
            param: "teacherScheduleSlot",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSessionWrongLengthValues.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          {
            _id: validMockSessionId,
            school_id: newSessionWrongLengthValues.school_id,
          },
          newSessionWrongLengthValues
        );
      });
    });
    describe("session::put::05 - Passing a start time past the 23:59 hours", () => {
      it("should return a invalid start time error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send({ ...newSession, startTime: 1440 });

        // assertions
        expect(body).toStrictEqual({
          msg: "The session start time must not exceed 23:00",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).not.toHaveBeenCalled();
        expect(findGroupCoordinator).not.toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::06 - Passing a non-existent group_coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::07 - Passing a non-matching school for the group_coordinator in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::08 - Passing a non-matching level for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            group_id: {
              _id: validMockGroupId,
              school_id: schoolPayload,
              level_id: otherValidMockId,
              name: "Group 101",
              numberStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the level",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::09 - Passing a non-matching group for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            group_id: {
              _id: otherValidMockId,
              school_id: schoolPayload,
              level_id: levelPayload,
              name: "Group 101",
              numberStudents: 40,
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group is the same assigned to the coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::10 - Passing a coordinator with a different role in the body", () => {
      it("should return a not valid coordinator role error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "teacher",
              status: "active",
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::11 - Passing a coordinator with a status different from active in the body", () => {
      it("should return a invalid status error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          {
            ...groupCoordinatorPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "inactive",
            },
          },
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).not.toHaveBeenCalled();
        expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::12 - Passing a non-existing teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::13 - Passing a non-matching school for the teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          {
            ...teacherCoordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::14 - Passing a non-matching coordinator for the group and the teacher", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          {
            ...teacherCoordinatorPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: schoolPayload,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "active",
            },
          },
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator has been assigned to both the group and the teacher",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::15 - Passing a non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field_teacher assignment exists",
        });
        expect(statusCode).toBe(404);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::16 - Passing a non-existent school for the teacher_field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::17 - Passing a non-matching teacher for the coordinator and the field in the body", () => {
      it("should return a non-existent subject error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            teacher_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              user_id: validMockUserId,
              coordinator_id: validMockCoordinatorId,
              contractType: "full-time",
              teachingHoursAssignable: 60,
              teachingHoursAssigned: 60,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            },
          },
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher assigned to the coordinator is also assigned to the field",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::18 - Passing a non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::19 - Passing a non-matching school for the subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          {
            ...subjectPayload,
            school_id: {
              _id: otherValidMockId,
              name: "school 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::20 - Passing a non-matching level for the subject in the body", () => {
      it("should return a non-matching level error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          {
            ...subjectPayload,
            level_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              schedule_id: validMockScheduleId,
              name: "Level 101",
            },
          },
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the level",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::21 - Passing a non-matching id field for the teacher_field and parent subject field in the body", () => {
      it("should return a non-matching field error", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            field_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              name: "Mathematics",
            },
          },
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).not.toHaveBeenCalled();
        expect(updateSession).not.toHaveBeenCalledWith(
          { _id: validMockSessionId, school_id: newSession.school_id },
          newSession
        );
      });
    });
    describe("session::put::22 - Passing a session but not updating it", () => {
      it("should not update a session", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionNullPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session not updated",
        });
        expect(statusCode).toBe(400);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).toHaveBeenCalled();
        expect(updateSession).toHaveBeenCalledWith(
          {
            _id: validMockSessionId,
            school_id: newSession.school_id,
            level_id: newSession.level_id,
          },
          newSession
        );
      });
    });
    describe("session::put::23 - Passing a session correctly to update", () => {
      it("should update a session", async () => {
        // mock services
        const findGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findPopulateGroupCoordinatorById"
        );
        const findTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findPopulateTeacherCoordinatorById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const updateSession = mockService(
          sessionPayload,
          "modifyFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session updated!",
        });
        expect(statusCode).toBe(200);
        expect(findGroupCoordinator).toHaveBeenCalled();
        expect(findGroupCoordinator).toHaveBeenCalledWith(
          newSession.groupCoordinator_id,
          "-createdAt -updatedAt",
          "school_id group_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherCoordinator).toHaveBeenCalled();
        expect(findTeacherCoordinator).toHaveBeenCalledWith(
          newSession.teacherCoordinator_id,
          "-createdAt -updatedAt",
          "school_id teacher_id coordinator_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newSession.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id field_id",
          "-createdAt -updatedAt"
        );
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newSession.subject_id,
          "-createdAt -updatedAt",
          "school_id level_id field_id",
          "-createdAt -updatedAt"
        );
        expect(updateSession).toHaveBeenCalled();
        expect(updateSession).toHaveBeenCalledWith(
          {
            _id: validMockSessionId,
            school_id: newSession.school_id,
            level_id: newSession.level_id,
          },
          newSession
        );
      });
    });
  });

  describe("DELETE /session ", () => {
    describe("session::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteSession = mockService(
          sessionNullPayload,
          "removeFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add a school id",
            param: "school_id",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteSession).not.toHaveBeenCalled();
        expect(deleteSession).not.toHaveBeenCalledWith({
          _id: validMockSessionId,
          school_id: null,
        });
      });
    });
    describe("session::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteSession = mockService(
          sessionNullPayload,
          "removeFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteSession).not.toHaveBeenCalled();
        expect(deleteSession).not.toHaveBeenCalledWith({
          _id: validMockSessionId,
          school_id: "",
        });
      });
    });
    describe("session::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteSession = mockService(
          sessionNullPayload,
          "removeFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The session id is not valid",
            param: "id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The school id is not valid",
            param: "school_id",
            value: invalidMockId,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteSession).not.toHaveBeenCalled();
        expect(deleteSession).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("session::delete::04 - Passing a session id but not deleting it", () => {
      it("should not delete a session", async () => {
        // mock services
        const deleteSession = mockService(
          sessionNullPayload,
          "removeFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Session not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteSession).toHaveBeenCalled();
        expect(deleteSession).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("session::delete::05 - Passing a session id correctly to delete", () => {
      it("should delete a session", async () => {
        // mock services
        const deleteSession = mockService(
          sessionPayload,
          "removeFilterSession"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Session deleted" });
        expect(statusCode).toBe(200);
        expect(deleteSession).toHaveBeenCalled();
        expect(deleteSession).toHaveBeenCalledWith({
          _id: validMockSessionId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
