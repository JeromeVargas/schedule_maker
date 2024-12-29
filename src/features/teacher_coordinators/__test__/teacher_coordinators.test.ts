import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertManyTeacherCoordinators,
  insertTeacherCoordinator,
  removeAllTeacherCoordinators,
  insertSchool,
  removeAllSchools,
  insertTeacher,
  removeAllTeachers,
  insertUser,
  removeAllUsers,
} from "../teacher_coordinators.services";

import {
  ContractType,
  NewSchool,
  SchoolStatus,
  UserRole,
  UserStatus,
} from "../../../typings/types";

describe("RESOURCE => TEACHER_COORDINATOR", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllTeacherCoordinators();
    await removeAllSchools();
    await removeAllUsers();
    await removeAllTeachers();
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
  const endPointUrl = `${BASE_URL}teacher_coordinators/`;

  // test blocks
  describe("TEACHER_COORDINATORS - POST", () => {
    describe("POST - /teacher_coordinators - Passing a teacher_coordinator with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinatorMissingValues = {
          school_i: validMockSchoolId,
          teacher_i: validMockTeacherId,
          coordinator_i: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a teacher_coordinator with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newTeacherCoordinatorEmptyValues = {
          school_id: "",
          teacher_id: "",
          coordinator_id: "",
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newTeacherCoordinatorNotValidDataTypes = {
          school_id: invalidMockId,
          teacher_id: invalidMockId,
          coordinator_id: invalidMockId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - teacher has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // inputs
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: otherValidMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("POST - /teacher_coordinators - Passing a teacher_coordinator correctly to create", () => {
      it("should create a teacher_coordinator", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
  });

  describe("TEACHER_COORDINATORS - GET", () => {
    describe("GET - /teacher_coordinators - passing a school id with missing values", () => {
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
    describe("GET - /teacher_coordinators - passing a field with empty values", () => {
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
    describe("GET - /teacher_coordinators - passing and invalid school id", () => {
      it("should get all fields", async () => {
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
    describe("GET - /teacher_coordinators - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /teacher_coordinators - Requesting all teacher_coordinators correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newTeacherCoordinators = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
        ];
        await insertManyTeacherCoordinators(newTeacherCoordinators);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newTeacherCoordinators,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /teacher_coordinators/:id - Passing fields with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /teacher_coordinators/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /teacher_coordinators/:id - Passing an invalid teacher_coordinator and school ids", () => {
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
      });
    });
    describe("GET - /teacher_coordinators/:id - Requesting a field but not finding it", () => {
      it("should not get a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /teacher_coordinators/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherCoordinatorId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newTeacherCoordinator,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("TEACHER_COORDINATORS - PUT", () => {
    describe("PUT - /teacher_coordinators/:id - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinatorMissingValues = {
          school_i: validMockSchoolId,
          teacher_i: validMockTeacherId,
          coordinator_i: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinatorEmptyValues = {
          school_id: "",
          teacher_id: "",
          coordinator_id: "",
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newTeacherCoordinatorNotValidDataTypes = {
          school_id: invalidMockId,
          teacher_id: invalidMockId,
          coordinator_id: invalidMockId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - teacher has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: otherValidMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a teacher_coordinator but not updating", () => {
      it("should not update a teacher_coordinator", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
    describe("PUT - /teacher_coordinators/:id - Passing a teacher_coordinator correctly to update", () => {
      it("should update a teacher_coordinator", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
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
          teachingHoursAssignable: 36,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 36,
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
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "1x3sdf1qwe3r2",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const teacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        await insertTeacherCoordinator(teacherCoordinator);
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };

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
      });
    });
  });

  describe("TEACHER_COORDINATORS - DELETE", () => {
    describe("DELETE - /teacher_coordinators/:id - Passing fields with missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /teacher_coordinators/:id - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /teacher_coordinators/:id - Passing an invalid teacher_coordinator and school ids", () => {
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
      });
    });
    describe("DELETE - /teacher_coordinators/:id - Passing a teacher_coordinator id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /teacher_coordinators/:id - Passing a teacher_coordinator id correctly to delete", () => {
      it("should delete a teacher_coordinator", async () => {
        // inputs
        const validMockTeacherCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newTeacherCoordinator = {
          _id: validMockTeacherCoordinatorId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertTeacherCoordinator(newTeacherCoordinator);

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
      });
    });
  });
});
