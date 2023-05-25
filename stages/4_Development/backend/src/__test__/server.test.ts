import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

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
    const otherValidMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "invalidMockId";
    const newSchool = {
      name: "school 001",
    };
    const newSchoolMissingValues = {
      nam: "school 001",
    };
    const newSchoolEmptyValues = {
      name: "",
    };
    const newSchoolNotValidDataTypes = {
      name: 1234567890,
    };
    const newSchoolWrongLengthValues = {
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
    };

    // payloads
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
    };
    const schoolNullPayload = null;
    const schoolsPayload = [
      {
        _id: new Types.ObjectId().toString(),
        name: "school 001",
      },
      {
        _id: new Types.ObjectId().toString(),
        name: "school 002",
      },
      {
        _id: new Types.ObjectId().toString(),
        name: "school 003",
      },
    ];
    const schoolsNullPayload = null;

    // test blocks
    describe("POST /school ", () => {
      describe("school::post::01 - Passing a school with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

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
          ]);

          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid type error", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::05 - Passing an existing school name", () => {
        it("should return a duplicated school error", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "This school name already exists",
          });
          expect(statusCode).toBe(409);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::06 - Passing a school but not being created", () => {
        it("should not create a school", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School not created",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::post::07 - Passing a school correctly to create", () => {
        it("should create a school", async () => {
          // mock services
          const findDuplicatedSchoolNameByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const insertSchoolService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School created successfully!",
          });

          expect(statusCode).toBe(201);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-_id -createdAt -updatedAt",
            "school"
          );
          expect(insertSchoolService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalledWith(
            { name: "school 001" },
            "school"
          );
        });
      });
    });

    describe("GET /school ", () => {
      describe("school - GET", () => {
        describe("school::get::01 - Requesting all schools but not finding any", () => {
          it("should not get any schools", async () => {
            // mock services
            const findAllSchoolsService = mockService(
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
            expect(findAllSchoolsService).toHaveBeenCalled();
            expect(findAllSchoolsService).toHaveBeenCalledWith(
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get::02 - Requesting all schools correctly", () => {
          it("should get all schools", async () => {
            // mock services
            const findAllSchoolsService = mockService(
              schoolsPayload,
              "findAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send();

            // assertions
            expect(body).toStrictEqual([
              {
                _id: expect.any(String),
                name: "school 001",
              },
              {
                _id: expect.any(String),
                name: "school 002",
              },
              {
                _id: expect.any(String),
                name: "school 003",
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findAllSchoolsService).toHaveBeenCalled();
            expect(findAllSchoolsService).toHaveBeenCalledWith(
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
            const findSchoolByIdService = mockService(
              schoolPayload,
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
                //cspell:disable-next-line
                value: invalidMockId,
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findSchoolByIdService).not.toHaveBeenCalled();
            expect(findSchoolByIdService).not.toHaveBeenCalledWith(
              validMockSchoolId,
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get/:id::02 - Requesting a school but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findSchoolByIdService = mockService(
              schoolNullPayload,
              "findResourceById"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSchoolId}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              msg: "School not found",
            });
            expect(statusCode).toBe(404);
            expect(findSchoolByIdService).toHaveBeenCalled();
            expect(findSchoolByIdService).toHaveBeenCalledWith(
              validMockSchoolId,
              "-createdAt -updatedAt",
              "school"
            );
          });
        });
        describe("school::get/:id::03 - Requesting a school correctly", () => {
          it("should get a school", async () => {
            // mock services
            const findSchoolByIdService = mockService(
              schoolPayload,
              "findResourceById"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockSchoolId}`)
              .send();

            // assertions
            expect(body).toStrictEqual({
              _id: validMockSchoolId,
              name: "school 001",
            });
            expect(statusCode).toBe(200);
            expect(findSchoolByIdService).toHaveBeenCalled();
            expect(findSchoolByIdService).toHaveBeenCalledWith(
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
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolNullPayload,
            "updateResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolNullPayload,
            "updateResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolNullPayload,
            "updateResource"
          );

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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The school name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolNullPayload,
            "updateResource"
          );

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
          ]);
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::05 - Passing an existing school name", () => {
        it("should not update a school", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "This school name already exists",
          });
          expect(statusCode).toBe(409);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::06 - Passing a school but not updating it", () => {
        it("should not update a school", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolNullPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({
            msg: "School not updated",
          });
          expect(statusCode).toBe(404);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).toHaveBeenCalled();
          expect(updateSchoolService).toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
      describe("school::put::07 - Passing a school correctly to update", () => {
        it("should update a school", async () => {
          // mock services
          const findSchoolNameDuplicatedByPropertyService = mockService(
            schoolNullPayload,
            "findResourceByProperty"
          );
          const updateSchoolService = mockService(
            schoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchool);

          // assertions
          expect(body).toStrictEqual({ msg: "School updated" });
          expect(statusCode).toBe(200);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            { name: "school 001" },
            "-createdAt -updatedAt",
            "school"
          );
          expect(updateSchoolService).toHaveBeenCalled();
          expect(updateSchoolService).toHaveBeenCalledWith(
            validMockSchoolId,
            { name: "school 001" },
            "school"
          );
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("school::delete::01 - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSchoolService = mockService(
            schoolPayload,
            "deleteResource"
          );

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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteSchoolService).not.toHaveBeenCalled();
          expect(deleteSchoolService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "school"
          );
        });
      });
      describe("school::delete::02 - Passing a school id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteSchoolService = mockService(
            schoolNullPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({
            msg: "School not deleted",
          });
          expect(statusCode).toBe(404);
          expect(deleteSchoolService).toHaveBeenCalled();
          expect(deleteSchoolService).toHaveBeenCalledWith(
            validMockSchoolId,
            "school"
          );
        });
      });
      describe("school::delete::03 - Passing a school id correctly to delete", () => {
        it("should delete a school", async () => {
          // mock services
          const deleteSchoolService = mockService(
            schoolPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toStrictEqual({ msg: "School deleted" });
          expect(statusCode).toBe(200);
          expect(deleteSchoolService).toHaveBeenCalled();
          expect(deleteSchoolService).toHaveBeenCalledWith(
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
    const otherValidMockUserId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "invalidMockId";
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
      //cspell:disable-next-line
      school_i: validMockSchoolId,
      firstNam: "Jerome",
      lastNam: "Vargas",
      //cspell:disable-next-line
      emai: "jerome@gmail.com",
      //cspell:disable-next-line
      passwor: "12341234",
      rol: "coordinator",
      //cspell:disable-next-line
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
    const newUserWrongValues = {
      school_id: invalidMockId,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail",
      password: "12341234",
      //cspell:disable-next-line
      role: "coordinador",
      //cspell:disable-next-line
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
        //cspell:disable-next-line
        firstName: "Ania",
        //cspell:disable-next-line
        lastName: "Kubow",
        email: "ania@yahoo.com",
        role: "teacher",
        status: "suspended",
        hasTeachingFunc: true,
      },
    ];
    const usersNullPayload: any[] = [];

    // test blocks
    describe("POST /user ", () => {
      describe("user::post::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");
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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid type error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

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
              //cspell:disable-next-line
              value: "invalidMockId",
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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::05 - Passing wrong school id, email, role or status", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserWrongValues);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
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
              //cspell:disable-next-line
              value: "coordinador",
            },
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",
              //cspell:disable-next-line
              value: "activo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::06 - Passing an non-existing school", () => {
        it("should return a duplicated user error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolNullPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the school first",
          });
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::07 -  Passing an existing user's email", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please try a different email address",
          });
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::08 - Passing a user but not being created", () => {
        it("should not create a user", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(
            userNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "User not created",
          });
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalledWith(newUser, "user");
        });
      });
      describe("user::post::09 - Passing a user correctly to create", () => {
        it("should create a user", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findDuplicatedUserEmailByPropertyService = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({ msg: "User created successfully!" });
          expect(statusCode).toBe(201);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: userPayload.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(insertUserService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalledWith(newUser, "user");
        });
      });
    });

    describe("GET /user ", () => {
      describe("user - GET", () => {
        describe("user::get::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllUsersService = mockService(
              usersNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              //cspell:disable-next-line
              .send({ school_i: invalidMockId });

            // assertions
            expect(body).toStrictEqual([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllUsersService).not.toHaveBeenCalled();
            expect(findAllUsersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::02 - passing a school with empty values", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllUsersService = mockService(
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
            expect(findAllUsersService).not.toHaveBeenCalled();
            expect(findAllUsersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::03 - Passing an invalid school id in the body", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllUsersService = mockService(
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
                //cspell:disable-next-line
                value: "invalidMockId",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllUsersService).not.toHaveBeenCalled();
            expect(findAllUsersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::04 - Requesting all users but not finding any", () => {
          it("should not get any users", async () => {
            // mock services
            const findAllUsersService = mockService(
              usersNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No users found",
            });
            expect(statusCode).toBe(404);
            expect(findAllUsersService).toHaveBeenCalled();
            expect(findAllUsersService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get::05 - Requesting all users", () => {
          it("should get all users", async () => {
            // mock services
            const findAllUsersService = mockService(
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
                //cspell:disable-next-line
                firstName: "Ania",
                hasTeachingFunc: true,
                //cspell:disable-next-line
                lastName: "Kubow",
                role: "teacher",
                school_id: expect.any(String),
                status: "suspended",
              },
            ]);
            expect(statusCode).toBe(200);
            expect(findAllUsersService).toHaveBeenCalled();
            expect(findAllUsersService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "user"
            );
          });
        });
      });
      describe("user - GET/:id", () => {
        describe("user::get/:id::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findUserByPropertyService = mockService(
              userPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)
              //cspell:disable-next-line
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
            expect(findUserByPropertyService).not.toHaveBeenCalled();
            expect(findUserByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findUserByPropertyService = mockService(
              userPayload,
              "findFilterResourceByProperty"
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
            expect(findUserByPropertyService).not.toHaveBeenCalled();
            expect(findUserByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::03 - Passing an invalid user and school ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findUserByPropertyService = mockService(
              userPayload,
              "findFilterResourceByProperty"
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
            expect(findUserByPropertyService).not.toHaveBeenCalled();
            expect(findUserByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::04 - Requesting a user but not finding it", () => {
          it("should not get a user", async () => {
            // mock services
            const findUserByPropertyService = mockService(
              usersNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)
              .send({ school_id: otherValidMockUserId });

            // assertions
            expect(body).toStrictEqual({
              msg: "User not found",
            });
            expect(statusCode).toBe(404);
            expect(findUserByPropertyService).toHaveBeenCalled();
            expect(findUserByPropertyService).toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: otherValidMockUserId }],
              "-password -createdAt -updatedAt",
              "user"
            );
          });
        });
        describe("user::get/:id::05 - Requesting a user correctly", () => {
          it("should get a user", async () => {
            // mock services
            const findUserByPropertyService = mockService(
              userPayload,
              "findFilterResourceByProperty"
            );

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
            expect(findUserByPropertyService).toHaveBeenCalled();
            expect(findUserByPropertyService).toHaveBeenCalledWith(
              [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
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
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
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
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
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
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
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
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
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
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::05 - Passing wrong email, role or status", () => {
        it("should return an invalid input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserWrongValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
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
              //cspell:disable-next-line
              value: "coordinador",
            },
            {
              location: "body",
              msg: "the status provided is not a valid option",
              param: "status",
              //cspell:disable-next-line
              value: "activo",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::06 - Passing an existing user's email", () => {
        it("should return a duplicated user error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please try a different email address",
          });
          expect(statusCode).toBe(409);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::07 - Passing a user but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
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
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
            newUser,
            "user"
          );
        });
      });
      describe("user::put::08 - Passing a user correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            userNullPayload,
            "findResourceByProperty"
          );
          const updateUserService = mockService(
            userPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toStrictEqual({ msg: "User updated" });
          expect(statusCode).toBe(200);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalledWith(
            { email: newUser.email },
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateUserService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalledWith(
            [{ _id: validMockUserId }, { school_id: validMockSchoolId }],
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
          const deleteUserService = mockService(
            userPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            //cspell: disable-next-line
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
          expect(deleteUserService).not.toHaveBeenCalled();
          expect(deleteUserService).not.toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::02 - passing a school with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const deleteUserService = mockService(
            userPayload,
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
          expect(deleteUserService).not.toHaveBeenCalled();
          expect(deleteUserService).not.toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::03 - Passing an invalid user and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteUserService = mockService(
            userPayload,
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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
          expect(deleteUserService).not.toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::04 - Passing a user id but not deleting it", () => {
        it("should not delete a user", async () => {
          // mock services
          const deleteUserService = mockService(
            userNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            msg: "User not deleted",
          });
          expect(statusCode).toBe(404);
          expect(deleteUserService).toHaveBeenCalled();
          expect(deleteUserService).toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "user"
          );
        });
      });
      describe("user::delete::05 - Passing a user id correctly to delete", () => {
        it("should delete a user", async () => {
          // mock services
          const deleteUserService = mockService(
            userPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "User deleted" });
          expect(statusCode).toBe(200);
          expect(deleteUserService).toHaveBeenCalled();
          expect(deleteUserService).toHaveBeenCalledWith(
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
    //cspell:disable-next-line
    const invalidMockId = "invalidMockId";
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
      //cspell:disable-next-line
      user_i: validMockUserId,
      coordinator_i: validMockCoordinatorId,
      contractTyp: "full-time",
      //cspell:disable-next-line
      hoursAssignabl: 60,
      //cspell:disable-next-line
      hoursAssigne: 60,
      //cspell:disable-next-line
      monda: true,
      //cspell:disable-next-line
      tuesda: true,
      //cspell:disable-next-line
      wednesda: true,
      //cspell:disable-next-line
      thursda: true,
      //cspell:disable-next-line
      frida: true,
      //cspell:disable-next-line
      saturda: true,
      //cspell:disable-next-line
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
      school_id: 87908074319,
      user_id: 87908074321,
      coordinator_id: 99221424323,
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
    const newTeacherWrongValues = {
      school_id: invalidMockId,
      user_id: invalidMockId,
      coordinator_id: invalidMockId,
      //cspell:disable-next-line
      contractType: "tiempo-completo",
      hoursAssignable: 71,
      hoursAssigned: 72,
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };

    // payloads
    const userSchoolCoordinatorPayload = [
      {
        _id: validMockUserId,
        school_id: {
          name: "School 001",
        },
        //cspell:disable-next-line
        firstName: "Mtuts",
        lastName: "Tuts",
        email: "mtuts@hello.com",
        rol: "teacher",
        status: "active",
        hasTeachingFunc: true,
      },
      {
        _id: validMockCoordinatorId,
        school_id: {
          name: "School 001",
        },
        firstName: "Dave",
        lastName: "Gray",
        email: "dave@hello.com",
        role: "coordinator",
        status: "active",
        hasTeachingFunc: false,
      },
    ];

    const teacherPayload = {
      _id: validMockTeacherId,
      school_id: validMockSchoolId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
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
    const teachersNullPayload: any[] = [];

    // test blocks
    describe("POST /teacher ", () => {
      describe("teacher::post::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
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
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findUserSchoolCoordinator).not.toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::02 - Passing a teacher with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
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
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findUserSchoolCoordinator).not.toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
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
              value: 87908074319,
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: 87908074321,
            },
            {
              location: "body",
              msg: "Invalid value",
              param: "coordinator_id",
              value: 99221424323,
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              value: 99221424323,
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
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findUserSchoolCoordinator).not.toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::04 - Passing wrong contract type, hours assignable or hours assigned input values", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherWrongValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              //cspell:disable-next-line
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              //cspell:disable-next-line
              value: invalidMockId,
            },
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              param: "contractType",
              //cspell:disable-next-line
              value: "tiempo-completo",
            },
            {
              location: "body",
              msg: "hours assignable must not exceed 70 hours",
              param: "hoursAssignable",
              value: 71,
            },
            {
              location: "body",
              msg: "hours assigned must not exceed the hours assignable",
              param: "hoursAssigned",
              value: 72,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findUserSchoolCoordinator).not.toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::05 - Not finding a user", () => {
        it("should return a user not found error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [null, userSchoolCoordinatorPayload[1]],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the base user first",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::06 - Passing an inactive user", () => {
        it("should return an inactive user error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [
              { ...userSchoolCoordinatorPayload[0], status: "inactive" },
              userSchoolCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({ msg: "The user is not active" });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::07 - Passing a user with no teaching functions assigned", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [
              { ...userSchoolCoordinatorPayload[0], hasTeachingFunc: false },
              userSchoolCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "The user does not have teaching functions assigned",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::08 - The user's school does not exists", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [
              {
                ...userSchoolCoordinatorPayload[0],
                school_id: null,
              },
              userSchoolCoordinatorPayload[1],
            ],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the school first",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::09 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [userSchoolCoordinatorPayload[0], null],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an existent coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::10 - Passing a user with a role different from coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            [
              userSchoolCoordinatorPayload[0],
              { ...userSchoolCoordinatorPayload[1], role: "student" },
            ],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass a user with a coordinator role",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::11 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          const findUserSchoolCoordinator = mockService(
            [
              userSchoolCoordinatorPayload[0],
              { ...userSchoolCoordinatorPayload[1], status: "inactive" },
            ],
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please pass an active coordinator",
          });
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::12 - user already a teacher", () => {
        it("should return a user already a teacher error", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({
            msg: "User is already a teacher",
          });
          expect(statusCode).toBe(409);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::13 - Passing a teacher but not being created", () => {
        it("should not create a teacher", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
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
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).toHaveBeenCalled();
          expect(insertTeacherService).toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::14 - Passing a teacher correctly to create", () => {
        it("should create a teacher", async () => {
          // mock services
          const findUserSchoolCoordinator = mockService(
            userSchoolCoordinatorPayload,
            "findPopulateFilterAllResources"
          );
          const findTeacherByIdPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacher);

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher created successfully!" });
          expect(statusCode).toBe(201);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findUserSchoolCoordinator).toHaveBeenCalledWith(
            [validMockUserId, validMockCoordinatorId],
            "-password -createdAt -updatedAt",
            "school_id",
            "-_id -createdAt -updatedAt",
            "user"
          );
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalledWith(
            { user_id: validMockUserId },
            "-createdAt -updatedAt",
            "teacher"
          );
          expect(insertTeacherService).toHaveBeenCalled();
          expect(insertTeacherService).toHaveBeenCalledWith(
            newTeacher,
            "teacher"
          );
        });
      });
    });

    describe("GET /teacher ", () => {
      describe("teacher - GET", () => {
        describe("teacher::get::01 - passing a school with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllTeachersService = mockService(
              teachersPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_i: invalidMockId });

            // assertions
            expect(body).toStrictEqual([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllTeachersService).not.toHaveBeenCalled();
            expect(findAllTeachersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllTeachersService = mockService(
              teachersPayload,
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
            expect(findAllTeachersService).not.toHaveBeenCalled();
            expect(findAllTeachersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::03 - Passing an invalid school id in the body", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllTeachersService = mockService(
              teachersPayload,
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
                //cspell:disable-next-line
                value: "invalidMockId",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllTeachersService).not.toHaveBeenCalled();
            expect(findAllTeachersService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::04 - Requesting all teachers but not finding any", () => {
          it("should not get any users", async () => {
            // mock services
            const findAllTeachersService = mockService(
              teachersNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No teachers found",
            });
            expect(statusCode).toBe(404);
            expect(findAllTeachersService).toHaveBeenCalled();
            expect(findAllTeachersService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get::05 - Requesting all teachers", () => {
          it("should get all teachers", async () => {
            // mock services
            const findAllTeachersService = mockService(
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
            expect(findAllTeachersService).toHaveBeenCalled();
            expect(findAllTeachersService).toHaveBeenCalledWith(
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
            const findTeacherByPropertyService = mockService(
              teacherPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
            expect(findTeacherByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockTeacherId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::02 - passing a school with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeacherByPropertyService = mockService(
              teacherPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
            expect(findTeacherByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockTeacherId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::03 - Passing an invalid user and school id", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findTeacherByPropertyService = mockService(
              teacherPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
            expect(findTeacherByPropertyService).not.toHaveBeenCalledWith(
              [{ _id: validMockTeacherId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::04 - Requesting a teacher but not finding it", () => {
          it("should not get a teacher", async () => {
            // mock services
            const findTeacherByPropertyService = mockService(
              teachersNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Teacher not found",
            });
            expect(statusCode).toBe(404);
            expect(findTeacherByPropertyService).toHaveBeenCalled();
            expect(findTeacherByPropertyService).toHaveBeenCalledWith(
              [{ _id: validMockTeacherId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "teacher"
            );
          });
        });
        describe("teacher::get/:id::05 - Requesting a teacher correctly", () => {
          it("should get a teacher", async () => {
            // mock services
            const findTeacherByPropertyService = mockService(
              teacherPayload,
              "findFilterResourceByProperty"
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
            });
            expect(findTeacherByPropertyService).toHaveBeenCalled();
            expect(findTeacherByPropertyService).toHaveBeenCalledWith(
              [{ _id: validMockTeacherId }, { school_id: validMockSchoolId }],
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
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
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
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
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
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherNotValidDataTypes);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: 87908074319,
            },
            {
              location: "body",
              msg: "Invalid value",
              param: "user_id",
              value: 87908074321,
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              value: 87908074321,
            },
            {
              location: "body",
              msg: "Invalid value",
              param: "coordinator_id",
              value: 99221424323,
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              value: 99221424323,
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
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::04 - Passing wrong contract type, hours assignable or hours assigned", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherWrongValues);

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "the contract type provided is not a valid option",
              //cspell:disable-next-line
              param: "contractType",
              //cspell:disable-next-line
              value: "tiempo-completo",
            },
            {
              location: "body",
              msg: "hours assignable must not exceed 70 hours",
              param: "hoursAssignable",
              value: 71,
            },
            {
              location: "body",
              msg: "hours assigned must not exceed the hours assignable",
              param: "hoursAssigned",
              value: 72,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::05 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorNullPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
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
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::06 - Passing a non coordinator user as coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            { ...coordinatorPayload, role: "teacher" },
            "findResourceById"
          );
          const updateTeacherService = mockService(
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
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::post::07 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            { ...coordinatorPayload, status: "inactive" },
            "findResourceById"
          );
          const updateTeacherService = mockService(
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
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::08 - Passing a teacher but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
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
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
            ],
            newTeacher,
            "teacher"
          );
        });
      });
      describe("teacher::put::09 - Passing a teacher correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
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
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalledWith(
            validMockCoordinatorId,
            "-password -createdAt -updatedAt",
            "user"
          );
          expect(updateTeacherService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherId },
              { user_id: validMockUserId },
              { school_id: validMockSchoolId },
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
          const deleteTeacherService = mockService(
            teacherPayload,
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
          expect(deleteTeacherService).not.toHaveBeenCalled();
          expect(deleteTeacherService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::02 - passing a school with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherPayload,
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
          expect(deleteTeacherService).not.toHaveBeenCalled();
          expect(deleteTeacherService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::03 - Passing invalid teacher or school id", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherPayload,
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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
          expect(deleteTeacherService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::04 - Passing a teacher but not deleting it", () => {
        it("should not delete a teacher", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherId}`)
            .send({
              school_id: validMockSchoolId,
            });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteTeacherService).toHaveBeenCalled();
          expect(deleteTeacherService).toHaveBeenCalledWith(
            { _id: validMockTeacherId, school_id: validMockSchoolId },
            "teacher"
          );
        });
      });
      describe("teacher::delete::05 - Passing a teacher correctly to delete", () => {
        it("should delete a teacher", async () => {
          // mock services
          const deleteTeacherService = mockService(
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
          expect(deleteTeacherService).toHaveBeenCalled();
          expect(deleteTeacherService).toHaveBeenCalledWith(
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
    //cspell:disable-next-line
    const invalidMockId = "invalidMockId";
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
      school_id: 9769231419,
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
    const fieldsNullPayload: any[] = [];

    // test blocks
    describe("POST /field ", () => {
      describe("field::post::01 - Passing a field with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

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
              value: 9769231419,
            },
            {
              location: "body",
              msg: "The field name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::05 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldNullPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::06 - Passing an existing field name", () => {
        it("should return a duplicated field error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            [fieldPayload],
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({ msg: "This field name already exists" });
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalledWith(
            newField,
            "field"
          );
        });
      });
      describe("field::post::07 - Passing a field but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({ msg: "Field not created!" });
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).toHaveBeenCalled();
          expect(insertFieldService).toHaveBeenCalledWith(newField, "field");
        });
      });
      describe("field::post::08 - Passing a field correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertFieldService = mockService(
            fieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({ msg: "Field created successfully!" });
          expect(statusCode).toBe(201);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(insertFieldService).toHaveBeenCalled();
          expect(insertFieldService).toHaveBeenCalledWith(newField, "field");
        });
      });
    });

    describe("GET /field ", () => {
      describe("field - GET", () => {
        describe("field::get::01 - passing a field with missing values", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllFieldsService = mockService(
              fieldsPayload,
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
            expect(findAllFieldsService).not.toHaveBeenCalled();
            expect(findAllFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::02 - passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllFieldsService = mockService(
              fieldsPayload,
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
            expect(findAllFieldsService).not.toHaveBeenCalled();
            expect(findAllFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::03 - passing and invalid school id", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllFieldsService = mockService(
              fieldsPayload,
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
                //cspell:disable-next-line
                value: "invalidMockId",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllFieldsService).not.toHaveBeenCalled();
            expect(findAllFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllFieldsService = mockService(
              fieldsNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No fields found",
            });
            expect(statusCode).toBe(404);
            expect(findAllFieldsService).toHaveBeenCalled();
            expect(findAllFieldsService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllFieldsService = mockService(
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
            expect(findAllFieldsService).toHaveBeenCalled();
            expect(findAllFieldsService).toHaveBeenCalledWith(
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
            const findFieldByIdService = mockService(
              fieldPayload,
              "findFilterResourceByProperty"
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
            expect(findFieldByIdService).not.toHaveBeenCalled();
            expect(findFieldByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::02 - Passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findFieldByIdService = mockService(
              fieldPayload,
              "findFilterResourceByProperty"
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
            expect(findFieldByIdService).not.toHaveBeenCalled();
            expect(findFieldByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::03 - Passing an invalid field and school ids in the url", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findFieldByIdService = mockService(
              fieldPayload,
              "findFilterResourceByProperty"
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
            expect(findFieldByIdService).not.toHaveBeenCalled();
            expect(findFieldByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findFieldByIdService = mockService(
              fieldsNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockFieldId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Field not found",
            });
            expect(statusCode).toBe(404);
            expect(findFieldByIdService).toHaveBeenCalled();
            expect(findFieldByIdService).toHaveBeenCalledWith(
              [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "field"
            );
          });
        });
        describe("field::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findFieldByIdService = mockService(
              fieldPayload,
              "findFilterResourceByProperty"
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
            expect(findFieldByIdService).toHaveBeenCalled();
            expect(findFieldByIdService).toHaveBeenCalledWith(
              [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
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
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
            fieldPayload,
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
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
            fieldPayload,
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
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
            fieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockFieldId}`)
            .send(newFieldNotValidDataTypes);

          //assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: 9769231419,
            },
            {
              location: "body",
              msg: "The field name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
            fieldPayload,
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
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::05 - Passing a field but not updating it because the field name, already exists for the school", () => {
        it("should not update a field", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
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
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id", () => {
        it("should not update a field", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
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
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).toHaveBeenCalled();
          expect(updateFieldService).toHaveBeenCalledWith(
            [{ _id: validMockFieldId }, { school_id: validMockSchoolId }],
            newField,
            "field"
          );
        });
      });
      describe("field::put::07 - Passing a field correctly to update", () => {
        it("should update a field", async () => {
          // mock services
          const findFieldNameDuplicatedByPropertyService = mockService(
            fieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const updateFieldService = mockService(
            fieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockFieldId}`)
            .send(newField);

          // assertions
          expect(body).toStrictEqual({ msg: "Field updated" });
          expect(statusCode).toBe(200);
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newField.name }],
            "-createdAt -updatedAt",
            "field"
          );
          expect(updateFieldService).toHaveBeenCalled();
          expect(updateFieldService).toHaveBeenCalledWith(
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
          const deleteFieldService = mockService(
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
          expect(deleteFieldService).not.toHaveBeenCalled();
          expect(deleteFieldService).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::02 - Passing a field with empty fields", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteFieldService = mockService(
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
          expect(deleteFieldService).not.toHaveBeenCalled();
          expect(deleteFieldService).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::03 - Passing an invalid field and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteFieldService = mockService(
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
              //cspell:disable-next-line
              value: "invalidMockId",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "invalidMockId",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(deleteFieldService).not.toHaveBeenCalled();
          expect(deleteFieldService).not.toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::04 - Passing a field id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteFieldService = mockService(
            fieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Field not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteFieldService).toHaveBeenCalled();
          expect(deleteFieldService).toHaveBeenCalledWith(
            { _id: validMockFieldId, school_id: validMockSchoolId },
            "field"
          );
        });
      });
      describe("field::delete::05 - Passing a field id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteFieldService = mockService(
            fieldPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Field deleted" });
          expect(statusCode).toBe(200);
          expect(deleteFieldService).toHaveBeenCalled();
          expect(deleteFieldService).toHaveBeenCalledWith(
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
    const otherValidMockFieldId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "invalidMockId";
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
    const teacherPayload = {
      _id: validMockTeacherId,
      school_id: { _id: validMockSchoolId },
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
    };
    const teacherNullPayload = null;
    const fieldPayload = {
      _id: validMockFieldId,
      school_id: { _id: validMockSchoolId },
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
    const teacherFieldsNullPayload: any[] = [];

    // test blocks
    describe("POST /teacher_field ", () => {
      describe("teacher_field::post::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
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
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            0
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::02 - Passing a teacher with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
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
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            0
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
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
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            0
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::04 - Passing an non-existent teacher in the body", () => {
        it("should return a non-existent teacher error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherNullPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
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
          expect(statusCode).toBe(400);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            1
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(
            findDuplicatedTeacherFieldByIdService
          ).not.toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::05 - Passing an non-existent field in the body", () => {
        it("should return a non-existent field error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldNullPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
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
          expect(statusCode).toBe(400);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::06 - Passing a teacher that do not match the school id", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              { ...teacherPayload, school_id: otherValidMockFieldId },
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "The resources do not belong to this school",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::07 - Passing a field that do not match the school id", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              { ...fieldPayload, school_id: otherValidMockFieldId },
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "The resources do not belong to this school",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::08 - teacher has the field already assigned", () => {
        it("should return an already assigned field", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            [teacherFieldPayload],
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
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
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).not.toHaveBeenCalled();
          expect(insertTeacherFieldService).not.toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::09 - Passing a teacher_field but not being created", () => {
        it("should not create a teacher_field", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher_Field not created!",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).toHaveBeenCalled();
          expect(insertTeacherFieldService).toHaveBeenCalledWith(
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::post::10 - Passing a teacher_field correctly to create", () => {
        it("should create a teacher_field", async () => {
          // mock services
          const findDuplicatedTeacherFieldByIdService =
            mockServiceMultipleReturns(
              teacherPayload,
              fieldPayload,
              "findPopulateResourceById"
            );
          const findTeacherFieldByPropertyService = mockService(
            teacherFieldsNullPayload,
            "findFilterResourceByProperty"
          );
          const insertTeacherFieldService = mockService(
            teacherFieldPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher_Field created successfully!",
          });
          expect(statusCode).toBe(201);
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenCalledTimes(
            2
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            1,
            validMockTeacherId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "teacher"
          );
          expect(findDuplicatedTeacherFieldByIdService).toHaveBeenNthCalledWith(
            2,
            validMockFieldId,
            "-createdAt -updatedAt",
            "school_id",
            "_id -name -createdAt -updatedAt",
            "field"
          );
          expect(findTeacherFieldByPropertyService).toHaveBeenCalled();
          expect(findTeacherFieldByPropertyService).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-name -createdAt -updatedAt",
            "teacherField"
          );
          expect(insertTeacherFieldService).toHaveBeenCalled();
          expect(insertTeacherFieldService).toHaveBeenCalledWith(
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
            const findAllTeacherFieldsService = mockService(
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
            expect(findAllTeacherFieldsService).not.toHaveBeenCalled();
            expect(findAllTeacherFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::02 - passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllTeacherFieldsService = mockService(
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
            expect(findAllTeacherFieldsService).not.toHaveBeenCalled();
            expect(findAllTeacherFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::03 - passing and invalid school id", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllTeacherFieldsService = mockService(
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
            expect(findAllTeacherFieldsService).not.toHaveBeenCalled();
            expect(findAllTeacherFieldsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllTeacherFieldsService = mockService(
              teacherFieldsNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No fields assigned to any teachers found",
            });
            expect(statusCode).toBe(404);
            expect(findAllTeacherFieldsService).toHaveBeenCalled();
            expect(findAllTeacherFieldsService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get::05 - Requesting all teacher_fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllTeacherFieldsService = mockService(
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
            expect(findAllTeacherFieldsService).toHaveBeenCalled();
            expect(findAllTeacherFieldsService).toHaveBeenCalledWith(
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
            const findTeacherFieldByIdService = mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherFieldByIdService).not.toHaveBeenCalled();
            expect(findTeacherFieldByIdService).not.toHaveBeenCalledWith(
              [
                { _id: validMockTeacherFieldId },
                { school_id: validMockSchoolId },
              ],
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findTeacherFieldByIdService = mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherFieldByIdService).not.toHaveBeenCalled();
            expect(findTeacherFieldByIdService).not.toHaveBeenCalledWith(
              [
                { _id: validMockTeacherFieldId },
                { school_id: validMockSchoolId },
              ],
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::03 - Passing an invalid teacher_field and school ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findTeacherFieldByIdService = mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherFieldByIdService).not.toHaveBeenCalled();
            expect(findTeacherFieldByIdService).not.toHaveBeenCalledWith(
              [
                { _id: validMockTeacherFieldId },
                { school_id: validMockSchoolId },
              ],
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findTeacherFieldByIdService = mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockTeacherFieldId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Teacher_Field not found",
            });
            expect(statusCode).toBe(404);
            expect(findTeacherFieldByIdService).toHaveBeenCalled();
            expect(findTeacherFieldByIdService).toHaveBeenCalledWith(
              [
                { _id: validMockTeacherFieldId },
                { school_id: validMockSchoolId },
              ],
              "-createdAt -updatedAt",
              "teacherField"
            );
          });
        });
        describe("teacher_field::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findTeacherFieldByIdService = mockService(
              teacherFieldPayload,
              "findFilterResourceByProperty"
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
            expect(findTeacherFieldByIdService).toHaveBeenCalled();
            expect(findTeacherFieldByIdService).toHaveBeenCalledWith(
              [
                { _id: validMockTeacherFieldId },
                { school_id: validMockSchoolId },
              ],
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
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );
          const updateTeacherFieldService = mockService(
            teacherFieldPayload,
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
          expect(findExistingField).not.toHaveBeenCalled();
          expect(findExistingField).not.toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).not.toHaveBeenCalled();
          expect(updateTeacherFieldService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("field::put::02 - Passing fields with empty fields", () => {
        it("should return an empty field error", async () => {
          /* mock services */
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );
          const updateTeacherFieldService = mockService(
            teacherFieldPayload,
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
          expect(findExistingField).not.toHaveBeenCalled();
          expect(findExistingField).not.toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).not.toHaveBeenCalled();
          expect(updateTeacherFieldService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );
          const updateTeacherFieldService = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
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
          expect(findExistingField).not.toHaveBeenCalled();
          expect(findExistingField).not.toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).not.toHaveBeenCalled();
          expect(updateTeacherFieldService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::04 - Passing a non-existent field ", () => {
        it("should not update a teacher_field", async () => {
          // mock services
          const findExistingField = mockService(
            fieldNullPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(teacherFieldsPayload, "findFilterResourceByProperty");
          const updateTeacherFieldService = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({
            msg: "Field not found",
          });
          expect(statusCode).toBe(404);
          expect(findExistingField).toHaveBeenCalled();
          expect(findExistingField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).not.toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).not.toHaveBeenCalled();
          expect(updateTeacherFieldService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::05 - Passing a field but not updating it because the field has already been assigned to the teacher", () => {
        it("should not update a teacher_field", async () => {
          // mock services
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(teacherFieldsPayload, "findFilterResourceByProperty");
          const updateTeacherFieldService = mockService(
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
          expect(findExistingField).toHaveBeenCalled();
          expect(findExistingField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).not.toHaveBeenCalled();
          expect(updateTeacherFieldService).not.toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id or teacher_id", () => {
        it("should not update a teacher_field", async () => {
          // mock services
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );
          const updateTeacherFieldService = mockService(
            teacherFieldNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher_Field not updated" });
          expect(statusCode).toBe(404);
          expect(findExistingField).toHaveBeenCalled();
          expect(findExistingField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).toHaveBeenCalled();
          expect(updateTeacherFieldService).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
            ],
            newTeacherField,
            "teacherField"
          );
        });
      });
      describe("teacher_field::put::07 - Passing a field correctly to update", () => {
        it("should update a field", async () => {
          // mock services
          const findExistingField = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findFieldAlreadyAssignedToTeacherByPropertyService =
            mockService(
              teacherFieldsNullPayload,
              "findFilterResourceByProperty"
            );
          const updateTeacherFieldService = mockService(
            teacherFieldPayload,
            "updateFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockTeacherFieldId}`)
            .send(newTeacherField);
          // assertions
          expect(body).toStrictEqual({ msg: "Teacher_Field updated" });
          expect(statusCode).toBe(200);
          expect(findExistingField).toHaveBeenCalled();
          expect(findExistingField).toHaveBeenCalledWith(
            validMockFieldId,
            "-createdAt -updatedAt",
            "field"
          );
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFieldAlreadyAssignedToTeacherByPropertyService
          ).toHaveBeenCalledWith(
            [
              { school_id: validMockSchoolId },
              { teacher_id: validMockTeacherId },
              { field_id: validMockFieldId },
            ],
            "-createdAt -updatedAt",
            "teacherField"
          );
          expect(updateTeacherFieldService).toHaveBeenCalled();
          expect(updateTeacherFieldService).toHaveBeenCalledWith(
            [
              { _id: validMockTeacherFieldId },
              { teacher_id: validMockTeacherId },
              { school_id: validMockSchoolId },
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
          const deleteTeacherFieldService = mockService(
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
          expect(deleteTeacherFieldService).not.toHaveBeenCalled();
          expect(deleteTeacherFieldService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::02 - Passing fields with empty fields", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteTeacherFieldService = mockService(
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
          expect(deleteTeacherFieldService).not.toHaveBeenCalled();
          expect(deleteTeacherFieldService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::03 - Passing an invalid teacher_field and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteTeacherFieldService = mockService(
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
          expect(deleteTeacherFieldService).not.toHaveBeenCalled();
          expect(deleteTeacherFieldService).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::04 - Passing a teacher_field id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteTeacherFieldService = mockService(
            teacherFieldNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockTeacherFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Teacher_Field not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteTeacherFieldService).toHaveBeenCalled();
          expect(deleteTeacherFieldService).toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "teacherField"
          );
        });
      });
      describe("teacher_field::delete::05 - Passing a teacher_field id correctly to delete", () => {
        it("should delete a teacher_field", async () => {
          // mock services
          const deleteTeacherFieldService = mockService(
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
          expect(deleteTeacherFieldService).toHaveBeenCalled();
          expect(deleteTeacherFieldService).toHaveBeenCalledWith(
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
    //cspell:disable-next-line
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
      //cspell:disable-next-line
      class_unit_minute: 40,
      //cspell:disable-next-line
      monda: true,
      //cspell:disable-next-line
      tuesda: true,
      //cspell:disable-next-line
      wednesda: true,
      //cspell:disable-next-line
      thursda: true,
      //cspell:disable-next-line
      frida: true,
      //cspell:disable-next-line
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
      //cspell:disable-next-line
      name: "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
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

    // payloads
    const schoolPayload = {
      _id: validMockScheduleId,
      school_id: validMockSchoolId,
      name: "School 001",
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
    const schedulesNullPayload: any[] = [];

    // test blocks
    describe("POST /schedule ", () => {
      describe("schedule::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
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
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::04 - The day start value exceeds the limit for a day", () => {
        it("should return an exceeds the limit for a day error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newSchedule, dayStart: 1440 });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school start time must must not exceed the 23:59 hours",
              param: "dayStart",
              value: 1440,
            },
            {
              location: "body",
              msg: "There is not enough time to allocate the entire shift in a day",
              param: "shiftNumberMinutes",
              value: 360,
            },
            {
              location: "body",
              msg: "There is not enough time available to allocate any class in a day",
              param: "classUnitMinutes",
              value: 40,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::05 - The class unit value exceeds the limit for a shift", () => {
        it("should return an exceeds the limit for shift error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({
              ...newSchedule,
              number_of_minutes: 360,
              classUnitMinutes: 361,
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "There is not enough time available to allocate any class in the shift",
              param: "classUnitMinutes",
              value: 361,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::06 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
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
                //cspell:disable-next-line
                "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::07 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolNullPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please create the school first",
          });
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::08 - Passing an already existing schedule name", () => {
        it("should return an existing schedule name", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            [schedulePayload],
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
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
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).not.toHaveBeenCalled();
          expect(insertScheduleService).not.toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::09 - Passing a schedule but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
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
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).toHaveBeenCalled();
          expect(insertScheduleService).toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::post::10 - Passing a schedule correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const findFilterScheduleByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const insertScheduleService = mockService(
            schedulePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchedule);

          // assertions
          expect(body).toStrictEqual({
            msg: "Schedule created successfully!",
          });
          expect(statusCode).toBe(201);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalledWith(
            validMockSchoolId,
            "-createdAt -updatedAt",
            "school"
          );
          expect(findFilterScheduleByPropertyService).toHaveBeenCalled();
          expect(findFilterScheduleByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertScheduleService).toHaveBeenCalled();
          expect(insertScheduleService).toHaveBeenCalledWith(
            newSchedule,
            "schedule"
          );
        });
      });
    });

    describe("GET /schedule ", () => {
      describe("schedule - GET", () => {
        describe("schedule::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllSchedulesService = mockService(
              schedulesPayload,
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
            expect(findAllSchedulesService).not.toHaveBeenCalled();
            expect(findAllSchedulesService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllSchedulesService = mockService(
              schedulesPayload,
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
                //cspell:disable-next-line
                value: invalidMockId,
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllSchedulesService).not.toHaveBeenCalled();
            expect(findAllSchedulesService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllSchedulesService = mockService(
              schedulesPayload,
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
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]);
            expect(statusCode).toBe(400);
            expect(findAllSchedulesService).not.toHaveBeenCalled();
            expect(findAllSchedulesService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllSchedulesService = mockService(
              schedulesNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "No schedules found",
            });
            expect(statusCode).toBe(404);
            expect(findAllSchedulesService).toHaveBeenCalled();
            expect(findAllSchedulesService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllSchedulesService = mockService(
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
            expect(findAllSchedulesService).toHaveBeenCalled();
            expect(findAllSchedulesService).toHaveBeenCalledWith(
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
            const findScheduleByIdService = mockService(
              schedulesNullPayload,
              "findFilterResourceByProperty"
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
            expect(findScheduleByIdService).not.toHaveBeenCalled();
            expect(findScheduleByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findScheduleByIdService = mockService(
              schedulesNullPayload,
              "findFilterResourceByProperty"
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
            expect(findScheduleByIdService).not.toHaveBeenCalled();
            expect(findScheduleByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findScheduleByIdService = mockService(
              schedulesNullPayload,
              "findFilterResourceByProperty"
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
            expect(findScheduleByIdService).not.toHaveBeenCalled();
            expect(findScheduleByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findScheduleByIdService = mockService(
              schedulesNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockScheduleId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Schedule not found",
            });
            expect(statusCode).toBe(404);
            expect(findScheduleByIdService).toHaveBeenCalled();
            expect(findScheduleByIdService).toHaveBeenCalledWith(
              [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "schedule"
            );
          });
        });
        describe("schedule::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findScheduleByIdService = mockService(
              schedulePayload,
              "findFilterResourceByProperty"
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
            expect(findScheduleByIdService).toHaveBeenCalled();
            expect(findScheduleByIdService).toHaveBeenCalledWith(
              [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
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
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::04 - The day start value exceeds the limit for a day", () => {
        it("should return an exceeds the limit for a day error", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send({
              ...newSchedule,
              dayStart: 1440,
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The school start time must must not exceed the 23:59 hours",
              param: "dayStart",
              value: 1440,
            },
            {
              location: "body",
              msg: "There is not enough time to allocate the entire shift in a day",
              param: "shiftNumberMinutes",
              value: 360,
            },
            {
              location: "body",
              msg: "There is not enough time available to allocate any class in a day",
              param: "classUnitMinutes",
              value: 40,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::05 - The class unit value exceeds the limit for a shift", () => {
        it("should return an exceeds the limit for shift error", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockScheduleId}`)
            .send({
              ...newSchedule,
              dayStart: 1400,
              shiftNumberMinutes: 38,
              classUnitMinutes: 39,
            });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "There is not enough time available to allocate any class in the shift",
              param: "classUnitMinutes",
              value: 39,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::06 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
            schedulePayload,
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
                //cspell:disable-next-line
                "fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkjsdfi07879sdf0fdssdfsdfsdfeqwerdfasdf12341234asdfjñlkj879sdf01",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::07 - Passing a schedule but not updating it because schedule name already exist", () => {
        it("should not update a schedule", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).not.toHaveBeenCalled();
          expect(updateScheduleService).not.toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::08 - Passing a schedule but not updating it because it does not match the filters", () => {
        it("should not update a schedule", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).toHaveBeenCalled();
          expect(updateScheduleService).toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
            newSchedule,
            "schedule"
          );
        });
      });
      describe("schedule::put::09 - Passing a schedule correctly to update", () => {
        it("should update a schedule", async () => {
          // mock services
          const findScheduleNameDuplicatedByPropertyService = mockService(
            schedulesNullPayload,
            "findFilterResourceByProperty"
          );
          const updateScheduleService = mockService(
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
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalled();
          expect(
            findScheduleNameDuplicatedByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newSchedule.name }],
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateScheduleService).toHaveBeenCalled();
          expect(updateScheduleService).toHaveBeenCalledWith(
            [{ _id: validMockScheduleId }, { school_id: validMockSchoolId }],
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
          const deleteScheduleService = mockService(
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
          expect(deleteScheduleService).not.toHaveBeenCalled();
          expect(deleteScheduleService).not.toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
      describe("schedule::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteScheduleService = mockService(
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
          expect(deleteScheduleService).not.toHaveBeenCalled();
          expect(deleteScheduleService).not.toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
      describe("schedule::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteScheduleService = mockService(
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
          expect(deleteScheduleService).not.toHaveBeenCalled();
          expect(deleteScheduleService).not.toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
      describe("schedule::delete::04 - Passing a schedule id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteScheduleService = mockService(
            scheduleNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockScheduleId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Schedule not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteScheduleService).toHaveBeenCalled();
          expect(deleteScheduleService).toHaveBeenCalledWith(
            { _id: validMockScheduleId, school_id: validMockSchoolId },
            "schedule"
          );
        });
      });
      describe("schedule::delete::05 - Passing a schedule id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteScheduleService = mockService(
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
          expect(deleteScheduleService).toHaveBeenCalled();
          expect(deleteScheduleService).toHaveBeenCalledWith(
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
    const otherValidBreakMockId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const validMockScheduleId = new Types.ObjectId().toString();
    //cspell:disable-next-line
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

    // payloads
    const schedulePayload = {
      _id: validMockScheduleId,
      school_id: {
        _id: validMockSchoolId,
        name: "School 001",
      },
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
    const breaksNullPayload: any[] = [];

    // test blocks
    describe("POST /break ", () => {
      describe("break::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::04 - Passing break start time after 23:59", () => {
        it("should return an day exceeding break start time error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, breakStart: 1440 });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The break start time must must not exceed the 23:59 hours",
              param: "breakStart",
              value: 1440,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::05 - Passing an non-existent schedule in the body", () => {
        it("should return a non-existent schedule error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule exists",
          });
          expect(statusCode).toBe(404);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::06 - Passing a non-existing school", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            { ...schedulePayload, school_id: null },
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::07 - Passing non-matching value", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, school_id: otherValidBreakMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::08 - Passing a break start time that starts earlier than the school shift day start time", () => {
        it("should return a break start time error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newBreak, breakStart: 419 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::09 - Passing a break number of minutes too long to fit in the schedule shift, allowing to have a class before and after", () => {
        it("should return an break number of minutes not fitting the schedule length error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            //@ts-ignore
            .send({ ...newBreak, numberMinutes: 281 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure there is enough time to have at least 2 one-unit classes one before and one after the break",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).not.toHaveBeenCalled();
          expect(insertBreakService).not.toHaveBeenCalledWith(
            newBreak,
            "break"
          );
        });
      });
      describe("break::post::10 - Passing a break but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break not created!",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).toHaveBeenCalled();
          expect(insertBreakService).toHaveBeenCalledWith(newBreak, "break");
        });
      });
      describe("break::post::11 - Passing a break correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const insertBreakService = mockService(
            breakPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break created!",
          });
          expect(statusCode).toBe(200);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertBreakService).toHaveBeenCalled();
          expect(insertBreakService).toHaveBeenCalledWith(newBreak, "break");
        });
      });
    });

    describe("GET /break ", () => {
      describe("break - GET", () => {
        describe("break::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllBreaksService = mockService(
              breaksPayload,
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
            expect(findAllBreaksService).not.toHaveBeenCalled();
            expect(findAllBreaksService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllBreaksService = mockService(
              breaksPayload,
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
            expect(findAllBreaksService).not.toHaveBeenCalled();
            expect(findAllBreaksService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllBreaksService = mockService(
              breaksPayload,
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
            expect(findAllBreaksService).not.toHaveBeenCalled();
            expect(findAllBreaksService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllBreaksService = mockService(
              breaksNullPayload,
              "findFilterAllResources"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({ msg: "No breaks found" });
            expect(statusCode).toBe(404);
            expect(findAllBreaksService).toHaveBeenCalled();
            expect(findAllBreaksService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllBreaksService = mockService(
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
            expect(findAllBreaksService).toHaveBeenCalled();
            expect(findAllBreaksService).toHaveBeenCalledWith(
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
            const findBreakByIdService = mockService(
              breakPayload,
              "findFilterResourceByProperty"
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
            expect(findBreakByIdService).not.toHaveBeenCalled();
            expect(findBreakByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findBreakByIdService = mockService(
              breakPayload,
              "findFilterResourceByProperty"
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
            expect(findBreakByIdService).not.toHaveBeenCalled();
            expect(findBreakByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findBreakByIdService = mockService(
              breakPayload,
              "findFilterResourceByProperty"
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
            expect(findBreakByIdService).not.toHaveBeenCalled();
            expect(findBreakByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findBreakByIdService = mockService(
              breaksNullPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockBreakId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual({
              msg: "Break not found",
            });
            expect(statusCode).toBe(404);
            expect(findBreakByIdService).toHaveBeenCalled();
            expect(findBreakByIdService).toHaveBeenCalledWith(
              [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "break"
            );
          });
        });
        describe("break::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findBreakByIdService = mockService(
              breakPayload,
              "findFilterResourceByProperty"
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
            expect(findBreakByIdService).toHaveBeenCalled();
            expect(findBreakByIdService).toHaveBeenCalledWith(
              [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
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
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
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
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::04 - Passing break start time after 23:59", () => {
        it("should return an day exceeding break start time error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, breakStart: 1440 });

          // assertions
          expect(body).toStrictEqual([
            {
              location: "body",
              msg: "The break start time must must not exceed the 23:59 hours",
              param: "breakStart",
              value: 1440,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalled();
          expect(
            findPopulateExistingScheduleByIdService
          ).not.toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::05 - Passing an non-existent schedule in the body", () => {
        it("should return a non-existent schedule error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule exists",
          });
          expect(statusCode).toBe(404);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::06 - Passing a non-existing school", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            { ...schedulePayload, school_id: null },
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::07 - Passing non-matching school", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, school_id: otherValidBreakMockId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::08 - Passing a break start time that starts earlier than the school shift day start time", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, breakStart: 419 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please take into account that the break start time cannot be earlier than the schedule start time",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::09 - Passing a break number of minutes too long to fit in the schedule shift, allowing to have a class before and after", () => {
        it("should return an break number of minutes not fitting the schedule length error", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send({ ...newBreak, numberMinutes: 281 });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure there is enough time to have at least 2 one-unit classes one before and one after the break",
          });
          expect(statusCode).toBe(400);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).not.toHaveBeenCalled();
          expect(updateBreakService).not.toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::10 - Passing a break but not updating it because it does not match the filters", () => {
        it("should not update a break", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
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
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).toHaveBeenCalled();
          expect(updateBreakService).toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
            newBreak,
            "break"
          );
        });
      });
      describe("break::put::11 - Passing a break correctly to update", () => {
        it("should update a break", async () => {
          // mock services
          const findPopulateExistingScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateBreakService = mockService(
            breakPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockBreakId}`)
            .send(newBreak);

          // assertions
          expect(body).toStrictEqual({
            msg: "Break updated!",
          });
          expect(statusCode).toBe(200);
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateExistingScheduleByIdService).toHaveBeenCalledWith(
            newBreak.schedule_id,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateBreakService).toHaveBeenCalled();
          expect(updateBreakService).toHaveBeenCalledWith(
            [{ _id: validMockBreakId }, { school_id: validMockSchoolId }],
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
          const deleteBreakService = mockService(
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
          expect(deleteBreakService).not.toHaveBeenCalled();
          expect(deleteBreakService).not.toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: validMockSchoolId },
            "break"
          );
        });
      });
      describe("break::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteBreakService = mockService(
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
          expect(deleteBreakService).not.toHaveBeenCalled();
          expect(deleteBreakService).not.toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: validMockSchoolId },
            "break"
          );
        });
      });
      describe("break::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteBreakService = mockService(
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
          expect(deleteBreakService).not.toHaveBeenCalled();
          expect(deleteBreakService).not.toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: validMockSchoolId },
            "break"
          );
        });
      });
      describe("break::delete::04 - Passing a break id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteBreakService = mockService(
            breakNullPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Break not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteBreakService).toHaveBeenCalled();
          expect(deleteBreakService).toHaveBeenCalledWith(
            { _id: validMockBreakId, school_id: validMockSchoolId },
            "break"
          );
        });
      });
      describe("break::delete::05 - Passing a break id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteBreakService = mockService(
            breakPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockBreakId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Break deleted" });
          expect(statusCode).toBe(200);
          expect(deleteBreakService).toHaveBeenCalled();
          expect(deleteBreakService).toHaveBeenCalledWith(
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
    const otherValidMockLevelId = new Types.ObjectId().toString();
    //cspell:disable-next-line
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
      school_id: 9769231419,
      schedule_id: 9769231419,
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
    const schedulePayload = {
      _id: validMockScheduleId,
      school_id: {
        _id: validMockSchoolId,
        name: "School 001",
      },
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
    const levelsNullPayload: any[] = [];

    // test blocks
    describe("POST /level ", () => {
      describe("level::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
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
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
            .send(newLevelNotValidDataTypes);

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
              msg: "The level name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::05 - Passing a duplicated value", () => {
        it("should return an duplicated value error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            [levelPayload],
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
            msg: "This group name already exists",
          });
          expect(statusCode).toBe(409);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
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
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::07 - Passing a non-existent school in the schedule", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            { ...schedulePayload, school_id: null },
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
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::08 - Passing a non matching school id", () => {
        it("should return a non matching school id error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
            .send({ ...newLevel, school_id: otherValidMockLevelId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: otherValidMockLevelId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
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
      describe("level::post::09 - Passing a level but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(insertLevelService).toHaveBeenCalled();
          expect(insertLevelService).toHaveBeenCalledWith(newLevel, "level");
        });
      });
      describe("level::post::10 - Passing a level correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
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
            const findAllLevelsService = mockService(
              levelsPayload,
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
            expect(findAllLevelsService).not.toHaveBeenCalled();
            expect(findAllLevelsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllLevelsService = mockService(
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
            expect(findAllLevelsService).not.toHaveBeenCalled();
            expect(findAllLevelsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllLevelsService = mockService(
              levelsPayload,
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
            expect(findAllLevelsService).not.toHaveBeenCalled();
            expect(findAllLevelsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get::04 - Requesting all levels but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllLevelsService = mockService(
              levelsNullPayload,
              "findFilterAllResources"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual({ msg: "No levels found" });
            expect(statusCode).toBe(404);
            expect(findAllLevelsService).toHaveBeenCalled();
            expect(findAllLevelsService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get::05 - Requesting all levels correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllLevelsService = mockService(
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
            expect(findAllLevelsService).toHaveBeenCalled();
            expect(findAllLevelsService).toHaveBeenCalledWith(
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
            const findLevelByIdService = mockService(
              levelPayload,
              "findFilterResourceByProperty"
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
            expect(findLevelByIdService).not.toHaveBeenCalled();
            expect(findLevelByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findLevelByIdService = mockService(
              levelPayload,
              "findFilterResourceByProperty"
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
            expect(findLevelByIdService).not.toHaveBeenCalled();
            expect(findLevelByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findLevelByIdService = mockService(
              levelPayload,
              "findFilterResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockLevelId}`)
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
            expect(findLevelByIdService).not.toHaveBeenCalled();
            expect(findLevelByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get/:id::04 - Requesting a level but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findLevelByIdService = mockService(
              levelsNullPayload,
              "findFilterResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockLevelId}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual({
              msg: "Level not found",
            });
            expect(statusCode).toBe(404);
            expect(findLevelByIdService).toHaveBeenCalled();
            expect(findLevelByIdService).toHaveBeenCalledWith(
              [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "level"
            );
          });
        });
        describe("level::get/:id::05 - Requesting a level correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findLevelByIdService = mockService(
              levelPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockLevelId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(levelPayload);
            expect(statusCode).toBe(200);
            expect(findLevelByIdService).toHaveBeenCalled();
            expect(findLevelByIdService).toHaveBeenCalledWith(
              [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
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
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send(newLevelNotValidDataTypes);

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
              msg: "The level name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]);
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
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
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::05 - Passing a duplicated value", () => {
        it("should return an duplicated value error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send(newLevel);

          // assertions
          expect(body).toStrictEqual({
            msg: "This level name already exists!",
          });
          expect(statusCode).toBe(409);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).not.toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::06 - Passing a non-existent schedule in the body", () => {
        it("should return a non-existent schedule error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            scheduleNullPayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send(newLevel);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule exists",
          });
          expect(statusCode).toBe(404);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::07 - Passing a non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            { ...schedulePayload, school_id: null },
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send(newLevel);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::08 - Passing a non matching school id", () => {
        it("should return a non matching school id error", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send({ ...newLevel, school_id: otherValidMockLevelId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the schedule belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: otherValidMockLevelId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).not.toHaveBeenCalled();
          expect(updateFilterLevelService).not.toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::09 - Passing a level but not being updated", () => {
        it("should not update a field", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
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
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).toHaveBeenCalled();
          expect(updateFilterLevelService).toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
            newLevel,
            "level"
          );
        });
      });
      describe("level::put::10 - Passing a level correctly to update", () => {
        it("should update a level", async () => {
          // mock services
          const findFilterDuplicatedNameByProperty = mockService(
            levelsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateScheduleByIdService = mockService(
            schedulePayload,
            "findPopulateResourceById"
          );
          const updateFilterLevelService = mockService(
            levelPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockLevelId}`)
            .send(newLevel);

          // assertions
          expect(body).toStrictEqual({
            msg: "Level updated!",
          });
          expect(statusCode).toBe(200);
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalled();
          expect(findFilterDuplicatedNameByProperty).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newLevel.name }],
            "-createdAt -updatedAt",
            "level"
          );
          expect(findPopulateScheduleByIdService).toHaveBeenCalled();
          expect(findPopulateScheduleByIdService).toHaveBeenCalledWith(
            validMockScheduleId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "schedule"
          );
          expect(updateFilterLevelService).toHaveBeenCalled();
          expect(updateFilterLevelService).toHaveBeenCalledWith(
            [{ _id: validMockLevelId }, { school_id: validMockSchoolId }],
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
          const deleteLevelService = mockService(
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
          expect(deleteLevelService).not.toHaveBeenCalled();
          expect(deleteLevelService).not.toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: validMockSchoolId },
            "level"
          );
        });
      });
      describe("level::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteLevelService = mockService(
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
          expect(deleteLevelService).not.toHaveBeenCalled();
          expect(deleteLevelService).not.toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: validMockSchoolId },
            "level"
          );
        });
      });
      describe("level::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteLevelService = mockService(
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
          expect(deleteLevelService).not.toHaveBeenCalled();
          expect(deleteLevelService).not.toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: validMockSchoolId },
            "level"
          );
        });
      });
      describe("level::delete::04 - Passing a level id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteLevelService = mockService(
            levelNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockLevelId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({ msg: "Level not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteLevelService).toHaveBeenCalled();
          expect(deleteLevelService).toHaveBeenCalledWith(
            { _id: validMockLevelId, school_id: validMockSchoolId },
            "level"
          );
        });
      });
      describe("level::delete::05 - Passing a level id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteLevelService = mockService(
            levelPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockLevelId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Level deleted" });
          expect(statusCode).toBe(200);
          expect(deleteLevelService).toHaveBeenCalled();
          expect(deleteLevelService).toHaveBeenCalledWith(
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
    const otherValidMockGroupId = new Types.ObjectId().toString();
    const validMockLevelId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newGroup = {
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      name: "Group 001",
      numberStudents: 40,
    };
    const newGroupMissingValues = {
      school_i: validMockSchoolId,
      level_i: validMockLevelId,
      nam: "Group 001",
      numberStudent: 40,
    };
    const newGroupEmptyValues = {
      school_id: "",
      level_id: "",
      name: "",
      numberStudents: "",
    };
    const newGroupNotValidDataTypes = {
      school_id: invalidMockId,
      level_id: invalidMockId,
      name: 432943,
      numberStudents: "hello",
    };
    const newGroupWrongLengthValues = {
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
      numberStudents: 40,
    };

    // payloads
    const groupPayload = {
      _id: validMockGroupId,
      school_id: validMockSchoolId,
      level_id: validMockLevelId,
      name: "Group 001",
      numberStudents: 40,
    };
    const groupNullPayload = null;
    const levelPayload = {
      _id: validMockGroupId,
      school_id: { _id: validMockSchoolId, nam: "Mathematics" },
      schedule_id: validMockLevelId,
      name: "Level 001",
    };
    const levelNullPayload = null;
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
    const groupsNullPayload: any[] = [];

    // test blocks
    describe("POST /group ", () => {
      describe("group::post::01 - Passing missing fields", () => {
        it("should return a missing fields error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

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
              msg: "Please add a level name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::02 - Passing fields with empty values", () => {
        it("should return an empty fields error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

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
              msg: "The level name field is empty",
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
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

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
              msg: "The level name is not valid",
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
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroupWrongLengthValues);

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
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::05 - Passing a duplicated group name", () => {
        it("should return a duplicated group name", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            [groupPayload],
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "This group name already exists",
          });
          expect(statusCode).toBe(409);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::06 - Passing a non-existent level", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelNullPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level exists",
          });
          expect(statusCode).toBe(404);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::07 - Passing an non-existent school in the level", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            { ...levelPayload, school_id: null },
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::08 - Passing a non matching school id", () => {
        it("should return a non matching school id error", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newGroup, school_id: otherValidMockGroupId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: otherValidMockGroupId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).not.toHaveBeenCalled();
          expect(insertGroupService).not.toHaveBeenCalledWith(
            newGroup,
            "group"
          );
        });
      });
      describe("group::post::09 - Passing a group but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupNullPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({ msg: "Group not created!" });
          expect(statusCode).toBe(400);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).toHaveBeenCalled();
          expect(insertGroupService).toHaveBeenCalledWith(newGroup, "group");
        });
      });
      describe("group::post::10 - Passing a group correctly to create", () => {
        it("should create a field", async () => {
          // mock services
          const findFilterDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateExistingSchoolById = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const insertGroupService = mockService(
            groupPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({ msg: "Group created!" });
          expect(statusCode).toBe(200);
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalled();
          expect(
            findFilterDuplicatedGroupNameByPropertyService
          ).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateExistingSchoolById).toHaveBeenCalled();
          expect(findPopulateExistingSchoolById).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(insertGroupService).toHaveBeenCalled();
          expect(insertGroupService).toHaveBeenCalledWith(newGroup, "group");
        });
      });
    });

    describe("GET /group ", () => {
      describe("group - GET", () => {
        describe("group::get::01 - Passing missing fields", () => {
          it("should return a missing values error", async () => {
            // mock services
            const findAllGroupsService = mockService(
              groupsPayload,
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
            expect(findAllGroupsService).not.toHaveBeenCalled();
            expect(findAllGroupsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::02 - passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findAllGroupsService = mockService(
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
            expect(findAllGroupsService).not.toHaveBeenCalled();
            expect(findAllGroupsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::03 - passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findAllGroupsService = mockService(
              groupsPayload,
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
            expect(findAllGroupsService).not.toHaveBeenCalled();
            expect(findAllGroupsService).not.toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::04 - Requesting all groups but not finding any", () => {
          it("should not get any fields", async () => {
            // mock services
            const findAllGroupsService = mockService(
              groupsNullPayload,
              "findFilterAllResources"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual({ msg: "No groups found" });
            expect(statusCode).toBe(404);
            expect(findAllGroupsService).toHaveBeenCalled();
            expect(findAllGroupsService).toHaveBeenCalledWith(
              { school_id: validMockSchoolId },
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get::05 - Requesting all groups correctly", () => {
          it("should get all fields", async () => {
            // mock services
            const findAllGroupsService = mockService(
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
            expect(findAllGroupsService).toHaveBeenCalled();
            expect(findAllGroupsService).toHaveBeenCalledWith(
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
            const findGroupByIdService = mockService(
              groupPayload,
              "findFilterResourceByProperty"
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
            expect(findGroupByIdService).not.toHaveBeenCalled();
            expect(findGroupByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::02 - Passing fields with empty values", () => {
          it("should return an empty values error", async () => {
            // mock services
            const findGroupByIdService = mockService(
              groupPayload,
              "findFilterResourceByProperty"
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
            expect(findGroupByIdService).not.toHaveBeenCalled();
            expect(findGroupByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::03 - Passing invalid ids", () => {
          it("should return an invalid id error", async () => {
            // mock services
            const findGroupByIdService = mockService(
              groupPayload,
              "findFilterResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
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
            expect(findGroupByIdService).not.toHaveBeenCalled();
            expect(findGroupByIdService).not.toHaveBeenCalledWith(
              [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::04 - Requesting a group but not finding it", () => {
          it("should not get a school", async () => {
            // mock services
            const findGroupByIdService = mockService(
              groupsNullPayload,
              "findFilterResourceByProperty"
            );
            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
              .send({ school_id: validMockSchoolId });
            // assertions
            expect(body).toStrictEqual({
              msg: "Group not found",
            });
            expect(statusCode).toBe(404);
            expect(findGroupByIdService).toHaveBeenCalled();
            expect(findGroupByIdService).toHaveBeenCalledWith(
              [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
              "-createdAt -updatedAt",
              "group"
            );
          });
        });
        describe("group::get/:id::05 - Requesting a group correctly", () => {
          it("should get a field", async () => {
            // mock services
            const findGroupByIdService = mockService(
              groupPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockGroupId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toStrictEqual(groupPayload);
            expect(statusCode).toBe(200);
            expect(findGroupByIdService).toHaveBeenCalled();
            expect(findGroupByIdService).toHaveBeenCalledWith(
              [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
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
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
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
              msg: "Please add a level name",
              param: "name",
            },
            {
              location: "body",
              msg: "Please add the group number of students",
              param: "numberStudents",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).not.toHaveBeenCalled();
          expect(findPopulateLevelByIdService).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::02 - Passing fields with empty values", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
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
              msg: "The level name field is empty",
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
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).not.toHaveBeenCalled();
          expect(findPopulateLevelByIdService).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
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
              msg: "The level name is not valid",
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
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).not.toHaveBeenCalled();
          expect(findPopulateLevelByIdService).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
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
              msg: "The level name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ]);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(
            findDuplicatedGroupNameByPropertyService
          ).not.toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).not.toHaveBeenCalled();
          expect(findPopulateLevelByIdService).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::05 - Passing a duplicated group name values", () => {
        it("should return a duplicated group name error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            [groupPayload],
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "This group name already exists",
          });
          expect(statusCode).toBe(409);
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).not.toHaveBeenCalled();
          expect(findPopulateLevelByIdService).not.toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::06 - Passing a non-existent level", () => {
        it("should return a non-existent level error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelNullPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
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
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).toHaveBeenCalled();
          expect(findPopulateLevelByIdService).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::07 - Passing a non-existent school id in the level", () => {
        it("should return a non-existent school id in the level error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            { ...levelPayload, school_id: null },
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the school exists",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).toHaveBeenCalled();
          expect(findPopulateLevelByIdService).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::08 - Passing a non-matching school id", () => {
        it("should return a non-matching school id error", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
            groupNullPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send({ ...newGroup, school_id: otherValidMockGroupId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Please make sure the level belongs to the school",
          });
          expect(statusCode).toBe(400);
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: otherValidMockGroupId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).toHaveBeenCalled();
          expect(findPopulateLevelByIdService).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).not.toHaveBeenCalled();
          expect(updateGroupService).not.toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::09 - Passing a group but not updating it because it does not match the filters", () => {
        it("should not update a group", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
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
          expect(statusCode).toBe(404);
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).toHaveBeenCalled();
          expect(findPopulateLevelByIdService).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );
          expect(updateGroupService).toHaveBeenCalled();
          expect(updateGroupService).toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
            newGroup,
            "group"
          );
        });
      });
      describe("group::put::10 - Passing a group correctly to update", () => {
        it("should update a group", async () => {
          // mock services
          const findDuplicatedGroupNameByPropertyService = mockService(
            groupsNullPayload,
            "findFilterResourceByProperty"
          );
          const findPopulateLevelByIdService = mockService(
            levelPayload,
            "findPopulateResourceById"
          );
          const updateGroupService = mockService(
            groupPayload,
            "updateFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockGroupId}`)
            .send(newGroup);

          // assertions
          expect(body).toStrictEqual({
            msg: "Group updated!",
          });
          expect(statusCode).toBe(200);
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalled();
          expect(findDuplicatedGroupNameByPropertyService).toHaveBeenCalledWith(
            [{ school_id: validMockSchoolId }, { name: newGroup.name }],
            "-createdAt -updatedAt",
            "group"
          );
          expect(findPopulateLevelByIdService).toHaveBeenCalled();
          expect(findPopulateLevelByIdService).toHaveBeenCalledWith(
            validMockLevelId,
            "-createdAt -updatedAt",
            "school_id",
            "-createdAt -updatedAt",
            "level"
          );

          expect(updateGroupService).toHaveBeenCalled();
          expect(updateGroupService).toHaveBeenCalledWith(
            [{ _id: validMockGroupId }, { school_id: validMockSchoolId }],
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
          const deleteGroupService = mockService(
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
          expect(deleteGroupService).not.toHaveBeenCalled();
          expect(deleteGroupService).not.toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
      describe("group::delete::02 - Passing fields with empty values", () => {
        it("should return a empty fields error", async () => {
          // mock services
          const deleteGroupService = mockService(
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
          expect(deleteGroupService).not.toHaveBeenCalled();
          expect(deleteGroupService).not.toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
      describe("group::delete::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteGroupService = mockService(
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
          expect(deleteGroupService).not.toHaveBeenCalled();
          expect(deleteGroupService).not.toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
      describe("group::delete::04 - Passing a group id but not deleting it", () => {
        it("should not delete a school", async () => {
          // mock services
          const deleteGroupService = mockService(
            groupNullPayload,
            "deleteFilterResource"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockGroupId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({ msg: "Group not deleted" });
          expect(statusCode).toBe(404);
          expect(deleteGroupService).toHaveBeenCalled();
          expect(deleteGroupService).toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
      describe("group::delete::05 - Passing a group id correctly to delete", () => {
        it("should delete a field", async () => {
          // mock services
          const deleteGroupService = mockService(
            groupPayload,
            "deleteFilterResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockGroupId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({ msg: "Group deleted" });
          expect(statusCode).toBe(200);
          expect(deleteGroupService).toHaveBeenCalled();
          expect(deleteGroupService).toHaveBeenCalledWith(
            { _id: validMockGroupId, school_id: validMockSchoolId },
            "group"
          );
        });
      });
    });
  });
  // continue here --> add the max number of students to the school entity and refactor the other entities to adapt
  // continue here --> create the subjects entity code
});
