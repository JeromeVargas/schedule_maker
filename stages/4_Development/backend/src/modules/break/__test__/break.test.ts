import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as MongoServices from "../../../services/mongoServices";

import { Break } from "../../../typings/types";

describe("Schedule maker API", () => {
  /* mock services */
  // just one return
  const mockService = (payload: unknown, service: string) => {
    return (
      jest
        // @ts-ignore
        .spyOn(MongoServices, service)
        // @ts-ignore
        .mockReturnValue(payload)
    );
  };

  // hooks
  afterAll(() => {
    connection.close();
  });

  // resources testing
  describe("Resource => Break", () => {
    // end point url
    const endPointUrl = "/api/v1/breaks/";

    // inputs
    const validMockBreakId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockScheduleId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newBreak = {
      school_id: validMockSchoolId,
      schedule_id: validMockScheduleId,
      breakStart: 600,
      numberMinutes: 40,
    };
    const newBreakMissingValues = {
      school_i: validMockSchoolId,
      schedule_i: validMockScheduleId,
      breakStar: 600,
      numberMinute: 40,
    };
    const newBreakEmptyValues = {
      school_id: "",
      schedule_id: "",
      breakStart: "",
      numberMinutes: "",
    };
    const newBreakNotValidDataTypes = {
      school_id: 9769231419,
      schedule_id: 9769231419,
      breakStart: "hello",
      numberMinutes: "hello",
    };
    const newBreakWrongLengthValues = {
      school_id: validMockSchoolId,
      schedule_id: validMockScheduleId,
      breakStart: 1234567890,
      numberMinutes: 1234567890,
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "School 001",
      groupMaxNumStudents: 40,
    };
    const schedulePayload = {
      _id: validMockScheduleId,
      school_id: schoolPayload,
      name: "Schedule 001",
      dayStart: 420,
      shiftNumberMinutes: 360,
      classUnitMinutes: 40,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const scheduleNullPayload = null;
    const breakPayload = {
      _id: validMockBreakId,
      school_id: validMockSchoolId,
      schedule_id: validMockScheduleId,
      breakStart: 600,
      numberMinutes: 40,
    };
    const breakNullPayload = null;
    const breaksPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        schedule_id: new Types.ObjectId().toString(),
        breakStart: 600,
        numberMinutes: 40,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        schedule_id: new Types.ObjectId().toString(),
        breakStart: 600,
        numberMinutes: 20,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        schedule_id: new Types.ObjectId().toString(),
        breakStart: 600,
        numberMinutes: 30,
      },
    ];
    const breaksNullPayload: Break[] = [];

    // test blocks
    describe("POST /break ", () => {
      describe("break::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreakMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakMissingValues.schedule_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(
            newBreakMissingValues,
            "break"
          );
        });
      });
      describe("break::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreakEmptyValues);

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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakEmptyValues.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(
            newBreakEmptyValues,
            "break"
          );
        });
      });
      describe("break::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreakNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakNotValidDataTypes.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(
            newBreakNotValidDataTypes,
            "break"
          );
        });
      });
      describe("break::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreakWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakWrongLengthValues.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt ull-updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(
            newBreakWrongLengthValues,
            "break"
          );
        });
      });
      describe("break::post::05 - Passing break start after the 23:59 in the body", () => {
        it("should return a break start after the 23:59 error", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, breakStart: 1440 });

          // assertions
          expect(body).toStrictEqual({
            msg: "The school shift start must exceed 11:59 p.m.",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::06 - Passing an non-existent schedule in the body", () => {
        it("should return a non-existent schedule error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule exists",
          });
          expect(statusCode).toBe(404);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::07 - Passing non-matching school id value", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::08 - Passing a break start time that starts earlier than the school shift day start time", () => {
        it("should return a break start time error", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, breakStart: 419 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).not.toHaveBeenCalled();
          expect(insertBreak).not.toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::09 - Passing a break but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break not created!",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).toHaveBeenCalled();
          expect(insertBreak).toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::10 - Passing a break correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreak = mockService(breakPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break created!",
          });
          expect(statusCode).toBe(200);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreak).toHaveBeenCalled();
          expect(insertBreak).toHaveBeenCalledWith(newBreak, "break");
        });
      });
    });

    describe("GET /break ", () => {
      describe("break - GET", () => {
        describe("break::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findBreaks = mockService(
              breaksNullPayload,
              "findFilterAllResources"
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
            expect(findBreaks).not.toHaveBeenCalled();
            expect(findBreaks).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findBreaks = mockService(
              breaksNullPayload,
              "findFilterAllResources"
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
            expect(findBreaks).not.toHaveBeenCalled();
            expect(findBreaks).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findBreaks = mockService(
              breaksNullPayload,
              "findFilterAllResources"
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
            expect(findBreaks).not.toHaveBeenCalled();
            expect(findBreaks).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findBreaks = mockService(
              breaksNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({ msg: "No breaks found" });
            expect(statusCode).toBe(404);
            expect(findBreaks).toHaveBeenCalled();
            expect(findBreaks).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findBreaks = mockService(
              breaksPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual([
              {
                _id: expect.any(String),
                school_id: expect.any(String),
                schedule_id: expect.any(String),
                breakStart: 600,
                numberMinutes: 40,
              },
              {
                _id: expect.any(String),
                school_id: expect.any(String),
                schedule_id: expect.any(String),
                breakStart: 600,
                numberMinutes: 20,
              },
              {
                _id: expect.any(String),
                school_id: expect.any(String),
                schedule_id: expect.any(String),
                breakStart: 600,
                numberMinutes: 30,
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findBreaks).toHaveBeenCalled();
            expect(findBreaks).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
      });

      describe("break - GET/:id", () => {
        describe("break::get/:id::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findBreak = mockService(
              breakNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockBreakId}`)
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
            expect(findBreak).not.toHaveBeenCalled();
            expect(findBreak).not.toHaveBeenCalledWith(
              { _id: validMockBreakId, school_id: null },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findBreak = mockService(
              breakNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockBreakId}`)
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
            expect(findBreak).not.toHaveBeenCalled();
            expect(findBreak).not.toHaveBeenCalledWith(
              { _id: validMockBreakId, school_id: "" },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findBreak = mockService(
              breakNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${invalidMockId}`)
              .send({ school_id: invalidMockId });

            // assertions
            expect(body).toStrictEqual([
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
            ]);
            expect(statusCode).toBe(400);
            expect(findBreak).not.toHaveBeenCalled();
            expect(findBreak).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findBreak = mockService(
              breakNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Break not found",
            });
            expect(statusCode).toBe(404);
            expect(findBreak).toHaveBeenCalled();
            expect(findBreak).toHaveBeenCalledWith(
              { _id: otherValidMockId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findBreak = mockService(
              breakPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockBreakId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              _id: validMockBreakId,
              school_id: validMockSchoolId,
              schedule_id: validMockScheduleId,
              breakStart: 600,
              numberMinutes: 40,
            });
            expect(statusCode).toBe(200);
            expect(findBreak).toHaveBeenCalled();
            expect(findBreak).toHaveBeenCalledWith(
              { _id: validMockBreakId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
      });
    });

    describe("PUT /break ", () => {
      describe("break::put::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreakMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakMissingValues.schedule_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [
              { _id: validMockBreakId },
              { school_id: newBreakMissingValues.school_i },
            ],
            newBreakMissingValues,
            "break"
          );
        });
      });
      describe("break::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreakEmptyValues);

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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakEmptyValues.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [
              { _id: validMockBreakId },
              { school_id: newBreakEmptyValues.school_id },
            ],
            newBreakEmptyValues,
            "break"
          );
        });
      });
      describe("break::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newBreakNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakNotValidDataTypes.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [
              { _id: invalidMockId },
              { school_id: newBreakNotValidDataTypes.school_id },
            ],
            newBreakNotValidDataTypes,
            "break"
          );
        });
      });
      describe("break::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreakWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreakWrongLengthValues.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [
              { _id: validMockBreakId },
              { school_id: newBreakWrongLengthValues.school_id },
            ],
            newBreakWrongLengthValues,
            "break"
          );
        });
      });
      describe("break::put::05 - Passing break start after the 23:59 in the body", () => {
        it("should return a break start after the 23:59 error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(breakPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, breakStart: 1440 });

          // assertions
          expect(body).toStrictEqual({
            msg: "The school shift start must exceed 11:59 p.m.",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::06 - Passing an non-existent schedule in the body", () => {
        it("should return a non-existent schedule error", async () => {
          // mock services
          const findSchedule = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(breakPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule exists",
          });
          expect(statusCode).toBe(404);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::07 - Passing non-matching school", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(breakPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::08 - Passing a break start time that starts earlier than the school shift day start time", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(breakPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, breakStart: 419 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          });
          expect(statusCode).toBe(400);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).not.toHaveBeenCalled();
          expect(updateBreak).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::09 - Passing a break but not updating it because it does not match the filters", () => {
        it("should not update a break", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break not updated",
          });
          expect(statusCode).toBe(404);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).toHaveBeenCalled();
          expect(updateBreak).toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::10 - Passing a break correctly to update", () => {
        it("should update a break", async () => {
          // mock services
          const findSchedule = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreak = mockService(breakPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break updated!",
          });
          expect(statusCode).toBe(200);
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreak).toHaveBeenCalled();
          expect(updateBreak).toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: newBreak.school_id }],
            newBreak,
            "break"
          );
        });
      });
    });

    describe("DELETE /break ", () => {
      describe("break::delete::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteBreak = mockService(
            breakNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
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
          expect(deleteBreak).not.toHaveBeenCalled();
          expect(deleteBreak).not.toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: null },
            "break"
          );
        });
      });
      describe("break::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteBreak = mockService(
            breakNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
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
          expect(deleteBreak).not.toHaveBeenCalled();
          expect(deleteBreak).not.toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: "" },
            "break"
          );
        });
      });
      describe("break::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteBreak = mockService(
            breakNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(deleteBreak).not.toHaveBeenCalled();
          expect(deleteBreak).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "break"
          );
        });
      });
      describe("break::delete::04 - Passing a break id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteBreak = mockService(
            breakNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({ msg: "Break not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteBreak).toHaveBeenCalled();
          expect(deleteBreak).toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: otherValidMockId },
            "break"
          );
        });
      });
      describe("break::delete::05 - Passing a break id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteBreak = mockService(breakPayload, "deleteFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Break deleted" });
          expect(statusCode).toBe(200);
          expect(deleteBreak).toHaveBeenCalled();
          expect(deleteBreak).toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: validMockSchoolId },
            "break"
          );
        });
      });
    });
  });
});
