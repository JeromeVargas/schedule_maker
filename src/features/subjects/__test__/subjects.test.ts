import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertField,
  insertLevel,
  insertManySubjects,
  insertSchool,
  insertSubject,
  removeAllFields,
  removeAllLevels,
  removeAllSchools,
  removeAllSubjects,
} from "../subjects.services";

import { SchoolStatus } from "../../../typings/types";

describe("Resource => SUBJECT", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllSubjects();
    await removeAllSchools();
    await removeAllLevels();
    await removeAllFields();
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
  const endPointUrl = `${BASE_URL}subjects/`;

  // test blocks
  describe("SUBJECT - POST", () => {
    describe("POST - /subjects - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubjectMissingValues = {
          school_i: validMockSchoolId,
          level_i: validMockLevelId,
          field_i: validMockFieldId,
          nam: "Mathematics 101",
          sessionUnit: 30,
          frequenc: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectMissingValues);

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
      });
    });
    describe("POST - /subjects - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // inputs
        const newSubjectEmptyValues = {
          school_id: "",
          level_id: "",
          field_id: "",
          name: "",
          sessionUnits: "",
          frequency: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectEmptyValues);

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
      });
    });
    describe("POST - /subjects - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newSubjectNotValidDataTypes = {
          school_id: invalidMockId,
          level_id: invalidMockId,
          field_id: invalidMockId,
          name: 92334428,
          sessionUnits: "hello",
          frequency: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectNotValidDataTypes);

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
      });
    });
    describe("POST - /subjects - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubjectWrongLengthValues = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          sessionUnits: 1234567890,
          frequency: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectWrongLengthValues);

        // assertions
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
      });
    });
    describe("POST - /subjects - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "This subject name already exists for this level",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /subjects - Passing a non-existent level in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /subjects - Passing a non-matching school id for the level in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /subjects - Passing a non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /subjects - Passing a non-matching school for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newField = {
          _id: validMockFieldId,
          school_id: otherValidMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /subjects - Passing a subject correctly to create", () => {
      it("should create a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Subject created!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("SUBJECTS - GET", () => {
    describe("GET - /subjects - Passing missing fields", () => {
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
    describe("GET - /subjects - passing fields with empty values", () => {
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
    describe("GET - /subjects - passing invalid ids", () => {
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
    describe("GET - /subjects - Requesting all subjects but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /subjects - Requesting all subjects correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSubjects = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
            name: "Mathematics 101",
            sessionUnits: 30,
            frequency: 2,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
            name: "Language 101",
            sessionUnits: 30,
            frequency: 2,
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            level_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
            name: "Physics 101",
            sessionUnits: 30,
            frequency: 2,
          },
        ];
        await insertManySubjects(newSubjects);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSubjects,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /subjects/:id - Passing missing fields", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /subjects/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /subjects/:id - Passing invalid ids", () => {
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
      });
    });
    describe("GET - /subjects/:id - Requesting a subject but not finding it", () => {
      it("should not get a school", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("GET - /subjects/:id - Requesting a subject correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newSubject,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SUBJECTS - PUT", () => {
    describe("PUT - /subjects/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubjectMissingValues = {
          school_i: validMockSchoolId,
          level_i: validMockLevelId,
          field_i: validMockFieldId,
          nam: "Mathematics 101",
          sessionUnit: 30,
          frequenc: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectMissingValues);

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
      });
    });
    describe("PUT - /subjects/:id - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const newSubjectEmptyValues = {
          school_id: "",
          level_id: "",
          field_id: "",
          name: "",
          sessionUnits: "",
          frequency: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectEmptyValues);

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
      });
    });
    describe("PUT - /subjects/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newSubjectNotValidDataTypes = {
          school_id: invalidMockId,
          level_id: invalidMockId,
          field_id: invalidMockId,
          name: 92334428,
          sessionUnits: "hello",
          frequency: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSubjectNotValidDataTypes);

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
      });
    });
    describe("PUT - /subjects/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubjectWrongLengthValues = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          sessionUnits: 1234567890,
          frequency: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectWrongLengthValues);

        // assertions
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
      });
    });
    describe("PUT - /subjects/:id - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "This subject name already exists for this level",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /subjects/:id - Passing a non-existent level in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /subjects/:id - Passing a non-matching school id for the level in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /subjects/:id - Passing a non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /subjects/:id - Passing a non-matching school id for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newField = {
          _id: validMockFieldId,
          school_id: otherValidMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /subjects/:id - Passing a subject but not being updated", () => {
      it("should not update a subject", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newSubject = {
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Subject not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /subjects/:id - Passing a subject correctly to update", () => {
      it("should update a subject", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockScheduleId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newLevel = {
          _id: validMockLevelId,
          school_id: validMockSchoolId,
          schedule_id: validMockScheduleId,
          name: "Level 001",
        };
        await insertLevel(newLevel);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions
        expect(body).toStrictEqual({
          msg: "Subject updated!",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SUBJECTS - DELETE", () => {
    describe("DELETE - /subjects/:id - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /subjects/:id - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /subjects/:id - Passing invalid ids", () => {
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
      });
    });
    describe("DELETE - /subjects/:id - Passing a subject id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

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
      });
    });
    describe("DELETE - /subjects/:id - Passing a subject id correctly to delete", () => {
      it("should delete a field", async () => {
        // inputs
        const validMockSubjectId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockLevelId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newSubject = {
          _id: validMockSubjectId,
          school_id: validMockSchoolId,
          level_id: validMockLevelId,
          field_id: validMockFieldId,
          name: "Mathematics 101",
          sessionUnits: 30,
          frequency: 2,
        };
        await insertSubject(newSubject);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Subject deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
