import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertField,
  removeAllFields,
  insertSchool,
  removeAllSchools,
  insertManyFields,
} from "../fields.services";

import { NewSchool, SchoolStatus } from "../../../typings/types";

describe("RESOURCE => FIELDS", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllFields();
    await removeAllSchools();
    // await removeAllSchedules();
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
  const endPointUrl = `${BASE_URL}fields/`;

  // test blocks
  describe("FIELDS - POST", () => {
    describe("POST - /fields - Passing a field with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newFieldMissingValues = {
          school_i: validMockSchoolId,
          nam: "Mathematics",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldMissingValues);

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
              msg: "Please add a field name",
              param: "name",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /fields - Passing a field with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newFieldEmptyValues = {
          school_id: "",
          name: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldEmptyValues);

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
              msg: "The field name is empty",
              param: "name",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /fields - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newFieldNotValidDataTypes = {
          school_id: invalidMockId,
          name: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldNotValidDataTypes);

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
              msg: "The field name is not valid",
              param: "name",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /fields - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newFieldWrongLengthValues = {
          school_id: validMockSchoolId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The field name must not exceed 100 characters",
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
    describe("POST - /fields - Passing a non-existent school in the body", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newField = {
          school_id: validMockSchoolId,
          name: "Mathematics",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the school exists",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /fields - Passing an existing field name", () => {
      it("should return a duplicate field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newField = {
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "This field name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /fields - Passing a field correctly to create", () => {
      it("should create a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newField = {
          school_id: validMockSchoolId,
          name: "Mathematics",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Field created successfully!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("FIELDS - GET", () => {
    describe("GET - /fields - passing a field with missing values", () => {
      it("should return a missing values error", async () => {
        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send();

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
    describe("GET - /fields - passing a field with empty values", () => {
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
    describe("GET - /fields - passing and invalid school id", () => {
      it("should get all fields", async () => {
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
    describe("GET - /fields - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No fields found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /fields - Requesting all fields correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newFields = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Mathematics",
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Language",
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            name: "Physics",
          },
        ];
        await insertManyFields(newFields);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newFields,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /fields/:id - Passing a field with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockFieldId}`)
          .send();

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
    describe("GET - /fields/:id - Passing a field with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockFieldId}`)
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
    describe("GET - /fields/:id - Passing an invalid field and school ids in the url", () => {
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
              msg: "The field id is not valid",
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
    describe("GET - /fields/:id - Requesting a field but not finding it", () => {
      it("should not get a school", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const validMockSchoolId = new Types.ObjectId().toString();
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Field not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /fields/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockFieldId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newField,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("FIELDS - PUT", () => {
    describe("PUT - /fields/:id - Passing a field with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newFieldMissingValues = {
          school_i: validMockSchoolId,
          nam: "Mathematics",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldMissingValues);

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
              msg: "Please add a field name",
              param: "name",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /fields/:id - Passing a field with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();
        const newFieldEmptyValues = {
          school_id: "",
          name: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldEmptyValues);

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
              msg: "The name field is empty",
              param: "name",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /fields/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newFieldNotValidDataTypes = {
          school_id: invalidMockId,
          name: 1234567890,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newFieldNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The field id is not valid",
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
              msg: "The field name is not valid",
              param: "name",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /fields/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newFieldWrongLengthValues = {
          school_id: validMockSchoolId,
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
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
    describe("PUT - /fields/:id - Passing a field but not updating it because the field name, already exists for the school", () => {
      it("should not update a field", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newField = {
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "This field name already exists!",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /fields/:id - Passing a field but not updating it because it does not match one of the filters", () => {
      it("should not update a field", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newField = {
          school_id: validMockSchoolId,
          name: "Mathematics",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Field not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /fields/:id - Passing a field correctly to update", () => {
      it("should update a field", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({ msg: "Field updated", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("FIELDS - DELETE", () => {
    describe("DELETE - /fields/:id - Passing a field with missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
          .send();

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
    describe("DELETE - /fields/:id - Passing a field with empty fields", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
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
    describe("DELETE - /fields/:id - Passing an invalid field and school ids", () => {
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
              msg: "The field id is not valid",
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
    describe("DELETE - /fields/:id - Passing a field id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Field not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /fields/:id - Passing a field id correctly to delete", () => {
      it("should delete a field", async () => {
        // inputs
        const validMockFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
          .send({ school_id: validMockSchoolId, success: true });

        // assertions
        expect(body).toStrictEqual({ msg: "Field deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
