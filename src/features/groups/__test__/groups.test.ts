import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertGroup,
  insertLevel,
  insertManyGroups,
  insertSchool,
  removeAllGroups,
  removeAllLevels,
  removeAllSchools,
} from "../groups.services";

import { SchoolStatus } from "../../../typings/types";

describe("Resource => GROUP", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllGroups();
    await removeAllSchools();
    await removeAllLevels();
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
  const endPointUrl = `${BASE_URL}groups/`;

  // test blocks
  describe("GROUP - POST", () => {
    describe("POST - /groups - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroupMissingValues = {
          school_i: validMockSchoolId,
          level_i: validMockLevelId,
          nam: "Group 001",
          numberStudent: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupMissingValues);

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
              msg: "Please add a group name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const newGroupEmptyValues = {
          school_id: "",
          level_id: "",
          name: "",
          numberStudents: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupEmptyValues);

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
              msg: "The group name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group number of students field is empty",
              param: "numberStudents",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newGroupNotValidDataTypes = {
          school_id: invalidMockId,
          level_id: invalidMockId,
          name: 432943,
          numberStudents: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupNotValidDataTypes);

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
              msg: "The group name is not valid",
              param: "name",
              value: 432943,
            },
            {
              location: "body",
              msg: "group number of students value is not valid",
              param: "numberStudents",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroupWrongLengthValues = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          numberStudents: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The group name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "numberStudents",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing a duplicate group name", () => {
      it("should return a duplicate group name", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /groups - Passing a non-existent level", () => {
      it("should return a non-existent level error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /groups - Passing a non matching school id for the level", () => {
      it("should return a non matching school id error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing a number of students larger than the max allowed number of students", () => {
      it("should return a larger than the max allowed number of students error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 41,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: `Please take into account that the number of students for any group cannot exceed ${newSchool.groupMaxNumStudents} students`,
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /groups - Passing a group correctly to create", () => {
      it("should create a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "School 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({ msg: "Group created!", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("GROUP - GET", () => {
    describe("GET - /groups - Passing missing fields", () => {
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
    describe("GET - /groups - passing fields with empty values", () => {
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
    describe("GET - /groups - passing invalid ids", () => {
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
    describe("GET - /groups - Requesting all groups but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No groups found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /groups - Requesting all groups correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newGroups = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Mathematics",
            level_id: new Types.ObjectId().toString(),
            numberStudents: 30,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Language",
            level_id: new Types.ObjectId().toString(),
            numberStudents: 30,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Physics",
            level_id: new Types.ObjectId().toString(),
            numberStudents: 30,
          },
        ];
        await insertManyGroups(newGroups);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ payload: newGroups, success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
  describe("GET - /groups/:id - Passing missing fields", () => {
    it("should return a missing values error", async () => {
      // inputs
      const validMockGroupId = new Types.ObjectId().toString();
      const validMockSchoolId = new Types.ObjectId().toString();

      // api call
      const { statusCode, body } = await supertest(server)
        .get(`${endPointUrl}${validMockGroupId}`)
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
  describe("GET - /groups/:id - Passing fields with empty values", () => {
    it("should return an empty values error", async () => {
      // input
      const validMockGroupId = new Types.ObjectId().toString();

      // api call
      const { statusCode, body } = await supertest(server)
        .get(`${endPointUrl}${validMockGroupId}`)
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
  describe("GET - /groups/:id - Passing invalid ids", () => {
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
            msg: "The group id is not valid",
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
  describe("GET - /groups/:id - Requesting a group but not finding it", () => {
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
        msg: "Group not found",
        success: false,
      });
      expect(statusCode).toBe(404);
    });
  });
  describe("GET - /groups/:id - Requesting a group correctly", () => {
    it("should get a field", async () => {
      // input
      const validMockGroupId = new Types.ObjectId().toString();
      const validMockSchoolId = new Types.ObjectId().toString();
      const validMockLevelId = new Types.ObjectId().toString();
      const newGroup = {
        _id: validMockGroupId,
        school_id: validMockSchoolId,
        level_id: validMockLevelId,
        name: "Group 001",
        numberStudents: 40,
      };
      await insertGroup(newGroup);

      // api call
      const { statusCode, body } = await supertest(server)
        .get(`${endPointUrl}${validMockGroupId}`)
        .send({ school_id: validMockSchoolId });

      // assertions
      expect(body).toStrictEqual({ payload: newGroup, success: true });
      expect(statusCode).toBe(200);
    });
  });

  describe("GROUP - PUT", () => {
    describe("PUT - /groups/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroupMissingValues = {
          school_i: validMockSchoolId,
          level_i: validMockLevelId,
          nam: "Group 001",
          numberStudent: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroupMissingValues);

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
              msg: "Please add a group name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const newGroupEmptyValues = {
          school_id: "",
          level_id: "",
          name: "",
          numberStudents: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroupEmptyValues);

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
              msg: "The group name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group number of students field is empty",
              param: "numberStudents",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newGroupNotValidDataTypes = {
          school_id: invalidMockId,
          level_id: invalidMockId,
          name: 432943,
          numberStudents: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newGroupNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The group id is not valid",
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
              msg: "The group name is not valid",
              param: "name",
              value: 432943,
            },
            {
              location: "body",
              msg: "group number of students value is not valid",
              param: "numberStudents",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroupWrongLengthValues = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          numberStudents: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroupWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The group name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "numberStudents",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing a duplicate group name value", () => {
      it("should return a duplicate group name error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /groups/:id - Passing a non-existent level", () => {
      it("should return a non-existent level error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /groups/:id - Passing a non-matching school id for the level", () => {
      it("should return a non-matching school id error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockGroupId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing a number students larger than the max allowed number of students", () => {
      it("should return a larger than the max allowed number of students error", async () => {
        // input
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
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 41,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: `Please take into account that the number of students cannot exceed ${newSchool.groupMaxNumStudents} students`,
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing a group but not updating it because it does not match the filters", () => {
      it("should not update a group", async () => {
        // input
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
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Group not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /groups/:id - Passing a group correctly to update", () => {
      it("should update a group", async () => {
        // input
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
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockLevelId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Group updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("GROUP - DELETE", () => {
    describe("DELETE - /groups/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupId}`)
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
    describe("DELETE - /groups/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupId}`)
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
    describe("DELETE - /groups/:id - Passing invalid ids", () => {
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
              msg: "The group id is not valid",
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
    describe("DELETE - /groups/:id - Passing a group id but not deleting it", () => {
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
          msg: "Group not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /groups/:id - Passing a group id correctly to delete", () => {
      it("should delete a field", async () => {
        // input
        const validMockGroupId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const newGroup = {
          _id: validMockGroupId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          name: "Group 001",
          numberStudents: 40,
        };
        await insertGroup(newGroup);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Group deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
