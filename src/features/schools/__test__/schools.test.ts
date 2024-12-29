import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  findAllSchools,
  insertManySchools,
  insertSchool,
  removeAllSchools,
} from "../schools.services";

import { NewSchool, School, SchoolStatus } from "../../../typings/types";

describe("RESOURCE => SCHOOLS", () => {
  /* hooks */
  afterEach(async () => {
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
  const endPointUrl = `${BASE_URL}schools/`;

  // test blocks
  describe("SCHOOLS - POST", () => {
    describe("POST - /schools - Passing a school with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const newSchoolMissingValues = {
          nam: "school 001",
          groupMaxNumStudent: 40,
          statu: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchoolMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group max number of students",
              param: "groupMaxNumStudents",
            },
            {
              location: "body",
              msg: "Please add the school's current status",
              param: "status",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schools - Passing a school with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newSchoolEmptyValues = {
          name: "",
          groupMaxNumStudents: "",
          status: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchoolEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group max number of students field is empty",
              param: "groupMaxNumStudents",
              value: "",
            },
            {
              location: "body",
              msg: "The status field is empty",
              param: "status",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schools - Passing an invalid type as field value", () => {
      it("should return a not valid type error", async () => {
        // inputs
        const newSchoolNotValidDataTypes = {
          name: 1234567890,
          groupMaxNumStudents: "hello",
          status: 123456789,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchoolNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school name is not valid",
              param: "name",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "group max number of students value is not valid",
              param: "groupMaxNumStudents",
              value: "hello",
            },
            {
              location: "body",
              msg: "status is not valid",
              param: "status",
              value: 123456789,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schools - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const newSchoolWrongLengthValues = {
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          groupMaxNumStudents: 1234567890,
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchoolWrongLengthValues);

        //assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "group max number of students must not exceed 9 digits",
              param: "groupMaxNumStudents",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schools - Passing an invalid status value", () => {
      it("should return a duplicate school error", async () => {
        // inputs
        const newSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /schools - Passing an existing school name", () => {
      it("should return a duplicate school error", async () => {
        // inputs
        const newSchool: NewSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active",
        };
        await insertSchool(newSchool);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: "This school name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /schools - Passing a school correctly to create", () => {
      it("should create a school", async () => {
        // inputs
        const newSchool: NewSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: "School created successfully!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("SCHOOLS - GET", () => {
    describe("GET - /schools - Requesting all schools but not finding any", () => {
      it("should not get any schools", async () => {
        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send();

        // assertions
        expect(body).toStrictEqual({
          msg: "No schools found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /schools - Requesting all schools correctly", () => {
      it("should get all schools", async () => {
        // inputs
        const validMockSchoolId01 = new Types.ObjectId().toString();
        const validMockSchoolId02 = new Types.ObjectId().toString();
        const validMockSchoolId03 = new Types.ObjectId().toString();
        const newSchools: School[] = [
          {
            _id: validMockSchoolId01,
            name: "school 001",
            groupMaxNumStudents: 40,
            status: "active",
          },
          {
            _id: validMockSchoolId02,
            name: "school 002",
            groupMaxNumStudents: 40,
            status: "active",
          },
          {
            _id: validMockSchoolId03,
            name: "school 003",
            groupMaxNumStudents: 40,
            status: "inactive",
          },
        ];
        await insertManySchools(newSchools);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send();

        // assertions
        expect(body).toStrictEqual({
          payload: newSchools,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
      describe("GET - /schools/:id - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          const invalidMockId = "63c5dcac78b868f80035asdf";

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            msg: [
              {
                location: "params",
                msg: "The school id is not valid",
                param: "id",
                value: invalidMockId,
              },
            ],
            success: false,
          });
          expect(statusCode).toBe(400);
        });
      });
      describe("GET - /schools/:id - Requesting a school but not finding it", () => {
        it("should not get a school", async () => {
          // inputs
          const otherValidMockId = new Types.ObjectId().toString();

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            msg: "School not found",
            success: false,
          });
          expect(statusCode).toBe(404);
        });
      });
      describe("GET - /schools/:id - Requesting a school correctly", () => {
        it("should get a school", async () => {
          // inputs
          const validMockSchoolId = new Types.ObjectId().toString();
          const newSchool = {
            _id: validMockSchoolId,
            name: "school 001",
            groupMaxNumStudents: 40,
            status: "active" as SchoolStatus,
          };
          await insertSchool(newSchool);

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            payload: newSchool,
            success: true,
          });
          expect(statusCode).toBe(200);
        });
      });
    });
  });

  describe("SCHOOLS - PUT", () => {
    describe("PUT - /schools/:id - Passing a school with missing fields", () => {
      it("should return a missing field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchoolMissingValues = {
          nam: "school 001",
          groupMaxNumStudent: 40,
          statu: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSchoolId}`)
          .send(newSchoolMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group max number of students",
              param: "groupMaxNumStudents",
            },
            {
              location: "body",
              msg: "Please add the school's current status",
              param: "status",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing a school with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchoolEmptyValues = {
          name: "",
          groupMaxNumStudents: "",
          status: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSchoolId}`)
          .send(newSchoolEmptyValues);

        //assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group max number of students field is empty",
              param: "groupMaxNumStudents",
              value: "",
            },
            {
              location: "body",
              msg: "The status field is empty",
              param: "status",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // input
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newSchoolNotValidDataTypes = {
          name: 1234567890,
          groupMaxNumStudents: "hello",
          status: 123456789,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSchoolNotValidDataTypes);

        //assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The school id is not valid",
              param: "id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The school name is not valid",
              param: "name",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "group max number of students value is not valid",
              param: "groupMaxNumStudents",
              value: "hello",
            },
            {
              location: "body",
              msg: "status is not valid",
              param: "status",
              value: 123456789,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchoolWrongLengthValues = {
          name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          groupMaxNumStudents: 1234567890,
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSchoolId}`)
          .send(newSchoolWrongLengthValues);

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
            {
              location: "body",
              msg: "group max number of students must not exceed 9 digits",
              param: "groupMaxNumStudents",
              value: 1234567890,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing an invalid status value", () => {
      it("should return a duplicate school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "hello",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSchoolId}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",
              value: "hello",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing an existing school name", () => {
      it("should not update a school", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();
        const newSchool: NewSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active",
        };
        await insertSchool(newSchool);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${otherValidMockId}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: "This school name already exists",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /schools/:id - Passing a school but not updating it", () => {
      it("should not update a school", async () => {
        // inputs
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const newSchool: NewSchool = {
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${otherValidMockSchoolId}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: "School not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /schools/:id - Passing a school correctly to update", () => {
      it("should update a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSchoolId}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({ msg: "School updated", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("SCHOOLS - DELETE", () => {
    describe("DELETE - /schools/:id - Passing an invalid school id in the url", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send();

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The school id is not valid",
              param: "id",
              value: invalidMockId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /schools/:id - Passing a school id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send();

        // assertions
        expect(body).toStrictEqual({
          msg: "School not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /schools/:id - Passing a school id correctly to delete", () => {
      it("should delete a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSchoolId}`)
          .send();

        // assertions
        expect(body).toStrictEqual({ msg: "School deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
