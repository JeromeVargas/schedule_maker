import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as schoolServices from "../schools.services";

import { BASE_URL } from "../../../lib/router";

import type { School } from "../../../typings/types";

type Service =
  | "insertSchool"
  | "findAllSchools"
  | "findSchoolById"
  | "findSchoolByProperty"
  | "modifySchool"
  | "removeSchool";

describe("RESOURCE => School", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(schoolServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}schools/`;

  /* inputs */
  const validMockSchoolId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newSchool = {
    name: "school 001",
    groupMaxNumStudents: 40,
    status: "active",
  };
  const newSchoolMissingValues = {
    nam: "school 001",
    groupMaxNumStudent: 40,
    statu: "active",
  };
  const newSchoolEmptyValues = {
    name: "",
    groupMaxNumStudents: "",
    status: "",
  };
  const newSchoolNotValidDataTypes = {
    name: 1234567890,
    groupMaxNumStudents: "hello",
    status: 123456789,
  };
  const newSchoolWrongLengthValues = {
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
    groupMaxNumStudents: 1234567890,
    status: "active",
  };

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "school 001",
    groupMaxNumStudents: 40,
    status: "active",
  };
  const schoolNullPayload = null;
  const schoolsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      name: "school 001",
      groupMaxNumStudents: 40,
      status: "active",
    },
    {
      _id: new Types.ObjectId().toString(),
      name: "school 002",
      groupMaxNumStudents: 40,
      status: "active",
    },
    {
      _id: new Types.ObjectId().toString(),
      name: "school 003",
      groupMaxNumStudents: 40,
      status: "inactive",
    },
  ];
  const schoolsNullPayload: School[] = [];

  // test blocks
  describe("POST /school ", () => {
    describe("school::post::01 - Passing a school with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

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
        expect(duplicateSchoolName).not.toHaveBeenCalledWith(
          { name: newSchoolMissingValues.nam },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::02 - Passing a school with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

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
        expect(duplicateSchoolName).not.toHaveBeenCalledWith(
          { name: newSchoolEmptyValues.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::03 - Passing an invalid type as field value", () => {
      it("should return a not valid type error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

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
        expect(duplicateSchoolName).not.toHaveBeenCalledWith(
          { name: newSchoolNotValidDataTypes.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

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
        expect(duplicateSchoolName).not.toHaveBeenCalledWith(
          { name: newSchoolWrongLengthValues.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::05 - Passing an invalid status value", () => {
      it("should return a duplicate school error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newSchool, status: "hello" });

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
        expect(duplicateSchoolName).not.toHaveBeenCalledWith(
          { name: newSchool.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::06 - Passing an existing school name", () => {
      it("should return a duplicate school error", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

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

        expect(duplicateSchoolName).toHaveBeenCalledWith(
          { name: newSchool.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
      });
    });
    describe("school::post::07 - Passing a school but not being created", () => {
      it("should not create a school", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolNullPayload, "insertSchool");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSchool);

        // assertions
        expect(body).toStrictEqual({
          msg: "School not created",
          success: false,
        });
        expect(statusCode).toBe(400);

        expect(duplicateSchoolName).toHaveBeenCalledWith(
          { name: newSchool.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).toHaveBeenCalledWith(newSchool);
      });
    });
    describe("school::post::08 - Passing a school correctly to create", () => {
      it("should create a school", async () => {
        // mock services
        const duplicateSchoolName = mockService(
          schoolNullPayload,
          "findSchoolByProperty"
        );
        const insertSchool = mockService(schoolPayload, "insertSchool");

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
        expect(duplicateSchoolName).toHaveBeenCalledWith(
          { name: newSchool.name },
          "-createdAt -updatedAt"
        );
        expect(insertSchool).toHaveBeenCalledWith(newSchool);
      });
    });
  });

  describe("GET /school ", () => {
    describe("school - GET", () => {
      describe("school::get::01 - Requesting all schools but not finding any", () => {
        it("should not get any schools", async () => {
          // mock services
          const findSchools = mockService(schoolsNullPayload, "findAllSchools");

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
          expect(findSchools).toHaveBeenCalledWith("-createdAt -updatedAt");
        });
      });
      describe("school::get::02 - Requesting all schools correctly", () => {
        it("should get all schools", async () => {
          // mock services
          const findSchools = mockService(schoolsPayload, "findAllSchools");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            payload: schoolsPayload,
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findSchools).toHaveBeenCalledWith("-createdAt -updatedAt");
        });
      });

      describe("school - GET/:id", () => {
        describe("school::get/:id::01 - Passing an invalid school id in the url", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSchool = mockService(schoolNullPayload, "findSchoolById");

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
            expect(findSchool).not.toHaveBeenCalledWith(
              invalidMockId,
              "-createdAt -updatedAt"
            );
          });
        });
        describe("school::get/:id::02 - Requesting a school but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findSchool = mockService(schoolNullPayload, "findSchoolById");

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
            expect(findSchool).toHaveBeenCalledWith(
              otherValidMockId,
              "-createdAt -updatedAt"
            );
          });
        });
        describe("school::get/:id::03 - Requesting a school correctly", () => {
          it("should get a school", async () => {
            // mock services
            const findSchool = mockService(schoolPayload, "findSchoolById");

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSchoolId}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              payload: schoolPayload,
              success: true,
            });
            expect(statusCode).toBe(200);
            expect(findSchool).toHaveBeenCalledWith(
              validMockSchoolId,
              "-createdAt -updatedAt"
            );
          });
        });
      });
    });

    describe("PUT /school ", () => {
      describe("school::put::01 - Passing a school with missing fields", () => {
        it("should return a missing field error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

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
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolMissingValues.nam },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolMissingValues
          );
        });
      });
      describe("school::put::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

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
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolEmptyValues.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolEmptyValues
          );
        });
      });
      describe("school::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

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
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolNotValidDataTypes.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            invalidMockId,
            newSchoolNotValidDataTypes
          );
        });
      });
      describe("school::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

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
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolWrongLengthValues.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolWrongLengthValues
          );
        });
      });
      describe("school::put::05 - Passing an invalid status value", () => {
        it("should return a duplicate school error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send({ ...newSchool, status: "hello" });

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
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolWrongLengthValues.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolWrongLengthValues
          );
        });
      });
      describe("school::put::06 - Passing an existing school name", () => {
        it("should not update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolPayload, "modifySchool");

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

          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool
          );
        });
      });
      describe("school::put::06 - Passing a school but not updating it", () => {
        it("should not update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "modifySchool");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School not updated",
            success: false,
          });
          expect(statusCode).toBe(400);

          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool
          );
        });
      });
      describe("school::put::07 - Passing a school correctly to update", () => {
        it("should update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findSchoolByProperty"
          );
          const updateSchool = mockService(schoolPayload, "modifySchool");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({ msg: "School updated", success: true });
          expect(statusCode).toBe(200);

          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt"
          );
          expect(updateSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool
          );
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("school::delete::01 - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSchool = mockService(schoolNullPayload, "removeSchool");

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
          expect(deleteSchool).not.toHaveBeenCalledWith(validMockSchoolId);
        });
      });
      describe("school::delete::02 - Passing a school id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteSchool = mockService(schoolNullPayload, "removeSchool");

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
          expect(deleteSchool).toHaveBeenCalledWith(otherValidMockId);
        });
      });
      describe("school::delete::03 - Passing a school id correctly to delete", () => {
        it("should delete a school", async () => {
          // mock services
          const deleteSchool = mockService(schoolPayload, "removeSchool");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({ msg: "School deleted", success: true });
          expect(statusCode).toBe(200);
          expect(deleteSchool).toHaveBeenCalledWith(validMockSchoolId);
        });
      });
    });
  });
});
