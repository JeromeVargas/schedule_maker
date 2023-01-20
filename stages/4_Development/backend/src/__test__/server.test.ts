import supertest from "supertest";

import { server, connection } from "../server";
import * as MongoServices from "../services/mongoServices";

describe("Schedule maker API", () => {
  describe("RESOURCE => School", () => {
    // end point url
    const endPointUrl = "/api/v1/school/";

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

    // test blocks
    describe("POST /school ", () => {
      describe("Passing a school correctly to create", () => {
        it("should create a school", async () => {
          // inputs
          const newSchool = {
            name: "school 182",
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            null,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

          // assertions
          expect(statusCode).toBe(201);
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              name: "school 182",
            })
          );
          expect(findResourceByPropertyService).toHaveBeenCalled();
          expect(insertResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school but not being created", () => {
        it("should not create school", async () => {
          // inputs
          const newSchool = {
            name: "school 182",
          };

          // payloads
          const schoolPayload = null;

          // mock services
          const findResourceByPropertyService = mockService(
            null,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

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
      describe("Passing an existing school name", () => {
        it("should return a duplicated school error", async () => {
          // inputs
          const newSchool = {
            name: "school 182",
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchool);

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
      describe("Passing a school without the name field", () => {
        it("should return a name needed error", async () => {
          // inputs
          const newSchoolMissingName = {
            nam: "school 182",
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolMissingName);

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
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an empty string as school name", () => {
        it("should return an empty field error", async () => {
          // inputs
          const newSchoolEmptyValue = {
            name: "",
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolEmptyValue);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name field is empty",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an integer as school name", () => {
        it("should return a not valid name error", async () => {
          // inputs
          const newSchoolNotAString = {
            name: 1234567890,
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolNotAString);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name is not valid",
              }),
            ])
          );
          expect(findResourceByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a long school name", () => {
        it("should return a name too long error", async () => {
          // inputs
          const newSchoolNameTooLong = {
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          };

          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByPropertyService = mockService(
            schoolPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolNameTooLong);

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
          // payloads
          const schoolsPayload = [
            {
              _id: "63c5dcac78b868f800355853",
              name: "school 001",
            },
            {
              _id: "63c5dcac78b868f800355857",
              name: "school 039",
            },
            {
              _id: "63c5dcac78b868f800355858",
              name: "school 182",
            },
          ];

          // mock services
          const findAllResourcesService = mockService(
            schoolsPayload,
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
                name: "school 182",
              }),
            ])
          );
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("Requesting a school correctly", () => {
        it("should get a school", async () => {
          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}63c5dcac78b868f800355853`)
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
          // payloads
          const schoolPayload = null;

          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}63c5dcac78b868f800355853`)
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
      describe("Passing an invalid formatted school name", () => {
        it("should return an invalid id error", async () => {
          // payloads
          const schoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 182",
          };

          // inputs
          const badlyFormattedId = "63c5dcac78b868f80035asdf";

          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedId}`)
            .send();

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid Id",
            })
          );
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
    });

    describe("PUT /school ", () => {
      describe("Passing a school correctly to update", () => {
        it("should update a school", async () => {
          // payloads
          const updatedSchoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 039",
          };

          // inputs
          const newSchool = {
            name: "school 039",
          };

          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}63c5dcac78b868f800355853`)
            .send(newSchool);

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              name: "school 039",
            })
          );
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school but not updating it", () => {
        it("should not update a school", async () => {
          // payloads
          const updatedSchoolPayload = null;

          // inputs
          const newSchool = {
            name: "school 039",
          };

          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}63c5dcac78b868f800355853`)
            .send(newSchool);

          // assertions
          expect(statusCode).toBe(404);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not updated",
            })
          );
          expect(updateResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school without the name field", () => {
        it("should return a name needed error", async () => {
          // payloads
          const updatedSchoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 039",
          };

          // inputs
          const newSchoolMissingName = {
            nam: "school 039",
          };

          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}63c5dcac78b868f800355853`)
            .send(newSchoolMissingName);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add a name",
              }),
            ])
          );
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an empty string as school name", () => {
        it("should return an empty field error", async () => {
          // payloads
          const updatedSchoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 039",
          };

          // inputs
          const newSchoolEmptyValue = {
            name: "",
          };

          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}63c5dcac78b868f800355853`)
            .send(newSchoolEmptyValue);

          //assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name field is empty",
              }),
            ])
          );
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing a long school name", () => {
        it("should return a name too long error", async () => {
          // payloads
          const updatedSchoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 039",
          };

          // inputs
          const newSchoolNameTooLong = {
            name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          };
          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}63c5dcac78b868f800355853`)
            .send(newSchoolNameTooLong);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name must not exceed 100 characters",
              }),
            ])
          );
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
      describe("Passing an invalid formatted school name", () => {
        it("should return an invalid id error", async () => {
          // payloads
          const updatedSchoolPayload = {
            _id: "63c5dcac78b868f800355853",
            name: "school 039",
          };

          // inputs
          const badlyFormattedId = "63c5dcac78b868f80035asdf";
          const newSchool = {
            name: "school 039",
          };

          // mock services
          const updateResourceService = mockService(
            updatedSchoolPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${badlyFormattedId}`)
            .send(newSchool);

          // assertions
          expect(statusCode).toBe(400);
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid Id",
            })
          );
          expect(updateResourceService).not.toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("Passing a school id correctly to delete", () => {
        it("should delete a school", async () => {
          // payloads
          const deletedSchoolPayload = {
            schoolDeleted: {
              _id: "63c5dcac78b868f800355853",
              name: "School 001",
            },
          };

          // mock services
          const deleteResourceService = mockService(
            deletedSchoolPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}63c5dcac78b868f800355853`)
            .send();

          // assertions
          expect(statusCode).toBe(200);
          expect(body).toEqual(
            expect.objectContaining({
              schoolDeleted: {
                _id: expect.any(String),
                name: "School 001",
              },
            })
          );
          expect(deleteResourceService).toHaveBeenCalled();
        });
      });
      describe("Passing a school id but not deleting it", () => {
        it("should not delete a school", async () => {
          // payloads
          const deletedSchoolPayload = null;

          // mock services
          const deleteResourceService = mockService(
            deletedSchoolPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}63c5dcac78b868f800355853`)
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
      describe("Passing an invalid formatted school id", () => {
        it("should return an invalid id error", async () => {
          // payloads
          const deletedSchoolPayload = {
            schoolDeleted: {
              _id: "63c5dcac78b868f800355853",
              name: "School 001",
            },
          };

          // inputs
          const badlyFormattedId = "63c5dcac78b868f80035asdf";

          // mock services
          const deleteResourceService = mockService(
            deletedSchoolPayload,
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
              msg: "Invalid Id",
            })
          );
          expect(deleteResourceService).not.toHaveBeenCalled();
        });
      });
    });
  });
});
