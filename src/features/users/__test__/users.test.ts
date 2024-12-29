import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  findAllUsers,
  insertManyUsers,
  insertUser,
  removeAllUsers,
  insertSchool,
  removeAllSchools,
} from "../users.services";
import {
  NewSchool,
  NewUser,
  SchoolStatus,
  UserRole,
  UserStatus,
} from "../../../typings/types";

describe("RESOURCE => USERS", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllUsers();
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
  const endPointUrl = `${BASE_URL}users/`;

  // test blocks
  describe("USERS - POST", () => {
    describe("POST - /users - Passing a user with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserMissingValues = {
          school_i: validMockSchoolId,
          firstNam: "Jerome",
          lastNam: "Vargas",
          emai: "jerome@gmail.com",
          passwor: "12341234",
          rol: "coordinator",
          statu: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUserMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newUserEmptyValues = {
          school_id: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          status: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUserEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing an invalid type as field value", () => {
      it("should return a not valid type error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newUserNotValidDataTypes = {
          school_id: invalidMockId,
          firstName: 9087432156,
          lastName: 890213429039,
          email: 9808934123,
          password: 12341234,
          role: 93870134699832,
          status: 43124314,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUserNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserWrongLengthValues = {
          school_id: validMockSchoolId,
          firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
          lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
          email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
          password: "1234123",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUserWrongLengthValues);

        //assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing a password that is too long", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const tooLongPassword =
          "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341";
        const newUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: tooLongPassword,
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUser);

        //assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The password must not exceed 128 characters",
              param: "password",
              value: tooLongPassword,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing wrong email, role or status", () => {
      it("should return a wrong input value error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserWrongInputValues = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail",
          password: "12341234",
          role: "coordinador",
          status: "activo",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUserWrongInputValues);

        //assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /users - Passing a non-existing school", () => {
      it("should return a duplicate user error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please create the school first",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /users - Passing an existing user's email", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const newSchool = {
          _id: validMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newUser = {
          _id: validMockUserId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please try a different email address",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /users - Passing a user correctly to create", () => {
      it("should create a user", async () => {
        // inputs
        const ValidMockSchoolId = new Types.ObjectId().toString();
        const newSchool = {
          _id: ValidMockSchoolId,
          name: "school 001",
          groupMaxNumStudents: 40,
          status: "active" as SchoolStatus,
        };
        await insertSchool(newSchool);
        const newUser = {
          school_id: ValidMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "User created successfully!",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("USERS - GET", () => {
    describe("GET - /users - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users - passing a school with empty values", () => {
      it("should return an invalid id error", async () => {
        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users - Passing an invalid school id in the body", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockSchoolId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: invalidMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockSchoolId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users - Requesting all users but not finding any", () => {
      it("should not get any users", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        expect(body).toStrictEqual({
          // assertions{}
          msg: "No users found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /users - Requesting all users", () => {
      it("should get all users", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUsers: NewUser[] = [
          {
            school_id: validMockSchoolId,
            firstName: "Jerome",
            lastName: "Vargas",
            email: "jerome@gmail.com",
            password: "s3dfj234802974sf",
            role: "headmaster",
            status: "inactive",
          },
          {
            school_id: validMockSchoolId,
            firstName: "Dave",
            lastName: "Gray",
            email: "dave@hotmail.com",
            password: "s3dfj234802974sf",
            role: "coordinator",
            status: "active",
          },
          {
            school_id: validMockSchoolId,
            firstName: "Ania",
            lastName: "Kubow",
            email: "ania@yahoo.com",
            password: "s3dfj234802974sf",
            role: "teacher",
            status: "leave",
          },
        ];
        await insertManyUsers(newUsers);
        const users = await findAllUsers(validMockSchoolId);
        const usersPayload = [
          {
            _id: users[0]._id.toString(),
            school_id: validMockSchoolId,
            firstName: "Jerome",
            lastName: "Vargas",
            email: "jerome@gmail.com",
            role: "headmaster",
            status: "inactive",
          },
          {
            _id: users[1]._id.toString(),
            school_id: validMockSchoolId,
            firstName: "Dave",
            lastName: "Gray",
            email: "dave@hotmail.com",
            role: "coordinator",
            status: "active",
          },
          {
            _id: users[2]._id.toString(),
            school_id: validMockSchoolId,
            firstName: "Ania",
            lastName: "Kubow",
            email: "ania@yahoo.com",
            role: "teacher",
            status: "leave",
          },
        ];

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: usersPayload,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /users/:id - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockUserId}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users/:id - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockUserId}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users/:id - Passing an invalid user and school ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockUserId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${invalidMockUserId}`)
          .send({ school_id: invalidMockUserId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "params",
              msg: "The user id is not valid",
              param: "id",
              value: invalidMockUserId,
            },
            {
              location: "body",
              msg: "The school id is not valid",
              param: "school_id",
              value: invalidMockUserId,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /users/:id - Requesting a user but not finding it", () => {
      it("should not get a user", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockUserId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${otherValidMockUserId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "User not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /users/:id - Requesting a user correctly", () => {
      it("should get a user", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUser: NewUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          password: "78sdf3322222a13dsd",
          email: "jerome@gmail.com",
          role: "coordinator",
          status: "active",
        };
        const user = await insertUser(newUser);
        const userId = user._id.toString();
        const userPayload = {
          _id: userId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${userId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: userPayload,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("USERS - PUT ", () => {
    describe("PUT - /users/:id - Passing a user with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserMissingValues = {
          school_i: validMockSchoolId,
          firstNam: "Jerome",
          lastNam: "Vargas",
          emai: "jerome@gmail.com",
          passwor: "12341234",
          rol: "coordinator",
          statu: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUserMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing a user with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const newUserEmptyValues = {
          school_id: "",
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          role: "",
          status: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUserEmptyValues);

        //assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newUserNotValidDataTypes = {
          school_id: invalidMockId,
          firstName: 9087432156,
          lastName: 890213429039,
          email: 9808934123,
          password: 12341234,
          role: 93870134699832,
          status: 43124314,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newUserNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserWrongLengthValues = {
          school_id: validMockSchoolId,
          firstName: "Jerome Je Jerome Je Jerome Je Jerome Je Jerome Je 1",
          lastName: "Vargas Va Vargas Va Vargas Va Vargas Va Vargas Va  1",
          email: "jeromejeromejeromejeromejeromejeromejerom@gmail.com",
          password: "1234123",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUserWrongLengthValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing a password that is too long", () => {
      it("should return an invalid length input value error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const tooLongPassword =
          "123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341212341234121234123412123412341";
        const newUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: tooLongPassword,
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The password must not exceed 128 characters",
              param: "password",
              value: tooLongPassword,
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing wrong email, role or status", () => {
      it("should return an invalid input value error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUserWrongInputValues = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail",
          password: "12341234",
          role: "coordinador",
          status: "activo",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUserWrongInputValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing an existing user's email", () => {
      it("should return a duplicate user error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();
        const newUser: NewUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator",
          status: "active",
        };
        await insertUser(newUser);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${otherValidMockId}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please try a different email address",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /users/:id - Passing a user but not updating it", () => {
      it("should not update a user", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const newUser = {
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator",
          status: "active",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({
          msg: "User not updated",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /users/:id - Passing a user correctly to update", () => {
      it("should update a user", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const newUser = {
          _id: validMockUserId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockUserId}`)
          .send(newUser);

        // assertions
        expect(body).toStrictEqual({ msg: "User updated", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("USERS - DELETE", () => {
    describe("DELETE - /users/:id - passing a school with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockUserId}`)
          .send({ school_i: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "Please add a school id",
              param: "school_id",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /users/:id - passing a school with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockUserId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockUserId}`)
          .send({ school_id: "" });

        // assertions
        expect(body).toStrictEqual({
          msg: [
            {
              location: "body",
              msg: "The school id field is empty",
              param: "school_id",
              value: "",
            },
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /users/:id - Passing an invalid user and school ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /users/:id - Passing a user id but not deleting it", () => {
      it("should not delete a user", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "User not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /users/:id - Passing a user id correctly to delete", () => {
      it("should delete a user", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const newUser = {
          _id: validMockUserId,
          school_id: validMockSchoolId,
          firstName: "Jerome",
          lastName: "Vargas",
          email: "jerome@gmail.com",
          password: "12341234",
          role: "teacher" as UserRole,
          status: "active" as UserStatus,
        };
        const user = await insertUser(newUser);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockUserId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "User deleted", success: true });
        expect(statusCode).toBe(200);
      });
    });
  });
});
