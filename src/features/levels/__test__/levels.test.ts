import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertLevel,
  insertManyLevels,
  insertSchedule,
  insertSchool,
  removeAllLevels,
  removeAllSchedules,
  removeAllSchools,
} from "../levels.services";

import { SchoolStatus } from "../../../typings/types";

describe("Resource => LEVEL", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllLevels;
    await removeAllSchools();
    await removeAllSchedules();
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
  const endPointUrl = `${BASE_URL}levels/`;

  // test blocks
  describe("LEVEL - POST", () => {
    describe("POST - /levels - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevelMissingValues = {
          school_i: validMockSchoolId,
          schedule_i: validMockScheduleId,
          nam: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelMissingValues);

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
              msg: "Please add the schedule id",
              param: "schedule_id",
            },
            {
              location: "body",
              msg: "Please add a level name",
              param: "name",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /levels - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const newLevelEmptyValues = {
          school_id: "",
          schedule_id: "",
          name: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelEmptyValues);

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
              msg: "The schedule id field is empty",
              param: "schedule_id",
              value: "",
            },
            {
              location: "body",
              msg: "The level name field is empty",
              param: "name",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /levels - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newLevelNotValidDataTypes = {
          school_id: invalidMockId,
          schedule_id: invalidMockId,
          name: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelNotValidDataTypes);

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
              msg: "The schedule id is not valid",
              param: "schedule_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The level name is not valid",
              param: "name",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /levels - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevelWrongLengthValues = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The level name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /levels - Passing a duplicate level name value", () => {
      it("should return an duplicate value error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "This level name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /levels - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /levels - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();
        const newSchedule = {
          _id: validMockScheduleId,
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 1440,
          shiftNumberMinutes: 360,
          sessionUnitMinutes: 40,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertSchedule(newSchedule);
        const newLevel = {
          school_id: otherValidMockId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /levels - Passing a level correctly to create", () => {
      it("should create a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newSchedule = {
          _id: validMockScheduleId,
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 1440,
          shiftNumberMinutes: 360,
          sessionUnitMinutes: 40,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertSchedule(newSchedule);
        const newLevel = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level created!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("LEVEL - GET", () => {
    describe("GET - /levels - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // api call
        const validMockSchoolId = new Types.ObjectId().toString();
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
    describe("GET - /levels - passing fields with empty values", () => {
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
    describe("GET - /levels - passing invalid ids", () => {
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
    describe("GET - /levels - Requesting all levels but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No levels found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /levels - Requesting all levels correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newLevels = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            name: "Mathematics",
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            name: "Language",
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            name: "Physics",
          },
        ];
        await insertManyLevels(newLevels);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ payload: newLevels, success: true });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /levels/:id - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockLevelId}`)
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
    describe("GET - /levels/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockLevelId}`)
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
    describe("GET - /levels/:id - Passing invalid ids", () => {
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
              msg: "The level id is not valid",
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
    describe("GET - /levels/:id - Requesting a level but not finding it", () => {
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
          msg: "Level not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /levels/:id - Requesting a level correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockLevelId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ payload: newLevel, success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("LEVEL - PUT", () => {
    describe("PUT - /levels/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevelMissingValues = {
          school_i: validMockSchoolId,
          schedule_i: validMockScheduleId,
          nam: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelMissingValues);

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
              msg: "Please add the schedule id",
              param: "schedule_id",
            },
            {
              location: "body",
              msg: "Please add a level name",
              param: "name",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const newLevelEmptyValues = {
          school_id: "",
          schedule_id: "",
          name: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelEmptyValues);

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
              msg: "The schedule id field is empty",
              param: "schedule_id",
              value: "",
            },
            {
              location: "body",
              msg: "The level name field is empty",
              param: "name",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newLevelNotValidDataTypes = {
          school_id: invalidMockId,
          schedule_id: invalidMockId,
          name: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newLevelNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The level id is not valid",
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
              msg: "The schedule id is not valid",
              param: "schedule_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The level name is not valid",
              param: "name",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevelWrongLengthValues = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The level name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing a duplicate level name value", () => {
      it("should return an duplicate value error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "This level name already exists!",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /levels/:id - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /levels/:id - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();
        const newSchedule = {
          _id: validMockScheduleId,
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 1440,
          shiftNumberMinutes: 360,
          sessionUnitMinutes: 40,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertSchedule(newSchedule);
        const newLevel = {
          _id: validMockLevelId,
          school_id: otherValidMockId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing a level but not being updated", () => {
      it("should not update a field", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newSchedule = {
          _id: validMockScheduleId,
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 1440,
          shiftNumberMinutes: 360,
          sessionUnitMinutes: 40,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertSchedule(newSchedule);
        const newLevel = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /levels/:id - Passing a level correctly to update", () => {
      it("should update a level", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newSchedule = {
          _id: validMockScheduleId,
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 1440,
          shiftNumberMinutes: 360,
          sessionUnitMinutes: 40,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertSchedule(newSchedule);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("LEVEL - DELETE", () => {
    describe("DELETE - /levels/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
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
    describe("DELETE - /levels/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
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
    describe("DELETE - /levels/:id - Passing invalid ids", () => {
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
              msg: "The level id is not valid",
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
    describe("DELETE - /levels/:id - Passing a level id but not deleting it", () => {
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
          msg: "Level not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /levels/:id - Passing a level id correctly to delete", () => {
      it("should delete a field", async () => {
        // inputs
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Level deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
