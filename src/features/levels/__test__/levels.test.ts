import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as levelServices from "../levels.services";

import { BASE_URL } from "../../../lib/router";

import type { Level } from "../../../typings/types";

type Service =
  | "insertLevel"
  | "findFilterAllLevels"
  | "findLevelByProperty"
  | "findFilterLevelByProperty"
  | "findPopulateLevelById"
  | "modifyFilterLevel"
  | "removeFilterLevel"
  | "findPopulateScheduleById";

describe("Resource => Level", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(levelServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}levels/`;

  /* inputs */
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockScheduleId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newLevel = {
    school_id: validMockSchoolId,
    schedule_id: validMockScheduleId,
    name: "Level 001",
  };
  const newLevelMissingValues = {
    school_i: validMockSchoolId,
    schedule_i: validMockScheduleId,
    nam: "Level 001",
  };
  const newLevelEmptyValues = {
    school_id: "",
    schedule_id: "",
    name: "",
  };
  const newLevelNotValidDataTypes = {
    school_id: invalidMockId,
    schedule_id: invalidMockId,
    name: 1234567890,
  };
  const newLevelWrongLengthValues = {
    school_id: validMockSchoolId,
    schedule_id: validMockScheduleId,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
  };

  /* payloads */
  const levelPayload = {
    _id: validMockLevelId,
    school_id: validMockSchoolId,
    schedule_id: validMockScheduleId,
    name: "Level 001",
  };
  const levelNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumberStudents: 40,
  };
  const schedulePayload = {
    _id: validMockScheduleId,
    school_id: schoolPayload,
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
  const scheduleNullPayload = null;
  const levelsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      schedule_id: new Types.ObjectId().toString(),
      name: "Mathematics",
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      schedule_id: new Types.ObjectId().toString(),
      name: "Language",
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      schedule_id: new Types.ObjectId().toString(),
      name: "Physics",
    },
  ];
  const levelsNullPayload: Level[] = [];

  // test blocks
  describe("POST /level ", () => {
    describe("level::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelMissingValues.school_i,
            name: newLevelMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelMissingValues.schedule_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelMissingValues
        );
      });
    });
    describe("level::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelEmptyValues.school_id,
            name: newLevelEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelEmptyValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel);
      });
    });
    describe("level::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelNotValidDataTypes.school_id,
            name: newLevelNotValidDataTypes.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes
        );
      });
    });
    describe("level::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelWrongLengthValues.school_id,
            name: newLevelWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues
        );
      });
    });
    describe("level::post::05 - Passing a duplicate level name value", () => {
      it("should return an duplicate value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelPayload, "insertLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel);
      });
    });
    describe("level::post::06 - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelPayload, "insertLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel);
      });
    });
    describe("level::post::07 - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newLevel, school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: otherValidMockId, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel);
      });
    });
    describe("level::post::08 - Passing a level but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelNullPayload, "insertLevel");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level not created!",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).toHaveBeenCalledWith(newLevel);
      });
    });
    describe("level::post::09 - Passing a level correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const insertLevelService = mockService(levelPayload, "insertLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertLevelService).toHaveBeenCalledWith(newLevel);
      });
    });
  });

  describe("GET /level ", () => {
    describe("level - GET", () => {
      describe("level::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
            "findFilterAllLevels"
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
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
            "findFilterAllLevels"
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
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
            "findFilterAllLevels"
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
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get::04 - Requesting all levels but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
            "findFilterAllLevels"
          );

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
          expect(findLevels).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get::05 - Requesting all levels correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findLevels = mockService(levelsPayload, "findFilterAllLevels");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ payload: levelsPayload, success: true });
          expect(statusCode).toBe(200);
          expect(findLevels).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("level - GET/:id", () => {
      describe("level::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findLevelByProperty"
          );

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
          expect(findLevel).not.toHaveBeenCalledWith(
            { school_id: null, _id: validMockLevelId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findLevelByProperty"
          );

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
          expect(findLevel).not.toHaveBeenCalledWith(
            { school_id: "", _id: validMockLevelId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findLevelByProperty"
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
          expect(findLevel).not.toHaveBeenCalledWith(
            { school_id: invalidMockId, _id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get/:id::04 - Requesting a level but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findLevelByProperty"
          );

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
          expect(findLevel).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, _id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("level::get/:id::05 - Requesting a level correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findLevel = mockService(levelPayload, "findLevelByProperty");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockLevelId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ payload: levelPayload, success: true });
          expect(statusCode).toBe(200);
          expect(findLevel).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, _id: validMockLevelId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /level ", () => {
    describe("level::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelNullPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelMissingValues.school_i,
            name: newLevelMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelMissingValues.schedule_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevelMissingValues.school_i },
          newLevelMissingValues
        );
      });
    });
    describe("level::put::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelNullPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelEmptyValues.school_id,
            name: newLevelEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelEmptyValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevelEmptyValues.school_id },
          newLevelEmptyValues
        );
      });
    });
    describe("level::put::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelNullPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelNotValidDataTypes.school_id,
            name: newLevelNotValidDataTypes.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: newLevelNotValidDataTypes },
          newLevelNotValidDataTypes
        );
      });
    });
    describe("level::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelNullPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelWrongLengthValues.school_id,
            name: newLevelWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          {
            _id: validMockLevelId,
            school_id: newLevelWrongLengthValues.school_id,
          },
          newLevelWrongLengthValues
        );
      });
    });
    describe("level::put::05 - Passing a duplicate value", () => {
      it("should return an duplicate value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevel.school_id },
          newLevel
        );
      });
    });
    describe("level::put::06 - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // mock services
        const duplicateLevelName = mockService([], "findFilterLevelByProperty");
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevel.school_id },
          newLevel
        );
      });
    });
    describe("level::put::07 - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelPayload, "modifyFilterLevel");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send({ ...newLevel, school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: otherValidMockId, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: otherValidMockId },
          newLevel
        );
      });
    });
    describe("level::put::08 - Passing a level but not being updated", () => {
      it("should not update a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelNullPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevel.school_id },
          newLevel
        );
      });
    });
    describe("level::put::09 - Passing a level correctly to update", () => {
      it("should update a level", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterLevelByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateScheduleById"
        );
        const updateLevel = mockService(levelPayload, "modifyFilterLevel");

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
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt"
        );
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateLevel).toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: newLevel.school_id },
          newLevel
        );
      });
    });
  });

  describe("DELETE /level ", () => {
    describe("level::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteLevel = mockService(levelNullPayload, "removeFilterLevel");

        // api call
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
        expect(deleteLevel).not.toHaveBeenCalledWith({
          school_id: null,
          _id: validMockLevelId,
        });
      });
    });
    describe("level::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteLevel = mockService(levelNullPayload, "removeFilterLevel");

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
        expect(deleteLevel).not.toHaveBeenCalledWith({
          school_id: "",
          _id: validMockLevelId,
        });
      });
    });
    describe("level::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteLevel = mockService(levelNullPayload, "removeFilterLevel");

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
        expect(deleteLevel).not.toHaveBeenCalledWith({
          school_id: invalidMockId,
          _id: invalidMockId,
        });
      });
    });

    describe("level::delete::04 - Passing a level id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteLevel = mockService(levelNullPayload, "removeFilterLevel");

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
        expect(deleteLevel).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: otherValidMockId,
        });
      });
    });
    describe("level::delete::05 - Passing a level id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteLevel = mockService(levelPayload, "removeFilterLevel");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Level deleted", success: true });
        expect(statusCode).toBe(200);
        expect(deleteLevel).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: validMockLevelId,
        });
      });
    });
  });
});
