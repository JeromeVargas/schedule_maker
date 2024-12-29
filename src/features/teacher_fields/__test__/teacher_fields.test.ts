import mongoose, { Types } from "mongoose";
import supertest from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";

import { server, connection } from "../../../server";
import { BASE_URL } from "../../../lib/router";
import {
  insertField,
  insertManyTeacherFields,
  insertSchool,
  insertTeacher,
  insertTeacherField,
  insertUser,
  removeAllFields,
  removeAllSchools,
  removeAllTeacherFields,
  removeAllTeachers,
  removeAllUsers,
} from "../teacher_fields.services";

import {
  ContractType,
  UserRole,
  SchoolStatus,
  UserStatus,
} from "../../../typings/types";

describe("RESOURCE => TEACHER_FIELD", () => {
  /* hooks */
  afterEach(async () => {
    await removeAllTeacherFields();
    await removeAllSchools();
    await removeAllTeachers();
    await removeAllUsers();
    await removeAllFields();
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
  const endPointUrl = `${BASE_URL}teacher_fields/`;

  // test blocks
  describe("TEACHER_FIELDS - POST", () => {
    describe("POST - /teacher_fields - Passing a teacher with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherFieldMissingValues = {
          school_i: validMockSchoolId,
          teacher_i: validMockTeacherId,
          field_i: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherFieldMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - Passing a teacher with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const newTeacherFieldEmptyValues = {
          school_id: "",
          teacher_id: "",
          field_id: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherFieldEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newTeacherFieldNotValidDataTypes = {
          school_id: invalidMockId,
          teacher_id: invalidMockId,
          field_id: invalidMockId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherFieldNotValidDataTypes);

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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - teacher has the field already assigned", () => {
      it("should return an already assigned field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "This teacher has already been assigned this field",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("POST - /teacher_fields - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /teacher_fields - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: otherValidMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - Passing a teacher with a non active user role", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "The teacher status is inactive",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - Passing a non-existent field in the body", () => {
      it("should return a non-existent field error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("POST - /teacher_fields - Passing a field that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newField = {
          _id: validMockFieldId,
          school_id: otherValidMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("POST - /teacher_fields - Passing a teacher_field correctly to create", () => {
      it("should create a teacher_field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Field has been successfully assigned the to teacher",
          success: true,
        });
        expect(statusCode).toBe(201);
      });
    });
  });

  describe("TEACHER_FIELDS - GET", () => {
    describe("GET - /teacher_fields - passing a school id with missing values", () => {
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
    describe("GET - /teacher_fields - passing a field with empty values", () => {
      it("should return an empty values error", async () => {
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
    describe("GET - /teacher_fields - passing and invalid school id", () => {
      it("should get all fields", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
    describe("GET - /teacher_fields - Requesting all fields but not finding any", () => {
      it("should not get any fields", async () => {
        // inputs
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: otherValidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: "No fields assigned to any teachers yet",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /teacher_fields - Requesting all teacher_fields correctly", () => {
      it("should get all fields", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const newTeacherFields = [
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
          },
          {
            _id: new Types.ObjectId().toString(),
            school_id: validMockSchoolId,
            teacher_id: new Types.ObjectId().toString(),
            field_id: new Types.ObjectId().toString(),
          },
        ];
        await insertManyTeacherFields(newTeacherFields);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newTeacherFields,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
    describe("GET - /teacher_fields/:id - Passing fields with missing values", () => {
      it("should return a missing values error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherFieldId}`)
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
    describe("GET - /teacher_fields/:id - Passing fields with empty values", () => {
      it("should return an empty values error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherFieldId}`)
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
    describe("GET - /teacher_fields/:id - Passing an invalid teacher_field and school ids", () => {
      it("should return an invalid id error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("GET - /teacher_fields/:id - Requesting a field but not finding it", () => {
      it("should not get a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "TeacherField not found",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("GET - /teacher_fields/:id - Requesting a field correctly", () => {
      it("should get a field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);

        // api call
        const { statusCode, body } = await supertest(server)
          .get(`${endPointUrl}${validMockTeacherFieldId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          payload: newTeacherField,
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("TEACHER_FIELDS - PUT", () => {
    describe("PUT - /teacher_fields/:id - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherFieldMissingValues = {
          school_i: validMockSchoolId,
          teacher_i: validMockTeacherId,
          field_i: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherFieldMissingValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const newTeacherFieldEmptyValues = {
          school_id: "",
          teacher_id: "",
          field_id: "",
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherFieldEmptyValues);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // inputs
        const invalidMockId = "63c5dcac78b868f80035asdf";
        const newTeacherFieldNotValidDataTypes = {
          school_id: invalidMockId,
          teacher_id: invalidMockId,
          field_id: invalidMockId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newTeacherFieldNotValidDataTypes);

        // assertions
        expect(body).toStrictEqual({
          msg: [
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a field but not updating it because the field has already been assigned to the teacher", () => {
      it("should not update a teacher_field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "This teacher has already been assigned this field",
          success: false,
        });
        expect(statusCode).toBe(409);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: otherValidMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the teacher belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a teacher with a non active user role", () => {
      it("should return a non-existent school error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "inactive" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "The teacher is inactive",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a non-existent field ", () => {
      it("should return a not non-existent field error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a not matching school id in the body", () => {
      it("should return a not matching school id error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newField = {
          _id: validMockFieldId,
          school_id: otherValidMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a field but not updating it because it does not match one of the filters: _id, school_id or teacher_id", () => {
      it("should not update a teacher_field", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "The teacher has not been assigned the updated field",
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("PUT - /teacher_fields/:id - Passing a field correctly to update", () => {
      it("should update a field", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockUserId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const otherValidMockFieldId = new Types.ObjectId().toString();
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
          password: "z13sd1fs3df",
          role: "coordinator" as UserRole,
          status: "active" as UserStatus,
        };
        await insertUser(newUser);
        const newTeacher = {
          _id: validMockTeacherId,
          school_id: validMockSchoolId,
          user_id: validMockUserId,
          contractType: "full-time" as ContractType,
          teachingHoursAssignable: 35,
          teachingHoursAssigned: 35,
          adminHoursAssignable: 35,
          adminHoursAssigned: 35,
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true,
        };
        await insertTeacher(newTeacher);
        const newField = {
          _id: validMockFieldId,
          school_id: validMockSchoolId,
          name: "Mathematics",
        };
        await insertField(newField);
        const teacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: otherValidMockFieldId,
        };
        await insertTeacherField(teacherField);
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockTeacherFieldId}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "The teacher has been successfully assigned the updated field",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });

  describe("TEACHER_FIELDS - DELETE", () => {
    describe("DELETE - /teacher_fields/:id - Passing fields with missing fields", () => {
      it("should return a missing fields error", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherFieldId}`)
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
    describe("DELETE - /teacher_fields/:id - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // inputs
        const validMockTeacherFieldId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherFieldId}`)
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
    describe("DELETE - /teacher_fields/:id - Passing an invalid teacher_field and school ids", () => {
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
          ],
          success: false,
        });
        expect(statusCode).toBe(400);
      });
    });
    describe("DELETE - /teacher_fields/:id - Passing a teacher_field id but not deleting it", () => {
      it("should not delete a school", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const otherValidMockId = new Types.ObjectId().toString();

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "TeacherField not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
      });
    });
    describe("DELETE - /teacher_fields/:id - Passing a teacher_field id correctly to delete", () => {
      it("should delete a teacher_field", async () => {
        // inputs
        const validMockSchoolId = new Types.ObjectId().toString();
        const validMockTeacherFieldId = new Types.ObjectId().toString();
        const validMockTeacherId = new Types.ObjectId().toString();
        const validMockFieldId = new Types.ObjectId().toString();
        const newTeacherField = {
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
          teacher_id: validMockTeacherId,
          field_id: validMockFieldId,
        };
        await insertTeacherField(newTeacherField);

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherFieldId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "TeacherField deleted",
          success: true,
        });
        expect(statusCode).toBe(200);
      });
    });
  });
});
