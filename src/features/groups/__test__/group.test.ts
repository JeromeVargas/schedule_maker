import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as groupServices from "../group.services";

import { Group } from "../../../typings/types";

type Service =
  | "insertGroup"
  | "findFilterAllGroups"
  | "findFilterGroupByProperty"
  | "findGroupByProperty"
  | "modifyFilterGroup"
  | "removeFilterGroup"
  | "findPopulateLevelById"
  | "findPopulateUserById";

describe("Resource => Group", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest.spyOn(groupServices, service).mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/groups/";

  /* inputs */
  const validMockGroupId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
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
    numberStudents: 1234567890,
  };

  /* payloads */
  const groupPayload = {
    _id: validMockGroupId,
    school_id: validMockSchoolId,
    level_id: validMockLevelId,
    name: "Group 001",
    numberStudents: 40,
  };
  const groupNullPayload = null;
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumStudents: 40,
  };
  const levelPayload = {
    _id: validMockLevelId,
    school_id: schoolPayload,
    schedule_id: validMockLevelId,
    name: "Level 001",
  };
  const levelNullPayload = null;
  const coordinatorPayload = {
    _id: validMockCoordinatorId,
    school_id: schoolPayload,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "jerome@gmail.com",
    role: "coordinator",
    status: "active",
  };
  const coordinatorNullPayload = null;
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
  const groupsNullPayload: Group[] = [];

  // test blocks
  describe("POST /group ", () => {
    describe("group::post::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupNullPayload, "insertGroup");

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
            msg: "Please add a group name",
            param: "name",
          },
          {
            location: "body",
            msg: "Please add the group number of students",
            param: "numberStudents",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          {
            school_id: newGroupMissingValues.school_i,
            name: newGroupMissingValues.nam,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupMissingValues.level_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroupMissingValues);
      });
    });
    describe("group::post::02 - Passing fields with empty values", () => {
      it("should return an empty fields error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupNullPayload, "insertGroup");

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
            msg: "The group name field is empty",
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
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          {
            school_id: newGroupEmptyValues.school_id,
            name: newGroupEmptyValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupEmptyValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroupEmptyValues);
      });
    });
    describe("group::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupNullPayload, "insertGroup");

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
            msg: "The group name is not valid",
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
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          { school_id: invalidMockId, name: newGroupNotValidDataTypes.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          invalidMockId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroupNotValidDataTypes);
      });
    });
    describe("group::post::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupNullPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The group name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
          {
            location: "body",
            msg: "The start time must not exceed 9 digits",
            param: "numberStudents",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          {
            school_id: newGroupWrongLengthValues.school_id,
            name: newGroupWrongLengthValues.name,
          },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupWrongLengthValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroupWrongLengthValues);
      });
    });
    describe("group::post::05 - Passing a duplicate group name", () => {
      it("should return a duplicate group name", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const insertGroup = mockService(groupPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group name already exists",
        });
        expect(statusCode).toBe(409);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroup);
      });
    });
    describe("group::post::06 - Passing a non-existent level", () => {
      it("should return a non-existent level error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroup);
      });
    });
    describe("group::post::07 - Passing a non matching school id for the level", () => {
      it("should return a non matching school id error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(
          {
            ...levelPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateLevelById"
        );
        const insertGroup = mockService(groupPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroup);
      });
    });
    describe("group::post::08 - Passing a number of students larger than the max allowed number of students", () => {
      it("should return a larger than the max allowed number of students error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const insertGroup = mockService(groupPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send({ ...newGroup, numberStudents: 41 });

        // assertions
        expect(body).toStrictEqual({
          msg: `Please take into account that the number of students for any group cannot exceed ${levelPayload.school_id.groupMaxNumStudents} students`,
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).not.toHaveBeenCalled();
        expect(insertGroup).not.toHaveBeenCalledWith(newGroup);
      });
    });
    describe("group::post::09 - Passing a group but not being created", () => {
      it("should not create a field", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const insertGroup = mockService(groupNullPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({ msg: "Group not created!" });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).toHaveBeenCalled();
        expect(insertGroup).toHaveBeenCalledWith(newGroup);
      });
    });
    describe("group::post::10 - Passing a group correctly to create", () => {
      it("should create a field", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupNullPayload,
          "findGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const insertGroup = mockService(groupPayload, "insertGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({ msg: "Group created!" });
        expect(statusCode).toBe(200);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroup).toHaveBeenCalled();
        expect(insertGroup).toHaveBeenCalledWith(newGroup);
      });
    });
  });

  describe("GET /group ", () => {
    describe("group - GET", () => {
      describe("group::get::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findGroups = mockService(
            groupsNullPayload,
            "findFilterAllGroups"
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
          expect(findGroups).not.toHaveBeenCalled();
          expect(findGroups).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get::02 - passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findGroups = mockService(
            groupsNullPayload,
            "findFilterAllGroups"
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
          expect(findGroups).not.toHaveBeenCalled();
          expect(findGroups).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get::03 - passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findGroups = mockService(
            groupsNullPayload,
            "findFilterAllGroups"
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
          expect(findGroups).not.toHaveBeenCalled();
          expect(findGroups).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get::04 - Requesting all groups but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findGroups = mockService(
            groupsNullPayload,
            "findFilterAllGroups"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });

          // assertions
          expect(body).toStrictEqual({ msg: "No groups found" });
          expect(statusCode).toBe(404);
          expect(findGroups).toHaveBeenCalled();
          expect(findGroups).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get::05 - Requesting all groups correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findGroups = mockService(groupsPayload, "findFilterAllGroups");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual(groupsPayload);
          expect(statusCode).toBe(200);
          expect(findGroups).toHaveBeenCalled();
          expect(findGroups).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("group - GET/:id", () => {
      describe("group::get/:id::01 - Passing missing fields", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findGroup = mockService(
            groupNullPayload,
            "findGroupByProperty"
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
          expect(findGroup).not.toHaveBeenCalled();
          expect(findGroup).not.toHaveBeenCalledWith(
            { school_id: null, _id: validMockGroupId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findGroup = mockService(
            groupNullPayload,
            "findGroupByProperty"
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
          expect(findGroup).not.toHaveBeenCalled();
          expect(findGroup).not.toHaveBeenCalledWith(
            { school_id: "", _id: validMockGroupId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get/:id::03 - Passing invalid ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findGroup = mockService(
            groupNullPayload,
            "findGroupByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
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
          expect(findGroup).not.toHaveBeenCalled();
          expect(findGroup).not.toHaveBeenCalledWith(
            { school_id: invalidMockId, _id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get/:id::04 - Requesting a group but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findGroup = mockService(
            groupNullPayload,
            "findGroupByProperty"
          );

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual({
            msg: "Group not found",
          });
          expect(statusCode).toBe(404);
          expect(findGroup).toHaveBeenCalled();
          expect(findGroup).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, _id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group::get/:id::05 - Requesting a group correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findGroup = mockService(groupPayload, "findGroupByProperty");

          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockGroupId}`)
            .send({ school_id: validMockSchoolId });

          // assertions
          expect(body).toStrictEqual(groupPayload);
          expect(statusCode).toBe(200);
          expect(findGroup).toHaveBeenCalled();
          expect(findGroup).toHaveBeenCalledWith(
            { school_id: validMockSchoolId, _id: validMockGroupId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /group ", () => {
    describe("group::put::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

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
            msg: "Please add a group name",
            param: "name",
          },
          {
            location: "body",
            msg: "Please add the group number of students",
            param: "numberStudents",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          { school_id: newGroupMissingValues.school_i },
          { name: newGroupMissingValues.nam },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupMissingValues.level_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId },
          { school_id: newGroupMissingValues.school_i },
          newGroupMissingValues
        );
      });
    });
    describe("group::put::02 - Passing fields with empty values", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

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
            msg: "The group name field is empty",
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
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          { school_id: newGroupEmptyValues.school_id },
          { name: newGroupEmptyValues.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupEmptyValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId },
          { school_id: newGroupEmptyValues.school_id },
          newGroupEmptyValues
        );
      });
    });
    describe("group::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${invalidMockId}`)
          .send(newGroupNotValidDataTypes);

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
          {
            location: "body",
            msg: "The level id is not valid",
            param: "level_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The group name is not valid",
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
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          { school_id: invalidMockId },
          { name: newGroupNotValidDataTypes.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          invalidMockId,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: invalidMockId, school_id: invalidMockId },
          newGroupNotValidDataTypes
        );
      });
    });
    describe("group::put::04 - Passing too long or short input values", () => {
      it("should return an invalid length input value error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroupWrongLengthValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "The group name must not exceed 100 characters",
            param: "name",
            value:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit Maiores laborum aspernatur similique sequi am",
          },
          {
            location: "body",
            msg: "The start time must not exceed 9 digits",
            param: "numberStudents",
            value: 1234567890,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).not.toHaveBeenCalled();
        expect(duplicateGroupName).not.toHaveBeenCalledWith(
          { school_id: newGroupWrongLengthValues.school_id },
          { name: newGroupWrongLengthValues.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroupWrongLengthValues.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId },
          { school_id: newGroupWrongLengthValues.school_id },
          newGroupWrongLengthValues
        );
      });
    });
    describe("group::put::05 - Passing a duplicate group name value", () => {
      it("should return a duplicate group name error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          [groupPayload],
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${otherValidMockId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group name already exists",
        });
        expect(statusCode).toBe(409);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).not.toHaveBeenCalled();
        expect(findLevel).not.toHaveBeenCalledWith(
          newGroup.school_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId, school_id: newGroup.school_id },
          newGroup
        );
      });
    });
    describe("group::put::06 - Passing a non-existent level", () => {
      it("should return a non-existent level error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          levelNullPayload,
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId, school_id: newGroup.school_id },
          newGroup
        );
      });
    });
    describe("group::put::07 - Passing a non-matching school id for the level", () => {
      it("should return a non-matching school id error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(
          {
            ...levelPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateLevelById"
        );
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the level belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: validMockSchoolId, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId, school_id: newGroup.school_id },
          newGroup
        );
      });
    });
    describe("group::put::08 - Passing a number students larger than the max allowed number of students", () => {
      it("should return a larger than the max allowed number of students error", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send({ ...newGroup, numberStudents: 41 });

        // assertions
        expect(body).toStrictEqual({
          msg: `Please take into account that the number of students cannot exceed ${levelPayload.school_id.groupMaxNumStudents} students`,
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).not.toHaveBeenCalled();
        expect(updateGroup).not.toHaveBeenCalledWith(
          { _id: validMockGroupId, school_id: newGroup.school_id },
          newGroup
        );
      });
    });
    describe("group::put::09 - Passing a group but not updating it because it does not match the filters", () => {
      it("should not update a group", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const updateGroup = mockService(groupNullPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Group not updated",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).toHaveBeenCalled();
        expect(updateGroup).toHaveBeenCalledWith(
          {
            _id: validMockGroupId,
            school_id: newGroup.school_id,
            level_id: newGroup.level_id,
          },
          newGroup
        );
      });
    });
    describe("group::put::10 - Passing a group correctly to update", () => {
      it("should update a group", async () => {
        // mock services
        const duplicateGroupName = mockService(
          groupsNullPayload,
          "findFilterGroupByProperty"
        );
        const findLevel = mockService(levelPayload, "findPopulateLevelById");
        const updateGroup = mockService(groupPayload, "modifyFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupId}`)
          .send(newGroup);

        // assertions
        expect(body).toStrictEqual({
          msg: "Group updated!",
        });
        expect(statusCode).toBe(200);
        expect(duplicateGroupName).toHaveBeenCalled();
        expect(duplicateGroupName).toHaveBeenCalledWith(
          { school_id: newGroup.school_id, name: newGroup.name },
          "-createdAt -updatedAt"
        );
        expect(findLevel).toHaveBeenCalled();
        expect(findLevel).toHaveBeenCalledWith(
          newGroup.level_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroup).toHaveBeenCalled();
        expect(updateGroup).toHaveBeenCalledWith(
          {
            _id: validMockGroupId,
            school_id: newGroup.school_id,
            level_id: newGroup.level_id,
          },
          newGroup
        );
      });
    });
  });

  describe("DELETE /group ", () => {
    describe("group::delete::01 - Passing missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteGroup = mockService(groupNullPayload, "removeFilterGroup");

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
        expect(deleteGroup).not.toHaveBeenCalled();
        expect(deleteGroup).not.toHaveBeenCalledWith({
          school_id: null,
          _id: validMockGroupId,
        });
      });
    });
    describe("group::delete::02 - Passing fields with empty values", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteGroup = mockService(groupNullPayload, "removeFilterGroup");

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
        expect(deleteGroup).not.toHaveBeenCalled();
        expect(deleteGroup).not.toHaveBeenCalledWith({
          school_id: "",
          _id: validMockGroupId,
        });
      });
    });
    describe("group::delete::03 - Passing invalid ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteGroup = mockService(groupNullPayload, "removeFilterGroup");

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
        expect(deleteGroup).not.toHaveBeenCalled();
        expect(deleteGroup).not.toHaveBeenCalledWith({
          school_id: invalidMockId,
          _id: invalidMockId,
        });
      });
    });
    describe("group::delete::04 - Passing a group id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteGroup = mockService(groupNullPayload, "removeFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Group not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteGroup).toHaveBeenCalled();
        expect(deleteGroup).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: otherValidMockId,
        });
      });
    });
    describe("group::delete::05 - Passing a group id correctly to delete", () => {
      it("should delete a field", async () => {
        // mock services
        const deleteGroup = mockService(groupPayload, "removeFilterGroup");

        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupId}`)
          .send({ school_id: validMockSchoolId });

        // assertions
        expect(body).toStrictEqual({ msg: "Group deleted" });
        expect(statusCode).toBe(200);
        expect(deleteGroup).toHaveBeenCalled();
        expect(deleteGroup).toHaveBeenCalledWith({
          school_id: validMockSchoolId,
          _id: validMockGroupId,
        });
      });
    });
  });
});
