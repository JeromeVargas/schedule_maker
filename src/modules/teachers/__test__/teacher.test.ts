import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as teacherServices from "../teacherServices";

import { Teacher, User } from "../../../typings/types";

type Service =
  | "insertTeacher"
  | "findFilterAllTeachers"
  | "findTeacherByProperty"
  | "modifyFilterTeacher"
  | "removeFilterTeacher"
  | "findPopulateFilterAllUsers"
  | "findUserByProperty";

describe("RESOURCE => Teacher", () => {
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
  const endPointUrl = "/api/v1/teachers/";

  /* inputs */
  const validMockUserId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newTeacher = {
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
  const newTeacherMissingValues = {
    school_i: validMockSchoolId,
    user_i: validMockUserId,
    coordinator_i: validMockCoordinatorId,
    contractTyp: "full-time",
    hoursAssignabl: 60,
    hoursAssigne: 60,
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
    coordinator_id: "",
    contractType: "",
    teachingHoursAssignable: "",
    teachingHoursAssigned: "",
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
    coordinator_id: invalidMockId,
    contractType: true,
    teachingHoursAssignable: "house",
    teachingHoursAssigned: "three3",
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
    coordinator_id: validMockCoordinatorId,
    contractType: "full-time",
    teachingHoursAssignable: 1234567890,
    teachingHoursAssigned: 1234567890,
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
    coordinator_id: validMockCoordinatorId,
    contractType: "tiempo-completo",
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

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumStudents: 40,
  };
  const userCoordinatorPayload = [
    {
      _id: validMockUserId,
      school_id: schoolPayload,
      firstName: "Mtuts",
      lastName: "Tuts",
      email: "mtuts@hello.com",
      role: "teacher",
      status: "active",
    },
    {
      _id: validMockCoordinatorId,
      school_id: schoolPayload,
      firstName: "Dave",
      lastName: "Gray",
      email: "dave@hello.com",
      role: "coordinator",
      status: "active",
    },
  ];
  const userCoordinatorNullPayload: User[] = [];
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
  const teacherNullPayload = null;
  const userNullPayload = null;
  const coordinatorNullPayload = null;
  const teachersPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      contractType: "full-time",
      teachingHoursAssignable: 60,
      teachingHoursAssigned: 60,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      contractType: "part-time",
      teachingHoursAssignable: 40,
      teachingHoursAssigned: 40,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      user_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
      contractType: "substitute",
      teachingHoursAssignable: 70,
      teachingHoursAssigned: 70,
    },
  ];
  const teachersNullPayload: Teacher[] = [];

  // test blocks
  describe("POST /teacher ", () => {
    describe("teacher::post::01 - Passing a teacher with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherMissingValues);

        // assertions
        expect(body).toStrictEqual([
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
            msg: "Please add the coordinator's id",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherMissingValues.school_i,
            user_id: newTeacherMissingValues.user_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherMissingValues.coordinator_i,
            newTeacherMissingValues.user_i,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-_id -createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacherMissingValues);
      });
    });
    describe("teacher::post::02 - Passing a teacher with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherEmptyValues);

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
            msg: "The teacher's user id field is empty",
            param: "user_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator's id field is empty",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherEmptyValues.school_id,
            user_id: newTeacherEmptyValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacherEmptyValues.coordinator_id, newTeacherEmptyValues.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-_id -createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacherEmptyValues);
      });
    });
    describe("teacher::post::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherNotValidDataTypes);

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
            msg: "The teacher's user id is not valid",
            param: "user_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The coordinator's id is not valid",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherNotValidDataTypes.school_id,
            user_id: newTeacherNotValidDataTypes.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherNotValidDataTypes.coordinator_id,
            newTeacherNotValidDataTypes.user_id,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherNotValidDataTypes
        );
      });
    });
    describe("teacher::post::04 - Passing too long or short input values", () => {
      it("should return invalid length input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherWrongLengthValues.school_id,
            user_id: newTeacherWrongLengthValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherWrongLengthValues.coordinator_id,
            newTeacherWrongLengthValues.user_id,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherWrongLengthValues
        );
      });
    });
    describe("teacher::post::05 - Passing wrong input values, the input values are part of the allowed values", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorNullPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherWrongInputValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "the contract type provided is not a valid option",
            param: "contractType",
            value: "tiempo-completo",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherWrongInputValues.school_id,
            user_id: newTeacherWrongInputValues.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherWrongInputValues.coordinator_id,
            newTeacherWrongInputValues.user_id,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(
          newTeacherWrongInputValues
        );
      });
    });
    describe("teacher::post::06 - Passing a number of assignable hours larger than the maximum allowed", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newTeacher, teachingHoursAssignable: 71 });

        // assertions
        expect(body).toStrictEqual({
          msg: "teaching hours assignable must not exceed 70 hours",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          {
            school_id: newTeacher.school_id,
            user_id: newTeacher.user_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::07 - Passing a number of assigned hours larger than the assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
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
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).not.toHaveBeenCalled();
        expect(duplicateTeacher).not.toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::08 - user already a teacher", () => {
      it("should return a user already a teacher error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
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
        });
        expect(statusCode).toBe(409);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::09 - Not finding a user", () => {
      it("should return a user not found error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [userNullPayload, userCoordinatorPayload[1]],
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
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::10 - Passing an inactive user", () => {
      it("should return an inactive user error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            { ...userCoordinatorPayload[0], status: "inactive" },
            userCoordinatorPayload[1],
          ],
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({ msg: "The user is inactive" });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::11 - Passing an user with a non teacher function assignable role such as: teacher, coordinator or headmaster", () => {
      it("should return an invalid role error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            { ...userCoordinatorPayload[0], role: "student" },
            userCoordinatorPayload[1],
          ],
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
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::12 - The user's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            {
              ...userCoordinatorPayload[0],
              school_id: null,
            },
            userCoordinatorPayload[1],
          ],
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
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::13 - Not finding a coordinator", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [userCoordinatorPayload[0], coordinatorNullPayload],
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an existent coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::14 - Passing a user with a role different from coordinator", () => {
      it("should return an not-a-coordinator error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], role: "student" },
          ],
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::15 - Passing an inactive coordinator", () => {
      it("should return an inactive coordinator error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], status: "inactive" },
          ],
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::16 - The coordinator's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], school_id: null },
          ],
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator's school is correct",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).not.toHaveBeenCalled();
        expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::17 - Passing a teacher but not being created", () => {
      it("should not create a teacher", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherNullPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher not created",
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).toHaveBeenCalled();
        expect(insertTeacher).toHaveBeenCalledWith(newTeacher);
      });
    });
    describe("teacher::post::18 - Passing a teacher correctly to create", () => {
      it("should create a teacher", async () => {
        // mock services
        const duplicateTeacher = mockService(
          teacherNullPayload,
          "findTeacherByProperty"
        );
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
          "findPopulateFilterAllUsers"
        );
        const insertTeacher = mockService(teacherPayload, "insertTeacher");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({ msg: "Teacher created successfully!" });
        expect(statusCode).toBe(201);
        expect(duplicateTeacher).toHaveBeenCalled();
        expect(duplicateTeacher).toHaveBeenCalledWith(
          { school_id: newTeacher.school_id, user_id: newTeacher.user_id },
          "-createdAt -updatedAt"
        );
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacher).toHaveBeenCalled();
        expect(insertTeacher).toHaveBeenCalledWith(newTeacher);
      });
    });
  });

  describe("GET /teacher ", () => {
    describe("teacher - GET", () => {
      describe("teacher::get::01 - passing a school with missing values", () => {
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
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeachers).not.toHaveBeenCalled();
          expect(findTeachers).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get::02 - passing a school with empty values", () => {
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
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeachers).not.toHaveBeenCalled();
          expect(findTeachers).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get::03 - Passing an invalid school id in the body", () => {
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
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeachers).not.toHaveBeenCalled();
          expect(findTeachers).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get::04 - Requesting all teachers but not finding any", () => {
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
          });
          expect(statusCode).toBe(404);
          expect(findTeachers).toHaveBeenCalled();
          expect(findTeachers).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get::05 - Requesting all teachers", () => {
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
          expect(body).toStrictEqual([
            {
              _id: expect.any(String),
              contractType: "full-time",
              coordinator_id: expect.any(String),
              teachingHoursAssignable: 60,
              teachingHoursAssigned: 60,
              school_id: expect.any(String),
              user_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              contractType: "part-time",
              coordinator_id: expect.any(String),
              teachingHoursAssignable: 40,
              teachingHoursAssigned: 40,
              school_id: expect.any(String),
              user_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              contractType: "substitute",
              coordinator_id: expect.any(String),
              teachingHoursAssignable: 70,
              teachingHoursAssigned: 70,
              school_id: expect.any(String),
              user_id: expect.any(String),
            },
          ]);
          expect(statusCode).toBe(200);
          expect(findTeachers).toHaveBeenCalled();
          expect(findTeachers).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("teacher - GET/:id", () => {
      describe("teacher::get/:id::01 - passing a school with missing values", () => {
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
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacher).not.toHaveBeenCalled();
          expect(findTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get/:id::02 - passing a school with empty values", () => {
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
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacher).not.toHaveBeenCalled();
          expect(findTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get/:id::03 - Passing an invalid user and school id", () => {
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
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacher).not.toHaveBeenCalled();
          expect(findTeacher).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get/:id::04 - Requesting a teacher but not finding it", () => {
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
          });
          expect(statusCode).toBe(404);
          expect(findTeacher).toHaveBeenCalled();
          expect(findTeacher).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher::get/:id::05 - Requesting a teacher correctly", () => {
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
          });
          expect(findTeacher).toHaveBeenCalled();
          expect(findTeacher).toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /teacher ", () => {
    describe("teacher::put::01 - Passing a teacher with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        expect(body).toStrictEqual([
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
            msg: "Please add the coordinator's user id",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherMissingValues.coordinator_i,
            newTeacherMissingValues.user_i,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::02 - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        expect(body).toStrictEqual([
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
            msg: "The coordinator's id field is empty",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacherEmptyValues.coordinator_id, newTeacherEmptyValues.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        expect(body).toStrictEqual([
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
            msg: "The coordinator's id is not valid",
            param: "coordinator_id",
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
        ]);
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherNotValidDataTypes.coordinator_id,
            newTeacherNotValidDataTypes.user_id,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::04 - Passing too long or short input values", () => {
      it("should return invalid length input value error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherWrongLengthValues.school_id,
            _id: newTeacherWrongLengthValues.coordinator_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::05 - Passing wrong input values, the input values are part of the allowed values", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "the contract type provided is not a valid option",
            param: "contractType",
            value: "tiempo-completo",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [
            newTeacherWrongInputValues.coordinator_id,
            newTeacherWrongInputValues.user_id,
          ],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::06 - Passing a number of assignable hours larger than the maximum allowed", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send({ ...newTeacher, teachingHoursAssignable: 71 });

        // assertions
        expect(body).toStrictEqual({
          msg: "teaching hours assignable must not exceed 70 hours",
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::07 - Passing a number of assigned hours larger than the assignable hours", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, coordinatorNullPayload],
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
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).not.toHaveBeenCalled();
        expect(findUserCoordinator).not.toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::08 - Not finding a user", () => {
      it("should return a user not found error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userNullPayload, userCoordinatorPayload[1]],
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
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::09 - Passing an inactive user", () => {
      it("should return an inactive user error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            {
              ...userCoordinatorPayload[0],
              status: "inactive",
            },
            userCoordinatorPayload[1],
          ],
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
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::10 - Passing an user with a non teacher function assignable role such as: teacher, coordinator or headmaster", () => {
      it("should return an invalid role error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            {
              ...userCoordinatorPayload[0],
              role: "student",
            },
            userCoordinatorPayload[1],
          ],
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
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::11 - The user's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            {
              ...userCoordinatorPayload[0],
              school_id: null,
            },
            userCoordinatorPayload[1],
          ],
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
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::12 - Not finding a coordinator", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [userCoordinatorPayload[0], coordinatorNullPayload],
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
          msg: "Please pass an existent coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::13 - Passing a non coordinator user as coordinator", () => {
      it("should return an not-a-coordinator error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], role: "teacher" },
          ],
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
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::14 - Passing an inactive coordinator", () => {
      it("should return an inactive coordinator error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], status: "inactive" },
          ],
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
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
    describe("teacher::put::15 - The coordinator's school does not match the body school id", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const findUserCoordinator = mockService(
          [
            userCoordinatorPayload[0],
            { ...userCoordinatorPayload[1], school_id: null },
          ],
          "findPopulateFilterAllUsers"
        );
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
          msg: "Please make sure the coordinator's school is correct",
        });
        expect(statusCode).toBe(400);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).not.toHaveBeenCalled();
        expect(updateTeacher).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherId,
            user_id: newTeacher.user_id,
            school_id: newTeacher.school_id,
          },
          newTeacher
        );
      });
    });
    describe("teacher::put::16 - Passing a teacher but not updating it", () => {
      it("should not update a user", async () => {
        // mock services
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
          "findPopulateFilterAllUsers"
        );
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
        });
        expect(statusCode).toBe(404);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).toHaveBeenCalled();
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
    describe("teacher::put::17 - Passing a teacher correctly to update", () => {
      it("should update a user", async () => {
        // mock services
        const findUserCoordinator = mockService(
          userCoordinatorPayload,
          "findPopulateFilterAllUsers"
        );
        const updateTeacher = mockService(
          teacherPayload,
          "modifyFilterTeacher"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherId}`)
          .send(newTeacher);

        // assertions
        expect(body).toStrictEqual({ msg: "Teacher updated" });
        expect(statusCode).toBe(200);
        expect(findUserCoordinator).toHaveBeenCalled();
        expect(findUserCoordinator).toHaveBeenCalledWith(
          [newTeacher.coordinator_id, newTeacher.user_id],
          "-password -createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacher).toHaveBeenCalled();
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

  describe("DELETE /teacher ", () => {
    describe("teacher::delete::01 - passing a school with missing values", () => {
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
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add a school id",
            param: "school_id",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("teacher::delete::02 - passing a school with empty values", () => {
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
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: "",
        });
      });
    });
    describe("teacher::delete::03 - Passing invalid teacher or school id", () => {
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
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("teacher::delete::04 - Passing a teacher but not deleting it", () => {
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
        expect(body).toStrictEqual({ msg: "Teacher not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("teacher::delete::05 - Passing a teacher correctly to delete", () => {
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
        expect(body).toStrictEqual({ msg: "Teacher deleted" });
        expect(statusCode).toBe(200);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
