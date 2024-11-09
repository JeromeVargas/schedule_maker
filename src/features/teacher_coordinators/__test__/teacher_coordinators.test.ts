import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as teacherCoordinatorServices from "../teacher_coordinators.services";

import { BASE_URL } from "../../../lib/router";

import type { Teacher_Coordinator } from "../../../typings/types";

type Service =
  | "insertTeacherCoordinator"
  | "findFilterAllTeacherCoordinators"
  | "findTeacherCoordinatorByProperty"
  | "findFilterTeacherCoordinatorByProperty"
  | "modifyFilterTeacherCoordinator"
  | "removeFilterTeacherCoordinator"
  | "findPopulateTeacherById"
  | "findPopulateCoordinatorById";

describe("RESOURCE => Teacher_coordinator", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest
      .spyOn(teacherCoordinatorServices, service)
      .mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}teacher_coordinators/`;

  /* inputs */
  const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newTeacherCoordinator = {
    school_id: validMockSchoolId,
    teacher_id: validMockTeacherId,
    coordinator_id: validMockCoordinatorId,
  };
  const newTeacherCoordinatorMissingValues = {
    school_i: validMockSchoolId,
    teacher_i: validMockTeacherId,
    coordinator_i: validMockCoordinatorId,
  };
  const newTeacherCoordinatorEmptyValues = {
    school_id: "",
    teacher_id: "",
    coordinator_id: "",
  };
  const newTeacherCoordinatorNotValidDataTypes = {
    school_id: invalidMockId,
    teacher_id: invalidMockId,
    coordinator_id: invalidMockId,
  };

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    teacherMaxNumStudents: 40,
  };
  const teacherPayload = {
    _id: validMockTeacherId,
    school_id: schoolPayload,
    level_id: validMockLevelId,
    name: "Teacher 101",
    numberStudents: 20,
  };
  const teacherNullPayload = null;
  const coordinatorPayload = {
    _id: validMockCoordinatorId,
    school_id: schoolPayload,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "JeromeVar@gmail.com",
    role: "coordinator",
    status: "active",
  };
  const coordinatorNullPayload = null;
  const teacherCoordinatorPayload = {
    _id: validMockTeacherCoordinatorId,
    school_id: validMockSchoolId,
    teacher_id: validMockTeacherId,
    coordinator_id: validMockCoordinatorId,
  };
  const teacherCoordinatorNullPayload = null;
  const teacherCoordinatorsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      teacher_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
  ];
  const teacherCoordinatorsNullPayload: Teacher_Coordinator[] = [];

  // test blocks
  describe("POST /teacher_coordinator ", () => {
    describe("teacher_coordinator::post::01 - Passing a teacher_coordinator with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinatorMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add a teacher id",
              param: "teacher_id",
            },
            {
              location: "body",
              msg: "Please add a coordinator id",
              param: "coordinator_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorMissingValues.school_i,
            teacher_id: newTeacherCoordinatorMissingValues.teacher_i,
            coordinator_id: newTeacherCoordinatorMissingValues.coordinator_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorMissingValues.teacher_i,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorMissingValues.coordinator_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorMissingValues
        );
      });
    });
    describe("teacher_coordinator::post::02 - Passing a teacher_coordinator with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinatorEmptyValues);

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
              msg: "The teacher id field is empty",
              param: "teacher_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorEmptyValues.school_id,
            teacher_id: newTeacherCoordinatorEmptyValues.teacher_id,
            coordinator_id: newTeacherCoordinatorEmptyValues.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorEmptyValues.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorEmptyValues.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorEmptyValues
        );
      });
    });
    describe("teacher_coordinator::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinatorNotValidDataTypes);

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
              msg: "The teacher id is not valid",
              param: "teacher_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorNotValidDataTypes.school_id,
            teacher_id: newTeacherCoordinatorNotValidDataTypes.teacher_id,
            coordinator_id:
              newTeacherCoordinatorNotValidDataTypes.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorNotValidDataTypes.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorNotValidDataTypes.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorNotValidDataTypes
        );
      });
    });
    describe("teacher_coordinator::post::04 - teacher has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This teacher has already been assigned this coordinator",
          success: false,
        });
        expect(statusCode).toBe(409);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::05 - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::06 - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          { ...teacherPayload, school_id: otherValidMockId },
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::07 - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::08 - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              teacherMaxNumStudents: 40,
            },
          },
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::09 - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            role: "teacher",
          },
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::10 - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            status: "inactive",
          },
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).not.toHaveBeenCalled();
        expect(insertTeacherCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::11 - Passing a teacher_coordinator but not being created", () => {
      it("should not create a teacher_coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Coordinator has not been assigned the to teacher",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).toHaveBeenCalled();
        expect(insertTeacherCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::12 - Passing a teacher_coordinator correctly to create", () => {
      it("should create a teacher_coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const insertTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "insertTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Coordinator has been successfully assigned the to teacher",
          success: true,
        });
        expect(statusCode).toBe(201);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherCoordinator).toHaveBeenCalled();
        expect(insertTeacherCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator
        );
      });
    });
  });

  describe("GET /teacher_coordinator ", () => {
    describe("teacher_coordinator - GET", () => {
      describe("teacher_coordinator::get::01 - passing a school id with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findTeacherCoordinators = mockService(
            teacherCoordinatorsNullPayload,
            "findFilterAllTeacherCoordinators"
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
          expect(findTeacherCoordinators).not.toHaveBeenCalled();
          expect(findTeacherCoordinators).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get::02 - passing a field with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findTeacherCoordinators = mockService(
            teacherCoordinatorsNullPayload,
            "findFilterAllTeacherCoordinators"
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
          expect(findTeacherCoordinators).not.toHaveBeenCalled();
          expect(findTeacherCoordinators).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get::03 - passing and invalid school id", () => {
        it("should get all fields", async () => {
          // mock services
          const findTeacherCoordinators = mockService(
            teacherCoordinatorsNullPayload,
            "findFilterAllTeacherCoordinators"
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
          expect(findTeacherCoordinators).not.toHaveBeenCalled();
          expect(findTeacherCoordinators).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get::04 - Requesting all fields but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findTeacherCoordinators = mockService(
            teacherCoordinatorsNullPayload,
            "findFilterAllTeacherCoordinators"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({
            msg: "No coordinators assigned to any teachers yet",
            success: false,
          });
          expect(statusCode).toBe(404);
          expect(findTeacherCoordinators).toHaveBeenCalled();
          expect(findTeacherCoordinators).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get::05 - Requesting all teacher_coordinators correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findTeacherCoordinators = mockService(
            teacherCoordinatorsPayload,
            "findFilterAllTeacherCoordinators"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            payload: [
              {
                _id: expect.any(String),
                coordinator_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                coordinator_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                coordinator_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
            ],
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findTeacherCoordinators).toHaveBeenCalled();
          expect(findTeacherCoordinators).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("teacher_coordinator - GET/:id", () => {
      describe("teacher_coordinator::get/:id::01 - Passing fields with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const duplicateTeacherCoordinator = mockService(
            teacherCoordinatorNullPayload,
            "findTeacherCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockTeacherCoordinatorId}`)
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
          expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
          expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
            { _id: validMockTeacherCoordinatorId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findTeacherCoordinator = mockService(
            teacherCoordinatorNullPayload,
            "findTeacherCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockTeacherCoordinatorId}`)
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
          expect(findTeacherCoordinator).not.toHaveBeenCalled();
          expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
            { _id: validMockTeacherCoordinatorId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get/:id::03 - Passing an invalid teacher_coordinator and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findTeacherCoordinator = mockService(
            teacherCoordinatorNullPayload,
            "findTeacherCoordinatorByProperty"
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
                msg: "The teacher_coordinator id is not valid",
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
          expect(findTeacherCoordinator).not.toHaveBeenCalled();
          expect(findTeacherCoordinator).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get/:id::04 - Requesting a field but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findTeacherCoordinator = mockService(
            teacherCoordinatorNullPayload,
            "findTeacherCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher_coordinator not found",
            success: false,
          });
          expect(statusCode).toBe(404);
          expect(findTeacherCoordinator).toHaveBeenCalled();
          expect(findTeacherCoordinator).toHaveBeenCalledWith(
            {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
            },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_coordinator::get/:id::05 - Requesting a field correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findTeacherCoordinator = mockService(
            teacherCoordinatorPayload,
            "findTeacherCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockTeacherCoordinatorId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            payload: {
              _id: validMockTeacherCoordinatorId,
              coordinator_id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              teacher_id: validMockTeacherId,
            },
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findTeacherCoordinator).toHaveBeenCalled();
          expect(findTeacherCoordinator).toHaveBeenCalledWith(
            {
              _id: validMockTeacherCoordinatorId,
              school_id: validMockSchoolId,
            },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /teacher_coordinator ", () => {
    describe("teacher_coordinator::put::01 - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        /* mock services */
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinatorMissingValues);
        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add a teacher id",
              param: "teacher_id",
            },
            {
              location: "body",
              msg: "Please add a coordinator id",
              param: "coordinator_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorMissingValues.school_i,
            teacher_id: newTeacherCoordinatorMissingValues.teacher_i,
            coordinator_id: newTeacherCoordinatorMissingValues.coordinator_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorMissingValues.coordinator_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorMissingValues.teacher_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinatorMissingValues.teacher_i,
            school_id: newTeacherCoordinatorMissingValues.school_i,
          },
          newTeacherCoordinatorMissingValues
        );
      });
    });
    describe("field::put::02 - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        /* mock services */
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinatorEmptyValues);
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
              msg: "The teacher id field is empty",
              param: "teacher_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorEmptyValues.school_id,
            teacher_id: newTeacherCoordinatorEmptyValues.teacher_id,
            coordinator_id: newTeacherCoordinatorEmptyValues.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorEmptyValues.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorEmptyValues.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinatorEmptyValues.teacher_id,
            school_id: newTeacherCoordinatorEmptyValues.school_id,
          },
          newTeacherCoordinatorEmptyValues
        );
      });
    });
    describe("teacher_coordinator::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinatorNotValidDataTypes);

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
              msg: "The teacher id is not valid",
              param: "teacher_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinatorNotValidDataTypes.school_id,
            teacher_id: newTeacherCoordinatorNotValidDataTypes.teacher_id,
            coordinator_id:
              newTeacherCoordinatorNotValidDataTypes.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinatorNotValidDataTypes.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinatorNotValidDataTypes.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinatorNotValidDataTypes.teacher_id,
            school_id: newTeacherCoordinatorNotValidDataTypes.school_id,
          },
          newTeacherCoordinatorNotValidDataTypes
        );
      });
    });
    describe("teacher_coordinator::put::04 - teacher has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This teacher has already been assigned this coordinator",
          success: false,
        });
        expect(statusCode).toBe(409);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::post::05 - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::06 - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          { ...teacherPayload, school_id: otherValidMockId },
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::06 - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::07 - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          { ...coordinatorPayload, school_id: otherValidMockId },
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::08 - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          { ...coordinatorPayload, role: "student" },
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::09 - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          { ...coordinatorPayload, status: "inactive" },
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).not.toHaveBeenCalled();
        expect(updateTeacherCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::10 - Passing a teacher_coordinator but not updating", () => {
      it("should not update a teacher_coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has not been assigned the updated teacher",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).toHaveBeenCalled();
        expect(updateTeacherCoordinator).toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
    describe("teacher_coordinator::put::11 - Passing a teacher_coordinator correctly to update", () => {
      it("should update a teacher_coordinator", async () => {
        // mock services
        const duplicateTeacherCoordinator = mockService(
          teacherCoordinatorNullPayload,
          "findTeacherCoordinatorByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const updateTeacherCoordinator = mockService(
          teacherCoordinatorPayload,
          "modifyFilterTeacherCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send(newTeacherCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has been successfully assigned the updated teacher",
          success: true,
        });
        expect(statusCode).toBe(200);
        expect(duplicateTeacherCoordinator).toHaveBeenCalled();
        expect(duplicateTeacherCoordinator).toHaveBeenCalledWith(
          {
            school_id: newTeacherCoordinator.school_id,
            teacher_id: newTeacherCoordinator.teacher_id,
            coordinator_id: newTeacherCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherCoordinator.teacher_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newTeacherCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherCoordinator).toHaveBeenCalled();
        expect(updateTeacherCoordinator).toHaveBeenCalledWith(
          {
            _id: validMockTeacherCoordinatorId,
            teacher_id: newTeacherCoordinator.teacher_id,
            school_id: newTeacherCoordinator.school_id,
          },
          newTeacherCoordinator
        );
      });
    });
  });

  describe("DELETE /teacher_coordinator ", () => {
    describe("teacher_coordinator::delete::01 - Passing fields with missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherCoordinatorNullPayload,
          "removeFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherCoordinatorId}`)
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherCoordinatorId,
          school_id: null,
        });
      });
    });
    describe("teacher_coordinator::delete::02 - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherCoordinatorNullPayload,
          "removeFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherCoordinatorId}`)
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherCoordinatorId,
          school_id: "",
        });
      });
    });
    describe("teacher_coordinator::delete::03 - Passing an invalid teacher_coordinator and school ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherCoordinatorNullPayload,
          "removeFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });
        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The teacher_coordinator id is not valid",
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("teacher_coordinator::delete::04 - Passing a teacher_coordinator id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherCoordinatorNullPayload,
          "removeFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher_coordinator not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("teacher_coordinator::delete::05 - Passing a teacher_coordinator id correctly to delete", () => {
      it("should delete a teacher_coordinator", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherCoordinatorPayload,
          "removeFilterTeacherCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher_coordinator deleted",
          success: true,
        });
        expect(statusCode).toBe(200);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
