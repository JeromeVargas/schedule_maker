import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

import {
  Break,
  Class,
  Field,
  Group,
  Level,
  Schedule,
  School,
  Subject,
  Teacher,
  Teacher_Field,
  User,
} from "../typings/types";

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
  // multiple returns
  const mockServiceMultipleReturns = (
    firstPayload: unknown,
    secondPayload: unknown,
    service: string
  ) => {
    return (
      jest
        // @ts-ignore
        .spyOn(MongoServices, service)
        // @ts-ignore
        .mockReturnValueOnce(firstPayload)
        .mockReturnValueOnce(secondPayload)
    );
  };

  // hooks
  afterAll(() => {
    connection.close();
  });

  // resources testing
  describe("RESOURCE => School", () => {
    // end point url
    const endPointUrl = "/api/v1/schools/";

    // inputs
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newSchool = {
      name: "school 001",
      groupMaxNumStudents: 40,
    };
    const newSchoolMissingValues = {
      nam: "school 001",
      groupMaxNumStudent: 40,
    };
    const newSchoolEmptyValues = {
      name: "",
      groupMaxNumStudents: "",
    };
    const newSchoolNotValidDataTypes = {
      name: 1234567890,
      groupMaxNumStudents: "hello",
    };
    const newSchoolWrongLengthValues = {
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
      groupMaxNumStudents: 1234567890,
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
      groupMaxNumStudents: 40,
    };
    const schoolNullPayload = null;
    const schoolsPayload = [
      {
        _id: new Types.ObjectId().toString(),
        name: "school 001",
        groupMaxNumStudents: 40,
      },
      {
        _id: new Types.ObjectId().toString(),
        name: "school 002",
        groupMaxNumStudents: 40,
      },
      {
        _id: new Types.ObjectId().toString(),
        name: "school 003",
        groupMaxNumStudents: 40,
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
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);

          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolMissingValues.nam },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).not.toHaveBeenCalled();
          expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolEmptyValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolEmptyValues.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).not.toHaveBeenCalled();
          expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid type error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolNotValidDataTypes.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).not.toHaveBeenCalled();
          expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolWrongLengthValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "groupMaxNumStudents",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolWrongLengthValues.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).not.toHaveBeenCalled();
          expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::05 - Passing an existing school name", () => {
        it("should return a duplicate school error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "This school name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).not.toHaveBeenCalled();
          expect(insertSchool).not.toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::06 - Passing a school but not being created", () => {
        it("should not create a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School not created",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).toHaveBeenCalled();
          expect(insertSchool).toHaveBeenCalledWith(newSchool, "school");
        });
      });
      describe("school::post::07 - Passing a school correctly to create", () => {
        it("should create a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchool = mockService(schoolPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School created successfully!",
          });

          expect(statusCode).toBe(201);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(insertSchool).toHaveBeenCalled();
          expect(insertSchool).toHaveBeenCalledWith(newSchool, "school");
        });
      });
    });

    describe("GET /school ", () => {
      describe("school - GET", () => {
        describe("school::get::01 - Requesting all schools but not finding any", () => {
          it("should not get any schools", async () => {
            // mock services
            const findSchools = mockService(
              schoolsNullPayload,
              "findAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              msg: "No schools found",
            });
            expect(statusCode).toBe(404);
            expect(findSchools).toHaveBeenCalled();
            expect(findSchools).toHaveBeenCalledWith(
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get::02 - Requesting all schools correctly", () => {
          it("should get all schools", async () => {
            // mock services
            const findSchools = mockService(schoolsPayload, "findAllResources");

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send();

            // assertions
            expect(body).toStrictEqual([
              {
                _id: expect.any(String),
                name: "school 001",
                groupMaxNumStudents: 40,
              },
              {
                _id: expect.any(String),
                name: "school 002",
                groupMaxNumStudents: 40,
              },
              {
                _id: expect.any(String),
                name: "school 003",
                groupMaxNumStudents: 40,
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findSchools).toHaveBeenCalled();
            expect(findSchools).toHaveBeenCalledWith(
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
      });

      describe("school - GET/:id", () => {
        describe("school::get/:id::01 - Passing an invalid school id in the url", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSchool = mockService(
              schoolNullPayload,
              "findResourceById"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${invalidMockId}`)
              .send();

            // assertions
            expect(body).toStrictEqual([
              {
                location: "params",
                msg: "The school id is not valid",
                param: "id",
                value: invalidMockId,
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findSchool).not.toHaveBeenCalled();
            expect(findSchool).not.toHaveBeenCalledWith(
              invalidMockId,
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get/:id::02 - Requesting a school but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findSchool = mockService(
              schoolNullPayload,
              "findResourceById"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              msg: "School not found",
            });
            expect(statusCode).toBe(404);
            expect(findSchool).toHaveBeenCalled();
            expect(findSchool).toHaveBeenCalledWith(
              otherValidMockId,
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get/:id::03 - Requesting a school correctly", () => {
          it("should get a school", async () => {
            // mock services
            const findSchool = mockService(schoolPayload, "findResourceById");

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSchoolId}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              _id: validMockSchoolId,
              name: "school 001",
              groupMaxNumStudents: 40,
            });
            expect(statusCode).toBe(200);
            expect(findSchool).toHaveBeenCalled();
            expect(findSchool).toHaveBeenCalledWith(
              validMockSchoolId,
              "-createdAt -updatedAt",
              "school"
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
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchoolMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolMissingValues.nam },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).not.toHaveBeenCalled();
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolMissingValues,
            "school"
          );
        });
      });
      describe("school::put::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchoolEmptyValues);

          //assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolEmptyValues.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).not.toHaveBeenCalled();
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolEmptyValues,
            "school"
          );
        });
      });
      describe("school::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newSchoolNotValidDataTypes);

          //assertions
          expect(body).toStrictEqual([
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolNotValidDataTypes.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).not.toHaveBeenCalled();
          expect(updateSchool).not.toHaveBeenCalledWith(
            invalidMockId,
            newSchoolNotValidDataTypes,
            "school"
          );
        });
      });
      describe("school::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchoolWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "groupMaxNumStudents",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSchoolName).not.toHaveBeenCalled();
          expect(duplicateSchoolName).not.toHaveBeenCalledWith(
            { name: newSchoolWrongLengthValues.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).not.toHaveBeenCalled();
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchoolWrongLengthValues,
            "school"
          );
        });
      });
      describe("school::put::05 - Passing an existing school name", () => {
        it("should not update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "This school name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).not.toHaveBeenCalled();
          expect(updateSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool,
            "school"
          );
        });
      });
      describe("school::put::06 - Passing a school but not updating it", () => {
        it("should not update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolNullPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School not updated",
          });
          expect(statusCode).toBe(404);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).toHaveBeenCalled();
          expect(updateSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool,
            "school"
          );
        });
      });
      describe("school::put::07 - Passing a school correctly to update", () => {
        it("should update a school", async () => {
          // mock services
          const duplicateSchoolName = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchool = mockService(schoolPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({ msg: "School updated" });
          expect(statusCode).toBe(200);
          expect(duplicateSchoolName).toHaveBeenCalled();
          expect(duplicateSchoolName).toHaveBeenCalledWith(
            { name: newSchool.name },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchool).toHaveBeenCalled();
          expect(updateSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            newSchool,
            "school"
          );
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("school::delete::01 - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSchool = mockService(schoolNullPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The school id is not valid",
              param: "id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteSchool).not.toHaveBeenCalled();
          expect(deleteSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "school"
          );
        });
      });
      describe("school::delete::02 - Passing a school id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteSchool = mockService(schoolNullPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            msg: "School not deleted",
          });
          expect(statusCode).toBe(404);
          expect(deleteSchool).toHaveBeenCalled();
          expect(deleteSchool).toHaveBeenCalledWith(otherValidMockId, "school");
        });
      });
      describe("school::delete::03 - Passing a school id correctly to delete", () => {
        it("should delete a school", async () => {
          // mock services
          const deleteSchool = mockService(schoolPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({ msg: "School deleted" });
          expect(statusCode).toBe(200);
          expect(deleteSchool).toHaveBeenCalled();
          expect(deleteSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            "school"
          );
        });
      });
    });
  });

  describe("RESOURCE => User", () => {
    // end point url
    const endPointUrl = "/api/v1/users/";

    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newUser = {
      school_id: validMockSchoolId,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const newUserMissingValues = {
      school_i: validMockSchoolId,
      firstNam: "Jerome",
      lastNam: "Vargas",
      emai: "jerome@gmail.com",
      passwor: "12341234",
      rol: "coordinator",
      statu: "active",
      hasTeachingFun: true,
    };
    const newUserEmptyValues = {
      school_id: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "",
      status: "",
      hasTeachingFunc: "",
    };
    const newUserNotValidDataTypes = {
      school_id: invalidMockId,
      firstName: 9087432156,
      lastName: 890213429039,
      email: 9808934123,
      password: 12341234,
      role: 93870134699832,
      status: 43124314,
      hasTeachingFunc: 987314,
    };
    const newUserWrongLengthValues = {
      school_id: validMockSchoolId,
      firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
      lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
      email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
      password: "1234123",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const newUserWrongInputValues = {
      school_id: validMockSchoolId,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail",
      password: "12341234",
      role: "coordinador",
      status: "activo",
      hasTeachingFunc: true,
    };

    // payloads
    const userPayload = {
      _id: validMockUserId,
      school_id: validMockSchoolId,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail.com",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const userNullPayload = null;
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
    };
    const schoolNullPayload = null;
    const usersPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        firstName: "Jerome",
        lastName: "Vargas",
        email: "jerome@gmail.com",
        role: "headmaster",
        status: "inactive",
        hasTeachingFunc: true,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        firstName: "Dave",
        lastName: "Gray",
        email: "dave@hotmail.com",
        role: "coordinator",
        status: "active",
        hasTeachingFunc: false,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        firstName: "Ania",
        lastName: "Kubow",
        email: "ania@yahoo.com",
        role: "teacher",
        status: "suspended",
        hasTeachingFunc: true,
      },
    ];
    const usersNullPayload: User[] = [];

    // test blocks
    describe("POST /user ", () => {
      describe("user::post::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              msg: "Please add the user's school id",
              param: "school_id",
              location: "body",
            },
            {
              msg: "Please add the user's first name",
              param: "firstName",
              location: "body",
            },
            {
              msg: "Please add the user's last name",
              param: "lastName",
              location: "body",
            },
            {
              msg: "Please add the user's email",
              param: "email",
              location: "body",
            },
            {
              msg: "Please add the user's password",
              param: "password",
              location: "body",
            },
            {
              msg: "Please add the user's role",
              param: "role",
              location: "body",
            },
            {
              msg: "Please add the user's current status",
              param: "status",
              location: "body",
            },
            {
              msg: "Please add if the user has teaching functions assigned",
              param: "hasTeachingFunc",
              location: "body",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserMissingValues.emai,
              school_id: newUserMissingValues.school_i,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserMissingValues,
            "user"
          );
        });
      });
      describe("user::post::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");
          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserEmptyValues);

          // assertions
          expect(body).toStrictEqual([
            {
              msg: "The school field is empty",
              param: "school_id",
              location: "body",
              value: "",
            },
            {
              msg: "The first name field is empty",
              param: "firstName",
              location: "body",
              value: "",
            },
            {
              msg: "The last name field is empty",
              param: "lastName",
              location: "body",
              value: "",
            },
            {
              msg: "The email field is empty",
              param: "email",
              location: "body",
              value: "",
            },
            {
              msg: "The password field is empty",
              param: "password",
              location: "body",
              value: "",
            },
            {
              msg: "The role field is empty",
              param: "role",
              location: "body",
              value: "",
            },
            {
              msg: "The status field is empty",
              param: "status",
              location: "body",
              value: "",
            },
            {
              msg: "The hasTeachingFunc field is empty",
              param: "hasTeachingFunc",
              location: "body",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserEmptyValues.email,
              school_id: newUserEmptyValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserEmptyValues,
            "user"
          );
        });
      });
      describe("user::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid type error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserNotValidDataTypes);

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
              msg: "The first name is not valid",
              param: "firstName",
              value: 9087432156,
            },
            {
              location: "body",
              msg: "The last name is not valid",
              param: "lastName",
              value: 890213429039,
            },
            {
              location: "body",
              msg: "email is not valid",
              param: "email",
              value: 9808934123,
            },
            {
              location: "body",
              msg: "The password is not valid",
              param: "password",
              value: 12341234,
            },
            {
              location: "body",
              msg: "role is not valid",
              param: "role",
              value: 93870134699832,
            },
            {
              location: "body",
              msg: "status is not valid",
              param: "status",
              value: 43124314,
            },
            {
              location: "body",
              msg: "hasTeachingFunc value is not valid",
              param: "hasTeachingFunc",
              value: 987314,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserNotValidDataTypes.email,
              school_id: newUserNotValidDataTypes.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserNotValidDataTypes,
            "user"
          );
        });
      });
      describe("user::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserWrongLengthValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The first name must not exceed 50 characters",
              param: "firstName",
              value: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
            },
            {
              location: "body",
              msg: "The last name must not exceed 50 characters",
              param: "lastName",
              value: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
            },
            {
              location: "body",
              msg: "The email must not exceed 50 characters",
              param: "email",
              value: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
            },
            {
              location: "body",
              msg: "The password must be at least 8 characters long",
              param: "password",
              value: "1234123",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserWrongLengthValues.email,
              school_id: newUserWrongInputValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserWrongLengthValues,
            "user"
          );
        });
      });
      describe("user::post::05 - Passing a password that is too long", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({
              ...newUser,
              password:
                "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341",
            });

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The password must not exceed 128 characters",
              param: "password",
              value:
                "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserWrongLengthValues.email,
              school_id: newUserWrongInputValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserWrongLengthValues,
            "user"
          );
        });
      });
      describe("user::post::06 - Passing wrong school id, email, role or status", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserWrongInputValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "please add a correct email address",
              param: "email",
              value: "jerome@gmail",
            },
            {
              location: "body",
              msg: "the role provided is not a valid option",
              param: "role",
              value: "coordinador",
            },
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",
              value: "activo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserWrongInputValues.email,
              school_id: newUserWrongLengthValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(
            newUserWrongInputValues,
            "user"
          );
        });
      });
      describe("user::post::07 - Passing an non-existing school", () => {
        it("should return a duplicate user error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the school first",
          });
          expect(statusCode).toBe(409);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::08 - Passing an existing user's email", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please try a different email address",
          });
          expect(statusCode).toBe(409);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).not.toHaveBeenCalled();
          expect(insertUser).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::09 - Passing a user but not being created", () => {
        it("should not create a user", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "User not created",
          });
          expect(statusCode).toBe(400);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).toHaveBeenCalled();
          expect(insertUser).toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::10 - Passing a user correctly to create", () => {
        it("should create a user", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUser = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({ msg: "User created successfully!" });
          expect(statusCode).toBe(201);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUser).toHaveBeenCalled();
          expect(insertUser).toHaveBeenCalledWith(newUser, "user");
        });
      });
    });

    describe("GET /user ", () => {
      describe("user - GET", () => {
        describe("user::get::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findUsers = mockService(
              usersNullPayload,
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
            expect(findUsers).not.toHaveBeenCalled();
            expect(findUsers).not.toHaveBeenCalledWith(
              { school_id: null },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::02 - passing a school with empty values", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findUsers = mockService(
              usersNullPayload,
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
            expect(findUsers).not.toHaveBeenCalled();
            expect(findUsers).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::03 - Passing an invalid school id in the body", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findUsers = mockService(
              usersNullPayload,
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
            expect(findUsers).not.toHaveBeenCalled();
            expect(findUsers).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::04 - Requesting all users but not finding any", () => {
          it("should not get any users", async () => {
            // mock services
            const findUsers = mockService(
              usersNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No users found",
            });
            expect(statusCode).toBe(404);
            expect(findUsers).toHaveBeenCalled();
            expect(findUsers).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::05 - Requesting all users", () => {
          it("should get all users", async () => {
            // mock services
            const findUsers = mockService(
              usersPayload,
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
                email: "jerome@gmail.com",
                firstName: "Jerome",
                hasTeachingFunc: true,
                lastName: "Vargas",
                role: "headmaster",
                school_id: expect.any(String),
                status: "inactive",
              },
              {
                _id: expect.any(String),
                email: "dave@hotmail.com",
                firstName: "Dave",
                hasTeachingFunc: false,
                lastName: "Gray",
                role: "coordinator",
                school_id: expect.any(String),
                status: "active",
              },
              {
                _id: expect.any(String),
                email: "ania@yahoo.com",

                firstName: "Ania",
                hasTeachingFunc: true,

                lastName: "Kubow",
                role: "teacher",
                school_id: expect.any(String),
                status: "suspended",
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findUsers).toHaveBeenCalled();
            expect(findUsers).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
      });

      describe("user - GET/:id", () => {
        describe("user::get/:id::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findUser = mockService(
              userNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)

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
            expect(findUser).not.toHaveBeenCalled();
            expect(findUser).not.toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: null }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findUser = mockService(
              userNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)
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
            expect(findUser).not.toHaveBeenCalled();
            expect(findUser).not.toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: "" }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::03 - Passing an invalid user and school ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findUser = mockService(
              userNullPayload,
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
                msg: "The user id is not valid",
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
            expect(findUser).not.toHaveBeenCalled();
            expect(findUser).not.toHaveBeenCalledWith(
              [{ _id: invalidMockId }, { school_id: invalidMockId }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::04 - Requesting a user but not finding it", () => {
          it("should not get a user", async () => {
            // mock services
            const findUser = mockService(
              userNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "User not found",
            });
            expect(statusCode).toBe(404);
            expect(findUser).toHaveBeenCalled();
            expect(findUser).toHaveBeenCalledWith(
              { _id: otherValidMockId, school_id: validMockSchoolId },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::05 - Requesting a user correctly", () => {
          it("should get a user", async () => {
            // mock services
            const findUser = mockService(userPayload, "findResourceByProperty");

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              _id: validMockUserId,
              school_id: validMockSchoolId,
              firstName: "Jerome",
              lastName: "Vargas",
              email: "jerome@gmail.com",
              status: "active",
              role: "coordinator",
              hasTeachingFunc: true,
            });
            expect(statusCode).toBe(200);
            expect(findUser).toHaveBeenCalled();
            expect(findUser).toHaveBeenCalledWith(
              { _id: validMockUserId, school_id: validMockSchoolId },
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
      });
    });

    describe("PUT /user ", () => {
      describe("user::put::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the user's school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the user's first name",
              param: "firstName",
            },
            {
              location: "body",
              msg: "Please add the user's last name",
              param: "lastName",
            },
            {
              location: "body",
              msg: "Please add the user's email",
              param: "email",
            },
            {
              location: "body",
              msg: "Please add the user's password",
              param: "password",
            },
            {
              location: "body",
              msg: "Please add the user's role",
              param: "role",
            },
            {
              location: "body",
              msg: "Please add the user's current status",
              param: "status",
            },
            {
              location: "body",
              msg: "Please add if the user has teaching functions assigned",
              param: "hasTeachingFunc",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserMissingValues.emai,
              school_id: newUserMissingValues.school_i,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: validMockUserId },
              { school_id: newUserMissingValues.school_i },
            ],
            newUserMissingValues,
            "user"
          );
        });
      });
      describe("user::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserEmptyValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The first name field is empty",
              param: "firstName",
              value: "",
            },
            {
              location: "body",
              msg: "The last name field is empty",
              param: "lastName",
              value: "",
            },
            {
              location: "body",
              msg: "The email field is empty",
              param: "email",
              value: "",
            },
            {
              location: "body",
              msg: "The password field is empty",
              param: "password",
              value: "",
            },
            {
              location: "body",
              msg: "The role field is empty",
              param: "role",
              value: "",
            },
            {
              location: "body",
              msg: "The status field is empty",
              param: "status",
              value: "",
            },
            {
              location: "body",
              msg: "The hasTeachingFunc field is empty",
              param: "hasTeachingFunc",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserEmptyValues.email,
              school_id: newUserEmptyValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: validMockUserId },
              { school_id: newUserEmptyValues.school_id },
            ],
            newUserEmptyValues,
            "user"
          );
        });
      });
      describe("user::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newUserNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The user id is not valid",
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
              msg: "The first name is not valid",
              param: "firstName",
              value: 9087432156,
            },
            {
              location: "body",
              msg: "The last name is not valid",
              param: "lastName",
              value: 890213429039,
            },
            {
              location: "body",
              msg: "email is not valid",
              param: "email",
              value: 9808934123,
            },
            {
              location: "body",
              msg: "The password is not valid",
              param: "password",
              value: 12341234,
            },
            {
              location: "body",
              msg: "role is not valid",
              param: "role",
              value: 93870134699832,
            },
            {
              location: "body",
              msg: "status is not valid",
              param: "status",
              value: 43124314,
            },
            {
              location: "body",
              msg: "hasTeachingFunc value is not valid",
              param: "hasTeachingFunc",
              value: 987314,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            {
              email: newUserNotValidDataTypes.email,
              school_id: newUserNotValidDataTypes.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: invalidMockId },
              { school_id: newUserNotValidDataTypes.school_id },
            ],
            newUserNotValidDataTypes,
            "user"
          );
        });
      });
      describe("user::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The first name must not exceed 50 characters",
              param: "firstName",
              value: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
            },
            {
              location: "body",
              msg: "The last name must not exceed 50 characters",
              param: "lastName",
              value: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
            },
            {
              location: "body",
              msg: "The email must not exceed 50 characters",
              param: "email",
              value: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
            },
            {
              location: "body",
              msg: "The password must be at least 8 characters long",
              param: "password",
              value: "1234123",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: validMockUserId },
              { school_id: newUserWrongLengthValues.school_id },
            ],
            newUserWrongLengthValues,
            "user"
          );
        });
      });
      describe("user::put::05 - Passing a password that is too long", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send({
              ...newUser,
              password:
                "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341",
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The password must not exceed 128 characters",
              param: "password",
              value:
                "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: validMockUserId },
              { school_id: newUserWrongLengthValues.school_id },
            ],
            newUserWrongLengthValues,
            "user"
          );
        });
      });
      describe("user::put::06 - Passing wrong email, role or status", () => {
        it("should return an invalid input value error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserWrongInputValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "please add a correct email address",
              param: "email",
              value: "jerome@gmail",
            },
            {
              location: "body",
              msg: "the role provided is not a valid option",
              param: "role",

              value: "coordinador",
            },
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",

              value: "activo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateUserEmail).not.toHaveBeenCalled();
          expect(duplicateUserEmail).not.toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [
              { _id: validMockUserId },
              { school_id: newUserWrongInputValues.school_id },
            ],
            newUserWrongInputValues,
            "user"
          );
        });
      });
      describe("user::put::07 - Passing an existing user's email", () => {
        it("should return a duplicate user error", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(userPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockId}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please try a different email address",
          });
          expect(statusCode).toBe(409);
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).not.toHaveBeenCalled();
          expect(updateUser).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: newUser.school_id }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::08 - Passing a user but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(
            userNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "User not updated",
          });
          expect(statusCode).toBe(404);
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).toHaveBeenCalled();
          expect(updateUser).toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: newUser.school_id }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::09 - Passing a user correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const duplicateUserEmail = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUser = mockService(userPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({ msg: "User updated" });
          expect(statusCode).toBe(200);
          expect(duplicateUserEmail).toHaveBeenCalled();
          expect(duplicateUserEmail).toHaveBeenCalledWith(
            { email: newUser.email, school_id: newUser.school_id },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUser).toHaveBeenCalled();
          expect(updateUser).toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: newUser.school_id }],
            newUser,
            "user"
          );
        });
      });
    });

    describe("DELETE /user ", () => {
      describe("user::delete::01 - passing a school with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const deleteUser = mockService(
            userNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
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
          expect(deleteUser).not.toHaveBeenCalled();
          expect(deleteUser).not.toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::02 - passing a school with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const deleteUser = mockService(
            userNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
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
          expect(deleteUser).not.toHaveBeenCalled();
          expect(deleteUser).not.toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: "" },
            "user"
          );
        });
      });
      describe("user::delete::03 - Passing an invalid user and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteUser = mockService(
            userNullPayload,
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
              msg: "The user id is not valid",
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
          expect(deleteUser).not.toHaveBeenCalled();
          expect(deleteUser).not.toHaveBeenCalledWith(
            {
              _id: invalidMockId,
              school_id: invalidMockId,
            },
            "user"
          );
        });
      });
      describe("user::delete::04 - Passing a user id but not deleting it", () => {
        it("should not delete a user", async () => {
          // mock services
          const deleteUser = mockService(
            userNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            msg: "User not deleted",
          });
          expect(statusCode).toBe(404);
          expect(deleteUser).toHaveBeenCalled();
          expect(deleteUser).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::05 - Passing a user id correctly to delete", () => {
        it("should delete a user", async () => {
          // mock services
          const deleteUser = mockService(userPayload, "deleteFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "User deleted" });
          expect(statusCode).toBe(200);
          expect(deleteUser).toHaveBeenCalled();
          expect(deleteUser).toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
    });
  });

  describe("RESOURCE => Teacher", () => {
    // end point url
    const endPointUrl = "/api/v1/teachers/";
    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockTeacherId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newTeacher = {
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const newTeacherMissingValues = {
      school_i: validMockSchoolId,
      user_i: validMockUserId,
      coordinator_i: validMockCoordinatorId,
      contractTyp: "full-time",
      hoursAssignabl: 60,
      hoursAssigne: 60,
      monda: true,
      tuesda: true,
      wednesda: true,
      thursda: true,
      frida: true,
      saturda: true,
      sunda: true,
    };
    const newTeacherEmptyValues = {
      school_id: "",
      user_id: "",
      coordinator_id: "",
      contractType: "",
      hoursAssignable: "",
      hoursAssigned: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };
    const newTeacherNotValidDataTypes = {
      school_id: invalidMockId,
      user_id: invalidMockId,
      coordinator_id: invalidMockId,
      contractType: true,
      hoursAssignable: "house",
      hoursAssigned: "three3",
      monday: "hello",
      tuesday: "hello",
      wednesday: "hello",
      thursday: "hello",
      friday: "hello",
      saturday: "hello",
      sunday: "hello",
    };
    const newTeacherWrongLengthValues = {
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 1234567890,
      hoursAssigned: 1234567890,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };

    const newTeacherWrongInputValues = {
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "tiempo-completo",
      hoursAssignable: 60,
      hoursAssigned: 60,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "School 001",
      groupMaxNumStudents: 40,
    };
    const userCoordinatorPayload = [
      {
        _id: validMockUserId,
        school_id: schoolPayload,
        firstName: "Mtuts",
        lastName: "Tuts",
        email: "mtuts@hello.com",
        rol: "teacher",
        status: "active",
        hasTeachingFunc: true,
      },
      {
        _id: validMockCoordinatorId,
        school_id: schoolPayload,
        firstName: "Dave",
        lastName: "Gray",
        email: "dave@hello.com",
        role: "coordinator",
        status: "active",
        hasTeachingFunc: false,
      },
    ];
    const userCoordinatorNullPayload: User[] = [];
    const teacherPayload = {
      _id: validMockTeacherId,
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const teacherNullPayload = null;
    const coordinatorPayload = {
      _id: validMockCoordinatorId,
      school_id: validMockSchoolId,
      firstName: "Dave",
      lastName: "Gray",
      email: "dave@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: false,
    };
    const coordinatorNullPayload = null;
    const teachersPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "full-time",
        hoursAssignable: 60,
        hoursAssigned: 60,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "part-time",
        hoursAssignable: 40,
        hoursAssigned: 40,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "substitute",
        hoursAssignable: 70,
        hoursAssigned: 70,
      },
    ];
    const teachersNullPayload: Teacher[] = [];

    // test blocks
    describe("POST /teacher ", () => {
      describe("teacher::post::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorNullPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the user's school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s user id",
              param: "user_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator's id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s contract type",
              param: "contractType",
            },
            {
              location: "body",
              msg: "Please add the number of hours assignable to the teacher",
              param: "hoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of hours assigned to the teacher",
              param: "hoursAssigned",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            {
              user_id: newTeacherMissingValues.user_i,
              school_id: newTeacherMissingValues.school_i,
            },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [
              newTeacherMissingValues.user_i,
              newTeacherMissingValues.coordinator_i,
            ],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(
            newTeacherMissingValues,
            "teacher"
          );
        });
      });
      describe("teacher::post::02 - Passing a teacher with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorNullPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherEmptyValues);

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
              msg: "The teacher's user id field is empty",
              param: "user_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator's id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The contract type field is empty",
              param: "contractType",
              value: "",
            },
            {
              location: "body",
              msg: "The hours assignable field is empty",
              param: "hoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The hours assigned field is empty",
              param: "hoursAssigned",
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            {
              user_id: newTeacherEmptyValues.user_id,
              school_id: newTeacherEmptyValues.school_id,
            },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [
              newTeacherEmptyValues.user_id,
              newTeacherEmptyValues.coordinator_id,
            ],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(
            newTeacherEmptyValues,
            "teacher"
          );
        });
      });
      describe("teacher::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorNullPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherNotValidDataTypes);

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
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "contract type is not valid",
              param: "contractType",
              value: true,
            },
            {
              location: "body",
              msg: "hours assignable value is not valid",
              param: "hoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "hours assigned value is not valid",
              param: "hoursAssigned",
              value: "three3",
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            {
              user_id: newTeacherNotValidDataTypes.user_id,
              school_id: newTeacherNotValidDataTypes.school_id,
            },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [
              newTeacherNotValidDataTypes.user_id,
              newTeacherNotValidDataTypes.coordinator_id,
            ],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(
            newTeacherNotValidDataTypes,
            "teacher"
          );
        });
      });
      describe("teacher::post::04 - Passing too long or short input values", () => {
        it("should return invalid length input value error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorNullPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "hoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "hoursAssigned",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            {
              user_id: newTeacherWrongLengthValues.user_id,
              school_id: newTeacherWrongLengthValues.school_id,
            },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [
              newTeacherWrongLengthValues.user_id,
              newTeacherWrongLengthValues.coordinator_id,
            ],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(
            newTeacherWrongLengthValues,
            "teacher"
          );
        });
      });
      describe("teacher::post::05 - Passing wrong input values, the input values are part of the allowed values", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorNullPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherWrongInputValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              param: "contractType",

              value: "tiempo-completo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            {
              user_id: newTeacherWrongInputValues.user_id,
              school_id: newTeacherWrongInputValues.school_id,
            },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [
              newTeacherWrongInputValues.user_id,
              newTeacherWrongInputValues.coordinator_id,
            ],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(
            newTeacherWrongInputValues,
            "teacher"
          );
        });
      });
      describe("teacher::post::06 - Passing a number of assignable hours larger than the maximum allowed", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newTeacher, hoursAssignable: 71 });

          // assertions
          expect(body).toStrictEqual({
            msg: "hours assignable must not exceed 70 hours",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::07 - Passing a number of assigned hours larger than the assignable hours", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newTeacher, hoursAssigned: 70 });

          // assertions
          expect(body).toStrictEqual({
            msg: `hours assigned must not exceed the hours assignable, ${newTeacher.hoursAssignable} hours`,
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).not.toHaveBeenCalled();
          expect(duplicateTeacher).not.toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::08 - user already a teacher", () => {
        it("should return a user already a teacher error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "User is already a teacher",
          });
          expect(statusCode).toBe(409);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::09 - Not finding a user", () => {
        it("should return a user not found error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [null, userCoordinatorPayload[1]],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the base user first",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::10 - Passing an inactive user", () => {
        it("should return an inactive user error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              { ...userCoordinatorPayload[0], status: "inactive" },
              userCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({ msg: "The user is not active" });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::11 - Passing a user with no teaching functions assigned", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              { ...userCoordinatorPayload[0], hasTeachingFunc: false },
              userCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "The user does not have teaching functions assigned",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::12 - The user's school does not match the body school id", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              {
                ...userCoordinatorPayload[0],
                school_id: null,
              },
              userCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the user's school is correct",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::13 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [userCoordinatorPayload[0], null],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an existent coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::14 - Passing a user with a role different from coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              userCoordinatorPayload[0],
              { ...userCoordinatorPayload[1], role: "student" },
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::15 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              userCoordinatorPayload[0],
              { ...userCoordinatorPayload[1], status: "inactive" },
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::16 - The coordinator's school does not match the body school id", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            [
              userCoordinatorPayload[0],
              { ...userCoordinatorPayload[1], school_id: null },
            ],
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator's school is correct",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).not.toHaveBeenCalled();
          expect(insertTeacher).not.toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::17 - Passing a teacher but not being created", () => {
        it("should not create a teacher", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(
            teacherNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher not created",
          });
          expect(statusCode).toBe(400);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).toHaveBeenCalled();
          expect(insertTeacher).toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
      describe("teacher::post::18 - Passing a teacher correctly to create", () => {
        it("should create a teacher", async () => {
          // mock services
          const duplicateTeacher = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findUserCoordinator = mockService(
            userCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const insertTeacher = mockService(teacherPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher created successfully!" });
          expect(statusCode).toBe(201);
          expect(duplicateTeacher).toHaveBeenCalled();
          expect(duplicateTeacher).toHaveBeenCalledWith(
            { user_id: newTeacher.user_id, school_id: newTeacher.school_id },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(findUserCoordinator).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledWith(
            [newTeacher.user_id, newTeacher.coordinator_id],
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertTeacher).toHaveBeenCalled();
          expect(insertTeacher).toHaveBeenCalledWith(newTeacher, "teacher");
        });
      });
    });

    describe("GET /teacher ", () => {
      describe("teacher - GET", () => {
        describe("teacher::get::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findTeachers = mockService(
              teachersNullPayload,
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
            expect(findTeachers).not.toHaveBeenCalled();
            expect(findTeachers).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeachers = mockService(
              teachersNullPayload,
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
            expect(findTeachers).not.toHaveBeenCalled();
            expect(findTeachers).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::03 - Passing an invalid school id in the body", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findTeachers = mockService(
              teachersNullPayload,
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
            expect(findTeachers).not.toHaveBeenCalled();
            expect(findTeachers).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::04 - Requesting all teachers but not finding any", () => {
          it("should not get any users", async () => {
            // mock services
            const findTeachers = mockService(
              teachersNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No teachers found",
            });
            expect(statusCode).toBe(404);
            expect(findTeachers).toHaveBeenCalled();
            expect(findTeachers).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::05 - Requesting all teachers", () => {
          it("should get all teachers", async () => {
            // mock services
            const findTeachers = mockService(
              teachersPayload,
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
                contractType: "full-time",
                coordinator_id: expect.any(String),
                hoursAssignable: 60,
                hoursAssigned: 60,
                school_id: expect.any(String),
                user_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                contractType: "part-time",
                coordinator_id: expect.any(String),
                hoursAssignable: 40,
                hoursAssigned: 40,
                school_id: expect.any(String),
                user_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                contractType: "substitute",
                coordinator_id: expect.any(String),
                hoursAssignable: 70,
                hoursAssigned: 70,
                school_id: expect.any(String),
                user_id: expect.any(String),
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findTeachers).toHaveBeenCalled();
            expect(findTeachers).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
      });

      describe("teacher - GET/:id", () => {
        describe("teacher::get/:id::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findTeacher = mockService(
              teacherNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherId}`)
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
            expect(findTeacher).not.toHaveBeenCalled();
            expect(findTeacher).not.toHaveBeenCalledWith(
              { _id: validMockTeacherId, school_id: null },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeacher = mockService(
              teacherNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherId}`)
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
            expect(findTeacher).not.toHaveBeenCalled();
            expect(findTeacher).not.toHaveBeenCalledWith(
              { _id: validMockTeacherId, school_id: "" },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::03 - Passing an invalid user and school id", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findTeacher = mockService(
              teacherNullPayload,
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
                msg: "The teacher id is not valid",
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
            expect(findTeacher).not.toHaveBeenCalled();
            expect(findTeacher).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::04 - Requesting a teacher but not finding it", () => {
          it("should not get a teacher", async () => {
            // mock services
            const findTeacher = mockService(
              teacherNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Teacher not found",
            });
            expect(statusCode).toBe(404);
            expect(findTeacher).toHaveBeenCalled();
            expect(findTeacher).toHaveBeenCalledWith(
              { _id: otherValidMockId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::05 - Requesting a teacher correctly", () => {
          it("should get a teacher", async () => {
            // mock services
            const findTeacher = mockService(
              teacherPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(statusCode).toBe(200);
            expect(body).toStrictEqual({
              _id: validMockTeacherId,
              school_id: validMockSchoolId,
              user_id: validMockUserId,
              coordinator_id: validMockCoordinatorId,
              contractType: "full-time",
              hoursAssignable: 60,
              hoursAssigned: 60,
              monday: true,
              tuesday: true,
              wednesday: true,
              thursday: true,
              friday: true,
              saturday: true,
              sunday: true,
            });
            expect(findTeacher).toHaveBeenCalled();
            expect(findTeacher).toHaveBeenCalledWith(
              { _id: validMockTeacherId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
      });
    });

    describe("PUT /teacher ", () => {
      describe("teacher::put::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the teacher's user id",
              param: "user_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator's user id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the teacher`s contract type",
              param: "contractType",
            },
            {
              location: "body",
              msg: "Please add the number of hours assignable to the teacher",
              param: "hoursAssignable",
            },
            {
              location: "body",
              msg: "Please add the number of hours assigned to the teacher",
              param: "hoursAssigned",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacherMissingValues.coordinator_i,
              school_id: newTeacherMissingValues.school_i,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacherMissingValues.user_i },
              { school_id: newTeacherMissingValues.school_i },
            ],
            newTeacherMissingValues,
            "teacher"
          );
        });
      });
      describe("teacher::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherEmptyValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The teacher`s user id field is empty",
              param: "user_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator's id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The contract type field is empty",
              param: "contractType",
              value: "",
            },
            {
              location: "body",
              msg: "The hours assignable field is empty",
              param: "hoursAssignable",
              value: "",
            },
            {
              location: "body",
              msg: "The hours assigned field is empty",
              param: "hoursAssigned",
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
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacherEmptyValues.coordinator_id,
              school_id: newTeacherEmptyValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacherEmptyValues.user_id },
              { school_id: newTeacherEmptyValues.school_id },
            ],
            newTeacherEmptyValues,
            "teacher"
          );
        });
      });
      describe("teacher::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newTeacherNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The teacher's id is not valid",
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
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "contract type is not valid",
              param: "contractType",
              value: true,
            },
            {
              location: "body",
              msg: "hours assignable value is not valid",
              param: "hoursAssignable",
              value: "house",
            },
            {
              location: "body",
              msg: "hours assigned value is not valid",
              param: "hoursAssigned",
              value: "three3",
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
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacherNotValidDataTypes.coordinator_id,
              school_id: newTeacherNotValidDataTypes.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: invalidMockId },
              { user_id: newTeacherNotValidDataTypes.user_id },
              { school_id: newTeacherNotValidDataTypes.school_id },
            ],
            newTeacherNotValidDataTypes,
            "teacher"
          );
        });
      });
      describe("teacher::put::04 - Passing too long or short input values", () => {
        it("should return invalid length input value error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "hoursAssignable",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "hoursAssigned",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacherWrongLengthValues.coordinator_id,
              school_id: newTeacherWrongLengthValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacherWrongLengthValues.user_id },
              { school_id: newTeacherWrongLengthValues.school_id },
            ],
            newTeacherWrongLengthValues,
            "teacher"
          );
        });
      });
      describe("teacher::put::05 - Passing wrong input values, the input values are part of the allowed values", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherWrongInputValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              param: "contractType",
              value: "tiempo-completo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacherWrongInputValues.coordinator_id,
              school_id: newTeacherWrongInputValues.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacherWrongInputValues.user_id },
              { school_id: newTeacherWrongInputValues.school_id },
            ],
            newTeacherWrongInputValues,
            "teacher"
          );
        });
      });
      describe("teacher::put::06 - Passing a number of assignable hours larger than the maximum allowed", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send({ ...newTeacher, hoursAssignable: 71 });

          // assertions
          expect(body).toStrictEqual({
            msg: "hours assignable must not exceed 70 hours",
          });
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::07 - Passing a number of assigned hours larger than the assignable hours", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send({ ...newTeacher, hoursAssigned: 70 });

          // assertions
          expect(body).toStrictEqual({
            msg: `hours assigned must not exceed the hours assignable, ${newTeacher.hoursAssignable} hours`,
          });
          expect(statusCode).toBe(400);
          expect(findCoordinator).not.toHaveBeenCalled();
          expect(findCoordinator).not.toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::08 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an existent coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findCoordinator).toHaveBeenCalled();
          expect(findCoordinator).toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::09 - Passing a non coordinator user as coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const findCoordinator = mockService(
            { ...coordinatorPayload, role: "teacher" },
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(findCoordinator).toHaveBeenCalled();
          expect(findCoordinator).toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::10 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          // mock services
          const findCoordinator = mockService(
            { ...coordinatorPayload, status: "inactive" },
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherId}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findCoordinator).toHaveBeenCalled();
          expect(findCoordinator).toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).not.toHaveBeenCalled();
          expect(updateTeacher).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::11 - Passing a teacher but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherId}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher not updated",
          });
          expect(statusCode).toBe(404);
          expect(findCoordinator).toHaveBeenCalled();
          expect(findCoordinator).toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).toHaveBeenCalled();
          expect(updateTeacher).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::12 - Passing a teacher correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const findCoordinator = mockService(
            coordinatorPayload,
            "findResourceByProperty"
          );
          const updateTeacher = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherId}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher updated" });
          expect(statusCode).toBe(200);
          expect(findCoordinator).toHaveBeenCalled();
          expect(findCoordinator).toHaveBeenCalledWith(
            {
              _id: newTeacher.coordinator_id,
              school_id: newTeacher.school_id,
            },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacher).toHaveBeenCalled();
          expect(updateTeacher).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: newTeacher.user_id },
              { school_id: newTeacher.school_id },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
    });

    describe("DELETE /teacher ", () => {
      describe("teacher::delete::01 - passing a school with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherId}`)
            .send({
              school_i: validMockSchoolId,
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::02 - passing a school with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSchoolId}`)
            .send({
              school_id: "",
            });

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
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: "" },
            "teacher"
          );
        });
      });
      describe("teacher::delete::03 - Passing invalid teacher or school id", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${invalidMockId}`)
            .send({
              school_id: invalidMockId,
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The teacher's id is not valid",
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
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::04 - Passing a teacher but not deleting it", () => {
        it("should not delete a teacher", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({
              school_id: validMockSchoolId,
            });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteTeacher).toHaveBeenCalled();
          expect(deleteTeacher).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::05 - Passing a teacher correctly to delete", () => {
        it("should delete a teacher", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherId}`)
            .send({
              school_id: validMockSchoolId,
            });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher deleted" });
          expect(statusCode).toBe(200);
          expect(deleteTeacher).toHaveBeenCalled();
          expect(deleteTeacher).toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
    });
  });

  describe("RESOURCE => Field", () => {
    // end point url
    const endPointUrl = "/api/v1/fields/";

    // inputs
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

    // payloads
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
          const findSchool = mockService(fieldNullPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findFilterResourceByProperty"
          );
          const insertField = mockService(fieldNullPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).not.toHaveBeenCalled();
          expect(duplicateField).not.toHaveBeenCalledWith(
            {
              school_id: newFieldMissingValues.school_i,
              name: newFieldMissingValues.nam,
            },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(
            newFieldMissingValues,
            "field"
          );
        });
      });
      describe("field::post::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchool = mockService(fieldNullPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findFilterResourceByProperty"
          );
          const insertField = mockService(fieldNullPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).not.toHaveBeenCalled();
          expect(duplicateField).not.toHaveBeenCalledWith(
            {
              school_id: newFieldEmptyValues.school_id,
              name: newFieldEmptyValues.name,
            },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(
            newFieldEmptyValues,
            "field"
          );
        });
      });
      describe("field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchool = mockService(fieldNullPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findFilterResourceByProperty"
          );
          const insertField = mockService(fieldNullPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).not.toHaveBeenCalled();
          expect(duplicateField).not.toHaveBeenCalledWith(
            {
              school_id: newFieldNotValidDataTypes.school_id,
              name: newField.name,
            },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(
            newFieldNotValidDataTypes,
            "field"
          );
        });
      });
      describe("field::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchool = mockService(fieldNullPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findFilterResourceByProperty"
          );
          const insertField = mockService(fieldNullPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).not.toHaveBeenCalled();
          expect(duplicateField).not.toHaveBeenCalledWith(
            {
              school_id: newFieldWrongLengthValues.school_id,
              name: newFieldWrongLengthValues.name,
            },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(newField, "field");
        });
      });
      describe("field::post::05 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchool = mockService(fieldNullPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findFilterResourceByProperty"
          );
          const insertField = mockService(fieldPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).not.toHaveBeenCalled();
          expect(duplicateField).not.toHaveBeenCalledWith(
            { school_id: newField.school_id, name: newField.name },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(newField, "field");
        });
      });
      describe("field::post::06 - Passing an existing field name", () => {
        it("should return a duplicate field error", async () => {
          // mock services
          const findSchool = mockService(fieldPayload, "findResourceById");
          const duplicateField = mockService(
            fieldPayload,
            "findResourceByProperty"
          );
          const insertField = mockService(fieldPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).toHaveBeenCalled();
          expect(duplicateField).toHaveBeenCalledWith(
            { school_id: newField.school_id, name: newField.name },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).not.toHaveBeenCalled();
          expect(insertField).not.toHaveBeenCalledWith(newField, "field");
        });
      });
      describe("field::post::07 - Passing a field but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchool = mockService(fieldPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findResourceByProperty"
          );
          const insertField = mockService(fieldNullPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).toHaveBeenCalled();
          expect(duplicateField).toHaveBeenCalledWith(
            { school_id: newField.school_id, name: newField.name },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).toHaveBeenCalled();
          expect(insertField).toHaveBeenCalledWith(newField, "field");
        });
      });
      describe("field::post::08 - Passing a field correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findSchool = mockService(fieldPayload, "findResourceById");
          const duplicateField = mockService(
            fieldNullPayload,
            "findResourceByProperty"
          );
          const insertField = mockService(fieldPayload, "insertResource");

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
            "-createdAt -updatedAt",
            "school"
          );
          expect(duplicateField).toHaveBeenCalled();
          expect(duplicateField).toHaveBeenCalledWith(
            { school_id: newField.school_id, name: newField.name },
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertField).toHaveBeenCalled();
          expect(insertField).toHaveBeenCalledWith(newField, "field");
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
              "findFilterAllResources"
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::02 - passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findFields = mockService(
              fieldsNullPayload,
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
            expect(findFields).not.toHaveBeenCalled();
            expect(findFields).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::03 - passing and invalid school id", () => {
          it("should get all fields", async () => {
            // mock services
            const findFields = mockService(
              fieldsNullPayload,
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
            expect(findFields).not.toHaveBeenCalled();
            expect(findFields).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findFields = mockService(
              fieldsNullPayload,
              "findFilterAllResources"
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findFields = mockService(
              fieldsPayload,
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
              "-createdAt -updatedAt",
              "field"
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
              "findResourceByProperty"
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::02 - Passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findField = mockService(
              fieldNullPayload,
              "findResourceByProperty"
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::03 - Passing an invalid field and school ids in the url", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findField = mockService(
              fieldNullPayload,
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findField = mockService(
              fieldNullPayload,
              "findResourceByProperty"
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
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findField = mockService(
              fieldPayload,
              "findResourceByProperty"
            );

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
              "-createdAt -updatedAt",
              "field"
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
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

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
            [
              { school_id: newFieldMissingValues.school_i },
              { name: newFieldMissingValues.nam },
            ],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).not.toHaveBeenCalled();
          expect(updateField).not.toHaveBeenCalledWith(
            [
              { _id: validMockFieldId },
              { school_id: newFieldMissingValues.school_i },
            ],
            newFieldMissingValues,
            "field"
          );
        });
      });
      describe("field::put::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateFieldName = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockFieldId}`)
            .send(newFieldEmptyValues);

          //assertions
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
            [
              { school_id: newFieldEmptyValues.school_id },
              { name: newFieldEmptyValues.name },
            ],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).not.toHaveBeenCalled();
          expect(updateField).not.toHaveBeenCalledWith(
            [
              { _id: validMockFieldId },
              { school_id: newFieldEmptyValues.school_id },
            ],
            newFieldEmptyValues,
            "field"
          );
        });
      });
      describe("field::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateFieldName = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newFieldNotValidDataTypes);

          //assertions
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
            [
              { school_id: newFieldNotValidDataTypes.school_id },
              { name: newFieldNotValidDataTypes.name },
            ],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).not.toHaveBeenCalled();
          expect(updateField).not.toHaveBeenCalledWith(
            [
              { _id: validMockFieldId },
              { school_id: newFieldNotValidDataTypes.school_id },
            ],
            newFieldNotValidDataTypes,
            "field"
          );
        });
      });
      describe("field::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateFieldName = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

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
            [
              { school_id: newFieldWrongLengthValues.school_id },
              { name: newFieldWrongLengthValues.name },
            ],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).not.toHaveBeenCalled();
          expect(updateField).not.toHaveBeenCalledWith(
            [
              { _id: validMockFieldId },
              { school_id: newFieldWrongLengthValues.school_id },
            ],
            newFieldWrongLengthValues,
            "field"
          );
        });
      });
      describe("field::put::05 - Passing a field but not updating it because the field name, already exists for the school", () => {
        it("should not update a field", async () => {
          // mock services
          const duplicateFieldName = mockService(
            fieldsPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

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
            [{ school_id: newField.school_id }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).not.toHaveBeenCalled();
          expect(updateField).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: newField.school_id }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id", () => {
        it("should not update a field", async () => {
          // mock services
          const duplicateFieldName = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(
            fieldNullPayload,
            "updateFilterResource"
          );

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
            [{ school_id: newField.school_id }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).toHaveBeenCalled();
          expect(updateField).toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: newField.school_id }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::07 - Passing a field correctly to update", () => {
        it("should update a field", async () => {
          // mock services
          const findFieldNameDuplicateByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateField = mockService(fieldPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockFieldId}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({ msg: "Field updated" });
          expect(statusCode).toBe(200);
          expect(findFieldNameDuplicateByPropertyService).toHaveBeenCalled();
          expect(findFieldNameDuplicateByPropertyService).toHaveBeenCalledWith(
            [{ school_id: newField.school_id }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateField).toHaveBeenCalled();
          expect(updateField).toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
    });

    describe("DELETE /field ", () => {
      describe("field::delete::01 - Passing a field with missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteField = mockService(
            fieldNullPayload,
            "deleteFilterResource"
          );

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
          expect(deleteField).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::02 - Passing a field with empty fields", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteField = mockService(
            fieldNullPayload,
            "deleteFilterResource"
          );

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
          expect(deleteField).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: "" },
            "field"
          );
        });
      });
      describe("field::delete::03 - Passing an invalid field and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteField = mockService(
            fieldNullPayload,
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
          expect(deleteField).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "field"
          );
        });
      });
      describe("field::delete::04 - Passing a field id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteField = mockService(
            fieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Field not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteField).toHaveBeenCalled();
          expect(deleteField).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::05 - Passing a field id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteField = mockService(fieldPayload, "deleteFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Field deleted" });
          expect(statusCode).toBe(200);
          expect(deleteField).toHaveBeenCalled();
          expect(deleteField).toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
    });
  });

  describe("RESOURCE => Teacher_field", () => {
    // end point url
    const endPointUrl = "/api/v1/teacher_fields/";

    // inputs
    const validMockTeacherFieldId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockTeacherId = new Types.ObjectId().toString();
    const validMockUserId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockFieldId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newTeacherField = {
      school_id: validMockSchoolId,
      teacher_id: validMockTeacherId,
      field_id: validMockFieldId,
    };
    const newTeacherFieldMissingValues = {
      school_i: validMockSchoolId,
      teacher_i: validMockTeacherId,
      field_i: validMockFieldId,
    };
    const newTeacherFieldEmptyValues = {
      school_id: "",
      teacher_id: "",
      field_id: "",
    };
    const newTeacherFieldNotValidDataTypes = {
      school_id: invalidMockId,
      teacher_id: invalidMockId,
      field_id: invalidMockId,
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "School 001",
      groupMaxNumStudents: 40,
    };
    const teacherPayload = {
      _id: validMockTeacherId,
      school_id: schoolPayload,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const teacherNullPayload = null;
    const fieldPayload = {
      _id: validMockFieldId,
      school_id: schoolPayload,
      name: "Mathematics",
    };
    const fieldNullPayload = null;
    const teacherFieldPayload = {
      _id: validMockTeacherFieldId,
      school_id: validMockSchoolId,
      teacher_id: validMockTeacherId,
      field_id: validMockFieldId,
    };
    const teacherFieldNullPayload = null;
    const teacherFieldsPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
      },
    ];
    const teacherFieldsNullPayload: Teacher_Field[] = [];

    // test blocks
    describe("POST /teacher_field ", () => {
      describe("teacher_field::post::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherFieldMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add a teacher id",
              param: "teacher_id",
            },
            {
              location: "body",
              msg: "Please add a field id",
              param: "field_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacherField).not.toHaveBeenCalled();
          expect(findTeacherField).not.toHaveBeenCalledWith(
            {
              teacher_id: newTeacherFieldMissingValues.teacher_i,
              field_id: newTeacherFieldMissingValues.field_i,
              school_id: newTeacherFieldMissingValues.school_i,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(0);
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newTeacherFieldMissingValues.teacher_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherFieldMissingValues.field_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherFieldMissingValues,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::02 - Passing a teacher with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherFieldEmptyValues);

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
              msg: "The teacher id field is empty",
              param: "teacher_id",
              value: "",
            },
            {
              location: "body",
              msg: "The field id field is empty",
              param: "field_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacherField).not.toHaveBeenCalled();
          expect(findTeacherField).not.toHaveBeenCalledWith(
            {
              teacher_id: newTeacherFieldEmptyValues.teacher_id,
              field_id: newTeacherFieldEmptyValues.field_id,
              school_id: newTeacherFieldEmptyValues.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(0);
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newTeacherFieldEmptyValues.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherFieldEmptyValues.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherFieldEmptyValues,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherFieldNotValidDataTypes);

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
              msg: "The teacher id is not valid",
              param: "teacher_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The field id is not valid",
              param: "field_id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findTeacherField).not.toHaveBeenCalled();
          expect(findTeacherField).not.toHaveBeenCalledWith(
            {
              teacher_id: newTeacherFieldNotValidDataTypes.teacher_id,
              field_id: newTeacherFieldNotValidDataTypes.field_id,
              school_id: newTeacherFieldNotValidDataTypes.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(0);
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newTeacherFieldNotValidDataTypes.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherFieldNotValidDataTypes.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherFieldNotValidDataTypes,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::04 - teacher has the field already assigned", () => {
        it("should return an already assigned field", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "This teacher has already been assigned this field",
          });
          expect(statusCode).toBe(409);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(0);
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::05 - Passing an non-existent teacher in the body", () => {
        it("should return a non-existent teacher error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherNullPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the teacher exists",
          });
          expect(statusCode).toBe(404);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(1);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::06 - Passing a teacher that do not match the school id", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            {
              ...teacherPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the teacher belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(1);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::07 - Passing an non-existent field in the body", () => {
        it("should return a non-existent field error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the field exists",
          });
          expect(statusCode).toBe(404);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(2);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::08 - Passing a field that do not match the school id", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherPayload,
            {
              ...fieldPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the field belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(2);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).not.toHaveBeenCalled();
          expect(insertTeacherField).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::09 - Passing a teacher_field but not being created", () => {
        it("should not create a teacher_field", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "The teacher has been successfully assigned the field",
          });
          expect(statusCode).toBe(400);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(2);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).toHaveBeenCalled();
          expect(insertTeacherField).toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::10 - Passing a teacher_field correctly to create", () => {
        it("should create a teacher_field", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findResourceByProperty"
          );
          const duplicateTeacherField = mockServiceMultipleReturns(
            teacherPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertTeacherField = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "The teacher has been successfully assigned the field",
          });
          expect(statusCode).toBe(201);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              teacher_id: newTeacherField.teacher_id,
              field_id: newTeacherField.field_id,
              school_id: newTeacherField.school_id,
            },
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(duplicateTeacherField).toHaveBeenCalledTimes(2);
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            1,
            newTeacherField.teacher_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(duplicateTeacherField).toHaveBeenNthCalledWith(
            2,
            newTeacherField.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertTeacherField).toHaveBeenCalled();
          expect(insertTeacherField).toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
    });

    describe("GET /teacher_field ", () => {
      describe("teacher_field - GET", () => {
        describe("teacher_field::get::01 - passing a school id with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findTeacherFields = mockService(
              teacherFieldsNullPayload,
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
            expect(findTeacherFields).not.toHaveBeenCalled();
            expect(findTeacherFields).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::02 - passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeacherFields = mockService(
              teacherFieldsNullPayload,
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
            expect(findTeacherFields).not.toHaveBeenCalled();
            expect(findTeacherFields).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::03 - passing and invalid school id", () => {
          it("should get all fields", async () => {
            // mock services
            const findTeacherFields = mockService(
              teacherFieldsNullPayload,
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
            expect(findTeacherFields).not.toHaveBeenCalled();
            expect(findTeacherFields).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findTeacherFields = mockService(
              teacherFieldsNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No fields assigned to any teachers found",
            });
            expect(statusCode).toBe(404);
            expect(findTeacherFields).toHaveBeenCalled();
            expect(findTeacherFields).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::05 - Requesting all teacher_fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findTeacherFields = mockService(
              teacherFieldsPayload,
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
                field_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                field_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
              {
                _id: expect.any(String),
                field_id: expect.any(String),
                school_id: expect.any(String),
                teacher_id: expect.any(String),
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findTeacherFields).toHaveBeenCalled();
            expect(findTeacherFields).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
      });

      describe("teacher_field - GET/:id", () => {
        describe("teacher_field::get/:id::01 - Passing fields with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findTeacherField = mockService(
              teacherFieldNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherFieldId}`)
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
            expect(findTeacherField).not.toHaveBeenCalled();
            expect(findTeacherField).not.toHaveBeenCalledWith(
              { _id: validMockTeacherFieldId, school_id: null },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeacherField = mockService(
              teacherFieldNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherFieldId}`)
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
            expect(findTeacherField).not.toHaveBeenCalled();
            expect(findTeacherField).not.toHaveBeenCalledWith(
              { _id: validMockTeacherFieldId, school_id: "" },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::03 - Passing an invalid teacher_field and school ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findTeacherField = mockService(
              teacherFieldNullPayload,
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
                msg: "The teacher_field id is not valid",
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
            expect(findTeacherField).not.toHaveBeenCalled();
            expect(findTeacherField).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findTeacherField = mockService(
              teacherFieldNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Teacher_Field not found",
            });
            expect(statusCode).toBe(404);
            expect(findTeacherField).toHaveBeenCalled();
            expect(findTeacherField).toHaveBeenCalledWith(
              {
                _id: otherValidMockId,
                school_id: validMockSchoolId,
              },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findTeacherField = mockService(
              teacherFieldPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherFieldId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              _id: validMockTeacherFieldId,
              field_id: validMockFieldId,
              school_id: validMockSchoolId,
              teacher_id: validMockTeacherId,
            });
            expect(statusCode).toBe(200);
            expect(findTeacherField).toHaveBeenCalled();
            expect(findTeacherField).toHaveBeenCalledWith(
              { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
      });
    });

    describe("PUT /teacher_field ", () => {
      describe("teacher_field::put::01 - Passing fields with missing fields", () => {
        it("should return a field needed error", async () => {
          /* mock services */
          const findField = mockService(
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherFieldMissingValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add a teacher id",
              param: "teacher_id",
            },
            {
              location: "body",
              msg: "Please add a field id",
              param: "field_id",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            newTeacherFieldMissingValues.field_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            [
              { school_id: newTeacherFieldMissingValues.school_i },
              { teacher_id: newTeacherFieldMissingValues.teacher_i },
              { field_id: newTeacherFieldMissingValues.field_i },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherFieldMissingValues.teacher_i },
              { school_id: newTeacherFieldMissingValues.school_i },
            ],
            newTeacherFieldMissingValues,
            "teacherField"
          );
        });
      });
      describe("field::put::02 - Passing fields with empty fields", () => {
        it("should return an empty field error", async () => {
          /* mock services */
          const findField = mockService(
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherFieldEmptyValues);

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
              msg: "The teacher id field is empty",
              param: "teacher_id",
              value: "",
            },
            {
              location: "body",
              msg: "The field id field is empty",
              param: "field_id",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            newTeacherFieldEmptyValues.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            [
              { school_id: newTeacherFieldEmptyValues.school_id },
              { teacher_id: newTeacherFieldEmptyValues.teacher_id },
              { field_id: newTeacherFieldEmptyValues.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherFieldEmptyValues.teacher_id },
              { school_id: newTeacherFieldEmptyValues.school_id },
            ],
            newTeacherFieldEmptyValues,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newTeacherFieldNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The teacher_field id is not valid",
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
              msg: "The teacher id is not valid",
              param: "teacher_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The field id is not valid",
              param: "field_id",
              value: invalidMockId,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findField).not.toHaveBeenCalled();
          expect(findField).not.toHaveBeenCalledWith(
            newTeacherFieldNotValidDataTypes.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            [
              { school_id: newTeacherFieldNotValidDataTypes.school_id },
              { teacher_id: newTeacherFieldNotValidDataTypes.teacher_id },
              { field_id: newTeacherFieldNotValidDataTypes.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherFieldNotValidDataTypes.teacher_id },
              { school_id: newTeacherFieldNotValidDataTypes.school_id },
            ],
            newTeacherFieldNotValidDataTypes,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::04 - Passing a non-existent field ", () => {
        it("should return a not non-existent field error", async () => {
          // mock services
          const findField = mockService(
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the field exists",
          });
          expect(statusCode).toBe(404);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            [
              { school_id: newTeacherField.school_id },
              { teacher_id: newTeacherField.teacher_id },
              { field_id: newTeacherField.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherField.teacher_id },
              { school_id: newTeacherField.school_id },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::05 - Passing a not matching school id in the body", () => {
        it("should return a not matching school id error", async () => {
          // mock services
          const findField = mockService(
            {
              ...fieldPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the field belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            [
              { school_id: newTeacherField.school_id },
              { teacher_id: newTeacherField.teacher_id },
              { field_id: newTeacherField.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherField.teacher_id },
              { school_id: newTeacherField.school_id },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::06 - Passing a field but not updating it because the field has already been assigned to the teacher", () => {
        it("should not update a teacher_field", async () => {
          // mock services
          const findField = mockService(
            fieldPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            [teacherFieldPayload],
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "This field has already been assigned to the teacher!",
          });
          expect(statusCode).toBe(409);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).toHaveBeenCalled();
          expect(duplicateTeacherField).toHaveBeenCalledWith(
            [
              { school_id: newTeacherField.school_id },
              { teacher_id: newTeacherField.teacher_id },
              { field_id: newTeacherField.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).not.toHaveBeenCalled();
          expect(updateTeacherField).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherField.teacher_id },
              { school_id: newTeacherField.school_id },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::07 - Passing a field but not updating it because it does not match one of the filters: _id, school_id or teacher_id", () => {
        it("should not update a teacher_field", async () => {
          // mock services
          const findField = mockService(
            fieldPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "The teacher has not been assigned the updated field",
          });
          expect(statusCode).toBe(404);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).toHaveBeenCalled();
          expect(duplicateTeacherField).toHaveBeenCalledWith(
            [
              { school_id: newTeacherField.school_id },
              { teacher_id: newTeacherField.teacher_id },
              { field_id: newTeacherField.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).toHaveBeenCalled();
          expect(updateTeacherField).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherField.teacher_id },
              { school_id: newTeacherField.school_id },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::08 - Passing a field correctly to update", () => {
        it("should update a field", async () => {
          // mock services
          const findField = mockService(
            fieldPayload,
            "findPopulateResourceById"
          );
          const duplicateTeacherField = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateTeacherField = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);
          // assertions
          expect(body).toStrictEqual({
            msg: "The teacher has been successfully assigned the updated field",
          });
          expect(statusCode).toBe(200);
          expect(findField).toHaveBeenCalled();
          expect(findField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(duplicateTeacherField).toHaveBeenCalled();
          expect(duplicateTeacherField).toHaveBeenCalledWith(
            [
              { school_id: newTeacherField.school_id },
              { teacher_id: newTeacherField.teacher_id },
              { field_id: newTeacherField.field_id },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherField).toHaveBeenCalled();
          expect(updateTeacherField).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: newTeacherField.teacher_id },
              { school_id: newTeacherField.school_id },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
    });

    describe("DELETE /teacher_field ", () => {
      describe("teacher_field::delete::01 - Passing fields with missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherFieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherFieldId}`)
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
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: null },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::02 - Passing fields with empty fields", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherFieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherFieldId}`)
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
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: "" },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::03 - Passing an invalid teacher_field and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherFieldNullPayload,
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
              msg: "The teacher_field id is not valid",
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
          expect(deleteTeacher).not.toHaveBeenCalled();
          expect(deleteTeacher).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::04 - Passing a teacher_field id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherFieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher_Field not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteTeacher).toHaveBeenCalled();
          expect(deleteTeacher).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::05 - Passing a teacher_field id correctly to delete", () => {
        it("should delete a teacher_field", async () => {
          // mock services
          const deleteTeacher = mockService(
            teacherFieldPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher_Field deleted" });
          expect(statusCode).toBe(200);
          expect(deleteTeacher).toHaveBeenCalled();
          expect(deleteTeacher).toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
    });
  });

  describe("Resource => Schedule", () => {
    // end point url
    const endPointUrl = "/api/v1/schedules/";

    // inputs
    const validMockScheduleId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newSchedule = {
      school_id: validMockSchoolId,
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
    const newScheduleMissingValues = {
      school_i: validMockSchoolId,
      nam: "Schedule 001",
      day_star: 420,
      shift_number_minute: 360,
      class_unit_minute: 40,
      monda: true,
      tuesda: true,
      wednesda: true,
      thursda: true,
      frida: true,
      saturda: true,
      sunda: true,
    };
    const newScheduleEmptyValues = {
      school_id: "",
      name: "",
      dayStart: "",
      shiftNumberMinutes: "",
      classUnitMinutes: "",
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: "",
    };
    const newScheduleNotValidDataTypes = {
      school_id: invalidMockId,
      name: 432,
      dayStart: "hello",
      shiftNumberMinutes: "hello",
      classUnitMinutes: "hello",
      monday: "hello",
      tuesday: "hello",
      wednesday: "hello",
      thursday: "hello",
      friday: "hello",
      saturday: "hello",
      sunday: "hello",
    };
    const newScheduleWrongLengthValues = {
      school_id: validMockSchoolId,
      name: "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
      dayStart: 1234567890,
      shiftNumberMinutes: 1234567890,
      classUnitMinutes: 1234567890,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "School 001",
      groupMaxNumStudents: 40,
    };
    const schoolNullPayload = null;
    const schedulePayload = {
      _id: validMockScheduleId,
      school_id: validMockSchoolId,
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
    const schedulesPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
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
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        name: "Schedule 002",
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
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        name: "Schedule 003",
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
      },
    ];
    const schedulesNullPayload: Schedule[] = [];

    // test blocks
    describe("POST /schedule ", () => {
      describe("schedule::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newScheduleMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "Please add the class unit length",
              param: "classUnitMinutes",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            newScheduleMissingValues.school_i,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            {
              school_id: newScheduleMissingValues.school_i,
              name: newScheduleMissingValues.nam,
            },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newScheduleMissingValues,
            "schedule"
          );
        });
      });
      describe("schedule::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newScheduleEmptyValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "The class unit length field is empty",
              param: "classUnitMinutes",
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            newScheduleEmptyValues.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            {
              school_id: newScheduleEmptyValues.school_id,
              name: newScheduleEmptyValues.name,
            },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newScheduleEmptyValues,
            "schedule"
          );
        });
      });
      describe("schedule::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newScheduleNotValidDataTypes);

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
              msg: "class unit length value is not valid",
              param: "classUnitMinutes",
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
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            newScheduleNotValidDataTypes.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            {
              school_id: newScheduleNotValidDataTypes.school_id,
              name: newScheduleNotValidDataTypes.name,
            },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newScheduleNotValidDataTypes,
            "schedule"
          );
        });
      });
      describe("schedule::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newScheduleWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
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
              param: "classUnitMinutes",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            newScheduleWrongLengthValues.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            {
              school_id: newScheduleWrongLengthValues.school_id,
              name: newScheduleWrongLengthValues.name,
            },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newScheduleWrongLengthValues,
            "schedule"
          );
        });
      });
      describe("schedule::post::05 - Passing day start after the 23:59 in the body", () => {
        it("should return a day start after the 23:59 error", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(schedulePayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newSchedule, dayStart: 1440 });

          // assertions
          expect(body).toStrictEqual({
            msg: "The school shift start must exceed 11:59 p.m.",
          });
          expect(statusCode).toBe(400);
          expect(findSchool).not.toHaveBeenCalled();
          expect(findSchool).not.toHaveBeenCalledWith(
            newSchedule.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            { school_id: newSchedule.school_id, name: newSchedule.name },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::06 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchool = mockService(schoolNullPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(schedulePayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the school first",
          });
          expect(statusCode).toBe(409);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            newSchedule.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).not.toHaveBeenCalled();
          expect(findSchedule).not.toHaveBeenCalledWith(
            { school_id: newSchedule.school_id, name: newSchedule.name },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::07 - Passing an already existing schedule name", () => {
        it("should return an existing schedule name", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const findSchedule = mockService(
            schedulePayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "This schedule name already exists",
          });
          expect(statusCode).toBe(409);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            newSchedule.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            { school_id: newSchedule.school_id, name: newSchedule.name },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).not.toHaveBeenCalled();
          expect(insertSchedule).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::08 - Passing a schedule but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(
            scheduleNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "Schedule not created",
          });
          expect(statusCode).toBe(400);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            newSchedule.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            { school_id: newSchedule.school_id, name: newSchedule.name },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).toHaveBeenCalled();
          expect(insertSchedule).toHaveBeenCalledWith(newSchedule, "schedule");
        });
      });
      describe("schedule::post::09 - Passing a schedule correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findSchool = mockService(schoolPayload, "findResourceById");
          const findSchedule = mockService(
            scheduleNullPayload,
            "findResourceByProperty"
          );
          const insertSchedule = mockService(schedulePayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "Schedule created successfully!",
          });
          expect(statusCode).toBe(201);
          expect(findSchool).toHaveBeenCalled();
          expect(findSchool).toHaveBeenCalledWith(
            newSchedule.school_id,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findSchedule).toHaveBeenCalled();
          expect(findSchedule).toHaveBeenCalledWith(
            { school_id: newSchedule.school_id, name: newSchedule.name },
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertSchedule).toHaveBeenCalled();
          expect(insertSchedule).toHaveBeenCalledWith(newSchedule, "schedule");
        });
      });
    });

    describe("GET /schedule ", () => {
      describe("schedule - GET", () => {
        describe("schedule::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findSchedules = mockService(
              schedulesNullPayload,
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
            expect(findSchedules).not.toHaveBeenCalled();
            expect(findSchedules).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findSchedules = mockService(
              schedulesNullPayload,
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
            expect(findSchedules).not.toHaveBeenCalled();
            expect(findSchedules).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSchedules = mockService(
              schedulesNullPayload,
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
            expect(findSchedules).not.toHaveBeenCalled();
            expect(findSchedules).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findSchedules = mockService(
              schedulesNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No schedules found",
            });
            expect(statusCode).toBe(404);
            expect(findSchedules).toHaveBeenCalled();
            expect(findSchedules).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findSchedules = mockService(
              schedulesPayload,
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
                classUnitMinutes: 40,
                dayStart: 420,
                friday: true,
                monday: true,
                name: "Schedule 001",
                shiftNumberMinutes: 360,
                saturday: true,
                sunday: true,
                thursday: true,
                tuesday: true,
                wednesday: true,
              },
              {
                _id: expect.any(String),
                school_id: expect.any(String),
                classUnitMinutes: 40,
                dayStart: 420,
                friday: true,
                monday: true,
                name: "Schedule 002",
                shiftNumberMinutes: 360,
                saturday: true,
                sunday: true,
                thursday: true,
                tuesday: true,
                wednesday: true,
              },
              {
                _id: expect.any(String),
                school_id: expect.any(String),
                classUnitMinutes: 40,
                dayStart: 420,
                friday: true,
                monday: true,
                name: "Schedule 003",
                shiftNumberMinutes: 360,
                saturday: true,
                sunday: true,
                thursday: true,
                tuesday: true,
                wednesday: true,
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findSchedules).toHaveBeenCalled();
            expect(findSchedules).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
      });

      describe("schedule - GET/:id", () => {
        describe("schedule::get/:id::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findSchedule = mockService(
              scheduleNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockScheduleId}`)
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
            expect(findSchedule).not.toHaveBeenCalled();
            expect(findSchedule).not.toHaveBeenCalledWith(
              { _id: validMockScheduleId, school_id: null },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findSchedule = mockService(
              scheduleNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockScheduleId}`)
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
            expect(findSchedule).not.toHaveBeenCalled();
            expect(findSchedule).not.toHaveBeenCalledWith(
              { _id: validMockScheduleId, school_id: "" },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSchedule = mockService(
              scheduleNullPayload,
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
            ]);
            expect(statusCode).toBe(400);
            expect(findSchedule).not.toHaveBeenCalled();
            expect(findSchedule).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findSchedule = mockService(
              scheduleNullPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Schedule not found",
            });
            expect(statusCode).toBe(404);
            expect(findSchedule).toHaveBeenCalled();
            expect(findSchedule).toHaveBeenCalledWith(
              { _id: otherValidMockId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findSchedule = mockService(
              schedulePayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockScheduleId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              _id: validMockScheduleId,
              school_id: validMockSchoolId,
              classUnitMinutes: 40,
              dayStart: 420,
              friday: true,
              monday: true,
              name: "Schedule 001",
              shiftNumberMinutes: 360,
              saturday: true,
              sunday: true,
              thursday: true,
              tuesday: true,
              wednesday: true,
            });
            expect(statusCode).toBe(200);
            expect(findSchedule).toHaveBeenCalled();
            expect(findSchedule).toHaveBeenCalledWith(
              { _id: validMockScheduleId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
      });
    });

    describe("PUT /schedule ", () => {
      describe("schedule::put::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newScheduleMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "Please add the class unit length",
              param: "classUnitMinutes",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Mondays",
              param: "monday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Tuesdays",
              param: "tuesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Wednesdays",
              param: "wednesday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Thursdays",
              param: "thursday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Fridays",
              param: "friday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Saturdays",
              param: "saturday",
            },
            {
              location: "body",
              msg: "Please add if the teacher is available to work on Sundays",
              param: "sunday",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateScheduleName).not.toHaveBeenCalled();
          expect(duplicateScheduleName).not.toHaveBeenCalledWith(
            [
              { school_id: newScheduleMissingValues.school_i },
              { name: newScheduleMissingValues.nam },
            ],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newScheduleMissingValues.school_i },
            ],
            newScheduleMissingValues,
            "schedule"
          );
        });
      });
      describe("schedule::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newScheduleEmptyValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "The class unit length field is empty",
              param: "classUnitMinutes",
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateScheduleName).not.toHaveBeenCalled();
          expect(duplicateScheduleName).not.toHaveBeenCalledWith(
            [
              { school_id: newScheduleEmptyValues.school_id },
              { name: newScheduleEmptyValues.name },
            ],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newScheduleEmptyValues.school_id },
            ],
            newScheduleEmptyValues,
            "schedule"
          );
        });
      });
      describe("schedule::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newScheduleNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "class unit length value is not valid",
              param: "classUnitMinutes",
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
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateScheduleName).not.toHaveBeenCalled();
          expect(duplicateScheduleName).not.toHaveBeenCalledWith(
            [
              { school_id: newScheduleNotValidDataTypes.school_id },
              { name: newScheduleNotValidDataTypes.name },
            ],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newScheduleNotValidDataTypes.school_id },
            ],
            newScheduleNotValidDataTypes,
            "schedule"
          );
        });
      });
      describe("schedule::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newScheduleWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
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
              param: "classUnitMinutes",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateScheduleName).not.toHaveBeenCalled();
          expect(duplicateScheduleName).not.toHaveBeenCalledWith(
            [
              { school_id: newScheduleWrongLengthValues.school_id },
              { name: newScheduleWrongLengthValues.name },
            ],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newScheduleWrongLengthValues.school_id },
            ],
            newScheduleWrongLengthValues,
            "schedule"
          );
        });
      });
      describe("schedule::put::05 - Passing day start after the 23:59 in the body", () => {
        it("should return a day start after the 23:59 error", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send({ ...newSchedule, dayStart: 1440 });

          // assertions
          expect(body).toStrictEqual({
            msg: "The school shift start must exceed 11:59 p.m.",
          });
          expect(statusCode).toBe(400);
          expect(duplicateScheduleName).not.toHaveBeenCalled();
          expect(duplicateScheduleName).not.toHaveBeenCalledWith(
            [{ school_id: newSchedule.school_id }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newSchedule.school_id },
            ],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::06 - Passing a schedule but not updating it because schedule name already exist", () => {
        it("should not update a schedule", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "This schedule name already exists!",
          });
          expect(statusCode).toBe(409);
          expect(duplicateScheduleName).toHaveBeenCalled();
          expect(duplicateScheduleName).toHaveBeenCalledWith(
            [{ school_id: newSchedule.school_id }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).not.toHaveBeenCalled();
          expect(updateSchedule).not.toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newSchedule.school_id },
            ],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::07 - Passing a schedule but not updating it because it does not match the filters", () => {
        it("should not update a schedule", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            scheduleNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({ msg: "Schedule not updated" });
          expect(statusCode).toBe(404);
          expect(duplicateScheduleName).toHaveBeenCalled();
          expect(duplicateScheduleName).toHaveBeenCalledWith(
            [{ school_id: newSchedule.school_id }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).toHaveBeenCalled();
          expect(updateSchedule).toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newSchedule.school_id },
            ],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::08 - Passing a schedule correctly to update", () => {
        it("should update a schedule", async () => {
          // mock services
          const duplicateScheduleName = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateSchedule = mockService(
            schedulePayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({ msg: "Schedule updated" });
          expect(statusCode).toBe(200);
          expect(duplicateScheduleName).toHaveBeenCalled();
          expect(duplicateScheduleName).toHaveBeenCalledWith(
            [{ school_id: newSchedule.school_id }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateSchedule).toHaveBeenCalled();
          expect(updateSchedule).toHaveBeenCalledWith(
            [
              { _id: validMockScheduleId },
              { school_id: newSchedule.school_id },
            ],
            newSchedule,
            "schedule"
          );
        });
      });
    });

    describe("DELETE /schedule ", () => {
      describe("schedule::delete::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteSchedule = mockService(
            scheduleNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockScheduleId}`)
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
          expect(deleteSchedule).not.toHaveBeenCalled();
          expect(deleteSchedule).not.toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: null },
            "schedule"
          );
        });
      });
      describe("schedule::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteSchedule = mockService(
            scheduleNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockScheduleId}`)
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
          expect(deleteSchedule).not.toHaveBeenCalled();
          expect(deleteSchedule).not.toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: "" },
            "schedule"
          );
        });
      });
      describe("schedule::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSchedule = mockService(
            scheduleNullPayload,
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
          ]);
          expect(statusCode).toBe(400);
          expect(deleteSchedule).not.toHaveBeenCalled();
          expect(deleteSchedule).not.toHaveBeenCalledWith(
            { _id: "", school_id: "" },
            "schedule"
          );
        });
      });
      describe("schedule::delete::04 - Passing a schedule id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteSchedule = mockService(
            scheduleNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Schedule not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteSchedule).toHaveBeenCalled();
          expect(deleteSchedule).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
      describe("schedule::delete::05 - Passing a schedule id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteSchedule = mockService(
            schedulePayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockScheduleId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Schedule deleted" });
          expect(statusCode).toBe(200);
          expect(deleteSchedule).toHaveBeenCalled();
          expect(deleteSchedule).toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
    });
  });

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

  describe("Resource => Level", () => {
    // end point url
    const endPointUrl = "/api/v1/levels/";

    // inputs
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

    // payloads
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
          expect(insertLevelService).not.toHaveBeenCalledWith(
            newLevel,
            "level"
          );
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
          const insertLevelService = mockService(
            levelPayload,
            "insertResource"
          );

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
          expect(insertLevelService).not.toHaveBeenCalledWith(
            newLevel,
            "level"
          );
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
          const insertLevelService = mockService(
            levelPayload,
            "insertResource"
          );

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
          expect(insertLevelService).not.toHaveBeenCalledWith(
            newLevel,
            "level"
          );
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
          expect(insertLevelService).not.toHaveBeenCalledWith(
            newLevel,
            "level"
          );
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
          const insertLevelService = mockService(
            levelPayload,
            "insertResource"
          );

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
            const findLevel = mockService(
              levelPayload,
              "findResourceByProperty"
            );

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

  describe("Resource => Group", () => {
    // end point url
    const endPointUrl = "/api/v1/groups/";

    // inputs
    const validMockGroupId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockLevelId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newGroup = {
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      coordinator_id: validMockCoordinatorId,
      name: "Group 001",
      numberStudents: 40,
    };
    const newGroupMissingValues = {
      school_i: validMockSchoolId,
      level_i: validMockLevelId,
      coordinator_i: validMockCoordinatorId,
      nam: "Group 001",
      numberStudent: 40,
    };
    const newGroupEmptyValues = {
      school_id: "",
      level_id: "",
      coordinator_id: "",
      name: "",
      numberStudents: "",
    };
    const newGroupNotValidDataTypes = {
      school_id: invalidMockId,
      level_id: invalidMockId,
      coordinator_id: invalidMockId,
      name: 432943,
      numberStudents: "hello",
    };
    const newGroupWrongLengthValues = {
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      coordinator_id: validMockCoordinatorId,
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
      numberStudents: 1234567890,
    };

    // payloads
    const groupPayload = {
      _id: validMockGroupId,
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      coordinator_id: validMockCoordinatorId,
      name: "Group 001",
      numberStudents: 40,
    };
    const groupNullPayload = null;
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "School 001",
      groupMaxNumStudents: 40,
    };
    const levelPayload = {
      _id: validMockLevelId,
      school_id: schoolPayload,
      schedule_id: validMockLevelId,
      name: "Level 001",
    };
    const levelNullPayload = null;
    const coordinatorPayload = {
      _id: validMockCoordinatorId,
      school_id: schoolPayload,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail.com",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const coordinatorNullPayload = null;
    const groupsPayload = [
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
    const groupsNullPayload: Group[] = [];

    // test blocks
    describe("POST /group ", () => {
      describe("group::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroupMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add a group name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            {
              school_id: newGroupMissingValues.school_i,
              name: newGroupMissingValues.nam,
            },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupMissingValues.level_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupMissingValues.coordinator_i,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(
            newGroupMissingValues,
            "group"
          );
        });
      });
      describe("group::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroupEmptyValues);

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
              msg: "The level id field is empty",
              param: "level_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The group name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group number of students field is empty",
              param: "numberStudents",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            {
              school_id: newGroupEmptyValues.school_id,
              name: newGroupEmptyValues.name,
            },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupEmptyValues.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupEmptyValues.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(
            newGroupEmptyValues,
            "group"
          );
        });
      });
      describe("group::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroupNotValidDataTypes);

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
              msg: "The level id is not valid",
              param: "level_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The group name is not valid",
              param: "name",
              value: 432943,
            },
            {
              location: "body",
              msg: "group number of students value is not valid",
              param: "numberStudents",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            { school_id: invalidMockId, name: newGroupNotValidDataTypes.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            invalidMockId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            invalidMockId,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(
            newGroupNotValidDataTypes,
            "group"
          );
        });
      });
      describe("group::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroupWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The group name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "numberStudents",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            {
              school_id: newGroupWrongLengthValues.school_id,
              name: newGroupWrongLengthValues.name,
            },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupWrongLengthValues.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupWrongLengthValues.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(
            newGroupWrongLengthValues,
            "group"
          );
        });
      });
      describe("group::post::05 - Passing a duplicate group name", () => {
        it("should return a duplicate group name", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "This group name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::06 - Passing a non-existent level", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::07 - Passing a non matching school id for the level", () => {
        it("should return a non matching school id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            {
              ...levelPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::08 - Passing a number of students larger than the max allowed number of students", () => {
        it("should return a larger than the max allowed number of students error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newGroup, numberStudents: 41 });

          // assertions
          expect(body).toStrictEqual({
            msg: `Please take into account that the number of students for any group cannot exceed ${levelPayload.school_id.groupMaxNumStudents} students`,
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::09 - Passing a non-existent coordinator", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::10 - Passing a non matching school id for the coordinator", () => {
        it("should return a non matching school id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::11 - Passing a user with no coordinator role as coordinator", () => {
        it("should return an invalid role error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              role: "teacher",
            },
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::12 - Passing a coordinator with a non-active status", () => {
        it("should return a non-active status coordinator id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              status: "inactive",
            },
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).not.toHaveBeenCalled();
          expect(insertGroup).not.toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::13 - Passing a group but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({ msg: "Group not created!" });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).toHaveBeenCalled();
          expect(insertGroup).toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::14 - Passing a group correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupNullPayload,
            "findResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const insertGroup = mockService(groupPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({ msg: "Group created!" });
          expect(statusCode).toBe(200);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            { school_id: newGroup.school_id, name: newGroup.name },
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(insertGroup).toHaveBeenCalled();
          expect(insertGroup).toHaveBeenCalledWith(newGroup, "group");
        });
      });
    });

    describe("GET /group ", () => {
      describe("group - GET", () => {
        describe("group::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findGroups = mockService(
              groupsNullPayload,
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
            expect(findGroups).not.toHaveBeenCalled();
            expect(findGroups).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findGroups = mockService(
              groupsNullPayload,
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
            expect(findGroups).not.toHaveBeenCalled();
            expect(findGroups).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findGroups = mockService(
              groupsNullPayload,
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
            expect(findGroups).not.toHaveBeenCalled();
            expect(findGroups).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::04 - Requesting all groups but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findGroups = mockService(
              groupsNullPayload,
              "findFilterAllResources"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });
            // assertions
            expect(body).toStrictEqual({ msg: "No groups found" });
            expect(statusCode).toBe(404);
            expect(findGroups).toHaveBeenCalled();
            expect(findGroups).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::05 - Requesting all groups correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findGroups = mockService(
              groupsPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(groupsPayload);
            expect(statusCode).toBe(200);
            expect(findGroups).toHaveBeenCalled();
            expect(findGroups).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
      });

      describe("group - GET/:id", () => {
        describe("group::get/:id::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findGroup = mockService(
              groupNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
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
            expect(findGroup).not.toHaveBeenCalled();
            expect(findGroup).not.toHaveBeenCalledWith(
              { _id: validMockGroupId, school_id: null },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findGroup = mockService(
              groupNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
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
            expect(findGroup).not.toHaveBeenCalled();
            expect(findGroup).not.toHaveBeenCalledWith(
              { _id: validMockGroupId, school_id: "" },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findGroup = mockService(
              groupNullPayload,
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
                msg: "The group id is not valid",
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
            expect(findGroup).not.toHaveBeenCalled();
            expect(findGroup).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::04 - Requesting a group but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findGroup = mockService(
              groupNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${otherValidMockId}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual({
              msg: "Group not found",
            });
            expect(statusCode).toBe(404);
            expect(findGroup).toHaveBeenCalled();
            expect(findGroup).toHaveBeenCalledWith(
              { _id: otherValidMockId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::05 - Requesting a group correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findGroup = mockService(
              groupPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(groupPayload);
            expect(statusCode).toBe(200);
            expect(findGroup).toHaveBeenCalled();
            expect(findGroup).toHaveBeenCalledWith(
              { _id: validMockGroupId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
      });
    });

    describe("PUT /group ", () => {
      describe("group::put::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroupMissingValues);

          // assertions
          expect(body).toStrictEqual([
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
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add a group name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            [
              { school_id: newGroupMissingValues.school_i },
              { name: newGroupMissingValues.nam },
            ],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupMissingValues.level_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupMissingValues.coordinator_i,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [
              { _id: validMockGroupId },
              { school_id: newGroupMissingValues.school_i },
            ],
            newGroupMissingValues,
            "group"
          );
        });
      });
      describe("group::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroupEmptyValues);

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
              msg: "The level id field is empty",
              param: "level_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The group name field is empty",
              param: "name",
              value: "",
            },
            {
              location: "body",
              msg: "The group number of students field is empty",
              param: "numberStudents",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            [
              { school_id: newGroupEmptyValues.school_id },
              { name: newGroupEmptyValues.name },
            ],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupEmptyValues.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupEmptyValues.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [
              { _id: validMockGroupId },
              { school_id: newGroupEmptyValues.school_id },
            ],
            newGroupEmptyValues,
            "group"
          );
        });
      });
      describe("group::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newGroupNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The group id is not valid",
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
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The group name is not valid",
              param: "name",
              value: 432943,
            },
            {
              location: "body",
              msg: "group number of students value is not valid",
              param: "numberStudents",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            [
              { school_id: invalidMockId },
              { name: newGroupNotValidDataTypes.name },
            ],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            invalidMockId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            invalidMockId,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: invalidMockId }, { school_id: invalidMockId }],
            newGroupNotValidDataTypes,
            "group"
          );
        });
      });
      describe("group::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroupWrongLengthValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The group name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "numberStudents",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).not.toHaveBeenCalled();
          expect(duplicateGroupName).not.toHaveBeenCalledWith(
            [
              { school_id: newGroupWrongLengthValues.school_id },
              { name: newGroupWrongLengthValues.name },
            ],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroupWrongLengthValues.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroupWrongLengthValues.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [
              { _id: validMockGroupId },
              { school_id: newGroupWrongLengthValues.school_id },
            ],
            newGroupWrongLengthValues,
            "group"
          );
        });
      });
      describe("group::put::05 - Passing a duplicate group name values", () => {
        it("should return a duplicate group name error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            [groupPayload],
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "This group name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(0);
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            1,
            newGroup.school_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::06 - Passing a non-existent level", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelNullPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::07 - Passing a non-matching school id for the level", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            {
              ...levelPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::08 - Passing a number students larger than the max allowed number of students", () => {
        it("should return a larger than the max allowed number of students error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send({ ...newGroup, numberStudents: 41 });

          // assertions
          expect(body).toStrictEqual({
            msg: `Please take into account that the number of students cannot exceed ${levelPayload.school_id.groupMaxNumStudents} students`,
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(1);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).not.toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::09 - Passing a non-existent coordinator", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorNullPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::10 - Passing a non-matching school id for the coordinator", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              school_id: {
                _id: otherValidMockId,
                name: "School 001",
                groupMaxNumStudents: 40,
              },
            },
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::11 - Passing a user with no coordinator role as coordinator", () => {
        it("should return an invalid role error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              role: "teacher",
            },
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::12 - Passing a coordinator with a non-active status", () => {
        it("should return a non-active status coordinator id error", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            {
              ...coordinatorPayload,
              status: "inactive",
            },
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).not.toHaveBeenCalled();
          expect(updateGroup).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::13 - Passing a group but not updating it because it does not match the filters", () => {
        it("should not update a group", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Group not updated",
          });
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).toHaveBeenCalled();
          expect(updateGroup).toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::14 - Passing a group correctly to update", () => {
        it("should update a group", async () => {
          // mock services
          const duplicateGroupName = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findLevelCoordinator = mockServiceMultipleReturns(
            levelPayload,
            coordinatorPayload,
            "findPopulateResourceById"
          );
          const updateGroup = mockService(groupPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Group updated!",
          });
          expect(statusCode).toBe(200);
          expect(duplicateGroupName).toHaveBeenCalled();
          expect(duplicateGroupName).toHaveBeenCalledWith(
            [{ school_id: newGroup.school_id }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findLevelCoordinator).toHaveBeenCalledTimes(2);
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            1,
            newGroup.level_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(findLevelCoordinator).toHaveBeenNthCalledWith(
            2,
            newGroup.coordinator_id,
            "-password -createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "user"
          );
          expect(updateGroup).toHaveBeenCalled();
          expect(updateGroup).toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: newGroup.school_id }],
            newGroup,
            "group"
          );
        });
      });
    });

    describe("DELETE /group ", () => {
      describe("group::delete::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteGroup = mockService(
            groupNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockGroupId}`)
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
          expect(deleteGroup).not.toHaveBeenCalled();
          expect(deleteGroup).not.toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: null },
            "group"
          );
        });
      });
      describe("group::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteGroup = mockService(
            groupNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockGroupId}`)
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
          expect(deleteGroup).not.toHaveBeenCalled();
          expect(deleteGroup).not.toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: "" },
            "group"
          );
        });
      });
      describe("group::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteGroup = mockService(
            groupNullPayload,
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
              msg: "The group id is not valid",
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
          expect(deleteGroup).not.toHaveBeenCalled();
          expect(deleteGroup).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "group"
          );
        });
      });
      describe("group::delete::04 - Passing a group id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteGroup = mockService(
            groupNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({ msg: "Group not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteGroup).toHaveBeenCalled();
          expect(deleteGroup).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
      describe("group::delete::05 - Passing a group id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteGroup = mockService(groupPayload, "deleteFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockGroupId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Group deleted" });
          expect(statusCode).toBe(200);
          expect(deleteGroup).toHaveBeenCalled();
          expect(deleteGroup).toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
    });
  });

  describe("Resource => subject", () => {
    // end point url
    const endPointUrl = "/api/v1/subjects/";

    // inputs
    const validMockSubjectId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockGroupId = new Types.ObjectId().toString();
    const validMockLevelId = new Types.ObjectId().toString();
    const validMockFieldId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newSubject = {
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      group_id: validMockGroupId,
      field_id: validMockFieldId,
      name: "Mathematics 101",
      classUnits: 30,
      frequency: 2,
    };
    const newSubjectMissingValues = {
      school_i: validMockSchoolId,
      coordinator_i: validMockCoordinatorId,
      group_i: validMockGroupId,
      field_i: validMockFieldId,
      nam: "Mathematics 101",
      classUnit: 30,
      frequenc: 2,
    };
    const newSubjectEmptyValues = {
      school_id: "",
      coordinator_id: "",
      group_id: "",
      field_id: "",
      name: "",
      classUnits: "",
      frequency: "",
    };
    const newSubjectNotValidDataTypes = {
      school_id: invalidMockId,
      coordinator_id: invalidMockId,
      group_id: invalidMockId,
      field_id: invalidMockId,
      name: 92334428,
      classUnits: "hello",
      frequency: "hello",
    };
    const newSubjectWrongLengthValues = {
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      group_id: validMockGroupId,
      field_id: validMockFieldId,
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
      classUnits: 1234567890,
      frequency: 1234567890,
    };

    // payloads
    const subjectPayload = {
      _id: validMockSubjectId,
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      group_id: validMockGroupId,
      field_id: validMockFieldId,
      name: "Mathematics 101",
      classUnits: 30,
      frequency: 2,
    };
    const subjectNullPayload = null;
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
      groupMaxNumStudents: 40,
    };
    const coordinatorPayload = {
      _id: validMockCoordinatorId,
      school_id: validMockSchoolId,
      firstName: "Dave",
      lastName: "Gray",
      email: "dave@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: false,
    };
    const groupPayload = {
      _id: validMockGroupId,
      school_id: schoolPayload,
      level_id: validMockLevelId,
      coordinator_id: coordinatorPayload,
      name: "Group 001",
      numberStudents: 40,
    };
    const fieldPayload = {
      _id: validMockFieldId,
      school_id: schoolPayload,
      name: "Mathematics",
    };
    const fieldNullPayload = null;
    const groupNullPayload = null;
    const subjectsPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        group_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
        name: "Mathematics 101",
        classUnits: 30,
        frequency: 2,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        group_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
        name: "Language 101",
        classUnits: 30,
        frequency: 2,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        group_id: new Types.ObjectId().toString(),
        field_id: new Types.ObjectId().toString(),
        name: "Physics 101",
        classUnits: 30,
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
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(
            subjectNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubjectMissingValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the group id",
              param: "group_id",
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
              msg: "Please add the number of class units",
              param: "classUnits",
            },
            {
              location: "body",
              msg: "Please add the subject class frequency",
              param: "frequency",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            {
              school_id: newSubjectMissingValues.school_i,
              name: newSubjectMissingValues.nam,
            },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectMissingValues.group_i,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectMissingValues.field_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(
            newSubjectMissingValues,
            "subject"
          );
        });
      });
      describe("subject::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(
            subjectNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubjectEmptyValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The group id field is empty",
              param: "group_id",
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
              msg: "The number of class units field is empty",
              param: "classUnits",
              value: "",
            },
            {
              location: "body",
              msg: "The subject class frequency field is empty",
              param: "frequency",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            {
              school_id: newSubjectEmptyValues.school_id,
              name: newSubjectEmptyValues.name,
            },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectEmptyValues.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectEmptyValues.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(
            newSubjectEmptyValues,
            "subject"
          );
        });
      });
      describe("subject::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(
            subjectNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubjectNotValidDataTypes);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The group id is not valid",
              param: "group_id",
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
              msg: "number of class units value is not valid",
              param: "classUnits",
              value: "hello",
            },
            {
              location: "body",
              msg: "subject class frequency value is not valid",
              param: "frequency",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            {
              school_id: newSubjectNotValidDataTypes.school_id,
              name: newSubjectNotValidDataTypes.name,
            },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectNotValidDataTypes.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectNotValidDataTypes.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(
            newSubjectNotValidDataTypes,
            "subject"
          );
        });
      });
      describe("subject::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(
            subjectNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubjectWrongLengthValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The subject name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The number of class units must not exceed 9 digits",
              param: "classUnits",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The subject class frequency must not exceed 9 digits",
              param: "frequency",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            {
              school_id: invalidMockId,
              name: newSubjectWrongLengthValues.name,
            },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectWrongLengthValues.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectWrongLengthValues.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(
            newSubjectWrongLengthValues,
            "subject"
          );
        });
      });
      describe("subject::post::05 - Passing a duplicate subject name value", () => {
        it("should return a duplicate field error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "This subject name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: newSubject.school_id, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::06 - Passing an non-existent group in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the group exists",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: newSubject.school_id, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::07 - Passing an non-matching school id for the group in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            { ...groupPayload, school_id: otherValidMockId },
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the group belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::08 - Passing an non-matching coordinator id for the subject parent group in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: otherValidMockId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the subject parent group",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::09 - Passing coordinator with a different role in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "teacher",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::10 - Passing coordinator with status different from active in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "inactive",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::11 - Passing an non-existent field in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field exists",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: newSubject.school_id, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::12 - Passing an non-matching school for the field in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            { ...fieldPayload, school_id: otherValidMockId },
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).not.toHaveBeenCalled();
          expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::13 - Passing a subject but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(
            subjectNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Subject not created!",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: newSubject.school_id, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).toHaveBeenCalled();
          expect(insertSubject).toHaveBeenCalledWith(newSubject, "subject");
        });
      });
      describe("subject::post::14 - Passing a subject correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const insertSubject = mockService(subjectPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Subject created!",
          });
          expect(statusCode).toBe(201);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            { school_id: newSubject.school_id, name: newSubject.name },
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertSubject).toHaveBeenCalled();
          expect(insertSubject).toHaveBeenCalledWith(newSubject, "subject");
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
            expect(findSubjects).not.toHaveBeenCalled();
            expect(findSubjects).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findSubjects = mockService(
              subjectsNullPayload,
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
            expect(findSubjects).not.toHaveBeenCalled();
            expect(findSubjects).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSubjects = mockService(
              subjectsNullPayload,
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
            expect(findSubjects).not.toHaveBeenCalled();
            expect(findSubjects).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get::04 - Requesting all subjects but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findSubjects = mockService(
              subjectsNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });

            // assertions
            expect(body).toStrictEqual({ msg: "No subjects found" });
            expect(statusCode).toBe(404);
            expect(findSubjects).toHaveBeenCalled();
            expect(findSubjects).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get::05 - Requesting all subjects correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findSubjects = mockService(
              subjectsPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(subjectsPayload);
            expect(statusCode).toBe(200);
            expect(findSubjects).toHaveBeenCalled();
            expect(findSubjects).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "subject"
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
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSubjectId}`)
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
            expect(findSubject).not.toHaveBeenCalled();
            expect(findSubject).not.toHaveBeenCalledWith(
              { _id: validMockSubjectId, school_id: null },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findSubject = mockService(
              subjectNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSubjectId}`)
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
            expect(findSubject).not.toHaveBeenCalled();
            expect(findSubject).not.toHaveBeenCalledWith(
              { _id: validMockSubjectId, school_id: "" },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findSubject = mockService(
              subjectNullPayload,
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
            ]);
            expect(statusCode).toBe(400);
            expect(findSubject).not.toHaveBeenCalled();
            expect(findSubject).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get/:id::04 - Requesting a subject but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findSubject = mockService(
              subjectNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSubjectId}`)
              .send({ school_id: otherValidMockId });
            // assertions
            expect(body).toStrictEqual({
              msg: "Subject not found",
            });
            expect(statusCode).toBe(404);
            expect(findSubject).toHaveBeenCalled();
            expect(findSubject).toHaveBeenCalledWith(
              { _id: validMockSubjectId, school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "subject"
            );
          });
        });
        describe("subject::get/:id::05 - Requesting a subject correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findSubject = mockService(
              subjectPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSubjectId}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual(subjectPayload);
            expect(statusCode).toBe(200);
            expect(findSubject).toHaveBeenCalled();
            expect(findSubject).toHaveBeenCalledWith(
              { _id: validMockSubjectId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "subject"
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
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubjectMissingValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the group id",
              param: "group_id",
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
              msg: "Please add the number of class units",
              param: "classUnits",
            },
            {
              location: "body",
              msg: "Please add the subject class frequency",
              param: "frequency",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            [
              { school_id: newSubjectMissingValues.school_i },
              { name: newSubjectMissingValues.nam },
            ],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectMissingValues.group_i,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectMissingValues.field_i,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [
              { _id: validMockSubjectId },
              { school_id: newSubjectMissingValues.school_i },
            ],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubjectEmptyValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The group id field is empty",
              param: "group_id",
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
              msg: "The number of class units field is empty",
              param: "classUnits",
              value: "",
            },
            {
              location: "body",
              msg: "The subject class frequency field is empty",
              param: "frequency",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            [
              { school_id: newSubjectEmptyValues.school_id },
              { name: newSubjectEmptyValues.name },
            ],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectEmptyValues.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectEmptyValues.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [
              { _id: validMockSubjectId },
              { school_id: newSubjectEmptyValues.school_id },
            ],
            newSubjectEmptyValues,
            "subject"
          );
        });
      });
      describe("subject::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newSubjectNotValidDataTypes);

          // assertions;
          expect(body).toStrictEqual([
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
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The group id is not valid",
              param: "group_id",
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
              msg: "number of class units value is not valid",
              param: "classUnits",
              value: "hello",
            },
            {
              location: "body",
              msg: "subject class frequency value is not valid",
              param: "frequency",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            [
              { school_id: newSubjectNotValidDataTypes.school_id },
              { name: newSubjectNotValidDataTypes.name },
            ],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectNotValidDataTypes.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectNotValidDataTypes.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [
              { _id: invalidMockId },
              { school_id: newSubjectNotValidDataTypes.school_id },
            ],
            newSubjectNotValidDataTypes,
            "subject"
          );
        });
      });
      describe("subject::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubjectWrongLengthValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The subject name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The number of class units must not exceed 9 digits",
              param: "classUnits",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The subject class frequency must not exceed 9 digits",
              param: "frequency",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).not.toHaveBeenCalled();
          expect(duplicateSubjectName).not.toHaveBeenCalledWith(
            [
              { school_id: newSubjectWrongLengthValues.school_id },
              { name: newSubjectWrongLengthValues.name },
            ],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubjectWrongLengthValues.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubjectWrongLengthValues.group_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [
              { _id: validMockSubjectId },
              { school_id: newSubjectWrongLengthValues.group_id },
            ],
            newSubjectWrongLengthValues,
            "subject"
          );
        });
      });
      describe("subject::put::05 - Passing a duplicate subject name value", () => {
        it("should return a duplicate field error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "This subject name already exists",
          });
          expect(statusCode).toBe(409);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: newSubject.school_id }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(0);
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::06 - Passing an non-existent group in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupNullPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the group exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: newSubject.school_id }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::07 - Passing an non-matching school for the group in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            { ...fieldPayload, school_id: otherValidMockId },
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::08 - Passing an non-matching coordinator id for the subject parent group in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: otherValidMockId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the subject parent group",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::09 - Passing coordinator with a different role in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "teacher",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::10 - Passing coordinator with status different from active in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            {
              ...groupPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "inactive",
                hasTeachingFunc: false,
              },
            },
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(1);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).not.toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::11 - Passing an non-existent field in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldNullPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field exists",
          });
          expect(statusCode).toBe(404);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: newSubject.school_id }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::12 - Passing an non-matching school for the field in the body", () => {
        it("should return a non-matching school error", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            { ...fieldPayload, school_id: otherValidMockId },
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).not.toHaveBeenCalled();
          expect(updateSubject).not.toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::13 - Passing a subject but not being created", () => {
        it("should not update a subject", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Subject not updated",
          });
          expect(statusCode).toBe(404);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: newSubject.school_id }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).toHaveBeenCalled();
          expect(updateSubject).toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
            newSubject,
            "subject"
          );
        });
      });
      describe("subject::put::14 - Passing a subject correctly to update", () => {
        it("should update a subject", async () => {
          // mock services
          const duplicateSubjectName = mockService(
            subjectsNullPayload,
            "findFilterResourceByProperty"
          );
          const findGroupField = mockServiceMultipleReturns(
            groupPayload,
            fieldPayload,
            "findPopulateResourceById"
          );
          const updateSubject = mockService(
            subjectPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSubjectId}`)
            .send(newSubject);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Subject updated!",
          });
          expect(statusCode).toBe(200);
          expect(duplicateSubjectName).toHaveBeenCalled();
          expect(duplicateSubjectName).toHaveBeenCalledWith(
            [{ school_id: newSubject.school_id }, { name: newSubject.name }],
            "-createdAt -updatedAt",
            "subject"
          );
          expect(findGroupField).toHaveBeenCalledTimes(2);
          expect(findGroupField).toHaveBeenNthCalledWith(
            1,
            newSubject.group_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id",
            "-createdAt -updatedAt",
            "group"
          );
          expect(findGroupField).toHaveBeenNthCalledWith(
            2,
            newSubject.field_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateSubject).toHaveBeenCalled();
          expect(updateSubject).toHaveBeenCalledWith(
            [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
            newSubject,
            "subject"
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
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSubjectId}`)
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
          expect(deleteSubject).not.toHaveBeenCalled();
          expect(deleteSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: null },
            "subject"
          );
        });
      });
      describe("subject::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteSubject = mockService(
            subjectNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSubjectId}`)
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
          expect(deleteSubject).not.toHaveBeenCalled();
          expect(deleteSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: "" },
            "subject"
          );
        });
      });
      describe("subject::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSubject = mockService(
            subjectNullPayload,
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
          ]);
          expect(statusCode).toBe(400);
          expect(deleteSubject).not.toHaveBeenCalled();
          expect(deleteSubject).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "subject"
          );
        });
      });
      describe("subject::delete::04 - Passing a subject id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteSubject = mockService(
            subjectNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({ msg: "Subject not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteSubject).toHaveBeenCalled();
          expect(deleteSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: otherValidMockId },
            "subject"
          );
        });
      });
      describe("subject::delete::05 - Passing a subject id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteSubject = mockService(
            subjectPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Subject deleted" });
          expect(statusCode).toBe(200);
          expect(deleteSubject).toHaveBeenCalled();
          expect(deleteSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: validMockSchoolId },
            "subject"
          );
        });
      });
    });
  });

  describe("Resource => Class", () => {
    // end point url
    const endPointUrl = "/api/v1/classes/";

    // inputs
    const validMockClassId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockSubjectId = new Types.ObjectId().toString();
    const validMockTeacherFieldId = new Types.ObjectId().toString();
    const validMockTeacherId = new Types.ObjectId().toString();
    const validMockUserId = new Types.ObjectId().toString();
    const validMockGroupId = new Types.ObjectId().toString();
    const validMockFieldId = new Types.ObjectId().toString();
    const otherValidMockId = new Types.ObjectId().toString();
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newClass = {
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      subject_id: validMockSubjectId,
      teacherField_id: validMockTeacherFieldId,
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    };
    const newClassMissingValues = {
      school_i: validMockSchoolId,
      coordinator_i: validMockCoordinatorId,
      subject_i: validMockSubjectId,
      teacherField_i: validMockTeacherFieldId,
      startTim: 420,
      groupScheduleSlo: 2,
      teacherScheduleSlo: 2,
    };
    const newClassEmptyValues = {
      school_id: "",
      coordinator_id: "",
      subject_id: "",
      teacherField_id: "",
      startTime: "",
      groupScheduleSlot: "",
      teacherScheduleSlot: "",
    };
    const newClassNotValidDataTypes = {
      school_id: invalidMockId,
      coordinator_id: invalidMockId,
      subject_id: invalidMockId,
      teacherField_id: invalidMockId,
      startTime: "hello",
      groupScheduleSlot: "hello",
      teacherScheduleSlot: "hello",
    };
    const newClassWrongLengthValues = {
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      subject_id: validMockSubjectId,
      teacherField_id: validMockTeacherFieldId,
      startTime: 1234567890,
      groupScheduleSlot: 1234567890,
      teacherScheduleSlot: 1234567890,
    };

    // payloads
    const classPayload = {
      _id: validMockClassId,
      school_id: validMockSchoolId,
      coordinator_id: validMockCoordinatorId,
      subject_id: validMockSubjectId,
      teacherField_id: validMockTeacherFieldId,
      startTime: 420,
      groupScheduleSlot: 2,
      teacherScheduleSlot: 2,
    };
    const classNullPayload = null;
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
      groupMaxNumStudents: 40,
    };
    const coordinatorPayload = {
      _id: validMockCoordinatorId,
      school_id: validMockSchoolId,
      firstName: "Dave",
      lastName: "Gray",
      email: "dave@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const fieldPayload = {
      _id: validMockFieldId,
      school_id: validMockSchoolId,
      name: "Mathematics",
    };
    const subjectPayload = {
      _id: validMockSubjectId,
      school_id: schoolPayload,
      coordinator_id: coordinatorPayload,
      group_id: validMockGroupId,
      field_id: fieldPayload,
      name: "Mathematics 101",
      classUnits: 30,
      frequency: 2,
    };
    const subjectNullPayload = null;
    const teacherPayload = {
      _id: validMockTeacherId,
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
    const teacherFieldPayload = {
      _id: validMockTeacherFieldId,
      school_id: schoolPayload,
      teacher_id: teacherPayload,
      field_id: validMockFieldId,
    };
    const teacherFieldNullPayload = null;
    const classesPayload = [
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        subject_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        startTime: 420,
        groupScheduleSlot: 2,
        teacherScheduleSlot: 2,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        subject_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        startTime: 420,
        groupScheduleSlot: 2,
        teacherScheduleSlot: 2,
      },
      {
        _id: new Types.ObjectId().toString(),
        school_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        subject_id: new Types.ObjectId().toString(),
        teacher_id: new Types.ObjectId().toString(),
        startTime: 420,
        groupScheduleSlot: 2,
        teacherScheduleSlot: 2,
      },
    ];
    const classesNullPayload: Class[] = [];

    // test blocks
    describe("POST /class ", () => {
      describe("class::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClassMissingValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the subject id",
              param: "subject_id",
            },
            {
              location: "body",
              msg: "Please add the teacher_field id",
              param: "teacherField_id",
            },
            {
              location: "body",
              msg: "Please add the start time for the class",
              param: "startTime",
            },
            {
              location: "body",
              msg: "Please add the group schedule slot number for this class",
              param: "groupScheduleSlot",
            },
            {
              location: "body",
              msg: "Please add the teacher schedule slot number for this class",
              param: "teacherScheduleSlot",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassMissingValues.subject_i,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassMissingValues.teacherField_i,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(
            newClassMissingValues,
            "class"
          );
        });
      });
      describe("class::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClassEmptyValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The subject id field is empty",
              param: "subject_id",
              value: "",
            },
            {
              location: "body",
              msg: "The teacherField id teacher_field is empty",
              param: "teacherField_id",
              value: "",
            },
            {
              location: "body",
              msg: "The start time field is empty",
              param: "startTime",
              value: "",
            },
            {
              location: "body",
              msg: "The group schedule slot number field is empty",
              param: "groupScheduleSlot",
              value: "",
            },
            {
              location: "body",
              msg: "The teacher schedule slot number field is empty",
              param: "teacherScheduleSlot",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassEmptyValues.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassEmptyValues.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(
            newClassEmptyValues,
            "class"
          );
        });
      });
      describe("class::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClassNotValidDataTypes);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The subject id is not valid",
              param: "subject_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The teacher_field id is not valid",
              param: "teacherField_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "start time value is not valid",
              param: "startTime",
              value: "hello",
            },
            {
              location: "body",
              msg: "group schedule slot number value is not valid",
              param: "groupScheduleSlot",
              value: "hello",
            },
            {
              location: "body",
              msg: "teacher schedule slot number value is not valid",
              param: "teacherScheduleSlot",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassNotValidDataTypes.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassNotValidDataTypes.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(
            newClassNotValidDataTypes,
            "class"
          );
        });
      });
      describe("class::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClassWrongLengthValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "startTime",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The group schedule slot number must not exceed 9 digits",
              param: "groupScheduleSlot",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The teacher schedule slot number must not exceed 9 digits",
              param: "teacherScheduleSlot",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassWrongLengthValues.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassWrongLengthValues.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(
            newClassWrongLengthValues,
            "class"
          );
        });
      });
      describe("class::post::05 - Passing an non-existent subject in the body", () => {
        it("should return a non-existent subject error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the subject exists",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::06 - Passing an non-existent school for the subject in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              school_id: {
                _id: otherValidMockId,
                name: "school 001",
                groupMaxNumStudents: 40,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the subject belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::07 - Passing an non-existent coordinator for the subject in the body", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: otherValidMockId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the class parent subject",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::08 - Passing a coordinator with a different role in the body", () => {
        it("should return a not valid user/coordinator role error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "teacher",
                status: "active",
                hasTeachingFunc: false,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::09 - Passing a coordinator with a status different from active in the body", () => {
        it("should return a invalid status error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "inactive",
                hasTeachingFunc: false,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::10 - Passing an non-existent teacher_field in the body", () => {
        it("should return a non-existent teacher_field error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field_teacher assignment exists",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::11 - Passing an non-existent school for the teacher_field in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              school_id: {
                _id: otherValidMockId,
                name: "school 001",
                groupMaxNumStudents: 40,
              },
            },

            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field assigned to the teacher belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::12 - Passing an teacher not assigned to the coordinator in the body", () => {
        it("should return a non-assigned teacher to coordinator error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              teacher_id: {
                _id: validMockTeacherId,
                school_id: validMockSchoolId,
                user_id: validMockUserId,
                coordinator_id: otherValidMockId,
                contractType: "full-time",
                hoursAssignable: 60,
                hoursAssigned: 60,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            },

            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the teacher has been assigned to the coordinator being passed",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::13 - Passing an non-matching field for the teacher_field and parent subject in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              field_id: otherValidMockId,
            },

            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field assigned to teacher is the same in the parent subject",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).not.toHaveBeenCalled();
          expect(insertClass).not.toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::14 - Passing a class but not being created", () => {
        it("should not create a class", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classNullPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Class not created!",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).toHaveBeenCalled();
          expect(insertClass).toHaveBeenCalledWith(newClass, "class");
        });
      });
      describe("class::post::15 - Passing a class correctly to create", () => {
        it("should create a class", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const insertClass = mockService(classPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Class created!",
          });
          expect(statusCode).toBe(201);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(insertClass).toHaveBeenCalled();
          expect(insertClass).toHaveBeenCalledWith(newClass, "class");
        });
      });
    });

    describe("GET /class ", () => {
      describe("class - GET", () => {
        describe("class::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findClasses = mockService(
              classesNullPayload,
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
            expect(findClasses).not.toHaveBeenCalled();
            expect(findClasses).not.toHaveBeenCalledWith(
              { school_id: null },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findClasses = mockService(
              classesNullPayload,
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
            expect(findClasses).not.toHaveBeenCalled();
            expect(findClasses).not.toHaveBeenCalledWith(
              { school_id: "" },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findClasses = mockService(
              classesNullPayload,
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
            expect(findClasses).not.toHaveBeenCalled();
            expect(findClasses).not.toHaveBeenCalledWith(
              { school_id: invalidMockId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get::04 - Requesting all classs but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findClasses = mockService(
              classesNullPayload,
              "findFilterAllResources"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: otherValidMockId });
            // assertions
            expect(body).toStrictEqual({ msg: "No classes found" });
            expect(statusCode).toBe(404);
            expect(findClasses).toHaveBeenCalled();
            expect(findClasses).toHaveBeenCalledWith(
              { school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get::05 - Requesting all classs correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findClasses = mockService(
              classesPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(classesPayload);
            expect(statusCode).toBe(200);
            expect(findClasses).toHaveBeenCalled();
            expect(findClasses).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
      });

      describe("class - GET/:id", () => {
        describe("class::get/:id::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findClass = mockService(
              classNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockClassId}`)
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
            expect(findClass).not.toHaveBeenCalled();
            expect(findClass).not.toHaveBeenCalledWith(
              { _id: validMockClassId, school_id: null },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findClass = mockService(
              classNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockClassId}`)
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
            expect(findClass).not.toHaveBeenCalled();
            expect(findClass).not.toHaveBeenCalledWith(
              { _id: validMockClassId, school_id: "" },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findClass = mockService(
              classNullPayload,
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
                msg: "The class id is not valid",
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
            expect(findClass).not.toHaveBeenCalled();
            expect(findClass).not.toHaveBeenCalledWith(
              { _id: invalidMockId, school_id: invalidMockId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get/:id::04 - Requesting a class but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findClass = mockService(
              classNullPayload,
              "findResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockClassId}`)
              .send({ school_id: otherValidMockId });
            // assertions
            expect(body).toStrictEqual({
              msg: "Class not found",
            });
            expect(statusCode).toBe(404);
            expect(findClass).toHaveBeenCalled();
            expect(findClass).toHaveBeenCalledWith(
              { _id: validMockClassId, school_id: otherValidMockId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
        describe("class::get/:id::05 - Requesting a class correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findClass = mockService(
              classPayload,
              "findResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockClassId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(classPayload);
            expect(statusCode).toBe(200);
            expect(findClass).toHaveBeenCalled();
            expect(findClass).toHaveBeenCalledWith(
              { _id: validMockClassId, school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "class"
            );
          });
        });
      });
    });

    describe("PUT /class ", () => {
      describe("class::put::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(
            classNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClassMissingValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "Please add the school id",
              param: "school_id",
            },
            {
              location: "body",
              msg: "Please add the coordinator id",
              param: "coordinator_id",
            },
            {
              location: "body",
              msg: "Please add the subject id",
              param: "subject_id",
            },
            {
              location: "body",
              msg: "Please add the teacher_field id",
              param: "teacherField_id",
            },
            {
              location: "body",
              msg: "Please add the start time for the class",
              param: "startTime",
            },
            {
              location: "body",
              msg: "Please add the group schedule slot number for this class",
              param: "groupScheduleSlot",
            },
            {
              location: "body",
              msg: "Please add the teacher schedule slot number for this class",
              param: "teacherScheduleSlot",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassMissingValues.subject_i,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassMissingValues.teacherField_i,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [
              { _id: validMockClassId },
              { school_id: newClassMissingValues.school_i },
            ],
            newClassMissingValues,
            "class"
          );
        });
      });
      describe("class::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(
            classNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClassEmptyValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
            {
              location: "body",
              msg: "The coordinator id field is empty",
              param: "coordinator_id",
              value: "",
            },
            {
              location: "body",
              msg: "The subject id field is empty",
              param: "subject_id",
              value: "",
            },
            {
              location: "body",
              msg: "The teacherField id teacher_field is empty",
              param: "teacherField_id",
              value: "",
            },
            {
              location: "body",
              msg: "The start time field is empty",
              param: "startTime",
              value: "",
            },
            {
              location: "body",
              msg: "The group schedule slot number field is empty",
              param: "groupScheduleSlot",
              value: "",
            },
            {
              location: "body",
              msg: "The teacher schedule slot number field is empty",
              param: "teacherScheduleSlot",
              value: "",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassEmptyValues.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassEmptyValues.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [
              { _id: validMockClassId },
              { school_id: newClassEmptyValues.school_id },
            ],
            newClassEmptyValues,
            "class"
          );
        });
      });
      describe("class::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(
            classNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newClassNotValidDataTypes);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The class id is not valid",
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
              msg: "The coordinator id is not valid",
              param: "coordinator_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The subject id is not valid",
              param: "subject_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The teacher_field id is not valid",
              param: "teacherField_id",
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "start time value is not valid",
              param: "startTime",
              value: "hello",
            },
            {
              location: "body",
              msg: "group schedule slot number value is not valid",
              param: "groupScheduleSlot",
              value: "hello",
            },
            {
              location: "body",
              msg: "teacher schedule slot number value is not valid",
              param: "teacherScheduleSlot",
              value: "hello",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassNotValidDataTypes.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassNotValidDataTypes.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [
              { _id: invalidMockId },
              { school_id: newClassNotValidDataTypes.school_id },
            ],
            newClassNotValidDataTypes,
            "class"
          );
        });
      });
      describe("class::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(
            classNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClassWrongLengthValues);

          // assertions;
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The start time must not exceed 9 digits",
              param: "startTime",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The group schedule slot number must not exceed 9 digits",
              param: "groupScheduleSlot",
              value: 1234567890,
            },
            {
              location: "body",
              msg: "The teacher schedule slot number must not exceed 9 digits",
              param: "teacherScheduleSlot",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(0);
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            1,
            newClassWrongLengthValues.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClassWrongLengthValues.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [
              { _id: validMockClassId },
              { school_id: newClassWrongLengthValues.school_id },
            ],
            newClassWrongLengthValues,
            "class"
          );
        });
      });
      describe("class::put::05 - Passing an non-existent subject in the body", () => {
        it("should return a non-existent subject error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectNullPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the subject exists",
          });
          expect(statusCode).toBe(404);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::06 - Passing an non-existent school for the subject in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              school_id: {
                _id: otherValidMockId,
                name: "school 001",
                groupMaxNumStudents: 40,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the subject belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::07 - Passing an non-existent coordinator for the subject in the body", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: otherValidMockId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "active",
                hasTeachingFunc: true,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the coordinator belongs to the class parent subject",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::08 - Passing a coordinator with a different role in the body", () => {
        it("should return a not valid user/coordinator role error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "teacher",
                status: "active",
                hasTeachingFunc: true,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::09 - Passing a coordinator with a status different from active in the body", () => {
        it("should return a invalid status error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            {
              ...subjectPayload,
              coordinator_id: {
                _id: validMockCoordinatorId,
                school_id: validMockSchoolId,
                firstName: "Dave",
                lastName: "Gray",
                email: "dave@gmail.com",
                password: "12341234",
                role: "coordinator",
                status: "inactive",
                hasTeachingFunc: true,
              },
            },
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(1);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).not.toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::10 - Passing an non-existent teacher_field in the body", () => {
        it("should return a non-existent teacher_field error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldNullPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the teacherField exists",
          });
          expect(statusCode).toBe(404);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::11 - Passing an non-existent school for the teacher_field in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              school_id: {
                _id: otherValidMockId,
                name: "school 001",
                groupMaxNumStudents: 40,
              },
            },
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field assigned to the teacher belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::12 - Passing an teacher not assigned to the coordinator in the body", () => {
        it("should return a non-assigned teacher to coordinator error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              teacher_id: {
                _id: validMockTeacherId,
                school_id: validMockSchoolId,
                user_id: validMockUserId,
                coordinator_id: otherValidMockId,
                contractType: "full-time",
                hoursAssignable: 60,
                hoursAssigned: 60,
                monday: true,
                tuesday: true,
                wednesday: true,
                thursday: true,
                friday: true,
                saturday: true,
                sunday: true,
              },
            },
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the teacher has been assigned to the coordinator being passed",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::13 - Passing an non-matching field for the teacher_field and parent subject in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            {
              ...teacherFieldPayload,
              field_id: otherValidMockId,
            },
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Please make sure the field assigned to teacher is the same in the parent subject",
          });
          expect(statusCode).toBe(400);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).not.toHaveBeenCalled();
          expect(updateClass).not.toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::14 - Passing a class but not updating it because it does not match the filters", () => {
        it("should not update a class", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(
            classNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Class not updated",
          });
          expect(statusCode).toBe(404);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).toHaveBeenCalled();
          expect(updateClass).toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
      describe("class::put::15 - Passing a class correctly to update", () => {
        it("should update a class", async () => {
          // mock services
          const findSubjectTeacherField = mockServiceMultipleReturns(
            subjectPayload,
            teacherFieldPayload,
            "findPopulateResourceById"
          );
          const updateClass = mockService(classPayload, "updateFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockClassId}`)
            .send(newClass);

          // assertions;
          expect(body).toStrictEqual({
            msg: "Class updated!",
          });
          expect(statusCode).toBe(200);
          expect(findSubjectTeacherField).toHaveBeenCalledTimes(2);
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            1,
            newClass.subject_id,
            "-createdAt -updatedAt",
            "school_id coordinator_id group_id field_id",
            "-createdAt -updatedAt -password -email",
            "subject"
          );
          expect(findSubjectTeacherField).toHaveBeenNthCalledWith(
            2,
            newClass.teacherField_id,
            "-createdAt -updatedAt",
            "school_id teacher_id",
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateClass).toHaveBeenCalled();
          expect(updateClass).toHaveBeenCalledWith(
            [{ _id: validMockClassId }, { school_id: newClass.school_id }],
            newClass,
            "class"
          );
        });
      });
    });

    describe("DELETE /class ", () => {
      describe("class::delete::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const deleteClass = mockService(
            classNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockClassId}`)
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
          expect(deleteClass).not.toHaveBeenCalled();
          expect(deleteClass).not.toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: null },
            "class"
          );
        });
      });
      describe("class::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteClass = mockService(
            classNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockClassId}`)
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
          expect(deleteClass).not.toHaveBeenCalled();
          expect(deleteClass).not.toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: "" },
            "class"
          );
        });
      });
      describe("class::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteClass = mockService(
            classNullPayload,
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
              msg: "The class id is not valid",
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
          expect(deleteClass).not.toHaveBeenCalled();
          expect(deleteClass).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "class"
          );
        });
      });
      describe("class::delete::04 - Passing a class id but not deleting it", () => {
        it("should not delete a class", async () => {
          // mock services
          const deleteClass = mockService(
            classNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({ msg: "Class not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteClass).toHaveBeenCalled();
          expect(deleteClass).toHaveBeenCalledWith(
            { _id: otherValidMockId, school_id: validMockSchoolId },
            "class"
          );
        });
      });
      describe("class::delete::05 - Passing a class id correctly to delete", () => {
        it("should delete a class", async () => {
          // mock services
          const deleteClass = mockService(classPayload, "deleteFilterResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockClassId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Class deleted" });
          expect(statusCode).toBe(200);
          expect(deleteClass).toHaveBeenCalled();
          expect(deleteClass).toHaveBeenCalledWith(
            { _id: validMockClassId, school_id: validMockSchoolId },
            "class"
          );
        });
      });
    });
  });
});
