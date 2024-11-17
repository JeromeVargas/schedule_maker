import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as subjectServices from "../subjects.services";

import { BASE_URL } from "../../../lib/router";

import type { Subject } from "../../../typings/types";

type Service =
  | "insertSubject"
  | "findFilterAllSubjects"
  | "findSubjectByProperty"
  | "findFilterSubjectByProperty"
  | "modifyFilterSubject"
  | "removeFilterSubject"
  | "findPopulateLevelById"
  | "findPopulateFieldById";

describe("Resource => subject", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(subjectServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}subjects/`;

  /* inputs */
  const validMockSubjectId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockScheduleId = new Types.ObjectId().toString();
  const validMockFieldId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newSubject = {
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    field_id: validMockFieldId,
    name: "Mathematics 101",
    sessionUnits: 30,
    frequency: 2,
  };
  const newSubjectMissingValues = {
    school_i: validMockSchoolId,
    level_i: validMockLevelId,
    field_i: validMockFieldId,
    nam: "Mathematics 101",
    sessionUnit: 30,
    frequenc: 2,
  };
  const newSubjectEmptyValues = {
    school_id: "",
    level_id: "",
    field_id: "",
    name: "",
    sessionUnits: "",
    frequency: "",
  };
  const newSubjectNotValidDataTypes = {
    school_id: invalidMockId,
    level_id: invalidMockId,
    field_id: invalidMockId,
    name: 92334428,
    sessionUnits: "hello",
    frequency: "hello",
  };
  const newSubjectWrongLengthValues = {
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    field_id: validMockFieldId,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
    sessionUnits: 1234567890,
    frequency: 1234567890,
  };

  /* payloads */
  const subjectPayload = {
    _id: validMockSubjectId,
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    field_id: validMockFieldId,
    name: "Mathematics 101",
    sessionUnits: 30,
    frequency: 2,
  };
  const subjectNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "school 001",
    levelMaxNumStudents: 40,
  };
  const levelPayload = {
    _id: validMockLevelId,
    school_id: schoolPayload,
    schedule_id: validMockScheduleId,
    name: "Level 001",
    numberStudents: 40,
  };
  const fieldPayload = {
    _id: validMockFieldId,
    school_id: schoolPayload,
    name: "Mathematics",
  };
  const fieldNullPayload = null;
  const levelNullPayload = null;
  const subjectsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Mathematics 101",
      sessionUnits: 30,
      frequency: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Language 101",
      sessionUnits: 30,
      frequency: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      level_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Physics 101",
      sessionUnits: 30,
      frequency: 2,
    },
  ];
  const subjectsNullPayload: Subject[] = [];

  // test blocks
  describe("POST /subject ", () => {
    describe("subject::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectMissingValues);

        // assertions;
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
              msg: "Please add the field id",
              param: "field_id",
            },
            {
              location: "body",
              msg: "Please add a subject name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the number of session units",
              param: "sessionUnits",
            },
            {
              location: "body",
              msg: "Please add the subject session frequency",
              param: "frequency",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectMissingValues.level_i,
            name: newSubjectMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectMissingValues.level_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubjectMissingValues);
      });
    });
    describe("subject::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectEmptyValues);

        // assertions;
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
              msg: "The field id field is empty",
              param: "field_id",
              value: "",
            },
            {
              location: "body",
              msg: "The subject name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The number of session units field is empty",
              param: "sessionUnits",
              value: "",
            },
            {
              location: "body",
              msg: "The subject session frequency field is empty",
              param: "frequency",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectEmptyValues.level_id,
            name: newSubjectEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectEmptyValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubjectEmptyValues);
      });
    });
    describe("subject::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectNotValidDataTypes);

        // assertions;
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
              msg: "The field id is not valid",
              param: "field_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The subject name is not valid",
              param: "name",
              value: 92334428,
            },
            {
              location: "body",
              msg: "number of session units value is not valid",
              param: "sessionUnits",
              value: "hello",
            },
            {
              location: "body",
              msg: "subject session frequency value is not valid",
              param: "frequency",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectNotValidDataTypes.level_id,
            name: newSubjectNotValidDataTypes.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes
        );
      });
    });
    describe("subject::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectWrongLengthValues);

        // assertions;
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The subject name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The number of session units must not exceed 9 digits",
              param: "sessionUnits",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The subject session frequency must not exceed 9 digits",
              param: "frequency",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectWrongLengthValues.level_id,
            name: newSubjectWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues
        );
      });
    });
    describe("subject::post::05 - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "This subject name already exists for this level",
          success: false,
        });
        expect(statusCode).toBe(409);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::06 - Passing a non-existent level in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::07 - Passing a non-matching school id for the level in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(
          { ...levelPayload, school_id: otherValidMockId },
          "findPopulateLevelById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::08 - Passing a non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::09 - Passing a non-matching school for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(
          { ...fieldPayload, school_id: otherValidMockId },
          "findPopulateFieldById"
        );
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::10 - Passing a subject but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertSubject = mockService(subjectNullPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject not created!",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).toHaveBeenCalledWith(newSubject);
      });
    });
    describe("subject::post::11 - Passing a subject correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertSubject = mockService(subjectPayload, "insertSubject");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject created!",
          success: true,
        });
        expect(statusCode).toBe(201);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertSubject).toHaveBeenCalledWith(newSubject);
      });
    });
  });

  describe("GET /subject ", () => {
    describe("subject - GET", () => {
      describe("subject::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
            "findFilterAllSubjects"
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
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
            "findFilterAllSubjects"
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
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
            "findFilterAllSubjects"
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
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get::04 - Requesting all subjects but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
            "findFilterAllSubjects"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "No subjects found",
            success: false,
          });
          expect(statusCode).toBe(404);
          expect(findSubjects).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get::05 - Requesting all subjects correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsPayload,
            "findFilterAllSubjects"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            payload: subjectsPayload,
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findSubjects).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("subject - GET/:id", () => {
      describe("subject::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findSubjectByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
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
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findSubjectByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
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
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findSubjectByProperty"
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
                msg: "The subject id is not valid",
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
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get/:id::04 - Requesting a subject but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findSubjectByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Subject not found",
            success: false,
          });
          expect(statusCode).toBe(404);
          expect(findSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("subject::get/:id::05 - Requesting a subject correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findSubject = mockService(
            subjectPayload,
            "findSubjectByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            payload: subjectPayload,
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /subject ", () => {
    describe("subject::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          levelNullPayload,
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectMissingValues);

        // assertions;
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
              msg: "Please add the field id",
              param: "field_id",
            },
            {
              location: "body",
              msg: "Please add a subject name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the number of session units",
              param: "sessionUnits",
            },
            {
              location: "body",
              msg: "Please add the subject session frequency",
              param: "frequency",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectMissingValues.level_i,
            name: newSubjectMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectMissingValues.level_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          {
            _id: validMockSubjectId,
            school_id: newSubjectMissingValues.school_i,
          },
          newSubject
        );
      });
    });
    describe("subject::put::02 - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectEmptyValues);

        // assertions;
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
              msg: "The field id field is empty",
              param: "field_id",
              value: "",
            },
            {
              location: "body",
              msg: "The subject name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The number of session units field is empty",
              param: "sessionUnits",
              value: "",
            },
            {
              location: "body",
              msg: "The subject session frequency field is empty",
              param: "frequency",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectEmptyValues.level_id,
            name: newSubjectEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectEmptyValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          {
            _id: validMockSubjectId,
            school_id: newSubjectEmptyValues.school_id,
          },
          newSubjectEmptyValues
        );
      });
    });
    describe("subject::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSubjectNotValidDataTypes);

        // assertions;
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The subject id is not valid",
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
              msg: "The field id is not valid",
              param: "field_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The subject name is not valid",
              param: "name",
              value: 92334428,
            },
            {
              location: "body",
              msg: "number of session units value is not valid",
              param: "sessionUnits",
              value: "hello",
            },
            {
              location: "body",
              msg: "subject session frequency value is not valid",
              param: "frequency",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectNotValidDataTypes.level_id,
            name: newSubjectNotValidDataTypes.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          {
            _id: invalidMockId,
            school_id: newSubjectNotValidDataTypes.school_id,
          },
          newSubjectNotValidDataTypes
        );
      });
    });
    describe("subject::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectWrongLengthValues);

        // assertions;
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The subject name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The number of session units must not exceed 9 digits",
              param: "sessionUnits",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The subject session frequency must not exceed 9 digits",
              param: "frequency",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            level_id: newSubjectWrongLengthValues.level_id,
            name: newSubjectWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          {
            _id: validMockSubjectId,
            school_id: newSubjectWrongLengthValues.level_id,
          },
          newSubjectWrongLengthValues
        );
      });
    });
    describe("subject::put::05 - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "This subject name already exists for this level",
          success: false,
        });
        expect(statusCode).toBe(409);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: newSubject.school_id },
          newSubject
        );
      });
    });
    describe("subject::put::06 - Passing a non-existent level in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: newSubject.school_id },
          newSubject
        );
      });
    });
    describe("subject::put::07 - Passing a non-matching school for the level in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(
          { ...levelPayload, school_id: otherValidMockId },
          "findPopulateLevelById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: validMockLevelId, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: otherValidMockId },
          newSubject
        );
      });
    });
    describe("subject::put::08 - Passing a non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: newSubject.school_id },
          newSubject
        );
      });
    });
    describe("subject::put::09 - Passing a non-matching school for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(
          { ...fieldPayload, school_id: otherValidMockId },
          "findPopulateFieldById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: validMockLevelId, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: otherValidMockId },
          newSubject
        );
      });
    });
    describe("subject::put::10 - Passing a subject but not being created", () => {
      it("should not update a subject", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateSubject = mockService(
          subjectNullPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).toHaveBeenCalledWith(
          {
            _id: validMockSubjectId,
            school_id: newSubject.school_id,
            level_id: newSubject.level_id,
          },
          newSubject
        );
      });
    });
    describe("subject::put::11 - Passing a subject correctly to update", () => {
      it("should update a subject", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterSubjectByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateSubject = mockService(
          subjectPayload,
          "modifyFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;f
        expect(body).toStrictEqual({
          msg: "Subject updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { level_id: newSubject.level_id, name: newSubject.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalledWith(
          newSubject.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalledWith(
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateSubject).toHaveBeenCalledWith(
          {
            _id: validMockSubjectId,
            school_id: newSubject.school_id,
            level_id: newSubject.level_id,
          },
          newSubject
        );
      });
    });
  });

  describe("DELETE /subject ", () => {
    describe("subject::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "removeFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
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
        expect(deleteSubject).not.toHaveBeenCalledWith({
          _id: validMockSubjectId,
          school_id: null,
        });
      });
    });
    describe("subject::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "removeFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
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
        expect(deleteSubject).not.toHaveBeenCalledWith({
          _id: validMockSubjectId,
          school_id: "",
        });
      });
    });
    describe("subject::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "removeFilterSubject"
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
              msg: "The subject id is not valid",
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
        expect(deleteSubject).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("subject::delete::04 - Passing a subject id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "removeFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Subject not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(deleteSubject).toHaveBeenCalledWith({
          _id: validMockSubjectId,
          school_id: otherValidMockId,
        });
      });
    });
    describe("subject::delete::05 - Passing a subject id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectPayload,
          "removeFilterSubject"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Subject deleted", success: true });
        expect(statusCode).toBe(200);
        expect(deleteSubject).toHaveBeenCalledWith({
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
