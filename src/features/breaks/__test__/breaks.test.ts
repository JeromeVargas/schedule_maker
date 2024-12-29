import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  findAllBreaks,
  insertBreak,
  insertManyBreaks,
  removeAllBreaks,
  insertSchool,
  removeAllSchools,
  insertSchedule,
  removeAllSchedules,
} from "../breaks.services";

import { NewSchool, SchoolStatus } from "../../../typings/types";

describe("Resource => BREAK", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllBreaks();
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
  const endPointUrl = `${BASE_URL}breaks/`;

  // test blocks
  describe("BREAKS - POST", () => {
    describe("POST - /breaks - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreakMissingValues = {
          school_i: validMockSchoolId,
          schedule_i: validMockScheduleId,
          breakStar: 600,
          numberMinute: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreakMissingValues);

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
              msg: "Please add the break day start time",
              param: "breakStart",
            },
            {
              location: "body",
              msg: "Please add the break number of minutes",
              param: "numberMinutes",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const newBreakEmptyValues = {
          school_id: "",
          schedule_id: "",
          breakStart: "",
          numberMinutes: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreakEmptyValues);

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
              msg: "The start field is empty",
              param: "breakStart",
              value: "",
            },
            {
              location: "body",
              msg: "The break number of minutes field is empty",
              param: "numberMinutes",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const newBreakNotValidDataTypes = {
          school_id: 9769231419,
          schedule_id: 9769231419,
          breakStart: "hello",
          numberMinutes: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreakNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: 9769231419,
            },
            {
              location: "body",
              msg: "The schedule id is not valid",
              param: "schedule_id",
              value: 9769231419,
            },
            {
              location: "body",
              msg: "start value is not valid",
              param: "breakStart",
              value: "hello",
            },
            {
              location: "body",
              msg: "break number of minutes value is not valid",
              param: "numberMinutes",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreakWrongLengthValues = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 1234567890,
          numberMinutes: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreakWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The break start time must not exceed 9 digits",
              param: "breakStart",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The break number of minutes must not exceed 9 digits",
              param: "numberMinutes",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing break start after the 23:59 in the body", () => {
      it("should return a break start after the 23:59 error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 1440,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "The school shift start must exceed 11:59 p.m.",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /breaks - Passing non-matching school id value", () => {
      it("should return a non-matching school id error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
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
          dayStart: 420,
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
        const newBreak = {
          school_id: otherValidMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing a break start time that starts earlier than the school shift day start time", () => {
      it("should return a break start time error", async () => {
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
          dayStart: 420,
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
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 419,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /breaks - Passing a break correctly to create", () => {
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
          dayStart: 420,
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
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Break created!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });
  describe("BREAK - GET", () => {
    describe("GET - /breaks - Passing missing fields", () => {
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
    describe("GET - /breaks - passing fields with empty values", () => {
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
    describe("GET - /breaks - passing invalid ids", () => {
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
    describe("GET - /breaks - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No breaks found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /breaks - Requesting all fields correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newBreaks = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            breakStart: 600,
            numberMinutes: 40,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            breakStart: 600,
            numberMinutes: 20,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            schedule_id: new Types.ObjectId().toString(),
            breakStart: 600,
            numberMinutes: 30,
          },
        ];
        await insertManyBreaks(newBreaks);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newBreaks,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /breaks/:id - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockBreakId}`)
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
    describe("GET - /breaks/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockBreakId}`)
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
    describe("GET - /breaks/:id - Passing invalid ids", () => {
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
              msg: "The break id is not valid",
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
    describe("GET - /breaks/:id - Requesting a field but not finding it", () => {
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
          msg: "Break not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /breaks/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreak = {
          _id: validMockBreakId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };
        await insertBreak(newBreak);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockBreakId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newBreak,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });
  describe("BREAKS - PUT", () => {
    describe("PUT - /breaks/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreakMissingValues = {
          school_i: validMockSchoolId,
          schedule_i: validMockScheduleId,
          breakStar: 600,
          numberMinute: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreakMissingValues);

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
              msg: "Please add the break day start time",
              param: "breakStart",
            },
            {
              location: "body",
              msg: "Please add the break number of minutes",
              param: "numberMinutes",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const newBreakEmptyValues = {
          school_id: "",
          schedule_id: "",
          breakStart: "",
          numberMinutes: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreakEmptyValues);

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
              msg: "The start field is empty",
              param: "breakStart",
              value: "",
            },
            {
              location: "body",
              msg: "The break number of minutes field is empty",
              param: "numberMinutes",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newBreakNotValidDataTypes = {
          school_id: 9769231419,
          schedule_id: 9769231419,
          breakStart: "hello",
          numberMinutes: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newBreakNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The break id is not valid",
              param: "id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: 9769231419,
            },
            {
              location: "body",
              msg: "The schedule id is not valid",
              param: "schedule_id",
              value: 9769231419,
            },
            {
              location: "body",
              msg: "start value is not valid",
              param: "breakStart",
              value: "hello",
            },
            {
              location: "body",
              msg: "break number of minutes value is not valid",
              param: "numberMinutes",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreakWrongLengthValues = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 1234567890,
          numberMinutes: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreakWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The break start time must not exceed 9 digits",
              param: "breakStart",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The break start time must not exceed 9 digits",
              param: "numberMinutes",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing break start after the 23:59 in the body", () => {
      it("should return a break start after the 23:59 error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 1440,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "The school shift start must exceed 11:59 p.m.",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /breaks/:id - Passing non-matching school", () => {
      it("should return a non-matching school id error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
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
          dayStart: 420,
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
        const newBreak = {
          school_id: otherValidMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing a break start time that starts earlier than the school shift day start time", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockBreakId = new Types.ObjectId().toString();
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
          dayStart: 420,
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
        insertSchedule(newSchedule);
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 419,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing a break but not updating it because it does not match the filters", () => {
      it("should not update a break", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
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
          dayStart: 420,
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
        const newBreak = {
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Break not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /breaks/:id - Passing a break correctly to update", () => {
      it("should update a break", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
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
          dayStart: 420,
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
        const newBreak = {
          _id: validMockBreakId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };
        await insertBreak(newBreak);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockBreakId}`)
          .send(newBreak);

        // assertions
        expect(body).toStrictEqual({
          msg: "Break updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });
  describe("BREAKS - DELETE", () => {
    describe("DELETE - /break/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockBreakId}`)
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
    describe("DELETE - /break/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockBreakId}`)
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
    describe("DELETE - /break/:id - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockBreakId = "63c5dcac78b868f80035asdf";
        const invalidMockSchoolId = "63c5dca8f800sd35adc78b86";

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockBreakId}`)
          .send({ school_id: invalidMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The break id is not valid",
              param: "id",
              value: invalidMockBreakId,
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockSchoolId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /break/:id - Passing a break id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockBreakId}`)
          .send({ school_id: otherValidMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Break not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /break/:id - Passing a break id correctly to delete", () => {
      it("should delete a field", async () => {
        // inputs
        const validMockBreakId = new Types.ObjectId().toString();
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
          school_id: validMockSchoolId,
          name: "Schedule 001",
          dayStart: 420,
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
        const newBreak = {
          _id: validMockBreakId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          breakStart: 600,
          numberMinutes: 40,
        };
        await insertBreak(newBreak);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockBreakId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Break deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
