import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as teacherServices from "../teachers.services";

import { BASE_URL } from "../../../lib/router";

import type { Teacher } from "../../../typings/types";

type Service =
  | "insertTeacher"
  | "findFilterAllTeachers"
  | "findTeacherByProperty"
  | "modifyFilterTeacher"
  | "removeFilterTeacher"
  | "findPopulateFilterAllUsers"
  | "findUserByProperty";

describe("RESOURCE => TEACHERS", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(teacherServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}teachers/`;

  /* inputs */
  const validMockUserId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newTeacher = {
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    contractType: "full-time",
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
  const newTeacherMissingValues = {
    school_i: validMockSchoolId,
    user_i: validMockUserId,
    contractTyp: "full-time",
    teachingHoursAssignabl: 35,
    teachingHoursAssigne: 35,
    adminHoursAssignabl: 35,
    adminHoursAssigne: 35,
    monda: true,
    tuesda: true,
    wednesda: true,
    thursda: true,
    frida: true,
    saturda: true,
    sunda: true,
  };
  const newTeacherEmptyValues = {
    school_id: "",
    user_id: "",
    contractType: "",
    teachingHoursAssignable: "",
    teachingHoursAssigned: "",
    adminHoursAssignable: "",
    adminHoursAssigned: "",
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  };
  const newTeacherNotValidDataTypes = {
    school_id: invalidMockId,
    user_id: invalidMockId,
    contractType: true,
    teachingHoursAssignable: "house",
    teachingHoursAssigned: "three3",
    adminHoursAssignable: "house",
    adminHoursAssigned: "three3",
    monday: "hello",
    tuesday: "hello",
    wednesday: "hello",
    thursday: "hello",
    friday: "hello",
    saturday: "hello",
    sunday: "hello",
  };
  const newTeacherWrongLengthValues = {
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    contractType: "full-time",
    teachingHoursAssignable: 1234567890,
    teachingHoursAssigned: 1234567890,
    adminHoursAssignable: 1234567890,
    adminHoursAssigned: 1234567890,
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  };
  const newTeacherWrongInputValues = {
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    contractType: "tiempo-completo",
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

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumStudents: 40,
  };
  const userPayload = {
    _id: validMockUserId,
    school_id: schoolPayload,
    firstName: "Mtuts",
    lastName: "Tuts",
    email: "mtuts@hello.com",
    role: "teacher",
    status: "active",
  };
  const teacherPayload = {
    _id: validMockTeacherId,
    school_id: validMockSchoolId,
    user_id: validMockUserId,
    contractType: "full-time",
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
  const teacherNullPayload = null;
  const userNullPayload = null;
  const teachersPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      contractType: "full-time",
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
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      contractType: "part-time",
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
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      contractType: "substitute",
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
    },
  ];
  const teachersNullPayload: Teacher[] = [];

  // test blocks
  describe("TEACHERS - POST", () => {
    describe("POST - /teachers - Passing a teacher with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add the user's school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s user id",
              param: "user_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s contract type",
              param: "contractType",
            },
            {
              location: "body",
              msg: "Please add the number of teaching hours assignable to the teacher",
              param: "teachingHoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of teaching hours assigned to the teacher",
              param: "teachingHoursAssigned",
            },
            {
              location: "body",
              msg: "Please add the number of admin hours assignable to the teacher",
              param: "adminHoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of admin hours assigned to the teacher",
              param: "adminHoursAssigned",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
              // param: "sunday",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherMissingValues.school_i,
            user_id: newTeacherMissingValues.user_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherMissingValues.user_i,
          "-password -createdAt -updatedAt",
          "school_id",
          "-_id -createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacherMissingValues);
      });
    });
    describe("POST - /teachers - Passing a teacher with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherEmptyValues);

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
              msg: "The teacher's user id field is empty",
              param: "user_id",
              value: "",
            },
            {
              location: "body",
              msg: "The contract type field is empty",
              param: "contractType",
              value: "",
            },
            {
              location: "body",
              msg: "The teaching hours assignable field is empty",
              param: "teachingHoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The teaching hours assigned field is empty",
              param: "teachingHoursAssigned",
              value: "",
            },
            {
              location: "body",
              msg: "The admin hours assignable field is empty",
              param: "adminHoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The admin hours assigned field is empty",
              param: "adminHoursAssigned",
              value: "",
            },
            {
              location: "body",
              msg: "The monday field is empty",
              param: "monday",
              value: "",
            },
            {
              location: "body",
              msg: "The tuesday field is empty",
              param: "tuesday",
              value: "",
            },
            {
              location: "body",
              msg: "The wednesday field is empty",
              param: "wednesday",
              value: "",
            },
            {
              location: "body",
              msg: "The thursday field is empty",
              param: "thursday",
              value: "",
            },
            {
              location: "body",
              msg: "The friday field is empty",
              param: "friday",
              value: "",
            },
            {
              location: "body",
              msg: "The saturday field is empty",
              param: "saturday",
              value: "",
            },
            {
              location: "body",
              msg: "The sunday field is empty",
              param: "sunday",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherEmptyValues.school_id,
            user_id: newTeacherEmptyValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherEmptyValues.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-_id -createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacherEmptyValues);
      });
    });
    describe("POST - /teachers - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherNotValidDataTypes);

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
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "contract type is not valid",
              param: "contractType",
              value: true,
            },
            {
              location: "body",
              msg: "teaching hours assignable value is not valid",
              param: "teachingHoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "teaching hours assigned value is not valid",
              param: "teachingHoursAssigned",
              value: "three3",
            },
            {
              location: "body",
              msg: "admin hours assignable value is not valid",
              param: "adminHoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "admin hours assigned value is not valid",
              param: "adminHoursAssigned",
              value: "three3",
            },
            {
              location: "body",
              msg: "monday value is not valid",
              param: "monday",
              value: "hello",
            },
            {
              location: "body",
              msg: "tuesday value is not valid",
              param: "tuesday",
              value: "hello",
            },
            {
              location: "body",
              msg: "wednesday value is not valid",
              param: "wednesday",
              value: "hello",
            },
            {
              location: "body",
              msg: "thursday value is not valid",
              param: "thursday",
              value: "hello",
            },
            {
              location: "body",
              msg: "friday value is not valid",
              param: "friday",
              value: "hello",
            },
            {
              location: "body",
              msg: "saturday value is not valid",
              param: "saturday",
              value: "hello",
            },
            {
              location: "body",
              msg: "sunday value is not valid",
              param: "sunday",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherNotValidDataTypes.school_id,
            user_id: newTeacherNotValidDataTypes.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherNotValidDataTypes.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherNotValidDataTypes
        );
      });
    });
    describe("POST - /teachers - Passing too long or short input values", () => {
      it("should return invalid length input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "teaching hours assignable must not exceed 9 digits",
              param: "teachingHoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "teaching hours assigned must not exceed 9 digits",
              param: "teachingHoursAssigned",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "admin hours assignable must not exceed 9 digits",
              param: "adminHoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "admin hours assigned must not exceed 9 digits",
              param: "adminHoursAssigned",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherWrongLengthValues.school_id,
            user_id: newTeacherWrongLengthValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherWrongLengthValues.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherWrongLengthValues
        );
      });
    });
    describe("POST - /teachers - Passing wrong input values, the input values are part of the allowed values", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherWrongInputValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              param: "contractType",
              value: "tiempo-completo",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherWrongInputValues.school_id,
            user_id: newTeacherWrongInputValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherWrongInputValues.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherWrongInputValues
        );
      });
    });
    describe("POST - /teachers - Passing a number of total assignable hours larger than the maximum allowed", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({
            ...newTeacher,
            teachingHoursAssignable: 36,
            adminHoursAssignable: 36,
          });

        // assertions
        expect(body).toStrictEqual({
          msg: "total hours assignable must not exceed 70 hours",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacher.school_id,
            user_id: newTeacher.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing a number of teaching assigned hours larger than the teaching assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newTeacher, teachingHoursAssigned: 70 });

        // assertions
        expect(body).toStrictEqual({
          msg: `teaching hours assigned must not exceed the teaching hours assignable, ${newTeacher.teachingHoursAssignable} hours`,
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing a number of admin assigned hours larger than the admin assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newTeacher, adminHoursAssigned: 70 });

        // assertions
        expect(body).toStrictEqual({
          msg: `admin hours assigned must not exceed the admin hours assignable, ${newTeacher.adminHoursAssignable} hours`,
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - user already a teacher", () => {
      it("should return a user already a teacher error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "User is already a teacher",
          success: false,
        });
        expect(statusCode).toBe(409);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Not finding a user", () => {
      it("should return a user not found error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please create the base user first",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing an inactive user", () => {
      it("should return an inactive user error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          { ...userPayload, status: "inactive" },
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "The user is inactive",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing an user with a non teacher function assignable role different from: teacher, coordinator or headmaster", () => {
      it("should return an invalid role error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          { ...userPayload, role: "student" },
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a teacher function assignable role such as: teacher, coordinator or headmaster",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - The user's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(
          {
            ...userPayload,
            school_id: null,
          },
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the user's school is correct",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing a teacher but not being created", () => {
      it("should not create a teacher", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(userPayload, "findPopulateFilterAllUsers");
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher not created",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("POST - /teachers - Passing a teacher correctly to create", () => {
      it("should create a teacher", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUser = mockService(userPayload, "findPopulateFilterAllUsers");
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher created successfully!",
          success: true,
        });
        expect(statusCode).toBe(201);
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).toHaveBeenCalledWith(newTeacher);
      });
    });
  });

  describe("TEACHERS - GET", () => {
    describe("GET - /teachers - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // mock services
        const findTeachers = mockService(
          teachersNullPayload,
          "findFilterAllTeachers"
        );

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
        expect(findTeachers).not.toHaveBeenCalledWith(
          { school_id: null },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // mock services
        const findTeachers = mockService(
          teachersNullPayload,
          "findFilterAllTeachers"
        );

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
        expect(findTeachers).not.toHaveBeenCalledWith(
          { school_id: "" },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers - Passing an invalid school id in the body", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const findTeachers = mockService(
          teachersNullPayload,
          "findFilterAllTeachers"
        );

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
        expect(findTeachers).not.toHaveBeenCalledWith(
          { school_id: invalidMockId },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers - Requesting all teachers but not finding any", () => {
      it("should not get any users", async () => {
        // mock services
        const findTeachers = mockService(
          teachersNullPayload,
          "findFilterAllTeachers"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No teachers found",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(findTeachers).toHaveBeenCalledWith(
          { school_id: otherValidMockId },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers - Requesting all teachers", () => {
      it("should get all teachers", async () => {
        // mock services
        const findTeachers = mockService(
          teachersPayload,
          "findFilterAllTeachers"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: teachersPayload,
          success: true,
        });
        expect(statusCode).toBe(200);
        expect(findTeachers).toHaveBeenCalledWith(
          { school_id: validMockSchoolId },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers/:id - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // mock services
        const findTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherId}`)
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
        expect(findTeacher).not.toHaveBeenCalledWith(
          { _id: validMockTeacherId, school_id: null },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers/:id - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // mock services
        const findTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherId}`)
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
        expect(findTeacher).not.toHaveBeenCalledWith(
          { _id: validMockTeacherId, school_id: "" },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers/:id - Passing an invalid user and school id", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const findTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The teacher id is not valid",
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
        expect(findTeacher).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: invalidMockId },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers/:id - Requesting a teacher but not finding it", () => {
      it("should not get a teacher", async () => {
        // mock services
        const findTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher not found",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(findTeacher).toHaveBeenCalledWith(
          { _id: otherValidMockId, school_id: validMockSchoolId },
          "-createdAt -updatedAt"
        );
      });
    });
    describe("GET - /teachers/:id - Requesting a teacher correctly", () => {
      it("should get a teacher", async () => {
        // mock services
        const findTeacher = mockService(
          teacherPayload,
          "findTeacherByProperty"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(statusCode).toBe(200);
        expect(body).toStrictEqual({
          payload: teacherPayload,
          success: true,
        });
        expect(findTeacher).toHaveBeenCalledWith(
          { _id: validMockTeacherId, school_id: validMockSchoolId },
          "-createdAt -updatedAt"
        );
      });
    });
  });

  describe("TEACHERS - PUT", () => {
    describe("PUT - /teachers/:id - Passing a teacher with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacherMissingValues);

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
              msg: "Please add the teacher's user id",
              param: "user_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s contract type",
              param: "contractType",
            },
            {
              location: "body",
              msg: "Please add the number of teaching hours assignable to the teacher",
              param: "teachingHoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of teaching hours assigned to the teacher",
              param: "teachingHoursAssigned",
            },
            {
              location: "body",
              msg: "Please add the number of admin hours assignable to the teacher",
              param: "adminHoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of admin hours assigned to the teacher",
              param: "adminHoursAssigned",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherMissingValues.user_i,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacherMissingValues.user_i,
            school_id: newTeacherMissingValues.school_i,
          },
          newTeacherMissingValues
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacherEmptyValues);
        //assertions
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
              msg: "The teacher`s user id field is empty",
              param: "user_id",
              value: "",
            },
            {
              location: "body",
              msg: "The contract type field is empty",
              param: "contractType",
              value: "",
            },
            {
              location: "body",
              msg: "The teaching hours assignable field is empty",
              param: "teachingHoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The teaching hours assigned field is empty",
              param: "teachingHoursAssigned",
              value: "",
            },
            {
              location: "body",
              msg: "The admin hours assignable field is empty",
              param: "adminHoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The admin hours assigned field is empty",
              param: "adminHoursAssigned",
              value: "",
            },
            {
              location: "body",
              msg: "The monday field is empty",
              param: "monday",
              value: "",
            },
            {
              location: "body",
              msg: "The tuesday field is empty",
              param: "tuesday",
              value: "",
            },
            {
              location: "body",
              msg: "The wednesday field is empty",
              param: "wednesday",
              value: "",
            },
            {
              location: "body",
              msg: "The thursday field is empty",
              param: "thursday",
              value: "",
            },
            {
              location: "body",
              msg: "The friday field is empty",
              param: "friday",
              value: "",
            },
            {
              location: "body",
              msg: "The saturday field is empty",
              param: "saturday",
              value: "",
            },
            {
              location: "body",
              msg: "The sunday field is empty",
              param: "sunday",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherEmptyValues.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacherEmptyValues.user_id,
            school_id: newTeacherEmptyValues.school_id,
          },
          newTeacherEmptyValues
        );
      });
    });
    describe("PUT - /teachers/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newTeacherNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The teacher's id is not valid",
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
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "contract type is not valid",
              param: "contractType",
              value: true,
            },
            {
              location: "body",
              msg: "teaching hours assignable value is not valid",
              param: "teachingHoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "teaching hours assigned value is not valid",
              param: "teachingHoursAssigned",
              value: "three3",
            },
            {
              location: "body",
              msg: "admin hours assignable value is not valid",
              param: "adminHoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "admin hours assigned value is not valid",
              param: "adminHoursAssigned",
              value: "three3",
            },
            {
              location: "body",
              msg: "monday value is not valid",
              param: "monday",
              value: "hello",
            },
            {
              location: "body",
              msg: "tuesday value is not valid",
              param: "tuesday",
              value: "hello",
            },
            {
              location: "body",
              msg: "wednesday value is not valid",
              param: "wednesday",
              value: "hello",
            },
            {
              location: "body",
              msg: "thursday value is not valid",
              param: "thursday",
              value: "hello",
            },
            {
              location: "body",
              msg: "friday value is not valid",
              param: "friday",
              value: "hello",
            },
            {
              location: "body",
              msg: "saturday value is not valid",
              param: "saturday",
              value: "hello",
            },
            {
              location: "body",
              msg: "sunday value is not valid",
              param: "sunday",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherNotValidDataTypes.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: invalidMockId,
            user_id: newTeacherNotValidDataTypes.user_id,
            school_id: newTeacherNotValidDataTypes.school_id,
          },
          newTeacherNotValidDataTypes
        );
      });
    });
    describe("PUT - /teachers/:id - Passing too long or short input values", () => {
      it("should return invalid length input value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacherWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "teaching hours assignable must not exceed 9 digits",
              param: "teachingHoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "teaching hours assigned must not exceed 9 digits",
              param: "teachingHoursAssigned",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "admin hours assignable must not exceed 9 digits",
              param: "adminHoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "admin hours assigned must not exceed 9 digits",
              param: "adminHoursAssigned",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherNotValidDataTypes.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacherWrongLengthValues.user_id,
            school_id: newTeacherWrongLengthValues.school_id,
          },
          newTeacherWrongLengthValues
        );
      });
    });
    describe("PUT - /teachers/:id - Passing wrong input values, the input values are part of the allowed values", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacherWrongInputValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              param: "contractType",
              value: "tiempo-completo",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacherWrongInputValues.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacherWrongInputValues.user_id,
            school_id: newTeacherWrongInputValues.school_id,
          },
          newTeacherWrongInputValues
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a total number of assignable hours larger than the maximum allowed", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send({
            ...newTeacher,
            teachingHoursAssignable: 36,
            adminHoursAssignable: 36,
          });

        // assertions
        expect(body).toStrictEqual({
          msg: "total hours assignable must not exceed 70 hours",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a number of teaching assigned hours larger than the teaching assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send({ ...newTeacher, teachingHoursAssigned: 70 });

        // assertions
        expect(body).toStrictEqual({
          msg: `teaching hours assigned must not exceed the teaching hours assignable, ${newTeacher.teachingHoursAssignable} hours`,
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a number of admin assigned hours larger than the admin assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send({ ...newTeacher, adminHoursAssigned: 70 });

        // assertions
        expect(body).toStrictEqual({
          msg: `admin hours assigned must not exceed the admin hours assignable, ${newTeacher.adminHoursAssignable} hours`,
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).not.toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Not finding a user", () => {
      it("should return a user not found error", async () => {
        // mock services
        const findUser = mockService(
          userNullPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please create the base user first",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing an inactive user", () => {
      it("should return an inactive user error", async () => {
        // mock services
        const findUser = mockService(
          {
            ...userPayload,
            status: "inactive",
          },
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "The user is inactive",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing an user with a non teacher function assignable role different from: teacher, coordinator or headmaster", () => {
      it("should return an invalid role error", async () => {
        // mock services
        const findUser = mockService(
          {
            ...userPayload,
            role: "student",
          },
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a teacher function assignable role such as: teacher, coordinator or headmaster",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - The user's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const findUser = mockService(
          {
            ...userPayload,
            school_id: null,
          },
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the user's school is correct",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalledWith(
          [
            { _id: validMockTeacherId },
            { user_id: newTeacher.user_id },
            { school_id: newTeacher.school_id },
          ],
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a teacher but not updating it", () => {
      it("should not update a user", async () => {
        // mock services
        const findUser = mockService(userPayload, "findPopulateFilterAllUsers");
        const updateTeacher = mockService(
          teacherNullPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacher.user_id,
            school_id: newTeacher.school_id,
          },
          newTeacher
        );
      });
    });
    describe("PUT - /teachers/:id - Passing a teacher correctly to update", () => {
      it("should update a user", async () => {
        // mock services
        const findUser = mockService(userPayload, "findPopulateFilterAllUsers");
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({ msg: "Teacher updated", success: true });
        expect(statusCode).toBe(200);
        expect(findUser).toHaveBeenCalledWith(
          newTeacher.user_id,
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacher.user_id,
            school_id: newTeacher.school_id,
          },
          newTeacher
        );
      });
    });
  });

  describe("TEACHERS - DELETE", () => {
    describe("DELETE - /teachers/:id - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherNullPayload,
          "removeFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherId}`)
          .send({
            school_i: validMockSchoolId,
          });

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
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("DELETE - /teachers/:id - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherNullPayload,
          "removeFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSchoolId}`)
          .send({
            school_id: "",
          });

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
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: "",
        });
      });
    });
    describe("DELETE - /teachers/:id - Passing invalid teacher or school id", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherNullPayload,
          "removeFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({
            school_id: invalidMockId,
          });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The teacher's id is not valid",
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
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("DELETE - /teachers/:id - Passing a teacher but not deleting it", () => {
      it("should not delete a teacher", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherNullPayload,
          "removeFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({
            school_id: validMockSchoolId,
          });

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("DELETE - /teachers/:id - Passing a teacher correctly to delete", () => {
      it("should delete a teacher", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherPayload,
          "removeFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherId}`)
          .send({
            school_id: validMockSchoolId,
          });

        // assertions
        expect(body).toStrictEqual({ msg: "Teacher deleted", success: true });
        expect(statusCode).toBe(200);
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
