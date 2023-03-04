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

    // inputs
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const badlyFormattedMockId = "63e6a16f467d0e2d224f092$";
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
    const duplicatedSchoolPayload = {
      name: "school 001",
    };
    const duplicatedSchoolNullPayload = null;
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
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add a school name",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolByPropertyService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::02 - Passing a school with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolByPropertyService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolByPropertyService).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
            "findResourceByProperty"
          );
          const insertResourceService = mockService(
            schoolPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newSchoolWrongLengthValues);

          //assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name must not exceed 100 characters",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolByPropertyService).not.toHaveBeenCalled();
          expect(insertResourceService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::05 - Passing an existing school name", () => {
        it("should return a duplicated school error", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolPayload,
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "This school name already exists",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedSchoolByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::06 - Passing a school but not being created", () => {
        it("should not create a school", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalled();
        });
      });
      describe("school::post::07 - Passing a school correctly to create", () => {
        it("should create a school", async () => {
          // mock services
          const findDuplicatedSchoolByPropertyService = mockService(
            duplicatedSchoolNullPayload,
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "School created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findDuplicatedSchoolByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalled();
        });
      });
    });

    describe("GET /school ", () => {
      describe("school::get::01 - Requesting all schools but not finding any", () => {
        it("should not get any schools", async () => {
          // mock services
          const findAllResourcesService = mockService(
            schoolsNullPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "No schools found",
            })
          );
          expect(statusCode).toBe(404);
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("school::get::02 - Requesting all schools correctly", () => {
        it("should get all schools", async () => {
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 001",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 002",
              }),
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 003",
              }),
            ])
          );
          expect(statusCode).toBe(200);
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("school::get::03 - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
      describe("school::get::04 - Passing an badly formatted school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
      describe("school::get::05 - Requesting a school but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findResourceByIdService = mockService(
            schoolNullPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not found",
            })
          );
          expect(statusCode).toBe(404);
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("school::get::06 - Requesting a school correctly", () => {
        it("should get a school", async () => {
          // mock services
          const findResourceByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSchoolId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              name: "school 001",
            })
          );
          expect(statusCode).toBe(200);
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
    });

    describe("PUT /school ", () => {
      describe("school::put::01 - Passing a school with missing fields", () => {
        it("should return a field needed error", async () => {
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add a name",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
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
            .put(`${endPointUrl}${validMockSchoolId}`)
            .send(newSchoolNotValidDataTypes);

          //assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The school name is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The name must not exceed 100 characters",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::put::05 - Passing an badly formatted school id in the url", () => {
        it("should return an invalid id error", async () => {
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
            .put(`${endPointUrl}${badlyFormattedMockId}`)
            .send(newSchool);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::put::06 - Passing an invalid school id in the url", () => {
        it("should return an invalid id error", async () => {
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
            .send(newSchool);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::put::07 - Passing an existing school name", () => {
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "This school name already exists",
            })
          );
          expect(statusCode).toBe(409);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::put::08 - Passing a school but not updating it", () => {
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateSchoolService).toHaveBeenCalled();
        });
      });
      describe("school::put::09 - Passing a school correctly to update", () => {
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "School updated" })
          );
          expect(statusCode).toBe(200);
          expect(findSchoolNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateSchoolService).toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /school ", () => {
      describe("school::delete::01 - Passing an badly formatted school id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteSchoolService = mockService(
            schoolPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(deleteSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::delete::02 - Passing an invalid formatted school id in the url", () => {
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(deleteSchoolService).not.toHaveBeenCalled();
        });
      });
      describe("school::delete::03 - Passing a school id but not deleting it", () => {
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not deleted",
            })
          );
          expect(statusCode).toBe(404);
          expect(deleteSchoolService).toHaveBeenCalled();
        });
      });
      describe("school::delete::04 - Passing a school id correctly to delete", () => {
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "School deleted" })
          );
          expect(statusCode).toBe(200);
          expect(deleteSchoolService).toHaveBeenCalled();
        });
      });
    });
  });

  describe("RESOURCE => User", () => {
    // end point url
    const endPointUrl = "/api/v1/user/";

    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockUserId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const badlyFormattedMockId = "63e6a16f467d0e2d224f092$";
    const newUser = {
      firstName: "Jerome",
      lastName: "Vargas",
      school: validMockSchoolId,
      email: "jerome@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const newUserMissingValues = {
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
      hasTeachingFun: true,
    };
    const newUserEmptyValues = {
      firstName: "",
      lastName: "",
      school: "",
      email: "",
      password: "",
      role: "",
      status: "",
      hasTeachingFunc: "",
    };
    const newUserNotValidDataTypes = {
      firstName: 9087432156,
      lastName: 890213429039,
      school: 23943242,
      email: 9808934123,
      password: 12341234,
      role: 93870134699832,
      status: 43124314,
      hasTeachingFunc: 987314,
    };
    const newUserWrongLengthValues = {
      firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
      lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
      school: "1234123412341234123412341",
      email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
      password: "1234123",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const newUserWrongValues = {
      firstName: "Jerome",
      lastName: "Vargas",
      school: badlyFormattedMockId,
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
      firstName: "Jerome",
      lastName: "Vargas",
      school: validMockSchoolId,
      email: "jerome@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const userNullPayload = null;
    const duplicatedUserEmailPayload = {
      _id: validMockUserId,
      firstName: "Jerome",
      lastName: "Vargas",
      school: validMockSchoolId,
      email: "jerome@gmail.com",
      password: "12341234",
      role: "coordinator",
      status: "active",
      hasTeachingFunc: true,
    };
    const duplicatedUserEmailNullPayload = null;
    const schoolPayload = {
      name: "school 001",
    };
    const schoolNullPayload = null;
    const usersPayload = [
      {
        _id: new Types.ObjectId().toString(),
        firstName: "Jerome",
        lastName: "Vargas",
        school: new Types.ObjectId().toString(),
        email: "jerome@gmail.com",
        role: "headmaster",
        status: "inactive",
        hasTeachingFunc: true,
      },
      {
        _id: new Types.ObjectId().toString(),
        firstName: "Dave",
        lastName: "Gray",
        school: new Types.ObjectId().toString(),
        email: "dave@hotmail.com",
        role: "coordinator",
        status: "active",
        hasTeachingFunc: false,
      },
      {
        _id: new Types.ObjectId().toString(),
        //cspell:disable-next-line
        firstName: "Ania",
        //cspell:disable-next-line
        lastName: "Kubow",
        school: new Types.ObjectId().toString(),
        email: "ania@yahoo.com",
        role: "teacher",
        status: "suspended",
        hasTeachingFunc: true,
      },
    ];
    const usersNullPayload = null;

    // test blocks
    describe("POST /user ", () => {
      describe("user::post::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserMissingValues);

          // assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add if the user has teaching functions assigned",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");
          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserEmptyValues);

          // assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hasTeachingFunc field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserNotValidDataTypes);

          // assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hasTeachingFunc value is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserWrongLengthValues);

          //assertions
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
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::05 - Passing an invalid formatted school id in the body", () => {
        it("should return an invalid school id error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newUser, school: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::06 - Passing wrong school id, email, role or status", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUserWrongValues);

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
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::07 - Passing an existing user's email", () => {
        it("should return a duplicated user error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::08 - Passing an non-existing school", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolNullPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the school first",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::post::09 - Passing a user but not being created", () => {
        it("should not create a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalled();
        });
      });
      describe("user::post::10 - Passing a user correctly to create", () => {
        it("should create a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );
          const insertUserService = mockService(userPayload, "insertResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "User created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalled();
        });
      });
    });

    describe("GET /user ", () => {
      describe("user::get::01 - Requesting all users but not finding any", () => {
        it("should not get any users", async () => {
          // mock services
          const findAllUsersService = mockService(
            usersNullPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "No users found",
            })
          );
          expect(statusCode).toBe(404);
          expect(findAllUsersService).toHaveBeenCalled();
        });
      });
      describe("user::get::02 - Requesting all users", () => {
        it("should get all users", async () => {
          // mock services
          const findAllUsersService = mockService(
            usersPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
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
                hasTeachingFunc: true,
              }),
              expect.objectContaining({
                _id: expect.any(String),
                firstName: "Dave",
                lastName: "Gray",
                school: expect.any(String),
                email: "dave@hotmail.com",
                role: "coordinator",
                status: "active",
                hasTeachingFunc: false,
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
                hasTeachingFunc: true,
              }),
            ])
          );
          expect(statusCode).toBe(200);
          expect(findAllUsersService).toHaveBeenCalled();
        });
      });
      describe("user::get::03 - Passing a badly formatted user id in the url", () => {
        it("should return an badly formatted user id error", async () => {
          // mock services
          const findUserByIdService = mockService(
            userPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findUserByIdService).not.toHaveBeenCalled();
        });
      });
      describe("user::get::04 - Passing an invalid user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findUserByIdService = mockService(
            userPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserByIdService).not.toHaveBeenCalled();
        });
      });
      describe("user::get::05 - Requesting a user but not finding it", () => {
        it("should not get a user", async () => {
          // mock services
          const findUserByIdService = mockService(
            userNullPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not found",
            })
          );
          expect(statusCode).toBe(404);
          expect(findUserByIdService).toHaveBeenCalled();
        });
      });
      describe("user::get::06 - Requesting a user correctly", () => {
        it("should get a user", async () => {
          // mock services
          const findUserByIdService = mockService(
            userPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              _id: expect.any(String),
              firstName: "Jerome",
              lastName: "Vargas",
              school: expect.any(String),
              email: "jerome@gmail.com",
              status: "active",
              role: "coordinator",
              hasTeachingFunc: true,
            })
          );
          expect(statusCode).toBe(200);
          expect(findUserByIdService).toHaveBeenCalled();
        });
      });
    });

    describe("PUT /user ", () => {
      describe("user::put::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");
          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserMissingValues);

          // assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add if the user has teaching functions assigned",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserEmptyValues);

          //assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hasTeachingFunc field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserNotValidDataTypes);

          // assertions
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hasTeachingFunc value is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserWrongLengthValues);

          // assertions
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
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::05 - Passing wrong school id (badly formatted), email, role or status", () => {
        it("should return an invalid input value error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUserWrongValues);

          // assertions
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
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::06 - Passing a badly formatted user id in the url", () => {
        it("should return badly formatted user id id error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${badlyFormattedMockId}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::07 - Passing an invalid user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::08 - Passing an invalid formatted school id in the body", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send({ ...newUser, school: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid school Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::09 - Passing an existing user's email", () => {
        it("should return a duplicated user error", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::put::10 - Passing a user but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(
            userNullPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalled();
        });
      });
      describe("user::put::11 - Passing a user correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const findDuplicatedUserEmailByPropertyService = mockService(
            duplicatedUserEmailNullPayload,
            "findResourceByProperty"
          );
          const findSchoolByIdService = mockService(
            schoolPayload,
            "findResourceById"
          );

          const updateUserService = mockService(userPayload, "updateResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newUser);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "User updated" })
          );
          expect(statusCode).toBe(200);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /user ", () => {
      describe("user::delete::01 - Passing a badly formatted user id in the url", () => {
        it("should return a badly formatted user id error", async () => {
          // mock services
          const deleteUserService = mockService(userPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::delete::02 - Passing an invalid user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteUserService = mockService(userPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::delete::03 - Passing a user id but not deleting it", () => {
        it("should not delete a user", async () => {
          // mock services
          const deleteUserService = mockService(
            userNullPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not deleted",
            })
          );
          expect(statusCode).toBe(404);
          expect(deleteUserService).toHaveBeenCalled();
        });
      });
      describe("user::delete::04 - Passing a user id correctly to delete", () => {
        it("should delete a user", async () => {
          // mock services
          const deleteUserService = mockService(userPayload, "deleteResource");

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "User deleted" })
          );
          expect(statusCode).toBe(200);
          expect(deleteUserService).toHaveBeenCalled();
        });
      });
    });
  });

  describe("RESOURCE => Teacher", () => {
    // end point url
    const endPointUrl = "/api/v1/teacher/";
    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockTeacherId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockUserId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const badlyFormattedMockId = "63e6a16f467d0e2d224f092$";
    const newTeacher = {
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
    };
    const newTeacherMissingValues = {
      //cspell:disable-next-line
      user_i: validMockUserId,
      coordinator_i: validMockCoordinatorId,
      contractTyp: "full-time",
      //cspell:disable-next-line
      hoursAssignabl: 60,
      //cspell:disable-next-line
      hoursAssigne: 60,
    };
    const newTeacherEmptyValues = {
      user_id: "",
      coordinator_id: "",
      contractType: "",
      hoursAssignable: "",
      hoursAssigned: "",
    };
    const newTeacherNotValidDataTypes = {
      user_id: 87908074321,
      coordinator_id: 99221424323,
      contractType: true,
      hoursAssignable: "house",
      hoursAssigned: "three3",
    };
    const newTeacherWrongLengthValues = {
      user_id: "1234123421341234123412341",
      coordinator_id: "1234123421341234123412342",
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
    };
    const newTeacherWrongValues = {
      user_id: badlyFormattedMockId,
      coordinator_id: badlyFormattedMockId,
      //cspell:disable-next-line
      contractType: "tiempo-completo",
      hoursAssignable: 71,
      hoursAssigned: 72,
    };

    // payloads
    const teacherPayload = {
      _id: validMockTeacherId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
    };
    const teacherNullPayload = null;
    const userAlreadyTeacherPayload = {
      _id: validMockTeacherId,
      user_id: validMockUserId,
      coordinator_id: validMockCoordinatorId,
      contractType: "full-time",
      hoursAssignable: 60,
      hoursAssigned: 60,
    };
    const userAlreadyTeacherNullPayload = null;
    const userPayload = {
      _id: validMockUserId,
      firstName: "Jerome",
      lastName: "Vargas",
      school: validMockSchoolId,
      email: "jerome@gmail.com",
      password: "12341234",
      role: "teacher",
      status: "active",
      hasTeachingFunc: true,
    };
    const userNullPayload = null;
    const coordinatorPayload = {
      _id: validMockCoordinatorId,
      firstName: "Dave",
      lastName: "Gray",
      school: validMockSchoolId,
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
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "full-time",
        hoursAssignable: 60,
        hoursAssigned: 60,
      },
      {
        _id: new Types.ObjectId().toString(),
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "part-time",
        hoursAssignable: 40,
        hoursAssigned: 40,
      },
      {
        _id: new Types.ObjectId().toString(),
        user_id: new Types.ObjectId().toString(),
        coordinator_id: new Types.ObjectId().toString(),
        contractType: "substitute",
        hoursAssignable: 70,
        hoursAssigned: 70,
      },
    ];
    const teachersNullPayload = null;

    // test blocks
    describe("POST /teacher ", () => {
      describe("teacher::post::01 - Passing a teacher with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the teacher`s user's id",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the coordinator's id",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the teacher`s contract type",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the number of hours assignable to the teacher",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the number of hours assigned to the teacher",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::02 - Passing a teacher with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The contract type field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hours assignable field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hours assigned field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "contract type is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assignable value is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assigned value is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send(newTeacherWrongLengthValues);

          // assertions
          //assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is not in the correct format",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is not in the correct format",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::05 - Passing wrong user id, coordinator id, contract type, hours assignable or hours assigned", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the contract type provided is not a valid option",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assignable must not exceed 70 hours",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assigned must not exceed the hours assignable",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::06 - Passing an invalid formatted user`s id in the body", () => {
        it("should return an invalid user id error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newTeacher, user_id: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::07 - Passing an invalid formatted coordinator`s id in the body", () => {
        it("should return an invalid coordinator id error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const insertTeacherService = mockService(
            teacherPayload,
            "insertResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .post(`${endPointUrl}`)
            .send({ ...newTeacher, coordinator_id: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid coordinator Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::08 - user already a teacher", () => {
        it("should return a user already a teacher error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User is already a teacher",
            })
          );
          expect(statusCode).toBe(409);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(0);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::09 - Not finding a user", () => {
        it("should return a user not found error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userNullPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the base user first",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(1);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::10 - Passing an inactive user", () => {
        it("should return an inactive user error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            { ...userPayload, status: "inactive" },
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "The user is not active" })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(1);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::11 - Passing a user with no teaching functions assigned", () => {
        it("should return no teaching functions assigned error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            { ...userPayload, hasTeachingFunc: false },
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "The user does not have teaching functions assigned",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(1);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::12 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorNullPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an existent coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(2);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::13 - Passing a user with a role different from coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            { ...coordinatorPayload, role: "teacher" },
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass a user with a coordinator role",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(2);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::14 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            { ...coordinatorPayload, status: "inactive" },
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an active coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(2);
          expect(insertTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::15 - Passing a teacher but not being created", () => {
        it("should not create a teacher", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Teacher not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(2);
          expect(insertTeacherService).toHaveBeenCalled();
        });
      });
      describe("teacher::post::16 - Passing a teacher correctly to create", () => {
        it("should create a teacher", async () => {
          // mock services
          const findTeacherByIdPropertyService = mockService(
            userAlreadyTeacherNullPayload,
            "findResourceByProperty"
          );
          let findUserCoordinator = mockService(
            userPayload,
            "findResourceById"
          );
          findUserCoordinator = mockService(
            coordinatorPayload,
            "findResourceById"
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(findUserCoordinator).toHaveBeenCalledTimes(2);
          expect(insertTeacherService).toHaveBeenCalled();
        });
      });
    });

    describe("GET /teacher ", () => {
      describe("teacher::get::01 - Requesting all users but not finding any", () => {
        it("should not get any users", async () => {
          // mock services
          const findAllResourcesService = mockService(
            teacherNullPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "No teachers found",
            })
          );
          expect(statusCode).toBe(404);

          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("teacher::get::02 - Requesting all teachers", () => {
        it("should get all teachers", async () => {
          // mock services
          const findAllResourcesService = mockService(
            teachersPayload,
            "findAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                _id: expect.any(String),
                user_id: expect.any(String),
                coordinator_id: expect.any(String),
                contractType: "full-time",
                hoursAssignable: 60,
                hoursAssigned: 60,
              }),
              expect.objectContaining({
                _id: expect.any(String),
                user_id: expect.any(String),
                coordinator_id: expect.any(String),
                contractType: "part-time",
                hoursAssignable: 40,
                hoursAssigned: 40,
              }),
              expect.objectContaining({
                _id: expect.any(String),
                user_id: expect.any(String),
                coordinator_id: expect.any(String),
                contractType: "substitute",
                hoursAssignable: 70,
                hoursAssigned: 70,
              }),
            ])
          );
          expect(statusCode).toBe(200);
          expect(findAllResourcesService).toHaveBeenCalled();
        });
      });
      describe("teacher::get::03 - Passing an badly formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findResourceByIdService = mockService(
            teacherPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::get::03 - Passing an invalid formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findResourceByIdService = mockService(
            teacherPayload,
            "findResourceById"
          );

          //a pi call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid teacher user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findResourceByIdService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::get::04 - Requesting a teacher but not finding it", () => {
        it("should not get a teacher", async () => {
          // mock services
          const findResourceByIdService = mockService(
            teacherNullPayload,
            "findResourceById"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Teacher not found",
            })
          );
          expect(statusCode).toBe(404);

          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
      describe("teacher::get::05 - Requesting a teacher correctly", () => {
        it("should get a user", async () => {
          // mock services
          const findResourceByIdService = mockService(
            teacherPayload,
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
              user_id: expect.any(String),
              coordinator_id: expect.any(String),
              contractType: "full-time",
              hoursAssignable: 60,
              hoursAssigned: 60,
            })
          );
          expect(findResourceByIdService).toHaveBeenCalled();
        });
      });
    });

    describe("PUT /teacher ", () => {
      describe("teacher::put::01 - Passing a user with missing fields", () => {
        it("should return a field needed error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherMissingValues);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the teacher`s user's id",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the coordinator's id",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the teacher`s contract type",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the number of hours assignable to the teacher",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Please add the number of hours assigned to the teacher",
              }),
            ])
          );

          expect(statusCode).toBe(400);

          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::02 - Passing a user with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherEmptyValues);

          //assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The contract type field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hours assignable field is empty",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The hours assigned field is empty",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherNotValidDataTypes);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "contract type is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assignable value is not valid",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assigned value is not valid",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherWrongLengthValues);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is not in the correct format",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is not in the correct format",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::05 - Passing wrong user id, coordinator id, contract type, hours assignable or hours assigned", () => {
        it("should return a wrong input value error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacherWrongValues);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The teacher`s user's id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "The coordinator's id is Non-properly formatted",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "the contract type provided is not a valid option",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assignable must not exceed 70 hours",
              }),
            ])
          );
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "hours assigned must not exceed the hours assignable",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::06 - Passing a badly formatted user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${badlyFormattedMockId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::07 - Passing an id in the url different from the id in the body to update", () => {
        it("should return a not matching id error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${otherValidMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Param id does not match user id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::08 - Passing an invalid user`s id in the body", () => {
        it("should return an invalid coordinator id error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${invalidMockId}`)
            .send({ ...newTeacher, user_id: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid user Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::09 - Passing an invalid coordinator`s id in the body", () => {
        it("should return an invalid coordinator id error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send({ ...newTeacher, coordinator_id: invalidMockId });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Invalid coordinator Id",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).not.toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::10 - Not finding a teacher", () => {
        it("should return a teacher not found error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherNullPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the teacher first",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::11 - Not finding a coordinator", () => {
        it("should return a non-existent coordinator error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorNullPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an existent coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::12 - Passing a non coordinator user as coordinator", () => {
        it("should return an not-a-coordinator error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            { ...coordinatorPayload, role: "teacher" },
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass a user with a coordinator role",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::post::13 - Passing an inactive coordinator", () => {
        it("should return an inactive coordinator error", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            { ...coordinatorPayload, status: "inactive" },
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an active coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::put::14 - Passing a teacher but not updating it", () => {
        it("should not update a user", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherNullPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Teacher not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalled();
        });
      });
      describe("teacher::put::15 - Passing a teacher correctly to update", () => {
        it("should update a user", async () => {
          // mock services
          const findTeacherByPropertyService = mockService(
            teacherPayload,
            "findResourceByProperty"
          );
          const findCoordinatorByIdService = mockService(
            coordinatorPayload,
            "findResourceById"
          );
          const updateTeacherService = mockService(
            teacherPayload,
            "updateResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher updated" })
          );
          expect(statusCode).toBe(200);
          expect(findTeacherByPropertyService).toHaveBeenCalled();
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /teacher ", () => {
      describe("teacher::delete::01 - Passing an badly formatted user id in the url", () => {
        it("should return a badly formatted id error", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${badlyFormattedMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                msg: "Non-properly formatted id",
              }),
            ])
          );
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::delete::02 - Passing an invalid user id in the url", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${invalidMockId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Invalid user teacher Id" })
          );
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
        });
      });
      describe("teacher::delete::03 - Passing a teacher id but not deleting it", () => {
        it("should not delete a teacher", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherNullPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher not deleted" })
          );
          expect(statusCode).toBe(404);
          expect(deleteTeacherService).toHaveBeenCalled();
        });
      });
      describe("teacher::delete::04 - Passing a teacher id correctly to delete", () => {
        it("should delete a teacher", async () => {
          // mock services
          const deleteTeacherService = mockService(
            teacherPayload,
            "deleteResource"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .delete(`${endPointUrl}${validMockUserId}`)
            .send();

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher deleted" })
          );
          expect(statusCode).toBe(200);
          expect(deleteTeacherService).toHaveBeenCalled();
        });
      });
    });
  });
  // --> continue here, review the testing, check what info is actually needed, check plural or singular routes names
  describe("RESOURCE => field", () => {
    // end point url
    const endPointUrl = "/api/v1/field/";

    // inputs
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const badlyFormattedMockId = "63e6a16f467d0e2d224f092$";
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
    const duplicatedSchoolPayload = {
      name: "school 001",
    };
    const duplicatedSchoolNullPayload = null;
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
    describe("POST /field ", () => {
      describe.only("school::post::01 - Passing a school with missing fields", () => {
        it("should return a field needed error", async () => {});
      });
    });
  });
});
