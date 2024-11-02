import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as userServices from "../userServices";
import * as utils from "../../../lib/utilities/utils";

import { User } from "../../../typings/types";

type Service =
  | "insertUser"
  | "findFilterAllUsers"
  | "findUserByProperty"
  | "modifyFilterUser"
  | "removeFilterUser"
  | "findSchoolById";

describe("RESOURCE => User", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(userServices, service).mockReturnValue(payload);
  };
  // password hashing mock
  const mockHashingService = (hashedPwd: any) => {
    return jest.spyOn(utils, "hashPwd").mockResolvedValue(hashedPwd);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/users/";

  /* inputs */
  const validMockUserId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const tooLongPassword =
    "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341";
  const hashedPwd =
    "$2b$10$3R7rTrUF5Dtknal44dnzsuJh.I2UI1S6wW0hwWqbmoDopiGtEa36.";
  const newUser = {
    school_id: validMockSchoolId,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "jerome@gmail.com",
    password: "12341234",
    role: "coordinator",
    status: "active",
  };
  const newUserMissingValues = {
    school_i: validMockSchoolId,
    firstNam: "Jerome",
    lastNam: "Vargas",
    emai: "jerome@gmail.com",
    passwor: "12341234",
    rol: "coordinator",
    statu: "active",
  };
  const newUserEmptyValues = {
    school_id: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
    status: "",
  };
  const newUserNotValidDataTypes = {
    school_id: invalidMockId,
    firstName: 9087432156,
    lastName: 890213429039,
    email: 9808934123,
    password: 12341234,
    role: 93870134699832,
    status: 43124314,
  };
  const newUserWrongLengthValues = {
    school_id: validMockSchoolId,
    firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
    lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
    email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
    password: "1234123",
    role: "coordinator",
    status: "active",
  };
  const newUserWrongInputValues = {
    school_id: validMockSchoolId,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "jerome@gmail",
    password: "12341234",
    role: "coordinador",
    status: "activo",
  };

  /* payloads */
  const userPayload = {
    _id: validMockUserId,
    school_id: validMockSchoolId,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "jerome@gmail.com",
    role: "coordinator",
    status: "active",
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
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      firstName: "Dave",
      lastName: "Gray",
      email: "dave@hotmail.com",
      role: "coordinator",
      status: "active",
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      firstName: "Ania",
      lastName: "Kubow",
      email: "ania@yahoo.com",
      role: "teacher",
      status: "on_leave",
    },
  ];
  const usersNullPayload: User[] = [];

  // test blocks
  describe("POST /user ", () => {
    describe("user::post::01 - Passing a user with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          validMockSchoolId,
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserMissingValues.emai,
            school_id: newUserMissingValues.school_i,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUserMissingValues.passwor);
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUserMissingValues);
      });
    });
    describe("user::post::02 - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          validMockSchoolId,
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserEmptyValues.email,
            school_id: newUserEmptyValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUserEmptyValues.password);
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUserEmptyValues, "user");
      });
    });
    describe("user::post::03 - Passing an invalid type as field value", () => {
      it("should return a not valid type error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          validMockSchoolId,
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserNotValidDataTypes.email,
            school_id: newUserNotValidDataTypes.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserNotValidDataTypes.password
        );
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUserNotValidDataTypes);
      });
    });
    describe("user::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserWrongLengthValues.email,
            school_id: newUserWrongInputValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserWrongLengthValues.password
        );
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUserWrongLengthValues);
      });
    });
    describe("user::post::05 - Passing a password that is too long", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({
            ...newUser,
            password: tooLongPassword,
          });

        //assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The password must not exceed 128 characters",
            param: "password",
            value: tooLongPassword,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(findSchool).not.toHaveBeenCalled();
        expect(findSchool).not.toHaveBeenCalledWith(
          validMockSchoolId,
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserWrongLengthValues.email,
            school_id: newUserWrongInputValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(tooLongPassword);
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith({
          ...newUser,
          password: tooLongPassword,
        });
      });
    });
    describe("user::post::06 - Passing wrong school id, email, role or status", () => {
      it("should return a wrong input value error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userNullPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserWrongInputValues.email,
            school_id: newUserWrongInputValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserWrongInputValues.password
        );
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUserWrongInputValues);
      });
    });
    describe("user::post::07 - Passing a non-existing school", () => {
      it("should return a duplicate user error", async () => {
        // mock services
        const findSchool = mockService(schoolNullPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          { email: newUser.email, school_id: newUser.school_id },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUser.password);
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUser);
      });
    });
    describe("user::post::08 - Passing an existing user's email", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const findSchool = mockService(schoolPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).toHaveBeenCalled();
        expect(duplicateUserEmail).toHaveBeenCalledWith(
          { email: newUser.email, school_id: newUser.school_id },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUser.password);
        expect(insertUser).not.toHaveBeenCalled();
        expect(insertUser).not.toHaveBeenCalledWith(newUser);
      });
    });
    describe("user::post::09 - Passing a user but not being created", () => {
      it("should not create a user", async () => {
        // mock services
        const findSchool = mockService(schoolPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);

        const insertUser = mockService(userNullPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).toHaveBeenCalled();
        expect(duplicateUserEmail).toHaveBeenCalledWith(
          { email: newUser.email, school_id: newUser.school_id },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).toHaveBeenCalled();
        expect(hashPwd).toHaveBeenCalledWith(newUser.password);
        expect(insertUser).toHaveBeenCalled();
        expect(insertUser).toHaveBeenCalledWith({
          ...newUser,
          password: hashedPwd,
        });
      });
    });
    describe("user::post::10 - Passing a user correctly to create", () => {
      it("should create a user", async () => {
        // mock services
        const findSchool = mockService(schoolPayload, "findSchoolById");
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const insertUser = mockService(userPayload, "insertUser");

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
          "-createdAt -updatedAt"
        );
        expect(duplicateUserEmail).toHaveBeenCalled();
        expect(duplicateUserEmail).toHaveBeenCalledWith(
          { email: newUser.email, school_id: newUser.school_id },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).toHaveBeenCalled();
        expect(hashPwd).toHaveBeenCalledWith(newUser.password);
        expect(insertUser).toHaveBeenCalled();
        expect(insertUser).toHaveBeenCalledWith({
          ...newUser,
          password: hashedPwd,
        });
      });
    });
  });

  describe("GET /user ", () => {
    describe("user - GET", () => {
      describe("user::get::01 - passing a school with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findUsers = mockService(usersNullPayload, "findFilterAllUsers");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get::02 - passing a school with empty values", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findUsers = mockService(usersNullPayload, "findFilterAllUsers");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get::03 - Passing an invalid school id in the body", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findUsers = mockService(usersNullPayload, "findFilterAllUsers");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get::04 - Requesting all users but not finding any", () => {
        it("should not get any users", async () => {
          // mock services
          const findUsers = mockService(usersNullPayload, "findFilterAllUsers");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get::05 - Requesting all users", () => {
        it("should get all users", async () => {
          // mock services
          const findUsers = mockService(usersPayload, "findFilterAllUsers");

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

              lastName: "Vargas",
              role: "headmaster",
              school_id: expect.any(String),
              status: "inactive",
            },
            {
              _id: expect.any(String),
              email: "dave@hotmail.com",
              firstName: "Dave",

              lastName: "Gray",
              role: "coordinator",
              school_id: expect.any(String),
              status: "active",
            },
            {
              _id: expect.any(String),
              email: "ania@yahoo.com",
              firstName: "Ania",

              lastName: "Kubow",
              role: "teacher",
              school_id: expect.any(String),
              status: "on_leave",
            },
          ]);
          expect(statusCode).toBe(200);
          expect(findUsers).toHaveBeenCalled();
          expect(findUsers).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-password -createdAt -updatedAt"
          );
        });
      });
    });
    describe("user - GET/:id", () => {
      describe("user::get/:id::01 - passing a school with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findUser = mockService(userNullPayload, "findUserByProperty");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get/:id::02 - passing a school with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findUser = mockService(userNullPayload, "findUserByProperty");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get/:id::03 - Passing an invalid user and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findUser = mockService(userNullPayload, "findUserByProperty");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get/:id::04 - Requesting a user but not finding it", () => {
        it("should not get a user", async () => {
          // mock services
          const findUser = mockService(userNullPayload, "findUserByProperty");

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
            "-password -createdAt -updatedAt"
          );
        });
      });
      describe("user::get/:id::05 - Requesting a user correctly", () => {
        it("should get a user", async () => {
          // mock services
          const findUser = mockService(userPayload, "findUserByProperty");

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
          });
          expect(statusCode).toBe(200);
          expect(findUser).toHaveBeenCalled();
          expect(findUser).toHaveBeenCalledWith(
            { _id: validMockUserId, school_id: validMockSchoolId },
            "-password -createdAt -updatedAt"
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
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserMissingValues.emai,
            school_id: newUserMissingValues.school_i,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUserMissingValues.passwor);
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          { _id: validMockUserId, school_id: newUserMissingValues.school_i },
          newUserMissingValues
        );
      });
    });
    describe("user::put::02 - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserEmptyValues.email,
            school_id: newUserEmptyValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUserEmptyValues.password);
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          { _id: validMockUserId, school_id: newUserEmptyValues.school_id },
          newUserEmptyValues
        );
      });
    });
    describe("user::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

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
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserNotValidDataTypes.email,
            school_id: newUserNotValidDataTypes.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserNotValidDataTypes.password
        );
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: newUserNotValidDataTypes.school_id },
          newUserNotValidDataTypes
        );
      });
    });
    describe("user::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

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
          {
            email: newUserWrongLengthValues.email,
            school_id: newUserWrongLengthValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserWrongLengthValues.password
        );
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          {
            school_id: newUserWrongLengthValues.school_id,
            _id: validMockUserId,
          },
          newUserWrongLengthValues
        );
      });
    });
    describe("user::put::05 - Passing a password that is too long", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send({
            ...newUser,
            password: tooLongPassword,
          });

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The password must not exceed 128 characters",
            param: "password",
            value: tooLongPassword,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateUserEmail).not.toHaveBeenCalled();
        expect(duplicateUserEmail).not.toHaveBeenCalledWith(
          {
            email: newUserWrongLengthValues.email,
            school_id: newUserWrongLengthValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(tooLongPassword);
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          {
            _id: validMockUserId,
            school_id: newUserWrongLengthValues.school_id,
          },
          {
            ...newUser,
            password: tooLongPassword,
          }
        );
      });
    });
    describe("user::put::06 - Passing wrong email, role or status", () => {
      it("should return an invalid input value error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

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
          {
            email: newUserWrongInputValues.email,
            school_id: newUserWrongInputValues.school_id,
          },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(
          newUserWrongInputValues.password
        );
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          {
            _id: validMockUserId,
            school_id: newUserWrongInputValues.school_id,
          },
          newUserWrongInputValues
        );
      });
    });
    describe("user::put::07 - Passing an existing user's email", () => {
      it("should return a duplicate user error", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userPayload, "modifyFilterUser");

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
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).not.toHaveBeenCalled();
        expect(hashPwd).not.toHaveBeenCalledWith(newUser.password);
        expect(updateUser).not.toHaveBeenCalled();
        expect(updateUser).not.toHaveBeenCalledWith(
          { school_id: newUser.school_id, _id: validMockUserId },
          newUser
        );
      });
    });
    describe("user::put::08 - Passing a user but not updating it", () => {
      it("should not update a user", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userNullPayload, "modifyFilterUser");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "User not updated",
        });
        expect(statusCode).toBe(400);
        expect(duplicateUserEmail).toHaveBeenCalled();
        expect(duplicateUserEmail).toHaveBeenCalledWith(
          { email: newUser.email, school_id: newUser.school_id },
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).toHaveBeenCalled();
        expect(hashPwd).toHaveBeenCalledWith(newUser.password);
        expect(updateUser).toHaveBeenCalled();
        expect(updateUser).toHaveBeenCalledWith(
          { school_id: newUser.school_id, _id: validMockUserId },
          {
            ...newUser,
            password: hashedPwd,
          }
        );
      });
    });
    describe("user::put::09 - Passing a user correctly to update", () => {
      it("should update a user", async () => {
        // mock services
        const duplicateUserEmail = mockService(
          userNullPayload,
          "findUserByProperty"
        );
        const hashPwd = mockHashingService(hashedPwd);
        const updateUser = mockService(userPayload, "modifyFilterUser");

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
          "-password -createdAt -updatedAt"
        );
        expect(hashPwd).toHaveBeenCalled();
        expect(hashPwd).toHaveBeenCalledWith(newUser.password);
        expect(updateUser).toHaveBeenCalled();
        expect(updateUser).toHaveBeenCalledWith(
          { school_id: newUser.school_id, _id: validMockUserId },
          {
            ...newUser,
            password: hashedPwd,
          }
        );
      });
    });
  });

  describe("DELETE /user ", () => {
    describe("user::delete::01 - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // mock services
        const deleteUser = mockService(userNullPayload, "removeFilterUser");

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
        expect(deleteUser).not.toHaveBeenCalledWith({
          _id: validMockUserId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("user::delete::02 - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // mock services
        const deleteUser = mockService(userNullPayload, "removeFilterUser");

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
        expect(deleteUser).not.toHaveBeenCalledWith({
          _id: validMockUserId,
          school_id: "",
        });
      });
    });
    describe("user::delete::03 - Passing an invalid user and school ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteUser = mockService(userNullPayload, "removeFilterUser");

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
        expect(deleteUser).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("user::delete::04 - Passing a user id but not deleting it", () => {
      it("should not delete a user", async () => {
        // mock services
        const deleteUser = mockService(userNullPayload, "removeFilterUser");

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
        expect(deleteUser).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("user::delete::05 - Passing a user id correctly to delete", () => {
      it("should delete a user", async () => {
        // mock services
        const deleteUser = mockService(userPayload, "removeFilterUser");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockUserId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "User deleted" });
        expect(statusCode).toBe(200);
        expect(deleteUser).toHaveBeenCalled();
        expect(deleteUser).toHaveBeenCalledWith({
          _id: validMockUserId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
