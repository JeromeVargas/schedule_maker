import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as teacherFieldServices from "../teacher_fields.services";

import { BASE_URL } from "../../../lib/router";

import type { Teacher_Field } from "../../../typings/types";

type Service =
  | "insertTeacherField"
  | "findFilterAllTeacherFields"
  | "findTeacherFieldByProperty"
  | "findFilterTeacherFieldByProperty"
  | "modifyFilterTeacherField"
  | "removeFilterTeacherField"
  | "findPopulateTeacherById"
  | "findPopulateFieldById";

describe("RESOURCE => Teacher_field", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(teacherFieldServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = `${BASE_URL}teacher_fields/`;

  /* inputs */
  const validMockTeacherFieldId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockTeacherId = new Types.ObjectId().toString();
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

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumStudents: 40,
  };
  const userPayload = {
    school_id: validMockSchoolId,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "jerome@gmail.com",
    password: "12341234",
    role: "coordinator",
    status: "active",
  };
  const teacherPayload = {
    _id: validMockTeacherId,
    school_id: schoolPayload,
    user_id: userPayload,
    coordinator_id: validMockCoordinatorId,
    contractType: "full-time",
    teachingHoursAssignable: 60,
    teachingHoursAssigned: 60,
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
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertTeacherField = mockService(
          teacherFieldNullPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldMissingValues.school_i,
            teacher_id: newTeacherFieldMissingValues.teacher_i,
            field_id: newTeacherFieldMissingValues.field_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldMissingValues.teacher_i,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(
          newTeacherFieldMissingValues
        );
      });
    });
    describe("teacher_field::post::02 - Passing a teacher with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertTeacherField = mockService(
          teacherFieldNullPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldEmptyValues.school_id,
            teacher_id: newTeacherFieldEmptyValues.teacher_id,
            field_id: newTeacherFieldEmptyValues.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldEmptyValues.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(
          newTeacherFieldEmptyValues
        );
      });
    });
    describe("teacher_field::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertTeacherField = mockService(
          teacherFieldNullPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldNotValidDataTypes.school_id,
            teacher_id: newTeacherFieldNotValidDataTypes.teacher_id,
            field_id: newTeacherFieldNotValidDataTypes.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldNotValidDataTypes.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(
          newTeacherFieldNotValidDataTypes
        );
      });
    });
    describe("teacher_field::post::04 - teacher has the field already assigned", () => {
      it("should return an already assigned field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::05 - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::06 - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          {
            ...teacherPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::07 - Passing a teacher with a non active user role", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          {
            ...teacherPayload,
            user_id: {
              school_id: validMockSchoolId,
              firstName: "Jerome",
              lastName: "Vargas",
              email: "jerome@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "inactive",
            },
          },
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "The teacher is inactive",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::08 - Passing a non-existent field in the body", () => {
      it("should return a non-existent field error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::09 - Passing a field that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          {
            ...fieldPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateFieldById"
        );
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).not.toHaveBeenCalled();
        expect(insertTeacherField).not.toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::10 - Passing a teacher_field but not being created", () => {
      it("should not create a teacher_field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldNullPayload,
          "insertTeacherField"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newTeacherField);

        // assertions
        expect(body).toStrictEqual({
          msg: "Field has not been assigned the to teacher",
          success: false,
        });
        expect(statusCode).toBe(400);
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).toHaveBeenCalled();
        expect(insertTeacherField).toHaveBeenCalledWith(newTeacherField);
      });
    });
    describe("teacher_field::post::11 - Passing a teacher_field correctly to create", () => {
      it("should create a teacher_field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const insertTeacherField = mockService(
          teacherFieldPayload,
          "insertTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          newTeacherField.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertTeacherField).toHaveBeenCalled();
        expect(insertTeacherField).toHaveBeenCalledWith(newTeacherField);
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
            "findFilterAllTeacherFields"
          );

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
          expect(findTeacherFields).not.toHaveBeenCalled();
          expect(findTeacherFields).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get::02 - passing a field with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findTeacherFields = mockService(
            teacherFieldsNullPayload,
            "findFilterAllTeacherFields"
          );

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
          expect(findTeacherFields).not.toHaveBeenCalled();
          expect(findTeacherFields).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get::03 - passing and invalid school id", () => {
        it("should get all fields", async () => {
          // mock services
          const findTeacherFields = mockService(
            teacherFieldsNullPayload,
            "findFilterAllTeacherFields"
          );

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
          expect(findTeacherFields).not.toHaveBeenCalled();
          expect(findTeacherFields).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get::04 - Requesting all fields but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findTeacherFields = mockService(
            teacherFieldsNullPayload,
            "findFilterAllTeacherFields"
          );

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
          expect(findTeacherFields).toHaveBeenCalled();
          expect(findTeacherFields).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get::05 - Requesting all teacher_fields correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findTeacherFields = mockService(
            teacherFieldsPayload,
            "findFilterAllTeacherFields"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            payload: teacherFieldsPayload,
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findTeacherFields).toHaveBeenCalled();
          expect(findTeacherFields).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("teacher_field - GET/:id", () => {
      describe("teacher_field::get/:id::01 - Passing fields with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const duplicateTeacherField = mockService(
            teacherFieldNullPayload,
            "findTeacherFieldByProperty"
          );

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
          expect(duplicateTeacherField).not.toHaveBeenCalled();
          expect(duplicateTeacherField).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findTeacherFieldByProperty"
          );

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
          expect(findTeacherField).not.toHaveBeenCalled();
          expect(findTeacherField).not.toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get/:id::03 - Passing an invalid teacher_field and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findTeacherFieldByProperty"
          );

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
          expect(findTeacherField).not.toHaveBeenCalled();
          expect(findTeacherField).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get/:id::04 - Requesting a field but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldNullPayload,
            "findTeacherFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Teacher_Field not found",
            success: false,
          });
          expect(statusCode).toBe(404);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
            },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("teacher_field::get/:id::05 - Requesting a field correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findTeacherField = mockService(
            teacherFieldPayload,
            "findTeacherFieldByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockTeacherFieldId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            payload: teacherFieldPayload,
            success: true,
          });
          expect(statusCode).toBe(200);
          expect(findTeacherField).toHaveBeenCalled();
          expect(findTeacherField).toHaveBeenCalledWith(
            { _id: validMockTeacherFieldId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /teacher_field ", () => {
    describe("teacher_field::put::01 - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        /* mock services */
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateTeacherField = mockService(
          teacherFieldNullPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldMissingValues.school_i,
            teacher_id: newTeacherFieldMissingValues.teacher_i,
            field_id: newTeacherFieldMissingValues.field_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldMissingValues.teacher_i,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherFieldMissingValues.teacher_i,
            school_id: newTeacherFieldMissingValues.school_i,
          },
          newTeacherFieldMissingValues
        );
      });
    });
    describe("field::put::02 - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        /* mock services */
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateTeacherField = mockService(
          teacherFieldNullPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldEmptyValues.school_id,
            teacher_id: newTeacherFieldEmptyValues.teacher_id,
            field_id: newTeacherFieldEmptyValues.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldEmptyValues.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherFieldEmptyValues.teacher_id,
            school_id: newTeacherFieldEmptyValues.school_id,
          },
          newTeacherFieldEmptyValues
        );
      });
    });
    describe("teacher_field::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateTeacherField = mockService(
          teacherFieldNullPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).not.toHaveBeenCalled();
        expect(duplicateTeacherField).not.toHaveBeenCalledWith(
          {
            school_id: newTeacherFieldNotValidDataTypes.school_id,
            teacher_id: newTeacherFieldNotValidDataTypes.teacher_id,
            field_id: newTeacherFieldNotValidDataTypes.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherFieldNotValidDataTypes.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          newTeacherFieldNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherFieldNotValidDataTypes.teacher_id,
            school_id: newTeacherFieldNotValidDataTypes.school_id,
          },
          newTeacherFieldNotValidDataTypes
        );
      });
    });
    describe("teacher_field::put::04 - Passing a field but not updating it because the field has already been assigned to the teacher", () => {
      it("should not update a teacher_field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldPayload,
          "findTeacherFieldByProperty"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const updateTeacherField = mockService(
          teacherFieldNullPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findTeacher).not.toHaveBeenCalled();
        expect(findTeacher).not.toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::05 - Passing a non-existent teacher in the body", () => {
      it("should return a non-existent teacher error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherNullPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::06 - Passing a teacher that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          {
            ...teacherPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::07 - Passing a teacher with a non active user role", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          {
            ...teacherPayload,
            user_id: {
              school_id: validMockSchoolId,
              firstName: "Jerome",
              lastName: "Vargas",
              email: "jerome@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "inactive",
            },
          },
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).not.toHaveBeenCalled();
        expect(findField).not.toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::08 - Passing a non-existent field ", () => {
      it("should return a not non-existent field error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          fieldNullPayload,
          "findPopulateFieldById"
        );
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::09 - Passing a not matching school id in the body", () => {
      it("should return a not matching school id error", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(
          {
            ...fieldPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateFieldById"
        );
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).not.toHaveBeenCalled();
        expect(updateTeacherField).not.toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::10 - Passing a field but not updating it because it does not match one of the filters: _id, school_id or teacher_id", () => {
      it("should not update a teacher_field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateTeacherField = mockService(
          teacherFieldNullPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).toHaveBeenCalled();
        expect(updateTeacherField).toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
        );
      });
    });
    describe("teacher_field::put::11 - Passing a field correctly to update", () => {
      it("should update a field", async () => {
        // mock services
        const duplicateTeacherField = mockService(
          teacherFieldNullPayload,
          "findTeacherFieldByProperty"
        );
        const findTeacher = mockService(
          teacherPayload,
          "findPopulateTeacherById"
        );
        const findField = mockService(fieldPayload, "findPopulateFieldById");
        const updateTeacherField = mockService(
          teacherFieldPayload,
          "modifyFilterTeacherField"
        );

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
        expect(duplicateTeacherField).toHaveBeenCalled();
        expect(duplicateTeacherField).toHaveBeenCalledWith(
          {
            school_id: newTeacherField.school_id,
            teacher_id: newTeacherField.teacher_id,
            field_id: newTeacherField.field_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findTeacher).toHaveBeenCalled();
        expect(findTeacher).toHaveBeenCalledWith(
          newTeacherField.teacher_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findField).toHaveBeenCalled();
        expect(findField).toHaveBeenCalledWith(
          validMockFieldId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateTeacherField).toHaveBeenCalled();
        expect(updateTeacherField).toHaveBeenCalledWith(
          {
            _id: validMockTeacherFieldId,
            teacher_id: newTeacherField.teacher_id,
            school_id: newTeacherField.school_id,
          },
          newTeacherField
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
          "removeFilterTeacherField"
        );

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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherFieldId,
          school_id: null,
        });
      });
    });
    describe("teacher_field::delete::02 - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherFieldNullPayload,
          "removeFilterTeacherField"
        );

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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockTeacherFieldId,
          school_id: "",
        });
      });
    });
    describe("teacher_field::delete::03 - Passing an invalid teacher_field and school ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherFieldNullPayload,
          "removeFilterTeacherField"
        );

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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("teacher_field::delete::04 - Passing a teacher_field id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherFieldNullPayload,
          "removeFilterTeacherField"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher_Field not deleted",
          success: false,
        });
        expect(statusCode).toBe(404);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("teacher_field::delete::05 - Passing a teacher_field id correctly to delete", () => {
      it("should delete a teacher_field", async () => {
        // mock services
        const deleteTeacher = mockService(
          teacherFieldPayload,
          "removeFilterTeacherField"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockTeacherFieldId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({
          msg: "Teacher_Field deleted",
          success: true,
        });
        expect(statusCode).toBe(200);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: validMockTeacherFieldId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
