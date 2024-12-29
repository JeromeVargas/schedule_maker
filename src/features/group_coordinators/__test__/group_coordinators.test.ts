import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertGroup,
  insertGroupCoordinator,
  insertManyGroupCoordinators,
  insertSchool,
  insertUser,
  removeAllGroupCoordinators,
  removeAllGroups,
  removeAllSchools,
  removeAllUsers,
} from "../group_coordinators.services";

import { UserRole, SchoolStatus, UserStatus } from "../../../typings/types";

describe("RESOURCE => GROUP_COORDINATOR", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllGroupCoordinators();
    await removeAllSchools();
    await removeAllGroups();
    await removeAllUsers();
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
  const endPointUrl = `${BASE_URL}group_coordinators/`;

  // test blocks
  describe("GROUP_COORDINATORS - POST", () => {
    describe("POST - /group_coordinators - Passing a group_coordinator with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinatorMissingValues = {
          school_i: validMockSchoolId,
          group_i: validMockGroupId,
          coordinator_i: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorMissingValues);

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
              msg: "Please add a group id",
              param: "group_id",
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
    describe("POST - /group_coordinators - Passing a group_coordinator with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newGroupCoordinatorEmptyValues = {
          school_id: "",
          group_id: "",
          coordinator_id: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorEmptyValues);

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
              msg: "The group id field is empty",
              param: "group_id",
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
    describe("POST - /group_coordinators - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newGroupCoordinatorNotValidDataTypes = {
          school_id: invalidMockId,
          group_id: invalidMockId,
          coordinator_id: invalidMockId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorNotValidDataTypes);

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
              msg: "The group id is not valid",
              param: "group_id",
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
    describe("POST - /group_coordinators - group has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group has already been assigned this coordinator",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /group_coordinators - Passing a non-existent group in the body", () => {
      it("should return a non-existent group error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /group_coordinators - Passing a group that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          _id: validMockGroupId,
          school_id: otherValidMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /group_coordinators - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /group_coordinators - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: otherValidMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /group_coordinators - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /group_coordinators - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /group_coordinators - Passing a group_coordinator correctly to create", () => {
      it("should create a group_coordinator", async () => {
        // inputs
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Coordinator has been successfully assigned the to group",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("GROUP_COORDINATORS - GET", () => {
    describe("GET - /group_coordinators - passing a school id with missing values", () => {
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
    describe("GET - /group_coordinators - passing a field with empty values", () => {
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
    describe("GET - /group_coordinators - passing and invalid school id", () => {
      it("should get all fields", async () => {
        // api call
        const invalidMockId = "63c5dcac78b868f80035asdf";
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
    describe("GET - /group_coordinators - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No coordinators assigned to any groups yet",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /group_coordinators - Requesting all group_coordinators correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newGroupCoordinators = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            group_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            group_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            group_id: new Types.ObjectId().toString(),
            coordinator_id: new Types.ObjectId().toString(),
          },
        ];
        await insertManyGroupCoordinators(newGroupCoordinators);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newGroupCoordinators,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /group_coordinators/:id - Passing fields with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
    describe("GET - /group_coordinators/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
    describe("GET - /group_coordinators/:id - Passing an invalid group_coordinator and school ids", () => {
      it("should return an invalid id error", async () => {
        // api call
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The group_coordinator id is not valid",
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
    describe("GET - /group_coordinators/:id - Requesting a field but not finding it", () => {
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
          msg: "Group_coordinator not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /group_coordinators/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newGroupCoordinator,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("GROUP_COORDINATORS - PUT", () => {
    describe("PUT - /group_coordinators/:id - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinatorMissingValues = {
          school_i: validMockSchoolId,
          group_i: validMockGroupId,
          coordinator_i: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorMissingValues);

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
              msg: "Please add a group id",
              param: "group_id",
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
    describe("PUT - /group_coordinators/:id - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinatorEmptyValues = {
          school_id: "",
          group_id: "",
          coordinator_id: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorEmptyValues);

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
              msg: "The group id field is empty",
              param: "group_id",
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
    describe("PUT - /group_coordinators/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinatorNotValidDataTypes = {
          school_id: invalidMockId,
          group_id: invalidMockId,
          coordinator_id: invalidMockId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorNotValidDataTypes);

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
              msg: "The group id is not valid",
              param: "group_id",
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
    describe("PUT - /group_coordinators/:id - group has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group has already been assigned this coordinator",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a non-existent group in the body", () => {
      it("should return a non-existent group error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a group that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          _id: validMockGroupId,
          school_id: otherValidMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const groupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const groupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: otherValidMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const groupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const groupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a group_coordinator but not updating it", () => {
      it("should not update a group_coordinator", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockGroupCoordinatorId =
          new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const groupCoordinator = {
          _id: otherValidMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has not been assigned the updated group",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /group_coordinators/:id - Passing a group_coordinator correctly to update", () => {
      it("should update a group_coordinator", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const otherValidMockCoordinatorId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 101",
          numberStudents: 20,
        };
        await insertGroup(newGroup);
        const newUser = {
          _id: validMockCoordinatorId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "sc3dsf3d28x3",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const groupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: otherValidMockCoordinatorId,
        };
        await insertGroupCoordinator(groupCoordinator);
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has been successfully assigned the updated group",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("GROUP_COORDINATOR - DELETE", () => {
    describe("DELETE - /group_coordinators/:id - Passing fields with missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
    describe("DELETE - /group_coordinators/:id - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
    describe("DELETE - /group_coordinators/:id - Passing an invalid group_coordinator and school ids", () => {
      it("should return an invalid id error", async () => {
        // api call
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The group_coordinator id is not valid",
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
    describe("DELETE - /group_coordinators/:id - Passing a group_coordinator id but not deleting it", () => {
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
          msg: "Group_coordinator not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /group_coordinators/:id - Passing a group_coordinator id correctly to delete", () => {
      it("should delete a group_coordinator", async () => {
        // inputs
        const validMockGroupCoordinatorId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockCoordinatorId = new Types.ObjectId().toString();
        const newGroupCoordinator = {
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
          group_id: validMockGroupId,
          coordinator_id: validMockCoordinatorId,
        };
        await insertGroupCoordinator(newGroupCoordinator);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Group_coordinator deleted",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });
});
