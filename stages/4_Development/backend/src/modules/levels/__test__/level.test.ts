import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as MongoServices from "../../../services/mongoServices";

import { Level } from "../../../typings/types";

describe("Resource => Level", () => {
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

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/levels/";

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
  const levelsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      name: "Mathematics",
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      name: "Language",
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
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
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelMissingValues);

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
            msg: "Please add a level name",
            param: "name",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelMissingValues.school_i,
            name: newLevelMissingValues.nam,
          },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelMissingValues.schedule_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelMissingValues,
          "level"
        );
      });
    });
    describe("level::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelEmptyValues);

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
            msg: "The level name field is empty",
            param: "name",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelEmptyValues.school_id,
            name: newLevelEmptyValues.name,
          },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelEmptyValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel, "level");
      });
    });
    describe("level::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelNotValidDataTypes);

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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelNotValidDataTypes.school_id,
            name: newLevelNotValidDataTypes.name,
          },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes,
          "level"
        );
      });
    });
    describe("level::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevelWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The level name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          {
            school_id: newLevelWrongLengthValues.school_id,
            name: newLevelWrongLengthValues.name,
          },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues,
          "level"
        );
      });
    });
    describe("level::post::05 - Passing a duplicate level name value", () => {
      it("should return an duplicate value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(levelPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "This level name already exists",
        });
        expect(statusCode).toBe(409);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel, "level");
      });
    });
    describe("level::post::06 - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(levelPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel, "level");
      });
    });
    describe("level::post::07 - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newLevel, school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: otherValidMockId, name: newLevel.name },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).not.toHaveBeenCalled();
        expect(insertLevelService).not.toHaveBeenCalledWith(newLevel, "level");
      });
    });
    describe("level::post::08 - Passing a level but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(
          levelNullPayload,
          "insertResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level not created!",
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).toHaveBeenCalled();
        expect(insertLevelService).toHaveBeenCalledWith(newLevel, "level");
      });
    });
    describe("level::post::09 - Passing a level correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelNullPayload,
          "findResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const insertLevelService = mockService(levelPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level created!",
        });
        expect(statusCode).toBe(200);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          { school_id: newLevel.school_id, name: newLevel.name },
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(insertLevelService).toHaveBeenCalled();
        expect(insertLevelService).toHaveBeenCalledWith(newLevel, "level");
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
          expect(findLevels).not.toHaveBeenCalled();
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
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
          expect(findLevels).not.toHaveBeenCalled();
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
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
          expect(findLevels).not.toHaveBeenCalled();
          expect(findLevels).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get::04 - Requesting all levels but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findLevels = mockService(
            levelsNullPayload,
            "findFilterAllResources"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({ msg: "No levels found" });
          expect(statusCode).toBe(404);
          expect(findLevels).toHaveBeenCalled();
          expect(findLevels).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get::05 - Requesting all levels correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findLevels = mockService(
            levelsPayload,
            "findFilterAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual(levelsPayload);
          expect(statusCode).toBe(200);
          expect(findLevels).toHaveBeenCalled();
          expect(findLevels).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt",
            "level"
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
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockLevelId}`)
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
          expect(findLevel).not.toHaveBeenCalled();
          expect(findLevel).not.toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: null },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockLevelId}`)
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
          expect(findLevel).not.toHaveBeenCalled();
          expect(findLevel).not.toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: "" },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
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
          ]);
          expect(statusCode).toBe(400);
          expect(findLevel).not.toHaveBeenCalled();
          expect(findLevel).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get/:id::04 - Requesting a level but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findLevel = mockService(
            levelNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            msg: "Level not found",
          });
          expect(statusCode).toBe(404);
          expect(findLevel).toHaveBeenCalled();
          expect(findLevel).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "-createdAt -updatedAt",
            "level"
          );
        });
      });
      describe("level::get/:id::05 - Requesting a level correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findLevel = mockService(levelPayload, "findResourceByProperty");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockLevelId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual(levelPayload);
          expect(statusCode).toBe(200);
          expect(findLevel).toHaveBeenCalled();
          expect(findLevel).toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: validMockSchoolId },
            "-createdAt -updatedAt",
            "level"
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
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(
          levelNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelMissingValues);

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
            msg: "Please add a level name",
            param: "name",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          [
            { school_id: newLevelMissingValues.school_i },
            { name: newLevelMissingValues.nam },
          ],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelMissingValues.schedule_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [
            { _id: validMockLevelId },
            { school_id: newLevelMissingValues.school_i },
          ],
          newLevelMissingValues,
          "level"
        );
      });
    });
    describe("level::put::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(
          levelNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelEmptyValues);

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
            msg: "The level name field is empty",
            param: "name",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          [
            { school_id: newLevelEmptyValues.school_id },
            { name: newLevelEmptyValues.name },
          ],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelEmptyValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [
            { _id: validMockLevelId },
            { school_id: newLevelEmptyValues.school_id },
          ],
          newLevelEmptyValues,
          "level"
        );
      });
    });
    describe("level::put::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(
          levelNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newLevelNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          [
            { school_id: newLevelNotValidDataTypes.school_id },
            { name: newLevelNotValidDataTypes.name },
          ],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelNotValidDataTypes.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [{ _id: invalidMockId }, { school_id: newLevelNotValidDataTypes }],
          newLevelNotValidDataTypes,
          "level"
        );
      });
    });
    describe("level::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(
          levelNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevelWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The level name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).not.toHaveBeenCalled();
        expect(duplicateLevelName).not.toHaveBeenCalledWith(
          [
            { school_id: newLevelWrongLengthValues.school_id },
            { name: newLevelWrongLengthValues.name },
          ],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevelWrongLengthValues.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [
            { _id: validMockLevelId },
            { school_id: newLevelWrongLengthValues.school_id },
          ],
          newLevelWrongLengthValues,
          "level"
        );
      });
    });
    describe("level::put::05 - Passing a duplicate value", () => {
      it("should return an duplicate value error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(levelPayload, "updateFilterResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "This level name already exists!",
        });
        expect(statusCode).toBe(409);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          [{ school_id: newLevel.school_id }, { name: newLevel.name }],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).not.toHaveBeenCalled();
        expect(findSchedule).not.toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [{ _id: validMockLevelId }, { school_id: newLevel.school_id }],
          newLevel,
          "level"
        );
      });
    });
    describe("level::put::06 - Passing a non-existent schedule in the body", () => {
      it("should return a non-existent schedule error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          scheduleNullPayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(levelPayload, "updateFilterResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          [{ school_id: newLevel.school_id }, { name: newLevel.name }],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [{ _id: validMockLevelId }, { school_id: newLevel.school_id }],
          newLevel,
          "level"
        );
      });
    });
    describe("level::put::07 - Passing a non matching school id", () => {
      it("should return a non matching school id error", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(levelPayload, "updateFilterResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send({ ...newLevel, school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the schedule belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          [{ school_id: otherValidMockId }, { name: newLevel.name }],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).not.toHaveBeenCalled();
        expect(updateLevel).not.toHaveBeenCalledWith(
          [{ _id: validMockLevelId }, { school_id: otherValidMockId }],
          newLevel,
          "level"
        );
      });
    });
    describe("level::put::08 - Passing a level but not being updated", () => {
      it("should not update a field", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(
          levelNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level not updated",
        });
        expect(statusCode).toBe(404);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          [{ school_id: newLevel.school_id }, { name: newLevel.name }],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).toHaveBeenCalled();
        expect(updateLevel).toHaveBeenCalledWith(
          [{ _id: validMockLevelId }, { school_id: newLevel.school_id }],
          newLevel,
          "level"
        );
      });
    });
    describe("level::put::09 - Passing a level correctly to update", () => {
      it("should update a level", async () => {
        // mock services
        const duplicateLevelName = mockService(
          levelsNullPayload,
          "findFilterResourceByProperty"
        );
        const findSchedule = mockService(
          schedulePayload,
          "findPopulateResourceById"
        );
        const updateLevel = mockService(levelPayload, "updateFilterResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockLevelId}`)
          .send(newLevel);

        // assertions
        expect(body).toStrictEqual({
          msg: "Level updated!",
        });
        expect(statusCode).toBe(200);
        expect(duplicateLevelName).toHaveBeenCalled();
        expect(duplicateLevelName).toHaveBeenCalledWith(
          [{ school_id: newLevel.school_id }, { name: newLevel.name }],
          "-createdAt -updatedAt",
          "level"
        );
        expect(findSchedule).toHaveBeenCalled();
        expect(findSchedule).toHaveBeenCalledWith(
          newLevel.schedule_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "schedule"
        );
        expect(updateLevel).toHaveBeenCalled();
        expect(updateLevel).toHaveBeenCalledWith(
          [{ _id: validMockLevelId }, { school_id: newLevel.school_id }],
          newLevel,
          "level"
        );
      });
    });
  });

  describe("DELETE /level ", () => {
    describe("level::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteLevel = mockService(
          levelNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
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
        expect(deleteLevel).not.toHaveBeenCalled();
        expect(deleteLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: null },
          "level"
        );
      });
    });
    describe("level::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteLevel = mockService(
          levelNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
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
        expect(deleteLevel).not.toHaveBeenCalled();
        expect(deleteLevel).not.toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: "" },
          "level"
        );
      });
    });
    describe("level::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteLevel = mockService(
          levelNullPayload,
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
        ]);
        expect(statusCode).toBe(400);
        expect(deleteLevel).not.toHaveBeenCalled();
        expect(deleteLevel).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: invalidMockId },
          "level"
        );
      });
    });
    describe("level::delete::04 - Passing a level id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteLevel = mockService(
          levelNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({ msg: "Level not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteLevel).toHaveBeenCalled();
        expect(deleteLevel).toHaveBeenCalledWith(
          { _id: otherValidMockId, school_id: validMockSchoolId },
          "level"
        );
      });
    });
    describe("level::delete::05 - Passing a level id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteLevel = mockService(levelPayload, "deleteFilterResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockLevelId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Level deleted" });
        expect(statusCode).toBe(200);
        expect(deleteLevel).toHaveBeenCalled();
        expect(deleteLevel).toHaveBeenCalledWith(
          { _id: validMockLevelId, school_id: validMockSchoolId },
          "level"
        );
      });
    });
  });
});
