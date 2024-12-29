import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertSchedule,
  insertManySchedules,
  removeAllSchedules,
  insertSchool,
  removeAllSchools,
  insertLevel,
} from "../schedules.services";

import { NewSchool, SchoolStatus } from "../../../typings/types";

describe("Resource => SCHEDULE", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllSchedules();
    await removeAllSchools();
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
  const endPointUrl = `${BASE_URL}schedules/`;

  // test blocks
  describe("SCHEDULE - POST", () => {
    describe("POST - /schedules - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newScheduleMissingValues = {
          school_i: validMockSchoolId,
          nam: "Schedule 001",
          day_star: 420,
          shift_number_minute: 360,
          session_unit_minute: 40,
          monda: true,
          tuesda: true,
          wednesda: true,
          thursda: true,
          frida: true,
          saturda: true,
          sunda: true,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newScheduleMissingValues);

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
              msg: "Please add a schedule name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the school day start time",
              param: "dayStart",
            },
            {
              location: "body",
              msg: "Please add the school shift number of minutes",
              param: "shiftNumberMinutes",
            },
            {
              location: "body",
              msg: "Please add the session unit length",
              param: "sessionUnitMinutes",
            },
            {
              location: "body",
              msg: "Please confirm if Monday is a working day",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please confirm if Tuesday is a working day",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please confirm if Wednesday is a working day",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please confirm if Thursday is a working day",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please confirm if Friday is a working day",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please confirm if Saturday is a working day",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please confirm if Sunday is a working day",
              param: "sunday",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schedules - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const newScheduleEmptyValues = {
          school_id: "",
          name: "",
          dayStart: "",
          shiftNumberMinutes: "",
          sessionUnitMinutes: "",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newScheduleEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The schedule name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The day start field is empty",
              param: "dayStart",
              value: "",
            },
            {
              location: "body",
              msg: "The number of minutes field is empty",
              param: "shiftNumberMinutes",
              value: "",
            },
            {
              location: "body",
              msg: "The session unit length field is empty",
              param: "sessionUnitMinutes",
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
      });
    });
    describe("POST - /schedules - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newScheduleNotValidDataTypes = {
          school_id: invalidMockId,
          name: 432,
          dayStart: "hello",
          shiftNumberMinutes: "hello",
          sessionUnitMinutes: "hello",
          monday: "hello",
          tuesday: "hello",
          wednesday: "hello",
          thursday: "hello",
          friday: "hello",
          saturday: "hello",
          sunday: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newScheduleNotValidDataTypes);

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
              msg: "The schedule name is not valid",
              param: "name",
              value: 432,
            },
            {
              location: "body",
              msg: "day start value is not valid",
              param: "dayStart",
              value: "hello",
            },
            {
              location: "body",
              msg: "number of minutes value is not valid",
              param: "shiftNumberMinutes",
              value: "hello",
            },
            {
              location: "body",
              msg: "session unit length value is not valid",
              param: "sessionUnitMinutes",
              value: "hello",
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
      });
    });
    describe("POST - /schedules - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newScheduleWrongLengthValues = {
          school_id: validMockSchoolId,
          name: "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
          dayStart: 1234567890,
          shiftNumberMinutes: 1234567890,
          sessionUnitMinutes: 1234567890,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newScheduleWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The schedule name must not exceed 100 characters",
              param: "name",
              value:
                "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "dayStart",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "shiftNumberMinutes",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "sessionUnitMinutes",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schedules - Passing day start after the 23:59 in the body", () => {
      it("should return a day start after the 23:59 error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchedule = {
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "The school shift start must exceed 11:59 p.m.",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schedules - Passing a non-existent school in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please create the school first",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /schedules - Passing an already existing schedule name", () => {
      it("should return an existing schedule name", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        insertSchool(newSchool);
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "This schedule name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /schedules - Passing a schedule correctly to create", () => {
      it("should create a field", async () => {
        const validMockSchoolId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "Schedule created successfully!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("SCHEDULE - GET", () => {
    describe("GET - /schedules - Passing missing fields", () => {
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
    describe("GET - /schedules - passing fields with empty values", () => {
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
    describe("GET - /schedules - passing invalid ids", () => {
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
    describe("GET - /schedules - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No schedules found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /schedules - Requesting all fields correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newSchedules = [
          {
            _id: new Types.ObjectId().toString(),
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
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Schedule 002",
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
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Schedule 003",
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
          },
        ];
        await insertManySchedules(newSchedules);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSchedules,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /schedules/:id - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockScheduleId}`)
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
    describe("GET - /schedules/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockScheduleId}`)
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
    describe("GET - /schedules/:id - Passing invalid ids", () => {
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
              msg: "The schedule id is not valid",
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
    describe("GET - /schedules/:id - Requesting a field but not finding it", () => {
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
          msg: "Schedule not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /schedules/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        const validMockScheduleId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockScheduleId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSchedule,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SCHEDULE - PUT", () => {
    describe("PUT - /schedules/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newScheduleMissingValues = {
          school_i: validMockSchoolId,
          nam: "Schedule 001",
          day_star: 420,
          shift_number_minute: 360,
          session_unit_minute: 40,
          monda: true,
          tuesda: true,
          wednesda: true,
          thursda: true,
          frida: true,
          saturda: true,
          sunda: true,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newScheduleMissingValues);

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
              msg: "Please add a schedule name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the school day start time",
              param: "dayStart",
            },
            {
              location: "body",
              msg: "Please add the school shift number of minutes",
              param: "shiftNumberMinutes",
            },
            {
              location: "body",
              msg: "Please add the session unit length",
              param: "sessionUnitMinutes",
            },
            {
              location: "body",
              msg: "Please confirm if Monday is a working day",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please confirm if Tuesday is a working day",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please confirm if Wednesday is a working day",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please confirm if Thursday is a working day",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please confirm if Friday is a working day",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please confirm if Saturday is a working day",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please confirm if Sunday is a working day",
              param: "sunday",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schedules/:id - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const newScheduleEmptyValues = {
          school_id: "",
          name: "",
          dayStart: "",
          shiftNumberMinutes: "",
          sessionUnitMinutes: "",
          monday: "",
          tuesday: "",
          wednesday: "",
          thursday: "",
          friday: "",
          saturday: "",
          sunday: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newScheduleEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The schedule name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The day start field is empty",
              param: "dayStart",
              value: "",
            },
            {
              location: "body",
              msg: "The number of minutes field is empty",
              param: "shiftNumberMinutes",
              value: "",
            },
            {
              location: "body",
              msg: "The session unit length field is empty",
              param: "sessionUnitMinutes",
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
      });
    });
    describe("PUT - /schedules/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newScheduleNotValidDataTypes = {
          school_id: invalidMockId,
          name: 432,
          dayStart: "hello",
          shiftNumberMinutes: "hello",
          sessionUnitMinutes: "hello",
          monday: "hello",
          tuesday: "hello",
          wednesday: "hello",
          thursday: "hello",
          friday: "hello",
          saturday: "hello",
          sunday: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newScheduleNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The schedule id is not valid",
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
              msg: "The schedule name is not valid",
              param: "name",
              value: 432,
            },
            {
              location: "body",
              msg: "day start value is not valid",
              param: "dayStart",
              value: "hello",
            },
            {
              location: "body",
              msg: "number of minutes value is not valid",
              param: "shiftNumberMinutes",
              value: "hello",
            },
            {
              location: "body",
              msg: "session unit length value is not valid",
              param: "sessionUnitMinutes",
              value: "hello",
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
      });
    });
    describe("PUT - /schedules/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newScheduleWrongLengthValues = {
          school_id: validMockSchoolId,
          name: "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
          dayStart: 1234567890,
          shiftNumberMinutes: 1234567890,
          sessionUnitMinutes: 1234567890,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newScheduleWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The schedule name must not exceed 100 characters",
              param: "name",
              value:
                "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "dayStart",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "shiftNumberMinutes",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The day start time must not exceed 9 digits",
              param: "sessionUnitMinutes",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schedules/:id - Passing day start after the 23:59 in the body", () => {
      it("should return a day start after the 23:59 error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchedule = {
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "The school shift start must exceed 11:59 p.m.",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schedules/:id - Passing a schedule but not updating it because schedule name already exist", () => {
      it("should not update a schedule", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "This schedule name already exists!",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /schedules/:id - Passing a schedule but not updating it because it does not match the filters", () => {
      it("should not update a schedule", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({
          msg: "Schedule not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schedules/:id - Passing a schedule correctly to update", () => {
      it("should update a schedule", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockScheduleId}`)
          .send(newSchedule);

        // assertions
        expect(body).toStrictEqual({ msg: "Schedule updated", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SCHEDULE - DELETE", () => {
    describe("DELETE - /schedules/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const validMockScheduleId = new Types.ObjectId().toString();
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockScheduleId}`)
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
    describe("DELETE - /schedules/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockScheduleId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockScheduleId}`)
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
    describe("DELETE - /schedules/:id - Passing invalid ids", () => {
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
              msg: "The schedule id is not valid",
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
      });
    });
    describe("DELETE - /schedules/:id - Passing a schedule with levels still extending from it", () => {
      it("should return a conflict error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
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
        await insertLevel(newLevel);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockScheduleId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Schedule cannot be deleted because there are levels extending from it",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("DELETE - /schedules/:id - Passing a schedule id but not deleting it", () => {
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
          msg: "Schedule not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /schedules/:id - Passing a schedule id correctly to delete", () => {
      it("should delete a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
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

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockScheduleId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Schedule deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
