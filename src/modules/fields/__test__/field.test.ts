import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as fieldServices from "../fieldServices";

import { Field } from "../../../typings/types";

type Service =
  | "insertField"
  | "findFilterAllFields"
  | "findFieldByProperty"
  | "findFilterFieldByProperty"
  | "modifyFilterField"
  | "removeFilterField"
  | "findSchoolById";

describe("RESOURCE => Field", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(fieldServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/fields/";

  /* inputs */
  const validMockFieldId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newField = {
    school_id: validMockSchoolId,
    name: "Mathematics",
  };
  const newFieldMissingValues = {
    school_i: validMockSchoolId,
    nam: "Mathematics",
  };
  const newFieldEmptyValues = {
    school_id: "",
    name: "",
  };
  const newFieldNotValidDataTypes = {
    school_id: invalidMockId,
    name: 1234567890,
  };
  const newFieldWrongLengthValues = {
    school_id: validMockSchoolId,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
  };
  /* payloads */
  const fieldPayload = {
    _id: validMockFieldId,
    school_id: validMockSchoolId,
    name: "Mathematics",
  };
  const fieldNullPayload = null;
  const fieldsPayload = [
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
  const fieldsNullPayload: Field[] = [];

  // test blocks
  describe("POST /field ", () => {
    describe("field::post::01 - Passing a field with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const findSchool = mockService(fieldNullPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFilterFieldByProperty"
        );
        const insertField = mockService(fieldNullPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldMissingValues);

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          newFieldMissingValues.school_i,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).not.toHaveBeenCalled();
        expect(duplicateField).not.toHaveBeenCalledWith(
          {
            school_id: newFieldMissingValues.school_i,
            name: newFieldMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newFieldMissingValues);
      });
    });
    describe("field::post::02 - Passing a field with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findSchool = mockService(fieldNullPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFilterFieldByProperty"
        );
        const insertField = mockService(fieldNullPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldEmptyValues);

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
            msg: "The field name is empty",
            param: "name",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          newFieldEmptyValues.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).not.toHaveBeenCalled();
        expect(duplicateField).not.toHaveBeenCalledWith(
          {
            school_id: newFieldEmptyValues.school_id,
            name: newFieldEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newFieldEmptyValues);
      });
    });
    describe("field::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const findSchool = mockService(fieldNullPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFilterFieldByProperty"
        );
        const insertField = mockService(fieldNullPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldNotValidDataTypes);

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
            msg: "The field name is not valid",
            param: "name",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          newFieldNotValidDataTypes.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).not.toHaveBeenCalled();
        expect(duplicateField).not.toHaveBeenCalledWith(
          {
            school_id: newFieldNotValidDataTypes.school_id,
            name: newField.name,
          },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newFieldNotValidDataTypes);
      });
    });
    describe("field::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findSchool = mockService(fieldNullPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFilterFieldByProperty"
        );
        const insertField = mockService(fieldNullPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newFieldWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The field name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          newFieldWrongLengthValues.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).not.toHaveBeenCalled();
        expect(duplicateField).not.toHaveBeenCalledWith(
          {
            school_id: newFieldWrongLengthValues.school_id,
            name: newFieldWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newField);
      });
    });
    describe("field::post::05 - Passing an non-existent school in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSchool = mockService(fieldNullPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFilterFieldByProperty"
        );
        const insertField = mockService(fieldPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the school exists",
        });
        expect(statusCode).toBe(400);
        expect(findSchool).toHaveBeenCalled();
        expect(findSchool).toHaveBeenCalledWith(
          newField.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).not.toHaveBeenCalled();
        expect(duplicateField).not.toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newField);
      });
    });
    describe("field::post::06 - Passing an existing field name", () => {
      it("should return a duplicate field error", async () => {
        // mock services
        const findSchool = mockService(fieldPayload, "findSchoolById");
        const duplicateField = mockService(fieldPayload, "findFieldByProperty");
        const insertField = mockService(fieldPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({ msg: "This field name already exists" });
        expect(statusCode).toBe(409);
        expect(findSchool).toHaveBeenCalled();
        expect(findSchool).toHaveBeenCalledWith(
          newField.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).toHaveBeenCalled();
        expect(duplicateField).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(insertField).not.toHaveBeenCalled();
        expect(insertField).not.toHaveBeenCalledWith(newField);
      });
    });
    describe("field::post::07 - Passing a field but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const findSchool = mockService(fieldPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFieldByProperty"
        );
        const insertField = mockService(fieldNullPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({ msg: "Field not created!" });
        expect(statusCode).toBe(400);
        expect(findSchool).toHaveBeenCalled();
        expect(findSchool).toHaveBeenCalledWith(
          newField.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).toHaveBeenCalled();
        expect(duplicateField).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(insertField).toHaveBeenCalled();
        expect(insertField).toHaveBeenCalledWith(newField);
      });
    });
    describe("field::post::08 - Passing a field correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const findSchool = mockService(fieldPayload, "findSchoolById");
        const duplicateField = mockService(
          fieldNullPayload,
          "findFieldByProperty"
        );
        const insertField = mockService(fieldPayload, "insertField");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({ msg: "Field created successfully!" });
        expect(statusCode).toBe(201);
        expect(findSchool).toHaveBeenCalled();
        expect(findSchool).toHaveBeenCalledWith(
          newField.school_id,
          "-createdAt -updatedAt"
        );
        expect(duplicateField).toHaveBeenCalled();
        expect(duplicateField).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(insertField).toHaveBeenCalled();
        expect(insertField).toHaveBeenCalledWith(newField);
      });
    });
  });

  describe("GET /field ", () => {
    describe("field - GET", () => {
      describe("field::get::01 - passing a field with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findFields = mockService(
            fieldsNullPayload,
            "findFilterAllFields"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findFields).not.toHaveBeenCalled();
          expect(findFields).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get::02 - passing a field with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findFields = mockService(
            fieldsNullPayload,
            "findFilterAllFields"
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
          expect(findFields).not.toHaveBeenCalled();
          expect(findFields).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get::03 - passing and invalid school id", () => {
        it("should get all fields", async () => {
          // mock services
          const findFields = mockService(
            fieldsNullPayload,
            "findFilterAllFields"
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
          expect(findFields).not.toHaveBeenCalled();
          expect(findFields).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get::04 - Requesting all fields but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findFields = mockService(
            fieldsNullPayload,
            "findFilterAllFields"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "No fields found",
          });
          expect(statusCode).toBe(404);
          expect(findFields).toHaveBeenCalled();
          expect(findFields).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get::05 - Requesting all fields correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findFields = mockService(fieldsPayload, "findFilterAllFields");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual([
            {
              _id: expect.any(String),
              name: "Mathematics",
              school_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              name: "Language",
              school_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              name: "Physics",
              school_id: expect.any(String),
            },
          ]);
          expect(statusCode).toBe(200);
          expect(findFields).toHaveBeenCalled();
          expect(findFields).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("field - GET/:id", () => {
      describe("field::get/:id::01 - Passing a field with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockFieldId}`)
            .send();

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get/:id::02 - Passing a field with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockFieldId}`)
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
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get/:id::03 - Passing an invalid field and school ids in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get/:id::04 - Requesting a field but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Field not found",
          });
          expect(statusCode).toBe(404);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("field::get/:id::05 - Requesting a field correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findField = mockService(fieldPayload, "findFieldByProperty");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            _id: validMockFieldId,
            school_id: validMockSchoolId,
            name: "Mathematics",
          });
          expect(statusCode).toBe(200);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /field ", () => {
    describe("field::put::01 - Passing a field with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldMissingValues);

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateFieldName).not.toHaveBeenCalled();
        expect(duplicateFieldName).not.toHaveBeenCalledWith(
          {
            school_id: newFieldMissingValues.school_i,
            name: newFieldMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(updateField).not.toHaveBeenCalled();
        expect(updateField).not.toHaveBeenCalledWith(
          { school_id: newFieldMissingValues.school_i, _id: validMockFieldId },
          newFieldMissingValues
        );
      });
    });
    describe("field::put::02 - Passing a field with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldEmptyValues);

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
            msg: "The name field is empty",
            param: "name",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateFieldName).not.toHaveBeenCalled();
        expect(duplicateFieldName).not.toHaveBeenCalledWith(
          {
            school_id: newFieldEmptyValues.school_id,
            name: newFieldEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(updateField).not.toHaveBeenCalled();
        expect(updateField).not.toHaveBeenCalledWith(
          { _id: validMockFieldId },
          { school_id: newFieldEmptyValues.school_id },
          newFieldEmptyValues
        );
      });
    });
    describe("field::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newFieldNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateFieldName).not.toHaveBeenCalled();
        expect(duplicateFieldName).not.toHaveBeenCalledWith(
          {
            school_id: newFieldNotValidDataTypes.school_id,
            name: newFieldNotValidDataTypes.name,
          },
          "-createdAt -updatedAt"
        );
        expect(updateField).not.toHaveBeenCalled();
        expect(updateField).not.toHaveBeenCalledWith(
          [
            { _id: validMockFieldId },
            { school_id: newFieldNotValidDataTypes.school_id },
          ],
          newFieldNotValidDataTypes
        );
      });
    });
    describe("field::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newFieldWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateFieldName).not.toHaveBeenCalled();
        expect(duplicateFieldName).not.toHaveBeenCalledWith(
          {
            school_id: newFieldWrongLengthValues.school_id,
            name: newFieldWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(updateField).not.toHaveBeenCalled();
        expect(updateField).not.toHaveBeenCalledWith(
          {
            _id: validMockFieldId,
            school_id: newFieldWrongLengthValues.school_id,
          },
          newFieldWrongLengthValues
        );
      });
    });
    describe("field::put::05 - Passing a field but not updating it because the field name, already exists for the school", () => {
      it("should not update a field", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "This field name already exists!",
        });
        expect(statusCode).toBe(409);
        expect(duplicateFieldName).toHaveBeenCalled();
        expect(duplicateFieldName).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(updateField).not.toHaveBeenCalled();
        expect(updateField).not.toHaveBeenCalledWith(
          { _id: validMockFieldId, school_id: newField.school_id },
          newField
        );
      });
    });
    describe("field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id", () => {
      it("should not update a field", async () => {
        // mock services
        const duplicateFieldName = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldNullPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Field not updated",
        });
        expect(statusCode).toBe(404);
        expect(duplicateFieldName).toHaveBeenCalled();
        expect(duplicateFieldName).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(updateField).toHaveBeenCalled();
        expect(updateField).toHaveBeenCalledWith(
          { _id: validMockFieldId, school_id: newField.school_id },
          newField
        );
      });
    });
    describe("field::put::07 - Passing a field correctly to update", () => {
      it("should update a field", async () => {
        // mock services
        const findFieldNameDuplicateByPropertyService = mockService(
          fieldsNullPayload,
          "findFilterFieldByProperty"
        );
        const updateField = mockService(fieldPayload, "modifyFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockFieldId}`)
          .send(newField);

        // assertions
        expect(body).toStrictEqual({ msg: "Field updated" });
        expect(statusCode).toBe(200);
        expect(findFieldNameDuplicateByPropertyService).toHaveBeenCalled();
        expect(findFieldNameDuplicateByPropertyService).toHaveBeenCalledWith(
          { school_id: newField.school_id, name: newField.name },
          "-createdAt -updatedAt"
        );
        expect(updateField).toHaveBeenCalled();
        expect(updateField).toHaveBeenCalledWith(
          { _id: validMockFieldId, school_id: newField.school_id },
          newField
        );
      });
    });
  });

  describe("DELETE /field ", () => {
    describe("field::delete::01 - Passing a field with missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteField = mockService(fieldNullPayload, "removeFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
          .send();

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add a school id",
            param: "school_id",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(deleteField).not.toHaveBeenCalled();
        expect(deleteField).not.toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: validMockFieldId,
        });
      });
    });
    describe("field::delete::02 - Passing a field with empty fields", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteField = mockService(fieldNullPayload, "removeFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
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
        expect(deleteField).not.toHaveBeenCalled();
        expect(deleteField).not.toHaveBeenCalledWith({
          school_id: "",
          _id: validMockFieldId,
        });
      });
    });
    describe("field::delete::03 - Passing an invalid field and school ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteField = mockService(fieldNullPayload, "removeFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual([
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
        ]);
        expect(statusCode).toBe(400);
        expect(deleteField).not.toHaveBeenCalled();
        expect(deleteField).not.toHaveBeenCalledWith({
          school_id: invalidMockId,
          _id: invalidMockId,
        });
      });
    });
    describe("field::delete::04 - Passing a field id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteField = mockService(fieldNullPayload, "removeFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Field not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteField).toHaveBeenCalled();
        expect(deleteField).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: otherValidMockId,
        });
      });
    });
    describe("field::delete::05 - Passing a field id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteField = mockService(fieldPayload, "removeFilterField");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockFieldId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Field deleted" });
        expect(statusCode).toBe(200);
        expect(deleteField).toHaveBeenCalled();
        expect(deleteField).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: validMockFieldId,
        });
      });
    });
  });
});
