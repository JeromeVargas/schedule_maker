import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertField,
  insertGroup,
  insertGroupCoordinator,
  insertLevel,
  insertManySessions,
  insertSchool,
  insertSession,
  insertSubject,
  insertTeacher,
  insertTeacherCoordinator,
  insertTeacherField,
  insertUser,
  removeAllFields,
  removeAllGroupCoordinators,
  removeAllGroups,
  removeAllLevels,
  removeAllSchools,
  removeAllSessions,
  removeAllSubjects,
  removeAllTeacherCoordinators,
  removeAllTeacherFields,
  removeAllTeachers,
  removeAllUsers,
} from "../sessions.services";

import {
  ContractType,
  UserRole,
  SchoolStatus,
  UserStatus,
} from "../../../typings/types";

describe("Resource => SESSION", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllSessions();
    await removeAllSchools();
    await removeAllLevels();
    await removeAllUsers();
    await removeAllFields();
    await removeAllTeacherFields();
    await removeAllTeachers();
    await removeAllTeacherCoordinators();
    await removeAllGroups();
    await removeAllGroupCoordinators();
    await removeAllSubjects();
  });
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}sessions/`;

  // test blocks
  describe("SESSIONS - POST", () => {
    describe("POST - /sessions - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSessionWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a start time past the 23:59 hours", () => {
      it("should return a invalid start time error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newSession = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          group_id: validMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 1440,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "The session start time must not exceed 23:00",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-existent group_coordinator in the body", () => {
      it("should return a non-existent group_coordinator error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /sessions - Passing a non-matching school for the group_coordinator in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          school_id: otherValidMockSchoolId,
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching level for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const otherValidMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          school_id: validMockSchoolId,
          level_id: otherValidMockLevelId,
          group_id: validMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 420,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the level",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching group for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const otherValidMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          group_id: otherValidMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 420,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group is the same assigned to the coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a coordinator with a role different from coordinator", () => {
      it("should return a not valid coordinator role error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a coordinator with a status different from active", () => {
      it("should return an invalid status error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-existing teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /sessions - Passing a non-matching school for the teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: otherValidMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching coordinator for the group and the teacher", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator has been assigned to both the group and the teacher",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field_teacher assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /sessions - Passing a non-matching school for the teacher_field in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: otherValidMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching teacher for the coordinator and the field", () => {
      it("should return a non-matching teacher error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const otherValidMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: otherValidMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher assigned to the coordinator is also assigned to the field",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /sessions - Passing a non-matching school for the subject in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const otherValidMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: otherValidMockSchoolId,
          level_id: otherValidMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching level for the subject in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const otherValidMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: otherValidMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the level",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a non-matching id field for the teacher_field and parent subject field in the body", () => {
      it("should return a non-matching field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const otherValidMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: otherValidMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /sessions - Passing a session correctly to create", () => {
      it("should create a session", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session created!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("SESSIONS - GET", () => {
    describe("GET - /sessions - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions - passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions - passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions - Requesting all sessions but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No sessions found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /sessions - Requesting all sessions correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSessions = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            group_id: new Types.ObjectId().toString(),
            groupCoordinator_id: new Types.ObjectId().toString(),
            teacherCoordinator_id: new Types.ObjectId().toString(),
            subject_id: new Types.ObjectId().toString(),
            teacherField_id: new Types.ObjectId().toString(),
            startTime: 420,
            groupScheduleSlot: 2,
            teacherScheduleSlot: 2,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            group_id: new Types.ObjectId().toString(),
            groupCoordinator_id: new Types.ObjectId().toString(),
            teacherCoordinator_id: new Types.ObjectId().toString(),
            subject_id: new Types.ObjectId().toString(),
            teacherField_id: new Types.ObjectId().toString(),
            startTime: 420,
            groupScheduleSlot: 2,
            teacherScheduleSlot: 2,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            group_id: new Types.ObjectId().toString(),
            groupCoordinator_id: new Types.ObjectId().toString(),
            teacherCoordinator_id: new Types.ObjectId().toString(),
            subject_id: new Types.ObjectId().toString(),
            teacherField_id: new Types.ObjectId().toString(),
            startTime: 420,
            groupScheduleSlot: 2,
            teacherScheduleSlot: 2,
          },
        ];
        await insertManySessions(newSessions);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSessions,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /sessions/:id - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockSessionId}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions/:id - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /sessions/:id - Requesting a session but not finding it", () => {
      it("should not get a school", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Session not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /sessions/:id - Requesting a session correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newSession = {
          _id: validMockSessionId,
          school_id: validMockSchoolId,
          level_id: validMockSchoolId,
          groupCoordinator_id: validMockCoordinatorId,
          teacherCoordinator_id: validMockCoordinatorId,
          group_id: validMockGroupId,
          subject_id: validMockSubjectId,
          teacherField_id: validMockTeacherFieldId,
          startTime: 420,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSession,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SESSIONS - PUT", () => {
    describe("PUT - /sessions/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSessionNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSessionWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a start time past the 23:59 hours", () => {
      it("should return a invalid start time error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newSession = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          group_id: validMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 1440,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "The session start time must not exceed 23:00",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-existent group_coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching school for the group_coordinator in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
          school_id: otherValidMockSchoolId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group_coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching level for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const otherValidMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
          school_id: validMockSchoolId,
          level_id: otherValidMockLevelId,
          group_id: validMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 420,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the level",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching group for the group in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const otherValidMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          group_id: otherValidMockGroupId,
          groupCoordinator_id: validMockGroupCoordinatorId,
          teacherCoordinator_id: validMockTeacherCoordinatorId,
          teacherField_id: validMockTeacherFieldId,
          subject_id: validMockSubjectId,
          startTime: 420,
          groupScheduleSlot: 2,
          teacherScheduleSlot: 2,
        };
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group is the same assigned to the coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a coordinator with a different role in the body", () => {
      it("should return a not valid coordinator role error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a coordinator with a status different from active in the body", () => {
      it("should return a invalid status error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-existing teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching school for the teacher_coordinator", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: otherValidMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher_coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching coordinator for the group and the teacher", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator has been assigned to both the group and the teacher",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field_teacher assignment exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-existent school for the teacher_field in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: otherValidMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching teacher for the coordinator and the field in the body", () => {
      it("should return a non-existent subject error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const otherValidMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: otherValidMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher assigned to the coordinator is also assigned to the field",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching school for the subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: otherValidMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching level for the subject in the body", () => {
      it("should return a non-matching level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const otherValidMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: otherValidMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the level",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a non-matching id field for the teacher_field and parent subject field in the body", () => {
      it("should return a non-matching field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const otherValidMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: otherValidMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a session but not updating it", () => {
      it("should not update a session", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const otherValidMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${otherValidMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /sessions/:id - Passing a session correctly to update", () => {
      it("should update a session", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSessionId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        await insertLevel(newLevel);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSessionId}`)
          .send(newSession);

        // assertions
        expect(body).toStrictEqual({
          msg: "Session updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SESSIONS - DELETE", () => {
    describe("DELETE - /sessions/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /sessions/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /sessions/:id - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /sessions/:id - Passing a session id but not deleting it", () => {
      it("should not delete a session", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Session not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /sessions/:id - Passing a session id correctly to delete", () => {
      it("should delete a session", async () => {
        // inputs
        const validMockSessionId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newSession = {
          _id: validMockSessionId,
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
        await insertSession(newSession);
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSessionId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Session deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
