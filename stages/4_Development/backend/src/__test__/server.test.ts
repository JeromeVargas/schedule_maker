import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

describe("Schedule maker API", () => {
  // mock services
  const mockService = (payload: unknown, service: string) => {
    return (
      jest
        // @ts-ignore
        .spyOn(MongoServices, service)
        // @ts-ignore
        .mockReturnValueOnce(payload)
    );
  };

  // hooks
  afterAll(() => {
    connection.close();
  });

  // resources testing
  describe("RESOURCE => School", () => {
    // end point url
    const endPointUrl = "/api/v1/school/";

    // test blocks
    describe("POST /school ", () => {
      describe("Passing a school correctly to create", () => {
        it("should create a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResource = {
            name: "school 182",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(201);
          expect(body).toEqual(
            expect.objectContaining({ msg: "School created successfully!" })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school but not being created", () => {
        it("should not create a school", async () => {
          // inputs
          const newResource = {
            name: "school 182",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = null;

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not created",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing an existing school", () => {
        it("should return a duplicated school error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResource = {
            name: "school 182",
          };

          // payloads
          const duplicateFound = {
            name: "school 182",
          };

          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(409);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "This school name already exists",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a school with missing fields", () => {
        it("should return a field needed error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceMissingValues = {
            nam: "school 182",
          };

          // payloads
          const duplicateFound = {
            name: "school 182",
          };
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceMissingValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add a school name",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            name: "",
          };

          // payloads
          const duplicateFound = {
            name: "school 182",
          };
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceEmptyValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name field is empty",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceNotValidDataTypes = {
            name: 1234567890,
          };

          // payloads
          const duplicateFound = {
            name: "school 182",
          };
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceNotValidDataTypes);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name is not valid",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceTooLongValues = {
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          };

          // payloads
          const duplicateFound = {
            name: "school 182",
          };
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceTooLongValues);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name must not exceed 100 characters",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
    });

    describe("GET /school ", () => {
      describe("Requesting all schools", () => {
        it("should get all schools", async () => {
          // inputs
          const validMockId01 = new Types.ObjectId().toString();
          const validMockId02 = new Types.ObjectId().toString();
          const validMockId03 = new Types.ObjectId().toString();

          // payloads
          const resourcesPayload = [
            {
              _id: validMockId01,
              name: "school 001",
            },
            {
              _id: validMockId02,
              name: "school 039",
            },
            {
              _id: validMockId03,
              name: "school 182",
            },
          ];

          // mock services
          const findAllResourcesService = mockService(
            resourcesPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 001",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 039",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 182",
              }),
            ])
          );
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("Requesting all schools but not finding any", () => {
        it("should not get any schools", async () => {
          // payloads
          const resourcesPayload = null;

          // mock services
          const findAllResourcesService = mockService(
            resourcesPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "No schools found",
            })
          );
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("Requesting a school correctly", () => {
        it("should get a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockId}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              name: "school 182",
            })
          );
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("Requesting a school but not finding it", () => {
        it("should not get a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = null;

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockId}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not found",
            })
          );
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school name id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedUrlId = "63c5dcac78b868f80035asdf";
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = {
            _id: validMockId,
            name: "school 182",
          };

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedUrlId}`)
            .send();

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
    });

    describe("PUT /school ", () => {
      describe("Passing a school correctly to update", () => {
        it("should update a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResource = {
            name: "school 039",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );

          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({ msg: "School updated" })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school but not updating it", () => {
        it("should not update a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResource = {
            name: "school 039",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = null;

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not updated",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school with missing fields", () => {
        it("should return a field needed error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceMissingValues = {
            nam: "school 039",
          };

          // payloads
          const duplicateFound = {
            _id: validMockId,
            name: "school 039",
          };
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResourceMissingValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add a name",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            name: 897898734134,
          };

          // payloads
          const duplicateFound = {
            _id: validMockId,
            name: "school 039",
          };
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResourceEmptyValues);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name is not valid",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            name: "",
          };

          // payloads
          const duplicateFound = {
            _id: validMockId,
            name: "school 039",
          };
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResourceEmptyValues);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name field is empty",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();
          const newResourceNameTooLong = {
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          };

          // payloads
          const duplicateFound = {
            _id: validMockId,
            name: "school 039",
          };
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockId}`)
            .send(newResourceNameTooLong);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name must not exceed 100 characters",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedUrlId = "63c5dcac78b868f80035asdf";
          const validMockId = new Types.ObjectId().toString();
          const newResource = {
            name: "school 039",
          };

          // payloads
          const duplicateFound = {
            _id: validMockId,
            name: "school 039",
          };
          const updatedResourcePayload = {
            _id: validMockId,
            name: "school 039",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${badlyFormattedUrlId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("Passing a school id correctly to delete", () => {
        it("should delete a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = {
            schoolDeleted: {
              _id: validMockId,
              name: "School 001",
            },
          };

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockId}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({ msg: "School deleted" })
          );
          expect(deleteResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school id but not deleting it", () => {
        it("should not delete a school", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = null;

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockId}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not deleted",
            })
          );
          expect(deleteResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedId = "63c5dcac78b868f80035asdf";
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = {
            schoolDeleted: {
              _id: validMockId,
              name: "School 001",
            },
          };

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${badlyFormattedId}`)
            .send();

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(deleteResourceService).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("RESOURCE => User", () => {
    // end point url
    const endPointUrl = "/api/v1/user/";

    // test blocks
    describe("POST /user ", () => {
      describe("Passing a user correctly to create", () => {
        it("should create a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(201);
          expect(body).toEqual(
            expect.objectContaining({ msg: "User created successfully!" })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a user but not being created", () => {
        it("should not create a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = null;

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not created",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing an existing user's email", () => {
        it("should return a duplicated user error", async () => {
          // inputs
          const validMockSchoolId = new Types.ObjectId().toString();
          const validMockUserId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(409);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // inputs
          const validMockSchoolId = new Types.ObjectId().toString();
          const validMockUserId = new Types.ObjectId().toString();
          const newResourceMissingValues = {
            firstNam: "Jerome",
            lastNam: "Vargas",
            //cspell:disable-next-line
            schoo: validMockSchoolId,
            //cspell:disable-next-line
            emai: "jerome@gmail.com",
            //cspell:disable-next-line
            passwor: "12341234",
            //cspell:disable-next-line
            rol: "coordinator",
            //cspell:disable-next-line
            statu: "active",
          };
          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceMissingValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's first name",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's last name",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's school",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's email",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's password",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's role",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's current status",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            firstName: "",
            lastName: "",
            school: "",
            email: "",
            password: "",
            role: "",
            status: "",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceEmptyValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The email field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The role field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The status field is empty",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceNotValidDataTypes = {
            firstName: 9087432156,
            lastName: 890213429039,
            school: 23943242,
            email: 9808934123,
            password: 12341234,
            role: 93870134699832,
            status: 43124314,
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceNotValidDataTypes);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "email is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "role is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "status is not valid",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceValuesTooLong = {
            firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
            lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
            school: 1234123412341234123412341,
            email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
            password: "1234123",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceValuesTooLong);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The email must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password must be at least 8 characters long",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school id in the body", () => {
        it("should return an invalid school id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedSchoolId = "63c5dcac78b868f80035asdf";
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: badlyFormattedSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            status: "active",
            role: "coordinator",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            status: "active",
            role: "coordinator",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing wrong school id, email, role or status", () => {
        it("should return a wrong input value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceWrongValues = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: "12341234123412341234!234",
            email: "jerome@gmail",
            password: "12341234",
            //cspell:disable-next-line
            role: "coordinador",
            //cspell:disable-next-line
            status: "activo",
          };

          // payloads
          const duplicateFound = null;
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            resourcePayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newResourceWrongValues);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "please add a correct email address",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the role provided is not a valid option",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the status provided is not a valid option",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
    });

    describe("GET /user ", () => {
      describe("Requesting all users", () => {
        it("should get all users", async () => {
          // inputs
          const validMockUserId01 = new Types.ObjectId().toString();
          const validMockUserId02 = new Types.ObjectId().toString();
          const validMockUserId03 = new Types.ObjectId().toString();
          const validMockSchoolId01 = new Types.ObjectId().toString();
          const validMockSchoolId02 = new Types.ObjectId().toString();
          const validMockSchoolId03 = new Types.ObjectId().toString();

          // payloads
          const resourcesPayload = [
            {
              _id: validMockUserId01,
              firstName: "Jerome",
              lastName: "Vargas",
              school: validMockSchoolId01,
              email: "jerome@gmail.com",
              role: "headmaster",
              status: "inactive",
            },
            {
              _id: validMockUserId02,
              firstName: "Dave",
              lastName: "Gray",
              school: validMockSchoolId02,
              email: "dave@hotmail.com",
              role: "coordinator",
              status: "active",
            },
            {
              _id: validMockUserId03,
              //cspell:disable-next-line
              firstName: "Ania",
              //cspell:disable-next-line
              lastName: "Kubow",
              school: validMockSchoolId03,
              email: "ania@yahoo.com",
              role: "teacher",
              status: "suspended",
            },
          ];

          // mock services
          const findAllResourcesService = mockService(
            resourcesPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                firstName: "Jerome",
                lastName: "Vargas",
                school: expect.any(String),
                email: "jerome@gmail.com",
                role: "headmaster",
                status: "inactive",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                firstName: "Dave",
                lastName: "Gray",
                school: expect.any(String),
                email: "dave@hotmail.com",
                role: "coordinator",
                status: "active",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                //cspell:disable-next-line
                firstName: "Ania",
                //cspell:disable-next-line
                lastName: "Kubow",
                school: expect.any(String),
                email: "ania@yahoo.com",
                role: "teacher",
                status: "suspended",
              }),
            ])
          );
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("Requesting all users but not finding any", () => {
        it("should not get any users", async () => {
          // payloads
          const resourcesPayload = null;
          // mock services
          const findAllResourcesService = mockService(
            resourcesPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "No users found",
            })
          );
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("Requesting a user correctly", () => {
        it("should get a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              firstName: "Jerome",
              lastName: "Vargas",
              school: expect.any(String),
              email: "jerome@gmail.com",
              status: "active",
              role: "coordinator",
            })
          );
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("Requesting a user but not finding it", () => {
        it("should not get a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = null;

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not found",
            })
          );
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedUserUrlId = "63c5dcac78b868f80035asdf";
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();

          // payloads
          const resourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByIdService = mockService(
            resourcePayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedUserUrlId}`)
            .send();

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
    });

    describe("PUT /user ", () => {
      describe("Passing a user correctly to update", () => {
        it("should update a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({ msg: "User updated" })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a user but not updating it", () => {
        it("should not update a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = null;

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not updated",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing an existing user's email", () => {
        it("should return a duplicated user error", async () => {
          // inputs
          const validMockDifferentUserIdUrl = new Types.ObjectId().toString();
          const validMockUserIdPayload = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = {
            _id: validMockUserIdPayload,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            role: "coordinator",
            status: "active",
          };
          const updatedResourcePayload = {
            _id: validMockUserIdPayload,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockDifferentUserIdUrl}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(409);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceMissingValues = {
            firstNam: "Jerome",
            lastNam: "Vargas",
            //cspell:disable-next-line
            schoo: validMockSchoolId,
            //cspell:disable-next-line
            emai: "jerome@gmail.com",
            //cspell:disable-next-line
            passwor: "12341234",
            rol: "coordinator",
            //cspell:disable-next-line
            statu: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResourceMissingValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's first name",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's last name",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's school",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's email",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's password",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's role",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the user's current status",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            firstName: "",
            lastName: "",
            school: "",
            email: "",
            password: "",
            role: "",
            status: "",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResourceEmptyValues);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The email field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The role field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The status field is empty",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceEmptyValues = {
            firstName: 9087432156,
            lastName: 890213429039,
            school: 23943242,
            email: 9808934123,
            password: 12341234,
            role: 93870134699832,
            status: 43124314,
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResourceEmptyValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "email is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "role is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "status is not valid",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceValuesTooLong = {
            firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
            lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
            school: 1234123412341234123412341,
            email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
            password: "1234123",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );

          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResourceValuesTooLong);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The first name must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The last name must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The email must not exceed 50 characters",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The password must be at least 8 characters long",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedUserUrlId = "63c5dcac78b868f80035asdf";
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${badlyFormattedUserUrlId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school id in the body", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedSchoolId = "63c5dcac78b868f80035asdf";
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResource = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: badlyFormattedSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );
          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResource);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing wrong school id, email, role or status", () => {
        it("should return an invalid input value error", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();
          const newResourceWrongValues = {
            firstName: "Jerome",
            lastName: "Vargas",
            school: "12341234123412341234!234",
            email: "jerome@gmail",
            password: "12341234",
            //cspell:disable-next-line
            role: "coordinador",
            //cspell:disable-next-line
            status: "activo",
          };

          // payloads
          const duplicateFound = null;
          const updatedResourcePayload = {
            _id: validMockUserId,
            firstName: "Jerome",
            lastName: "Vargas",
            school: validMockSchoolId,
            email: "jerome@gmail.com",
            password: "12341234",
            role: "coordinator",
            status: "active",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            duplicateFound,
            "findResourceByProperty"
          );

          const updateResourceService = mockService(
            updatedResourcePayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newResourceWrongValues);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "please add a correct email address",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the role provided is not a valid option",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the status provided is not a valid option",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /user ", () => {
      describe("Passing a user id correctly to delete", () => {
        it("should delete a user", async () => {
          // inputs
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = {
            resourceDeleted: {
              _id: validMockUserId,
              firstName: "Jerome",
              lastName: "Vargas",
              school: validMockSchoolId,
              email: "jerome@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "active",
            },
          };

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({ msg: "User deleted" })
          );
          expect(deleteResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a user id but not deleting it", () => {
        it("should not delete a user", async () => {
          // inputs
          const validMockId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = null;

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockId}`)
            .send();

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not deleted",
            })
          );
          expect(deleteResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // inputs
          //cspell:disable-next-line
          const badlyFormattedUserUrlId = "63c5dcac78b868f80035asdf";
          const validMockUserId = new Types.ObjectId().toString();
          const validMockSchoolId = new Types.ObjectId().toString();

          // payloads
          const deletedResourcePayload = {
            schoolDeleted: {
              _id: validMockUserId,
              firstName: "Jerome",
              lastName: "Vargas",
              school: validMockSchoolId,
              email: "jerome@gmail.com",
              password: "12341234",
              status: "active",
              role: "coordinator",
            },
          };

          // mock services
          const deleteResourceService = mockService(
            deletedResourcePayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${badlyFormattedUserUrlId}`)
            .send();

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(deleteResourceService).not.toHaveBeenCalled();
        });
      });
    });
  });
});
