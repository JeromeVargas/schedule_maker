import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as classServices from "../classServices";

import { Class } from "../../../typings/types";

type Service =
  | "insertClass"
  | "findClassByProperty"
  | "findFilterAllClasses"
  | "modifyFilterClass"
  | "removeFilterClass"
  | "findPopulateSubjectById"
  | "findPopulateTeacherFieldById";

describe("Resource => Class", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(classServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/classes/";

  /* inputs */
  const validMockClassId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const validMockSubjectId = new Types.ObjectId().toString();
  const validMockTeacherFieldId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
  const validMockUserId = new Types.ObjectId().toString();
  const validMockGroupId = new Types.ObjectId().toString();
  const validMockFieldId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newClass = {
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    subject_id: validMockSubjectId,
    teacherField_id: validMockTeacherFieldId,
    startTime: 420,
    groupScheduleSlot: 2,
    teacherScheduleSlot: 2,
  };
  const newClassMissingValues = {
    school_i: validMockSchoolId,
    coordinator_i: validMockCoordinatorId,
    subject_i: validMockSubjectId,
    teacherField_i: validMockTeacherFieldId,
    startTim: 420,
    groupScheduleSlo: 2,
    teacherScheduleSlo: 2,
  };
  const newClassEmptyValues = {
    school_id: "",
    coordinator_id: "",
    subject_id: "",
    teacherField_id: "",
    startTime: "",
    groupScheduleSlot: "",
    teacherScheduleSlot: "",
  };
  const newClassNotValidDataTypes = {
    school_id: invalidMockId,
    coordinator_id: invalidMockId,
    subject_id: invalidMockId,
    teacherField_id: invalidMockId,
    startTime: "hello",
    groupScheduleSlot: "hello",
    teacherScheduleSlot: "hello",
  };
  const newClassWrongLengthValues = {
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    subject_id: validMockSubjectId,
    teacherField_id: validMockTeacherFieldId,
    startTime: 1234567890,
    groupScheduleSlot: 1234567890,
    teacherScheduleSlot: 1234567890,
  };

  /* payloads */
  const classPayload = {
    _id: validMockClassId,
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    subject_id: validMockSubjectId,
    teacherField_id: validMockTeacherFieldId,
    startTime: 420,
    groupScheduleSlot: 2,
    teacherScheduleSlot: 2,
  };
  const classNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "school 001",
    groupMaxNumStudents: 40,
  };
  const coordinatorPayload = {
    _id: validMockCoordinatorId,
    school_id: validMockSchoolId,
    firstName: "Dave",
    lastName: "Gray",
    role: "coordinator",
    status: "active",
    hasTeachingFunc: true,
  };
  const fieldPayload = {
    _id: validMockFieldId,
    school_id: validMockSchoolId,
    name: "Mathematics",
  };
  const subjectPayload = {
    _id: validMockSubjectId,
    school_id: schoolPayload,
    coordinator_id: coordinatorPayload,
    group_id: validMockGroupId,
    field_id: fieldPayload,
    name: "Mathematics 101",
    classUnits: 30,
    frequency: 2,
  };
  const subjectNullPayload = null;
  const teacherPayload = {
    _id: validMockTeacherId,
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    coordinator_id: validMockCoordinatorId,
    contractType: "full-time",
    hoursAssignable: 60,
    hoursAssigned: 60,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };
  const teacherFieldPayload = {
    _id: validMockTeacherFieldId,
    school_id: schoolPayload,
    teacher_id: teacherPayload,
    field_id: validMockFieldId,
  };
  const teacherFieldNullPayload = null;
  const classesPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      subject_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    },
  ];
  const classesNullPayload: Class[] = [];

  // continue here --> refactor services
  // test blocks
  describe("POST /class ", () => {
    describe("class::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classNullPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClassMissingValues);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the coordinator id",
            param: "coordinator_id",
          },
          {
            location: "body",
            msg: "Please add the subject id",
            param: "subject_id",
          },
          {
            location: "body",
            msg: "Please add the teacher_field id",
            param: "teacherField_id",
          },
          {
            location: "body",
            msg: "Please add the start time for the class",
            param: "startTime",
          },
          {
            location: "body",
            msg: "Please add the group schedule slot number for this class",
            param: "groupScheduleSlot",
          },
          {
            location: "body",
            msg: "Please add the teacher schedule slot number for this class",
            param: "teacherScheduleSlot",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassMissingValues.subject_i,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassMissingValues.teacherField_i,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClassMissingValues);
      });
    });
    describe("class::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classNullPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClassEmptyValues);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
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
            msg: "The teacherField id teacher_field is empty",
            param: "teacherField_id",
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassEmptyValues.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassEmptyValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClassEmptyValues);
      });
    });
    describe("class::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classNullPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClassNotValidDataTypes);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id is not valid",
            param: "school_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
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
            msg: "The teacher_field id is not valid",
            param: "teacherField_id",
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassNotValidDataTypes.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassNotValidDataTypes.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClassNotValidDataTypes);
      });
    });
    describe("class::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findSubject = mockService(
          teacherFieldNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classNullPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClassWrongLengthValues);
        // assertions;
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassWrongLengthValues.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassWrongLengthValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClassWrongLengthValues);
      });
    });
    describe("class::post::05 - Passing an non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::06 - Passing an non-existent school for the subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
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
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::07 - Passing an non-existent coordinator for the subject in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the class parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::08 - Passing a coordinator with a different role in the body", () => {
      it("should return a not valid user/coordinator role error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "teacher",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::09 - Passing a coordinator with a status different from active in the body", () => {
      it("should return a invalid status error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "inactive",
              hasTeachingFunc: false,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::10 - Passing an non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field_teacher assignment exists",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::11 - Passing an non-existent school for the teacher_field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
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
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::12 - Passing an teacher not assigned to the coordinator in the body", () => {
      it("should return a non-assigned teacher to coordinator error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            teacher_id: {
              _id: validMockTeacherId,
              school_id: validMockSchoolId,
              user_id: validMockUserId,
              coordinator_id: otherValidMockId,
              contractType: "full-time",
              hoursAssignable: 60,
              hoursAssigned: 60,
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
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher has been assigned to the coordinator being passed",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::13 - Passing an non-matching field for the teacher_field and parent subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            field_id: otherValidMockId,
          },
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).not.toHaveBeenCalled();
        expect(insertClass).not.toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::14 - Passing a class but not being created", () => {
      it("should not create a class", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,

          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classNullPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Class not created!",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).toHaveBeenCalled();
        expect(insertClass).toHaveBeenCalledWith(newClass);
      });
    });
    describe("class::post::15 - Passing a class correctly to create", () => {
      it("should create a class", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const insertClass = mockService(classPayload, "insertClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Class created!",
        });
        expect(statusCode).toBe(201);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(insertClass).toHaveBeenCalled();
        expect(insertClass).toHaveBeenCalledWith(newClass);
      });
    });
  });

  describe("GET /class ", () => {
    describe("class - GET", () => {
      describe("class::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findClasses = mockService(
            classesNullPayload,
            "findFilterAllClasses"
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
          expect(findClasses).not.toHaveBeenCalled();
          expect(findClasses).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findClasses = mockService(
            classesNullPayload,
            "findFilterAllClasses"
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
          expect(findClasses).not.toHaveBeenCalled();
          expect(findClasses).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findClasses = mockService(
            classesNullPayload,
            "findFilterAllClasses"
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
          expect(findClasses).not.toHaveBeenCalled();
          expect(findClasses).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get::04 - Requesting all classes but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findClasses = mockService(
            classesNullPayload,
            "findFilterAllClasses"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({ msg: "No classes found" });
          expect(statusCode).toBe(404);
          expect(findClasses).toHaveBeenCalled();
          expect(findClasses).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get::05 - Requesting all classes correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findClasses = mockService(
            classesPayload,
            "findFilterAllClasses"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual(classesPayload);
          expect(statusCode).toBe(200);
          expect(findClasses).toHaveBeenCalled();
          expect(findClasses).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("class - GET/:id", () => {
      describe("class::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findClass = mockService(
            classNullPayload,
            "findClassByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockClassId}`)
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
          expect(findClass).not.toHaveBeenCalled();
          expect(findClass).not.toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findClass = mockService(
            classNullPayload,
            "findClassByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockClassId}`)
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
          expect(findClass).not.toHaveBeenCalled();
          expect(findClass).not.toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findClass = mockService(
            classNullPayload,
            "findClassByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });
          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The class id is not valid",
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
          expect(findClass).not.toHaveBeenCalled();
          expect(findClass).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get/:id::04 - Requesting a class but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findClass = mockService(
            classNullPayload,
            "findClassByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockClassId}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({
            msg: "Class not found",
          });
          expect(statusCode).toBe(404);
          expect(findClass).toHaveBeenCalled();
          expect(findClass).toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("class::get/:id::05 - Requesting a class correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findClass = mockService(classPayload, "findClassByProperty");
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockClassId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual(classPayload);
          expect(statusCode).toBe(200);
          expect(findClass).toHaveBeenCalled();
          expect(findClass).toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /class ", () => {
    describe("class::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classNullPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClassMissingValues);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the coordinator id",
            param: "coordinator_id",
          },
          {
            location: "body",
            msg: "Please add the subject id",
            param: "subject_id",
          },
          {
            location: "body",
            msg: "Please add the teacher_field id",
            param: "teacherField_id",
          },
          {
            location: "body",
            msg: "Please add the start time for the class",
            param: "startTime",
          },
          {
            location: "body",
            msg: "Please add the group schedule slot number for this class",
            param: "groupScheduleSlot",
          },
          {
            location: "body",
            msg: "Please add the teacher schedule slot number for this class",
            param: "teacherScheduleSlot",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassMissingValues.subject_i,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassMissingValues.teacherField_i,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClassMissingValues.school_i },
          newClassMissingValues
        );
      });
    });
    describe("class::put::02 - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classNullPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClassEmptyValues);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
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
            msg: "The teacherField id teacher_field is empty",
            param: "teacherField_id",
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassEmptyValues.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassEmptyValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClassEmptyValues.school_id },
          newClassEmptyValues
        );
      });
    });
    describe("class::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classNullPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newClassNotValidDataTypes);
        // assertions;
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The class id is not valid",
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
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
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
            msg: "The teacher_field id is not valid",
            param: "teacherField_id",
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassNotValidDataTypes.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassNotValidDataTypes.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          {
            _id: invalidMockId,
            school_id: newClassNotValidDataTypes.school_id,
          },
          newClassNotValidDataTypes
        );
      });
    });
    describe("class::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classNullPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClassWrongLengthValues);
        // assertions;
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
        expect(findSubject).not.toHaveBeenCalled();
        expect(findSubject).not.toHaveBeenCalledWith(
          newClassWrongLengthValues.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClassWrongLengthValues.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          {
            _id: validMockClassId,
            school_id: newClassWrongLengthValues.school_id,
          },
          newClassWrongLengthValues
        );
      });
    });
    describe("class::put::05 - Passing an non-existent subject in the body", () => {
      it("should return a non-existent subject error", async () => {
        // mock services
        const findSubject = mockService(
          subjectNullPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the subject exists",
        });
        expect(statusCode).toBe(404);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::06 - Passing an non-existent school for the subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
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
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the subject belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::07 - Passing an non-existent coordinator for the subject in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "active",
              hasTeachingFunc: true,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the class parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::08 - Passing a coordinator with a different role in the body", () => {
      it("should return a not valid user/coordinator role error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "teacher",
              status: "active",
              hasTeachingFunc: true,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::09 - Passing a coordinator with a status different from active in the body", () => {
      it("should return a invalid status error", async () => {
        // mock services
        const findSubject = mockService(
          {
            ...subjectPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              role: "coordinator",
              status: "inactive",
              hasTeachingFunc: true,
            },
          },
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).not.toHaveBeenCalled();
        expect(findTeacherField).not.toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::10 - Passing an non-existent teacher_field in the body", () => {
      it("should return a non-existent teacher_field error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldNullPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the teacherField exists",
        });
        expect(statusCode).toBe(404);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::11 - Passing an non-existent school for the teacher_field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
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
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to the teacher belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::12 - Passing an teacher not assigned to the coordinator in the body", () => {
      it("should return a non-assigned teacher to coordinator error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            teacher_id: {
              _id: validMockTeacherId,
              school_id: validMockSchoolId,
              user_id: validMockUserId,
              coordinator_id: otherValidMockId,
              contractType: "full-time",
              hoursAssignable: 60,
              hoursAssigned: 60,
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
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher has been assigned to the coordinator being passed",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::13 - Passing an non-matching field for the teacher_field and parent subject in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          {
            ...teacherFieldPayload,
            field_id: otherValidMockId,
          },
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field assigned to teacher is the same in the parent subject",
        });
        expect(statusCode).toBe(400);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).not.toHaveBeenCalled();
        expect(updateClass).not.toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::14 - Passing a class but not updating it because it does not match the filters", () => {
      it("should not update a class", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classNullPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Class not updated",
        });
        expect(statusCode).toBe(404);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).toHaveBeenCalled();
        expect(updateClass).toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
    describe("class::put::15 - Passing a class correctly to update", () => {
      it("should update a class", async () => {
        // mock services
        const findSubject = mockService(
          subjectPayload,
          "findPopulateSubjectById"
        );
        const findTeacherField = mockService(
          teacherFieldPayload,
          "findPopulateTeacherFieldById"
        );
        const updateClass = mockService(classPayload, "modifyFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockClassId}`)
          .send(newClass);
        // assertions;
        expect(body).toStrictEqual({
          msg: "Class updated!",
        });
        expect(statusCode).toBe(200);
        expect(findSubject).toHaveBeenCalled();
        expect(findSubject).toHaveBeenCalledWith(
          newClass.subject_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id group_id field_id",
          "-password -email -createdAt -updatedAt"
        );
        expect(findTeacherField).toHaveBeenCalled();
        expect(findTeacherField).toHaveBeenCalledWith(
          newClass.teacherField_id,
          "-createdAt -updatedAt",
          "school_id teacher_id",
          "-createdAt -updatedAt"
        );
        expect(updateClass).toHaveBeenCalled();
        expect(updateClass).toHaveBeenCalledWith(
          { _id: validMockClassId, school_id: newClass.school_id },
          newClass
        );
      });
    });
  });
  describe("DELETE /class ", () => {
    describe("class::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteClass = mockService(classNullPayload, "removeFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockClassId}`)
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
        expect(deleteClass).not.toHaveBeenCalled();
        expect(deleteClass).not.toHaveBeenCalledWith({
          _id: validMockClassId,
          school_id: null,
        });
      });
    });
    describe("class::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteClass = mockService(classNullPayload, "removeFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockClassId}`)
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
        expect(deleteClass).not.toHaveBeenCalled();
        expect(deleteClass).not.toHaveBeenCalledWith({
          _id: validMockClassId,
          school_id: "",
        });
      });
    });
    describe("class::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteClass = mockService(classNullPayload, "removeFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });
        // assertions
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The class id is not valid",
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
        expect(deleteClass).not.toHaveBeenCalled();
        expect(deleteClass).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("class::delete::04 - Passing a class id but not deleting it", () => {
      it("should not delete a class", async () => {
        // mock services
        const deleteClass = mockService(classNullPayload, "removeFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({ msg: "Class not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteClass).toHaveBeenCalled();
        expect(deleteClass).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("class::delete::05 - Passing a class id correctly to delete", () => {
      it("should delete a class", async () => {
        // mock services
        const deleteClass = mockService(classPayload, "removeFilterClass");
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockClassId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({ msg: "Class deleted" });
        expect(statusCode).toBe(200);
        expect(deleteClass).toHaveBeenCalled();
        expect(deleteClass).toHaveBeenCalledWith({
          _id: validMockClassId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
