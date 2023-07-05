import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as MongoServices from "../../../services/mongoServices";

import { School } from "../../../typings/types";

describe("RESOURCE => School", () => {
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
  const endPointUrl = "/api/v1/schools/";

  /* inputs */
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

  /* payloads */
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
          const findSchool = mockService(schoolNullPayload, "findResourceById");

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
          const findSchool = mockService(schoolNullPayload, "findResourceById");

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
        expect(deleteSchool).toHaveBeenCalledWith(validMockSchoolId, "school");
      });
    });
  });
});
