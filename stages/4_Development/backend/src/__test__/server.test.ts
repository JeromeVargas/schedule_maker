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
    const endPointUrl = "/api/v1/schools/";

    // inputs
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
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
          expect([
            {
              location: "body",
              msg: "Please add a school name",
              param: "name",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school name field is empty",
              param: "name",
              value: "",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedSchoolNameByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "This school name already exists",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "School created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findDuplicatedSchoolNameByPropertyService).toHaveBeenCalled();
          expect(insertSchoolService).toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "No schools found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findAllSchoolsService).toHaveBeenCalled();
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
            expect([
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
            ]).toMatchObject(body);
            expect(statusCode).toBe(200);
            expect(findAllSchoolsService).toHaveBeenCalled();
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
            expect([
              {
                location: "params",
                msg: "The school id is not valid",
                param: "id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findSchoolByIdService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "School not found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findSchoolByIdService).toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                name: "school 001",
              })
            );
            expect(statusCode).toBe(200);
            expect(findSchoolByIdService).toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "Please add a name",
              param: "name",
            },
          ]).toMatchObject(body);
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
          expect([
            {
              location: "body",
              msg: "The name field is empty",
              param: "name",
              value: "",
            },
          ]).toMatchObject(body);
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
            .put(`${endPointUrl}${invalidMockId}`)
            .send(newSchoolNotValidDataTypes);

          //assertions
          expect([
            {
              location: "params",
              msg: "The school id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The school name is not valid",
              param: "name",
              value: 1234567890,
            },
          ]).toMatchObject(body);
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
          expect([
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findSchoolNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateSchoolService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "params",
              msg: "The school id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteSchoolService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "School not deleted",
            })
          );
          expect(statusCode).toBe(404);
          expect(deleteSchoolService).toHaveBeenCalled();
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
    const endPointUrl = "/api/v1/users/";

    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    const otherValidMockUserId = new Types.ObjectId().toString();
    //cspell:disable-next-line
    const invalidMockId = "63c5dcac78b868f80035asdf";
    const newUser = {
      school_id: validMockSchoolId,
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
      school_id: "1234123412341234123412341",
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
      password: "12341234",
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: "1234123412341234123412341",
            },
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the school first",
            })
          );
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(insertUserService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "User created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(insertUserService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllUsersService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllUsersService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllUsersService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "No users found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findAllUsersService).toHaveBeenCalled();
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
            expect([
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
            ]).toMatchObject(body);
            expect(statusCode).toBe(200);
            expect(findAllUsersService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findUserByPropertyService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findUserByPropertyService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "params",
                msg: "The user id is not valid",
                param: "id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findUserByPropertyService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "User not found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findUserByPropertyService).toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                school_id: expect.any(String),
                firstName: "Jerome",
                lastName: "Vargas",
                email: "jerome@gmail.com",
                status: "active",
                role: "coordinator",
                hasTeachingFunc: true,
              })
            );
            expect(statusCode).toBe(200);
            expect(findUserByPropertyService).toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "params",
              msg: "The user id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: "1234123412341234123412341",
            },
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findDuplicatedUserEmailByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please try a different email address",
            })
          );
          expect(statusCode).toBe(409);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(updateUserService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "User updated" })
          );
          expect(statusCode).toBe(200);
          expect(findDuplicatedUserEmailByPropertyService).toHaveBeenCalled();
          expect(updateUserService).toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "params",
              msg: "The user id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteUserService).not.toHaveBeenCalled();
        });
      });
      describe("user::delete::05 - Passing a user id but not deleting it", () => {
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User not deleted",
            })
          );
          expect(statusCode).toBe(404);
          expect(deleteUserService).toHaveBeenCalled();
        });
      });
      describe("user::delete::06 - Passing a user id correctly to delete", () => {
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
    const endPointUrl = "/api/v1/teachers/";
    // inputs
    const validMockUserId = new Types.ObjectId().toString();
    const validMockTeacherId = new Types.ObjectId().toString();
    const validMockCoordinatorId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
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
    const userPayload = {
      _id: validMockUserId,
      school_id: validMockSchoolId,
      firstName: "Jerome",
      lastName: "Vargas",
      email: "jerome@gmail.com",
      password: "12341234",
      role: "teacher",
      status: "active",
      hasTeachingFunc: true,
    };
    const userNullPayload = null;
    const schoolPayload = {
      _id: validMockSchoolId,
      name: "school 001",
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).not.toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the base user first",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "The user is not active" })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "The user does not have teaching functions assigned",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please create the school first",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an existent coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass a user with a coordinator role",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an active coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).not.toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "User is already a teacher",
            })
          );
          expect(statusCode).toBe(409);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(insertTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Teacher not created",
            })
          );
          expect(statusCode).toBe(400);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(insertTeacherService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findUserSchoolCoordinator).toHaveBeenCalled();
          expect(findTeacherByIdPropertyService).toHaveBeenCalled();
          expect(insertTeacherService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllTeachersService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllTeachersService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllTeachersService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "No teachers found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findAllTeachersService).toHaveBeenCalled();
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
            expect([
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
            ]).toMatchObject(body);
            expect(statusCode).toBe(200);
            expect(findAllTeachersService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "params",
                msg: "The teacher id is not valid",
                param: "id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findTeacherByPropertyService).not.toHaveBeenCalled();
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
              .get(`${endPointUrl}${validMockUserId}`)
              .send({ school_id: validMockSchoolId });

            // assertions
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Teacher not found",
              })
            );
            expect(statusCode).toBe(404);

            expect(findTeacherByPropertyService).toHaveBeenCalled();
          });
        });
        describe("teacher::get/:id::05 - Requesting a teacher correctly", () => {
          it("should get a user", async () => {
            // mock services
            const findTeacherByPropertyService = mockService(
              teacherPayload,
              "findFilterResourceByProperty"
            );

            // api call
            const { statusCode, body } = await supertest(server)
              .get(`${endPointUrl}${validMockUserId}`)
              .send({ school_id: validMockSchoolId });

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
            expect(findTeacherByPropertyService).toHaveBeenCalled();
          });
        });
      });
    });

    describe("PUT /teacher ", () => {
      describe("teacher::put::01 - Passing a user with missing fields", () => {
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The teacher's user id is not valid",
              param: "user_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The coordinator's id is not valid",
              param: "coordinator_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).not.toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an existent coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass a user with a coordinator role",
            })
          );
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please pass an active coordinator",
            })
          );
          expect(statusCode).toBe(400);
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).not.toHaveBeenCalled();
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
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Teacher not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalled();
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
            .put(`${endPointUrl}${validMockUserId}`)
            .send(newTeacher);

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher updated" })
          );
          expect(statusCode).toBe(200);
          expect(findCoordinatorByIdService).toHaveBeenCalled();
          expect(updateTeacherService).toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "params",
              msg: "The teacher's id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteTeacherService).not.toHaveBeenCalled();
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
            .delete(`${endPointUrl}${validMockUserId}`)
            .send({
              school_id: validMockSchoolId,
            });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher not deleted" })
          );
          expect(statusCode).toBe(404);
          expect(deleteTeacherService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Teacher deleted" })
          );
          expect(statusCode).toBe(200);
          expect(deleteTeacherService).toHaveBeenCalled();
        });
      });
    });
  });

  describe("RESOURCE => field", () => {
    // end point url
    const endPointUrl = "/api/v1/fields/";

    // inputs
    const validMockFieldId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
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
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect([
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
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect([
            {
              location: "body",
              msg: "The field name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).not.toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::05 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldNullPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Please make sure the school exists",
            })
          );
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::06 - Passing an existing field name", () => {
        it("should return a duplicated field error", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "This field name already exists" })
          );
          expect(statusCode).toBe(409);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).toHaveBeenCalled();
          expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::07 - Passing a field but not being created", () => {
        it("should not create a field", async () => {
          // mock services
          const findSchoolByIdService = mockService(
            fieldPayload,
            "findResourceById"
          );
          const findDuplicatedFieldsByPropertyService = mockService(
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Field not created!" })
          );
          expect(statusCode).toBe(400);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedFieldsByPropertyService).toHaveBeenCalled();
          expect(insertFieldService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Field created successfully!" })
          );
          expect(statusCode).toBe(201);
          expect(findSchoolByIdService).toHaveBeenCalled();
          expect(findDuplicatedFieldByPropertyService).toHaveBeenCalled();
          expect(insertFieldService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllFieldsService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllFieldsService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findAllFieldsService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "No fields found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findAllFieldsService).toHaveBeenCalled();
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
            expect([
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
            ]).toMatchObject(body);
            expect(statusCode).toBe(200);
            expect(findAllFieldsService).toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "Please add a school id",
                param: "school_id",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findFieldByIdService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "body",
                msg: "The school id field is empty",
                param: "school_id",
                value: "",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findFieldByIdService).not.toHaveBeenCalled();
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
            expect([
              {
                location: "params",
                msg: "The field id is not valid",
                param: "id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
              {
                location: "body",
                msg: "The school id is not valid",
                param: "school_id",
                //cspell:disable-next-line
                value: "63c5dcac78b868f80035asdf",
              },
            ]).toMatchObject(body);
            expect(statusCode).toBe(400);
            expect(findFieldByIdService).not.toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                msg: "Field not found",
              })
            );
            expect(statusCode).toBe(404);
            expect(findFieldByIdService).toHaveBeenCalled();
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
            expect(body).toEqual(
              expect.objectContaining({
                _id: expect.any(String),
                name: "Mathematics",
              })
            );
            expect(statusCode).toBe(200);
            expect(findFieldByIdService).toHaveBeenCalled();
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
            .send({ ...newFieldMissingValues, prevNam: "Science" });

          // assertions
          expect([
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
            {
              location: "body",
              msg: "Please add the previous field name",
              param: "prevName",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalled();
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
            .send({ ...newFieldEmptyValues, prevName: "" });

          //assertions
          expect([
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
            {
              location: "body",
              msg: "The previous field name is empty",
              param: "prevName",
              value: "",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalled();
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
            .send({ ...newFieldNotValidDataTypes, prevName: 12341234 });

          //assertions
          expect([
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
            {
              location: "body",
              msg: "The previous field name is not valid",
              param: "prevName",
              value: 12341234,
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalled();
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
            .send({
              ...newFieldWrongLengthValues,
              prevName:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            });

          // assertions
          expect([
            {
              location: "body",
              msg: "The name must not exceed 100 characters",
              param: "name",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
            {
              location: "body",
              msg: "The previous field name must not exceed 100 characters",
              param: "prevName",
              value:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(
            findFieldNameDuplicatedByPropertyService
          ).not.toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::05 - Passing a field but not updating it because the field name, prevName, already exists for the school", () => {
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
            .send({ ...newField, prevName: "Science" });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "This field name already exists!",
            })
          );
          expect(statusCode).toBe(409);
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id or previous name", () => {
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
            .send({ ...newField, prevName: "Science" });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({
              msg: "Field not updated",
            })
          );
          expect(statusCode).toBe(404);
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateFieldService).toHaveBeenCalled();
        });
      });
      describe("field::put::11 - Passing a field correctly to update", () => {
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
            .send({ ...newField, prevName: "Science" });

          // assertions
          expect(body).toEqual(
            expect.objectContaining({ msg: "Field updated" })
          );
          expect(statusCode).toBe(200);
          expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          expect(updateFieldService).toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteFieldService).not.toHaveBeenCalled();
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
          expect([
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::delete::03 - Passing an invalid field id in the url", () => {
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
          expect([
            {
              location: "params",
              msg: "The field id is not valid",
              param: "id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              //cspell:disable-next-line
              value: "63c5dcac78b868f80035asdf",
            },
          ]).toMatchObject(body);
          expect(statusCode).toBe(400);
          expect(deleteFieldService).not.toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Field not deleted" })
          );
          expect(statusCode).toBe(404);
          expect(deleteFieldService).toHaveBeenCalled();
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
          expect(body).toEqual(
            expect.objectContaining({ msg: "Field deleted" })
          );
          expect(statusCode).toBe(200);
          expect(deleteFieldService).toHaveBeenCalled();
        });
      });
    });
  });

  // continue here --> create the teacher_field table
  describe("RESOURCE => teacher_field", () => {
    // end point url
    const endPointUrl = "/api/v1/teacher_fields/";

    // inputs
    const validMockFieldId = new Types.ObjectId().toString();
    const validMockSchoolId = new Types.ObjectId().toString();
    //cspell:disable-next-line
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
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newFieldMissingValues);
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "Please add a school id",
          //     param: "school_id",
          //   },
          //   {
          //     location: "body",
          //     msg: "Please add a field name",
          //     param: "name",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).not.toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newFieldEmptyValues);
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The school id field is empty",
          //     param: "school_id",
          //     value: "",
          //   },
          //   {
          //     location: "body",
          //     msg: "The field name is empty",
          //     param: "name",
          //     value: "",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).not.toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::03 - Passing an invalid type as a value", () => {
        it("should return a not valid value error", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newFieldNotValidDataTypes);
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The school id is not valid",
          //     param: "school_id",
          //     value: 9769231419,
          //   },
          //   {
          //     location: "body",
          //     msg: "The field name is not valid",
          //     param: "name",
          //     value: 1234567890,
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).not.toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newFieldWrongLengthValues);
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The field name must not exceed 100 characters",
          //     param: "name",
          //     value:
          //       "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).not.toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::05 - Passing an non-existent school in the body", () => {
        it("should return a non-existent school error", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldNullPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newField);
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({
          //     msg: "Please make sure the school exists",
          //   })
          // );
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).not.toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::post::06 - Passing an existing field name", () => {
        it("should return a duplicated field error", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   [fieldPayload],
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newField);
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "This field name already exists" })
          // );
          // expect(statusCode).toBe(409);
          // expect(findSchoolByIdService).toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).toHaveBeenCalled();
          // expect(insertFieldService).not.toHaveBeenCalled();
        });
      });
      describe("school::post::07 - Passing a field but not being created", () => {
        it("should not create a field", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldsByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldNullPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newField);
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "Field not created!" })
          // );
          // expect(statusCode).toBe(400);
          // expect(findSchoolByIdService).toHaveBeenCalled();
          // expect(findDuplicatedFieldsByPropertyService).toHaveBeenCalled();
          // expect(insertFieldService).toHaveBeenCalled();
        });
      });
      describe("field::post::08 - Passing a field correctly to create", () => {
        it("should create a field", async () => {
          // // mock services
          // const findSchoolByIdService = mockService(
          //   fieldPayload,
          //   "findResourceById"
          // );
          // const findDuplicatedFieldByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const insertFieldService = mockService(
          //   fieldPayload,
          //   "insertResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .post(`${endPointUrl}`)
          //   .send(newField);
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "Field created successfully!" })
          // );
          // expect(statusCode).toBe(201);
          // expect(findSchoolByIdService).toHaveBeenCalled();
          // expect(findDuplicatedFieldByPropertyService).toHaveBeenCalled();
          // expect(insertFieldService).toHaveBeenCalled();
        });
      });
    });

    describe("GET /field ", () => {
      describe("field - GET", () => {
        describe("field::get::01 - passing a field with missing values", () => {
          it("should return a missing values error", async () => {
            // // mock services
            // const findAllFieldsService = mockService(
            //   fieldsPayload,
            //   "findFilterAllResources"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}`)
            //   .send();
            // // assertions
            // expect([
            //   {
            //     location: "body",
            //     msg: "Please add a school id",
            //     param: "school_id",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findAllFieldsService).not.toHaveBeenCalled();
          });
        });
        describe("field::get::02 - passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // // mock services
            // const findAllFieldsService = mockService(
            //   fieldsPayload,
            //   "findFilterAllResources"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}`)
            //   .send({ school_id: "" });
            // // assertions
            // expect([
            //   {
            //     location: "body",
            //     msg: "The school id field is empty",
            //     param: "school_id",
            //     value: "",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findAllFieldsService).not.toHaveBeenCalled();
          });
        });
        describe("field::get::03 - passing and invalid school id", () => {
          it("should get all fields", async () => {
            // // mock services
            // const findAllFieldsService = mockService(
            //   fieldsPayload,
            //   "findFilterAllResources"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}`)
            //   .send({ school_id: invalidMockId });
            // // assertions
            // expect([
            //   {
            //     location: "body",
            //     msg: "The school id is not valid",
            //     param: "school_id",
            //     //cspell:disable-next-line
            //     value: "63c5dcac78b868f80035asdf",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findAllFieldsService).not.toHaveBeenCalled();
          });
        });
        describe("field::get::04 - Requesting all fields but not finding any", () => {
          it("should not get any fields", async () => {
            // // mock services
            // const findAllFieldsService = mockService(
            //   fieldsNullPayload,
            //   "findFilterAllResources"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}`)
            //   .send({ school_id: validMockSchoolId });
            // // assertions
            // expect(body).toEqual(
            //   expect.objectContaining({
            //     msg: "No fields found",
            //   })
            // );
            // expect(statusCode).toBe(404);
            // expect(findAllFieldsService).toHaveBeenCalled();
          });
        });
        describe("field::get::05 - Requesting all fields correctly", () => {
          it("should get all fields", async () => {
            // // mock services
            // const findAllFieldsService = mockService(
            //   fieldsPayload,
            //   "findFilterAllResources"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}`)
            //   .send({ school_id: validMockSchoolId });
            // // assertions
            // expect([
            //   {
            //     _id: expect.any(String),
            //     name: "Mathematics",
            //     school_id: expect.any(String),
            //   },
            //   {
            //     _id: expect.any(String),
            //     name: "Language",
            //     school_id: expect.any(String),
            //   },
            //   {
            //     _id: expect.any(String),
            //     name: "Physics",
            //     school_id: expect.any(String),
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(200);
            // expect(findAllFieldsService).toHaveBeenCalled();
          });
        });
      });
      describe("field - GET/:id", () => {
        describe("field::get/:id::01 - Passing a field with missing values", () => {
          it("should return a missing values error", async () => {
            // // mock services
            // const findFieldByIdService = mockService(
            //   fieldPayload,
            //   "findFilterResourceByProperty"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}${validMockFieldId}`)
            //   .send();
            // // assertions
            // expect([
            //   {
            //     location: "body",
            //     msg: "Please add a school id",
            //     param: "school_id",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findFieldByIdService).not.toHaveBeenCalled();
          });
        });
        describe("field::get/:id::02 - Passing a field with empty values", () => {
          it("should return an empty values error", async () => {
            // // mock services
            // const findFieldByIdService = mockService(
            //   fieldPayload,
            //   "findFilterResourceByProperty"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}${validMockFieldId}`)
            //   .send({ school_id: "" });
            // // assertions
            // expect([
            //   {
            //     location: "body",
            //     msg: "The school id field is empty",
            //     param: "school_id",
            //     value: "",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findFieldByIdService).not.toHaveBeenCalled();
          });
        });
        describe("field::get/:id::03 - Passing an invalid field and school ids in the url", () => {
          it("should return an invalid id error", async () => {
            // // mock services
            // const findFieldByIdService = mockService(
            //   fieldPayload,
            //   "findFilterResourceByProperty"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}${invalidMockId}`)
            //   .send({ school_id: invalidMockId });
            // // assertions
            // expect([
            //   {
            //     location: "params",
            //     msg: "The field id is not valid",
            //     param: "id",
            //     //cspell:disable-next-line
            //     value: "63c5dcac78b868f80035asdf",
            //   },
            //   {
            //     location: "body",
            //     msg: "The school id is not valid",
            //     param: "school_id",
            //     //cspell:disable-next-line
            //     value: "63c5dcac78b868f80035asdf",
            //   },
            // ]).toMatchObject(body);
            // expect(statusCode).toBe(400);
            // expect(findFieldByIdService).not.toHaveBeenCalled();
          });
        });
        describe("field::get/:id::04 - Requesting a field but not finding it", () => {
          it("should not get a school", async () => {
            // // mock services
            // const findFieldByIdService = mockService(
            //   fieldsNullPayload,
            //   "findFilterResourceByProperty"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}${validMockFieldId}`)
            //   .send({ school_id: validMockSchoolId });
            // // assertions
            // expect(body).toEqual(
            //   expect.objectContaining({
            //     msg: "Field not found",
            //   })
            // );
            // expect(statusCode).toBe(404);
            // expect(findFieldByIdService).toHaveBeenCalled();
          });
        });
        describe("field::get/:id::05 - Requesting a field correctly", () => {
          it("should get a field", async () => {
            // // mock services
            // const findFieldByIdService = mockService(
            //   fieldPayload,
            //   "findFilterResourceByProperty"
            // );
            // // api call
            // const { statusCode, body } = await supertest(server)
            //   .get(`${endPointUrl}${validMockFieldId}`)
            //   .send({ school_id: validMockSchoolId });
            // // assertions
            // expect(body).toEqual(
            //   expect.objectContaining({
            //     _id: expect.any(String),
            //     name: "Mathematics",
            //   })
            // );
            // expect(statusCode).toBe(200);
            // expect(findFieldByIdService).toHaveBeenCalled();
          });
        });
      });
    });

    describe("PUT /field ", () => {
      describe("field::put::01 - Passing a field with missing fields", () => {
        it("should return a field needed error", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newFieldMissingValues, prevNam: "Science" });
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "Please add a school id",
          //     param: "school_id",
          //   },
          //   {
          //     location: "body",
          //     msg: "Please add a field name",
          //     param: "name",
          //   },
          //   {
          //     location: "body",
          //     msg: "Please add the previous field name",
          //     param: "prevName",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(
          //   findFieldNameDuplicatedByPropertyService
          // ).not.toHaveBeenCalled();
          // expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::02 - Passing a field with empty fields", () => {
        it("should return an empty field error", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newFieldEmptyValues, prevName: "" });
          // //assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The school id field is empty",
          //     param: "school_id",
          //     value: "",
          //   },
          //   {
          //     location: "body",
          //     msg: "The name field is empty",
          //     param: "name",
          //     value: "",
          //   },
          //   {
          //     location: "body",
          //     msg: "The previous field name is empty",
          //     param: "prevName",
          //     value: "",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(
          //   findFieldNameDuplicatedByPropertyService
          // ).not.toHaveBeenCalled();
          // expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::03 - Passing an invalid type as field value", () => {
        it("should return a not valid value error", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newFieldNotValidDataTypes, prevName: 12341234 });
          // //assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The school id is not valid",
          //     param: "school_id",
          //     value: 9769231419,
          //   },
          //   {
          //     location: "body",
          //     msg: "The field name is not valid",
          //     param: "name",
          //     value: 1234567890,
          //   },
          //   {
          //     location: "body",
          //     msg: "The previous field name is not valid",
          //     param: "prevName",
          //     value: 12341234,
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(
          //   findFieldNameDuplicatedByPropertyService
          // ).not.toHaveBeenCalled();
          // expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::04 - Passing too long or short input values", () => {
        it("should return an invalid length input value error", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({
          //     ...newFieldWrongLengthValues,
          //     prevName:
          //       "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          //   });
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The name must not exceed 100 characters",
          //     param: "name",
          //     value:
          //       "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          //   },
          //   {
          //     location: "body",
          //     msg: "The previous field name must not exceed 100 characters",
          //     param: "prevName",
          //     value:
          //       "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(
          //   findFieldNameDuplicatedByPropertyService
          // ).not.toHaveBeenCalled();
          // expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::05 - Passing a field but not updating it because the field name, prevName, already exists for the school", () => {
        it("should not update a field", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldNullPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newField, prevName: "Science" });
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({
          //     msg: "This field name already exists!",
          //   })
          // );
          // expect(statusCode).toBe(409);
          // expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          // expect(updateFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::put::06 - Passing a field but not updating it because it does not match one of the filters: _id, school_id or previous name", () => {
        it("should not update a field", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldNullPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newField, prevName: "Science" });
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({
          //     msg: "Field not updated",
          //   })
          // );
          // expect(statusCode).toBe(404);
          // expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          // expect(updateFieldService).toHaveBeenCalled();
        });
      });
      describe("field::put::11 - Passing a field correctly to update", () => {
        it("should update a field", async () => {
          // // mock services
          // const findFieldNameDuplicatedByPropertyService = mockService(
          //   fieldsNullPayload,
          //   "findFilterResourceByProperty"
          // );
          // const updateFieldService = mockService(
          //   fieldPayload,
          //   "updateFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .put(`${endPointUrl}${validMockFieldId}`)
          //   .send({ ...newField, prevName: "Science" });
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "Field updated" })
          // );
          // expect(statusCode).toBe(200);
          // expect(findFieldNameDuplicatedByPropertyService).toHaveBeenCalled();
          // expect(updateFieldService).toHaveBeenCalled();
        });
      });
    });

    describe("DELETE /field ", () => {
      describe("field::delete::01 - Passing a field with missing fields", () => {
        it("should return a missing fields error", async () => {
          // // mock services
          // const deleteFieldService = mockService(
          //   fieldNullPayload,
          //   "deleteFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .delete(`${endPointUrl}${validMockFieldId}`)
          //   .send();
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "Please add a school id",
          //     param: "school_id",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(deleteFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::delete::02 - Passing a field with empty fields", () => {
        it("should return a empty fields error", async () => {
          // // mock services
          // const deleteFieldService = mockService(
          //   fieldNullPayload,
          //   "deleteFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .delete(`${endPointUrl}${validMockFieldId}`)
          //   .send({ school_id: "" });
          // // assertions
          // expect([
          //   {
          //     location: "body",
          //     msg: "The school id field is empty",
          //     param: "school_id",
          //     value: "",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(deleteFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::delete::03 - Passing an invalid field id in the url", () => {
        it("should return an invalid id error", async () => {
          // // mock services
          // const deleteFieldService = mockService(
          //   fieldNullPayload,
          //   "deleteFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .delete(`${endPointUrl}${invalidMockId}`)
          //   .send({ school_id: invalidMockId });
          // // assertions
          // expect([
          //   {
          //     location: "params",
          //     msg: "The field id is not valid",
          //     param: "id",
          //     //cspell:disable-next-line
          //     value: "63c5dcac78b868f80035asdf",
          //   },
          //   {
          //     location: "body",
          //     msg: "The school id is not valid",
          //     param: "school_id",
          //     //cspell:disable-next-line
          //     value: "63c5dcac78b868f80035asdf",
          //   },
          // ]).toMatchObject(body);
          // expect(statusCode).toBe(400);
          // expect(deleteFieldService).not.toHaveBeenCalled();
        });
      });
      describe("field::delete::04 - Passing a field id but not deleting it", () => {
        it("should not delete a school", async () => {
          // // mock services
          // const deleteFieldService = mockService(
          //   fieldNullPayload,
          //   "deleteFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .delete(`${endPointUrl}${validMockFieldId}`)
          //   .send({ school_id: validMockSchoolId });
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "Field not deleted" })
          // );
          // expect(statusCode).toBe(404);
          // expect(deleteFieldService).toHaveBeenCalled();
        });
      });
      describe("field::delete::05 - Passing a field id correctly to delete", () => {
        it("should delete a field", async () => {
          // // mock services
          // const deleteFieldService = mockService(
          //   fieldPayload,
          //   "deleteFilterResource"
          // );
          // // api call
          // const { statusCode, body } = await supertest(server)
          //   .delete(`${endPointUrl}${validMockFieldId}`)
          //   .send({ school_id: validMockSchoolId });
          // // assertions
          // expect(body).toEqual(
          //   expect.objectContaining({ msg: "Field deleted" })
          // );
          // expect(statusCode).toBe(200);
          // expect(deleteFieldService).toHaveBeenCalled();
        });
      });
    });
  });
});
