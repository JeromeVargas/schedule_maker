import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";
import * as MongoServices from "../../../services/mongoServices";

import { Subject } from "../../../typings/types";

describe("Resource => subject", () => {
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

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/subjects/";

  /* inputs */
  const validMockSubjectId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const validMockGroupId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockFieldId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newSubject = {
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    group_id: validMockGroupId,
    field_id: validMockFieldId,
    name: "Mathematics 101",
    classUnits: 30,
    frequency: 2,
  };
  const newSubjectMissingValues = {
    school_i: validMockSchoolId,
    coordinator_i: validMockCoordinatorId,
    group_i: validMockGroupId,
    field_i: validMockFieldId,
    nam: "Mathematics 101",
    classUnit: 30,
    frequenc: 2,
  };
  const newSubjectEmptyValues = {
    school_id: "",
    coordinator_id: "",
    group_id: "",
    field_id: "",
    name: "",
    classUnits: "",
    frequency: "",
  };
  const newSubjectNotValidDataTypes = {
    school_id: invalidMockId,
    coordinator_id: invalidMockId,
    group_id: invalidMockId,
    field_id: invalidMockId,
    name: 92334428,
    classUnits: "hello",
    frequency: "hello",
  };
  const newSubjectWrongLengthValues = {
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    group_id: validMockGroupId,
    field_id: validMockFieldId,
    name: "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
    classUnits: 1234567890,
    frequency: 1234567890,
  };

  /* payloads */
  const subjectPayload = {
    _id: validMockSubjectId,
    school_id: validMockSchoolId,
    coordinator_id: validMockCoordinatorId,
    group_id: validMockGroupId,
    field_id: validMockFieldId,
    name: "Mathematics 101",
    classUnits: 30,
    frequency: 2,
  };
  const subjectNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "school 001",
    groupMaxNumStudents: 40,
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
  const groupPayload = {
    _id: validMockGroupId,
    school_id: schoolPayload,
    level_id: validMockLevelId,
    coordinator_id: coordinatorPayload,
    name: "Group 001",
    numberStudents: 40,
  };
  const fieldPayload = {
    _id: validMockFieldId,
    school_id: schoolPayload,
    name: "Mathematics",
  };
  const fieldNullPayload = null;
  const groupNullPayload = null;
  const subjectsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Mathematics 101",
      classUnits: 30,
      frequency: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Language 101",
      classUnits: 30,
      frequency: 2,
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      field_id: new Types.ObjectId().toString(),
      name: "Physics 101",
      classUnits: 30,
      frequency: 2,
    },
  ];
  const subjectsNullPayload: Subject[] = [];

  // test blocks
  describe("POST /subject ", () => {
    describe("subject::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectMissingValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the coordinator id",
            param: "coordinator_id",
          },
          {
            location: "body",
            msg: "Please add the group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add the field id",
            param: "field_id",
          },
          {
            location: "body",
            msg: "Please add a subject name",
            param: "name",
          },
          {
            location: "body",
            msg: "Please add the number of class units",
            param: "classUnits",
          },
          {
            location: "body",
            msg: "Please add the subject class frequency",
            param: "frequency",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            school_id: newSubjectMissingValues.school_i,
            name: newSubjectMissingValues.nam,
          },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectMissingValues.group_i,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectMissingValues,
          "subject"
        );
      });
    });
    describe("subject::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectEmptyValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The field id field is empty",
            param: "field_id",
            value: "",
          },
          {
            location: "body",
            msg: "The subject name field is empty",
            param: "name",
            value: "",
          },
          {
            location: "body",
            msg: "The number of class units field is empty",
            param: "classUnits",
            value: "",
          },
          {
            location: "body",
            msg: "The subject class frequency field is empty",
            param: "frequency",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            school_id: newSubjectEmptyValues.school_id,
            name: newSubjectEmptyValues.name,
          },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectEmptyValues.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectEmptyValues,
          "subject"
        );
      });
    });
    describe("subject::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectNotValidDataTypes);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id is not valid",
            param: "school_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The field id is not valid",
            param: "field_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The subject name is not valid",
            param: "name",
            value: 92334428,
          },
          {
            location: "body",
            msg: "number of class units value is not valid",
            param: "classUnits",
            value: "hello",
          },
          {
            location: "body",
            msg: "subject class frequency value is not valid",
            param: "frequency",
            value: "hello",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            school_id: newSubjectNotValidDataTypes.school_id,
            name: newSubjectNotValidDataTypes.name,
          },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectNotValidDataTypes.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectNotValidDataTypes,
          "subject"
        );
      });
    });
    describe("subject::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubjectWrongLengthValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The subject name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
          {
            location: "body",
            msg: "The number of class units must not exceed 9 digits",
            param: "classUnits",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The subject class frequency must not exceed 9 digits",
            param: "frequency",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          {
            school_id: invalidMockId,
            name: newSubjectWrongLengthValues.name,
          },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectWrongLengthValues.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectWrongLengthValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(
          newSubjectWrongLengthValues,
          "subject"
        );
      });
    });
    describe("subject::post::05 - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "This subject name already exists",
        });
        expect(statusCode).toBe(409);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: newSubject.school_id, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::06 - Passing an non-existent group in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: newSubject.school_id, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::07 - Passing an non-matching school id for the group in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          { ...groupPayload, school_id: otherValidMockId },
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::08 - Passing an non-matching coordinator id for the subject parent group in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the subject parent group",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::09 - Passing coordinator with a different role in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "teacher",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::10 - Passing coordinator with status different from active in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "inactive",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::11 - Passing an non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: newSubject.school_id, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::12 - Passing an non-matching school for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          { ...fieldPayload, school_id: otherValidMockId },
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).not.toHaveBeenCalled();
        expect(insertSubject).not.toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::13 - Passing a subject but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectNullPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject not created!",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: newSubject.school_id, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).toHaveBeenCalled();
        expect(insertSubject).toHaveBeenCalledWith(newSubject, "subject");
      });
    });
    describe("subject::post::14 - Passing a subject correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectNullPayload,
          "findResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const insertSubject = mockService(subjectPayload, "insertResource");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject created!",
        });
        expect(statusCode).toBe(201);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          { school_id: newSubject.school_id, name: newSubject.name },
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(insertSubject).toHaveBeenCalled();
        expect(insertSubject).toHaveBeenCalledWith(newSubject, "subject");
      });
    });
  });

  describe("GET /subject ", () => {
    describe("subject - GET", () => {
      describe("subject::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
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
          expect(findSubjects).not.toHaveBeenCalled();
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
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
          expect(findSubjects).not.toHaveBeenCalled();
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
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
          expect(findSubjects).not.toHaveBeenCalled();
          expect(findSubjects).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get::04 - Requesting all subjects but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsNullPayload,
            "findFilterAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({ msg: "No subjects found" });
          expect(statusCode).toBe(404);
          expect(findSubjects).toHaveBeenCalled();
          expect(findSubjects).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get::05 - Requesting all subjects correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findSubjects = mockService(
            subjectsPayload,
            "findFilterAllResources"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual(subjectsPayload);
          expect(statusCode).toBe(200);
          expect(findSubjects).toHaveBeenCalled();
          expect(findSubjects).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
    });

    describe("subject - GET/:id", () => {
      describe("subject::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
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
          expect(findSubject).not.toHaveBeenCalled();
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: null },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
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
          expect(findSubject).not.toHaveBeenCalled();
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: "" },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });
          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The subject id is not valid",
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
          expect(findSubject).not.toHaveBeenCalled();
          expect(findSubject).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get/:id::04 - Requesting a subject but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findSubject = mockService(
            subjectNullPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({
            msg: "Subject not found",
          });
          expect(statusCode).toBe(404);
          expect(findSubject).toHaveBeenCalled();
          expect(findSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: otherValidMockId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
      describe("subject::get/:id::05 - Requesting a subject correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findSubject = mockService(
            subjectPayload,
            "findResourceByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockSubjectId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual(subjectPayload);
          expect(statusCode).toBe(200);
          expect(findSubject).toHaveBeenCalled();
          expect(findSubject).toHaveBeenCalledWith(
            { _id: validMockSubjectId, school_id: validMockSchoolId },
            "-createdAt -updatedAt",
            "subject"
          );
        });
      });
    });
  });

  describe("PUT /subject ", () => {
    describe("subject::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectMissingValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add the school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add the coordinator id",
            param: "coordinator_id",
          },
          {
            location: "body",
            msg: "Please add the group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add the field id",
            param: "field_id",
          },
          {
            location: "body",
            msg: "Please add a subject name",
            param: "name",
          },
          {
            location: "body",
            msg: "Please add the number of class units",
            param: "classUnits",
          },
          {
            location: "body",
            msg: "Please add the subject class frequency",
            param: "frequency",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          [
            { school_id: newSubjectMissingValues.school_i },
            { name: newSubjectMissingValues.nam },
          ],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectMissingValues.group_i,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectMissingValues.field_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [
            { _id: validMockSubjectId },
            { school_id: newSubjectMissingValues.school_i },
          ],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::02 - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectEmptyValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The school id field is empty",
            param: "school_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
            value: "",
          },
          {
            location: "body",
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The field id field is empty",
            param: "field_id",
            value: "",
          },
          {
            location: "body",
            msg: "The subject name field is empty",
            param: "name",
            value: "",
          },
          {
            location: "body",
            msg: "The number of class units field is empty",
            param: "classUnits",
            value: "",
          },
          {
            location: "body",
            msg: "The subject class frequency field is empty",
            param: "frequency",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          [
            { school_id: newSubjectEmptyValues.school_id },
            { name: newSubjectEmptyValues.name },
          ],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectEmptyValues.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectEmptyValues.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [
            { _id: validMockSubjectId },
            { school_id: newSubjectEmptyValues.school_id },
          ],
          newSubjectEmptyValues,
          "subject"
        );
      });
    });
    describe("subject::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newSubjectNotValidDataTypes);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The subject id is not valid",
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
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The field id is not valid",
            param: "field_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The subject name is not valid",
            param: "name",
            value: 92334428,
          },
          {
            location: "body",
            msg: "number of class units value is not valid",
            param: "classUnits",
            value: "hello",
          },
          {
            location: "body",
            msg: "subject class frequency value is not valid",
            param: "frequency",
            value: "hello",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          [
            { school_id: newSubjectNotValidDataTypes.school_id },
            { name: newSubjectNotValidDataTypes.name },
          ],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectNotValidDataTypes.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectNotValidDataTypes.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [
            { _id: invalidMockId },
            { school_id: newSubjectNotValidDataTypes.school_id },
          ],
          newSubjectNotValidDataTypes,
          "subject"
        );
      });
    });
    describe("subject::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubjectWrongLengthValues);

        // assertions;
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The subject name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
          {
            location: "body",
            msg: "The number of class units must not exceed 9 digits",
            param: "classUnits",
            value: 1234567890,
          },
          {
            location: "body",
            msg: "The subject class frequency must not exceed 9 digits",
            param: "frequency",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).not.toHaveBeenCalled();
        expect(duplicateSubjectName).not.toHaveBeenCalledWith(
          [
            { school_id: newSubjectWrongLengthValues.school_id },
            { name: newSubjectWrongLengthValues.name },
          ],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubjectWrongLengthValues.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubjectWrongLengthValues.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [
            { _id: validMockSubjectId },
            { school_id: newSubjectWrongLengthValues.group_id },
          ],
          newSubjectWrongLengthValues,
          "subject"
        );
      });
    });
    describe("subject::put::05 - Passing a duplicate subject name value", () => {
      it("should return a duplicate field error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "This subject name already exists",
        });
        expect(statusCode).toBe(409);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: newSubject.school_id }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(0);
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::06 - Passing an non-existent group in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupNullPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: newSubject.school_id }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::07 - Passing an non-matching school for the group in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          { ...fieldPayload, school_id: otherValidMockId },
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: validMockSchoolId }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::08 - Passing an non-matching coordinator id for the subject parent group in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the subject parent group",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: validMockSchoolId }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::09 - Passing coordinator with a different role in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "teacher",
              status: "active",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: validMockSchoolId }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::10 - Passing coordinator with status different from active in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          {
            ...groupPayload,
            coordinator_id: {
              _id: validMockCoordinatorId,
              school_id: validMockSchoolId,
              firstName: "Dave",
              lastName: "Gray",
              email: "dave@gmail.com",
              password: "12341234",
              role: "coordinator",
              status: "inactive",
              hasTeachingFunc: false,
            },
          },
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: validMockSchoolId }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(1);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).not.toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::11 - Passing an non-existent field in the body", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldNullPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: newSubject.school_id }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::12 - Passing an non-matching school for the field in the body", () => {
      it("should return a non-matching school error", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          { ...fieldPayload, school_id: otherValidMockId },
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Please make sure the field belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: validMockSchoolId }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).not.toHaveBeenCalled();
        expect(updateSubject).not.toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: otherValidMockId }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::13 - Passing a subject but not being created", () => {
      it("should not update a subject", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectNullPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject not updated",
        });
        expect(statusCode).toBe(404);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: newSubject.school_id }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).toHaveBeenCalled();
        expect(updateSubject).toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
          newSubject,
          "subject"
        );
      });
    });
    describe("subject::put::14 - Passing a subject correctly to update", () => {
      it("should update a subject", async () => {
        // mock services
        const duplicateSubjectName = mockService(
          subjectsNullPayload,
          "findFilterResourceByProperty"
        );
        const findGroupField = mockServiceMultipleReturns(
          groupPayload,
          fieldPayload,
          "findPopulateResourceById"
        );
        const updateSubject = mockService(
          subjectPayload,
          "updateFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockSubjectId}`)
          .send(newSubject);

        // assertions;
        expect(body).toStrictEqual({
          msg: "Subject updated!",
        });
        expect(statusCode).toBe(200);
        expect(duplicateSubjectName).toHaveBeenCalled();
        expect(duplicateSubjectName).toHaveBeenCalledWith(
          [{ school_id: newSubject.school_id }, { name: newSubject.name }],
          "-createdAt -updatedAt",
          "subject"
        );
        expect(findGroupField).toHaveBeenCalledTimes(2);
        expect(findGroupField).toHaveBeenNthCalledWith(
          1,
          newSubject.group_id,
          "-createdAt -updatedAt",
          "school_id coordinator_id",
          "-createdAt -updatedAt",
          "group"
        );
        expect(findGroupField).toHaveBeenNthCalledWith(
          2,
          newSubject.field_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt",
          "field"
        );
        expect(updateSubject).toHaveBeenCalled();
        expect(updateSubject).toHaveBeenCalledWith(
          [{ _id: validMockSubjectId }, { school_id: newSubject.school_id }],
          newSubject,
          "subject"
        );
      });
    });
  });

  describe("DELETE /subject ", () => {
    describe("subject::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
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
        expect(deleteSubject).not.toHaveBeenCalled();
        expect(deleteSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: null },
          "subject"
        );
      });
    });
    describe("subject::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
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
        expect(deleteSubject).not.toHaveBeenCalled();
        expect(deleteSubject).not.toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: "" },
          "subject"
        );
      });
    });
    describe("subject::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
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
            msg: "The subject id is not valid",
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
        expect(deleteSubject).not.toHaveBeenCalled();
        expect(deleteSubject).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: invalidMockId },
          "subject"
        );
      });
    });
    describe("subject::delete::04 - Passing a subject id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectNullPayload,
          "deleteFilterResource"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: otherValidMockId });
        // assertions
        expect(body).toStrictEqual({ msg: "Subject not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteSubject).toHaveBeenCalled();
        expect(deleteSubject).toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: otherValidMockId },
          "subject"
        );
      });
    });
    describe("subject::delete::05 - Passing a subject id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteSubject = mockService(
          subjectPayload,
          "deleteFilterResource"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockSubjectId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Subject deleted" });
        expect(statusCode).toBe(200);
        expect(deleteSubject).toHaveBeenCalled();
        expect(deleteSubject).toHaveBeenCalledWith(
          { _id: validMockSubjectId, school_id: validMockSchoolId },
          "subject"
        );
      });
    });
  });
});
