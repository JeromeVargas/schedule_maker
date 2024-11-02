import supertest from "supertest";
import { Types } from "mongoose";

import { server, connection } from "../../../server";

import * as groupCoordinatorServices from "../groupCoordinatorServices";

import { Group_Coordinator } from "../../../typings/types";

type Service =
  | "insertGroupCoordinator"
  | "findFilterAllGroupCoordinators"
  | "findGroupCoordinatorByProperty"
  | "findFilterGroupCoordinatorByProperty"
  | "modifyFilterGroupCoordinator"
  | "removeFilterGroupCoordinator"
  | "findPopulateGroupById"
  | "findPopulateCoordinatorById";

describe("RESOURCE => Group_coordinator", () => {
  /* mock services */
  // just one return
  const mockService = (payload: any, service: Service) => {
    return jest
      .spyOn(groupCoordinatorServices, service)
      .mockReturnValue(payload);
  };

  /* hooks */
  afterAll(() => {
    connection.close();
  });

  /* end point url */
  const endPointUrl = "/api/v1/group_coordinators/";

  /* inputs */
  const validMockGroupCoordinatorId = new Types.ObjectId().toString();
  const validMockSchoolId = new Types.ObjectId().toString();
  const validMockGroupId = new Types.ObjectId().toString();
  const validMockLevelId = new Types.ObjectId().toString();
  const validMockCoordinatorId = new Types.ObjectId().toString();
  const otherValidMockId = new Types.ObjectId().toString();
  const invalidMockId = "63c5dcac78b868f80035asdf";
  const newGroupCoordinator = {
    school_id: validMockSchoolId,
    group_id: validMockGroupId,
    coordinator_id: validMockCoordinatorId,
  };
  const newGroupCoordinatorMissingValues = {
    school_i: validMockSchoolId,
    group_i: validMockGroupId,
    coordinator_i: validMockCoordinatorId,
  };
  const newGroupCoordinatorEmptyValues = {
    school_id: "",
    group_id: "",
    coordinator_id: "",
  };
  const newGroupCoordinatorNotValidDataTypes = {
    school_id: invalidMockId,
    group_id: invalidMockId,
    coordinator_id: invalidMockId,
  };

  /* payloads */
  const schoolPayload = {
    _id: validMockSchoolId,
    name: "School 001",
    groupMaxNumStudents: 40,
  };
  const groupPayload = {
    _id: validMockGroupId,
    school_id: schoolPayload,
    level_id: validMockLevelId,
    name: "Group 101",
    numberStudents: 20,
  };
  const groupNullPayload = null;
  const coordinatorPayload = {
    _id: validMockCoordinatorId,
    school_id: schoolPayload,
    firstName: "Jerome",
    lastName: "Vargas",
    email: "JeromeVar@gmail.com",
    role: "coordinator",
    status: "active",
  };
  const coordinatorNullPayload = null;
  const groupCoordinatorPayload = {
    _id: validMockGroupCoordinatorId,
    school_id: validMockSchoolId,
    group_id: validMockGroupId,
    coordinator_id: validMockCoordinatorId,
  };
  const groupCoordinatorNullPayload = null;
  const groupCoordinatorsPayload = [
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
    {
      _id: new Types.ObjectId().toString(),
      school_id: new Types.ObjectId().toString(),
      group_id: new Types.ObjectId().toString(),
      coordinator_id: new Types.ObjectId().toString(),
    },
  ];
  const groupCoordinatorsNullPayload: Group_Coordinator[] = [];

  // test blocks
  describe("POST /group_coordinator ", () => {
    describe("group_coordinator::post::01 - Passing a group_coordinator with missing fields", () => {
      it("should return a field needed error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorMissingValues);

        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add a school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add a group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add a coordinator id",
            param: "coordinator_id",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorMissingValues.school_i,
            group_id: newGroupCoordinatorMissingValues.group_i,
            coordinator_id: newGroupCoordinatorMissingValues.coordinator_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorMissingValues.group_i,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorMissingValues.coordinator_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorMissingValues
        );
      });
    });
    describe("group_coordinator::post::02 - Passing a group_coordinator with empty fields", () => {
      it("should return an empty field error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorEmptyValues);

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
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorEmptyValues.school_id,
            group_id: newGroupCoordinatorEmptyValues.group_id,
            coordinator_id: newGroupCoordinatorEmptyValues.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorEmptyValues.group_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorEmptyValues.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorEmptyValues
        );
      });
    });
    describe("group_coordinator::post::03 - Passing an invalid type as a value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinatorNotValidDataTypes);

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
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
            value: invalidMockId,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorNotValidDataTypes.school_id,
            group_id: newGroupCoordinatorNotValidDataTypes.group_id,
            coordinator_id: newGroupCoordinatorNotValidDataTypes.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorNotValidDataTypes.group_id,
          "-createdAt -updatedAt",
          "school_id user_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorNotValidDataTypes.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorNotValidDataTypes
        );
      });
    });
    describe("group_coordinator::post::04 - group has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group has already been assigned this coordinator",
        });
        expect(statusCode).toBe(409);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::05 - Passing a non-existent group in the body", () => {
      it("should return a non-existent group error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::06 - Passing a group that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          { ...groupPayload, school_id: otherValidMockId },
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::07 - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::08 - Passing a group that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            school_id: {
              _id: otherValidMockId,
              name: "School 001",
              groupMaxNumStudents: 40,
            },
          },
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::09 - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            role: "teacher",
          },
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::10 - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          {
            ...coordinatorPayload,
            status: "inactive",
          },
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).not.toHaveBeenCalled();
        expect(insertGroupCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::11 - Passing a group_coordinator but not being created", () => {
      it("should not create a group_coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Coordinator has not been assigned the to group",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).toHaveBeenCalled();
        expect(insertGroupCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::12 - Passing a group_coordinator correctly to create", () => {
      it("should create a group_coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const insertGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "insertGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .post(`${endPointUrl}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Coordinator has been successfully assigned the to group",
        });
        expect(statusCode).toBe(201);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(insertGroupCoordinator).toHaveBeenCalled();
        expect(insertGroupCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator
        );
      });
    });
  });

  describe("GET /group_coordinator ", () => {
    describe("group_coordinator - GET", () => {
      describe("group_coordinator::get::01 - passing a school id with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const findGroupCoordinators = mockService(
            groupCoordinatorsNullPayload,
            "findFilterAllGroupCoordinators"
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
          expect(findGroupCoordinators).not.toHaveBeenCalled();
          expect(findGroupCoordinators).not.toHaveBeenCalledWith(
            { school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get::02 - passing a field with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findGroupCoordinators = mockService(
            groupCoordinatorsNullPayload,
            "findFilterAllGroupCoordinators"
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
          expect(findGroupCoordinators).not.toHaveBeenCalled();
          expect(findGroupCoordinators).not.toHaveBeenCalledWith(
            { school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get::03 - passing and invalid school id", () => {
        it("should get all fields", async () => {
          // mock services
          const findGroupCoordinators = mockService(
            groupCoordinatorsNullPayload,
            "findFilterAllGroupCoordinators"
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
          expect(findGroupCoordinators).not.toHaveBeenCalled();
          expect(findGroupCoordinators).not.toHaveBeenCalledWith(
            { school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get::04 - Requesting all fields but not finding any", () => {
        it("should not get any fields", async () => {
          // mock services
          const findGroupCoordinators = mockService(
            groupCoordinatorsNullPayload,
            "findFilterAllGroupCoordinators"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: otherValidMockId });
          // assertions
          expect(body).toStrictEqual({
            msg: "No coordinators assigned to any groups yet",
          });
          expect(statusCode).toBe(404);
          expect(findGroupCoordinators).toHaveBeenCalled();
          expect(findGroupCoordinators).toHaveBeenCalledWith(
            { school_id: otherValidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get::05 - Requesting all group_coordinators correctly", () => {
        it("should get all fields", async () => {
          // mock services
          const findGroupCoordinators = mockService(
            groupCoordinatorsPayload,
            "findFilterAllGroupCoordinators"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual([
            {
              _id: expect.any(String),
              coordinator_id: expect.any(String),
              school_id: expect.any(String),
              group_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              coordinator_id: expect.any(String),
              school_id: expect.any(String),
              group_id: expect.any(String),
            },
            {
              _id: expect.any(String),
              coordinator_id: expect.any(String),
              school_id: expect.any(String),
              group_id: expect.any(String),
            },
          ]);
          expect(statusCode).toBe(200);
          expect(findGroupCoordinators).toHaveBeenCalled();
          expect(findGroupCoordinators).toHaveBeenCalledWith(
            { school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
    describe("group_coordinator - GET/:id", () => {
      describe("group_coordinator::get/:id::01 - Passing fields with missing values", () => {
        it("should return a missing values error", async () => {
          // mock services
          const duplicateGroupCoordinator = mockService(
            groupCoordinatorNullPayload,
            "findGroupCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
          expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
          expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
            { _id: validMockGroupCoordinatorId, school_id: null },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get/:id::02 - Passing fields with empty values", () => {
        it("should return an empty values error", async () => {
          // mock services
          const findGroupCoordinator = mockService(
            groupCoordinatorNullPayload,
            "findGroupCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
          expect(findGroupCoordinator).not.toHaveBeenCalled();
          expect(findGroupCoordinator).not.toHaveBeenCalledWith(
            { _id: validMockGroupCoordinatorId, school_id: "" },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get/:id::03 - Passing an invalid group_coordinator and school ids", () => {
        it("should return an invalid id error", async () => {
          // mock services
          const findGroupCoordinator = mockService(
            groupCoordinatorNullPayload,
            "findGroupCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${invalidMockId}`)
            .send({ school_id: invalidMockId });
          // assertions
          expect(body).toStrictEqual([
            {
              location: "params",
              msg: "The group_coordinator id is not valid",
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
          expect(findGroupCoordinator).not.toHaveBeenCalled();
          expect(findGroupCoordinator).not.toHaveBeenCalledWith(
            { _id: invalidMockId, school_id: invalidMockId },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get/:id::04 - Requesting a field but not finding it", () => {
        it("should not get a school", async () => {
          // mock services
          const findGroupCoordinator = mockService(
            groupCoordinatorNullPayload,
            "findGroupCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${otherValidMockId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            msg: "Group_coordinator not found",
          });
          expect(statusCode).toBe(404);
          expect(findGroupCoordinator).toHaveBeenCalled();
          expect(findGroupCoordinator).toHaveBeenCalledWith(
            {
              _id: otherValidMockId,
              school_id: validMockSchoolId,
            },
            "-createdAt -updatedAt"
          );
        });
      });
      describe("group_coordinator::get/:id::05 - Requesting a field correctly", () => {
        it("should get a field", async () => {
          // mock services
          const findGroupCoordinator = mockService(
            groupCoordinatorPayload,
            "findGroupCoordinatorByProperty"
          );
          // api call
          const { statusCode, body } = await supertest(server)
            .get(`${endPointUrl}${validMockGroupCoordinatorId}`)
            .send({ school_id: validMockSchoolId });
          // assertions
          expect(body).toStrictEqual({
            _id: validMockGroupCoordinatorId,
            coordinator_id: validMockCoordinatorId,
            school_id: validMockSchoolId,
            group_id: validMockGroupId,
          });
          expect(statusCode).toBe(200);
          expect(findGroupCoordinator).toHaveBeenCalled();
          expect(findGroupCoordinator).toHaveBeenCalledWith(
            { _id: validMockGroupCoordinatorId, school_id: validMockSchoolId },
            "-createdAt -updatedAt"
          );
        });
      });
    });
  });

  describe("PUT /group_coordinator ", () => {
    describe("group_coordinator::put::01 - Passing fields with missing fields", () => {
      it("should return a field needed error", async () => {
        /* mock services */
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorMissingValues);
        // assertions
        expect(body).toStrictEqual([
          {
            location: "body",
            msg: "Please add a school id",
            param: "school_id",
          },
          {
            location: "body",
            msg: "Please add a group id",
            param: "group_id",
          },
          {
            location: "body",
            msg: "Please add a coordinator id",
            param: "coordinator_id",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorMissingValues.school_i,
            group_id: newGroupCoordinatorMissingValues.group_i,
            coordinator_id: newGroupCoordinatorMissingValues.coordinator_i,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorMissingValues.coordinator_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorMissingValues.group_i,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinatorMissingValues.group_i,
            school_id: newGroupCoordinatorMissingValues.school_i,
          },
          newGroupCoordinatorMissingValues
        );
      });
    });
    describe("field::put::02 - Passing fields with empty fields", () => {
      it("should return an empty field error", async () => {
        /* mock services */
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorEmptyValues);
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
            msg: "The group id field is empty",
            param: "group_id",
            value: "",
          },
          {
            location: "body",
            msg: "The coordinator id field is empty",
            param: "coordinator_id",
            value: "",
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorEmptyValues.school_id,
            group_id: newGroupCoordinatorEmptyValues.group_id,
            coordinator_id: newGroupCoordinatorEmptyValues.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorEmptyValues.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorEmptyValues.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinatorEmptyValues.group_id,
            school_id: newGroupCoordinatorEmptyValues.school_id,
          },
          newGroupCoordinatorEmptyValues
        );
      });
    });
    describe("group_coordinator::put::03 - Passing an invalid type as field value", () => {
      it("should return a not valid value error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinatorNotValidDataTypes);

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
            msg: "The group id is not valid",
            param: "group_id",
            value: invalidMockId,
          },
          {
            location: "body",
            msg: "The coordinator id is not valid",
            param: "coordinator_id",
            value: invalidMockId,
          },
        ]);
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).not.toHaveBeenCalled();
        expect(duplicateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinatorNotValidDataTypes.school_id,
            group_id: newGroupCoordinatorNotValidDataTypes.group_id,
            coordinator_id: newGroupCoordinatorNotValidDataTypes.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinatorNotValidDataTypes.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinatorNotValidDataTypes.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinatorNotValidDataTypes.group_id,
            school_id: newGroupCoordinatorNotValidDataTypes.school_id,
          },
          newGroupCoordinatorNotValidDataTypes
        );
      });
    });
    describe("group_coordinator::put::03 - group has the coordinator already assigned", () => {
      it("should return an already assigned coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "This group has already been assigned this coordinator",
        });
        expect(statusCode).toBe(409);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).not.toHaveBeenCalled();
        expect(findGroup).not.toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::post::05 - Passing a non-existent group in the body", () => {
      it("should return a non-existent group error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          groupNullPayload,
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::06 - Passing a group that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(
          { ...groupPayload, school_id: otherValidMockId },
          "findPopulateGroupById"
        );
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the group belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).not.toHaveBeenCalled();
        expect(findCoordinator).not.toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::06 - Passing a non-existent coordinator in the body", () => {
      it("should return a non-existent coordinator error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorNullPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator exists",
        });
        expect(statusCode).toBe(404);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::07 - Passing a coordinator that does not match the school id", () => {
      it("should return a non-existent school error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          { ...coordinatorPayload, school_id: otherValidMockId },
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please make sure the coordinator belongs to the school",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::08 - Passing a coordinator with a role different from coordinator", () => {
      it("should return a non-coordinator role error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          { ...coordinatorPayload, role: "student" },
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass a user with a coordinator role",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::09 - Passing a coordinator with a status different from active", () => {
      it("should return a non-active coordinator error", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          { ...coordinatorPayload, status: "inactive" },
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "Please pass an active coordinator",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).not.toHaveBeenCalled();
        expect(updateGroupCoordinator).not.toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::10 - Passing a group_coordinator but not updating", () => {
      it("should not update a group_coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has not been assigned the updated group",
        });
        expect(statusCode).toBe(400);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).toHaveBeenCalled();
        expect(updateGroupCoordinator).toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
    describe("group_coordinator::put::11 - Passing a group_coordinator correctly to update", () => {
      it("should update a group_coordinator", async () => {
        // mock services
        const duplicateGroupCoordinator = mockService(
          groupCoordinatorNullPayload,
          "findGroupCoordinatorByProperty"
        );
        const findGroup = mockService(groupPayload, "findPopulateGroupById");
        const findCoordinator = mockService(
          coordinatorPayload,
          "findPopulateCoordinatorById"
        );
        const updateGroupCoordinator = mockService(
          groupCoordinatorPayload,
          "modifyFilterGroupCoordinator"
        );

        // api call
        const { statusCode, body } = await supertest(server)
          .put(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send(newGroupCoordinator);

        // assertions
        expect(body).toStrictEqual({
          msg: "The coordinator has been successfully assigned the updated group",
        });
        expect(statusCode).toBe(200);
        expect(duplicateGroupCoordinator).toHaveBeenCalled();
        expect(duplicateGroupCoordinator).toHaveBeenCalledWith(
          {
            school_id: newGroupCoordinator.school_id,
            group_id: newGroupCoordinator.group_id,
            coordinator_id: newGroupCoordinator.coordinator_id,
          },
          "-createdAt -updatedAt"
        );
        expect(findGroup).toHaveBeenCalled();
        expect(findGroup).toHaveBeenCalledWith(
          newGroupCoordinator.group_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(findCoordinator).toHaveBeenCalled();
        expect(findCoordinator).toHaveBeenCalledWith(
          newGroupCoordinator.coordinator_id,
          "-createdAt -updatedAt",
          "school_id",
          "-createdAt -updatedAt"
        );
        expect(updateGroupCoordinator).toHaveBeenCalled();
        expect(updateGroupCoordinator).toHaveBeenCalledWith(
          {
            _id: validMockGroupCoordinatorId,
            group_id: newGroupCoordinator.group_id,
            school_id: newGroupCoordinator.school_id,
          },
          newGroupCoordinator
        );
      });
    });
  });

  describe("DELETE /group_coordinator ", () => {
    describe("group_coordinator::delete::01 - Passing fields with missing fields", () => {
      it("should return a missing fields error", async () => {
        // mock services
        const deleteTeacher = mockService(
          groupCoordinatorNullPayload,
          "removeFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockGroupCoordinatorId,
          school_id: null,
        });
      });
    });
    describe("group_coordinator::delete::02 - Passing fields with empty fields", () => {
      it("should return a empty fields error", async () => {
        // mock services
        const deleteTeacher = mockService(
          groupCoordinatorNullPayload,
          "removeFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: validMockGroupCoordinatorId,
          school_id: "",
        });
      });
    });
    describe("group_coordinator::delete::03 - Passing an invalid group_coordinator and school ids", () => {
      it("should return an invalid id error", async () => {
        // mock services
        const deleteTeacher = mockService(
          groupCoordinatorNullPayload,
          "removeFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${invalidMockId}`)
          .send({ school_id: invalidMockId });
        // assertions
        expect(body).toStrictEqual([
          {
            location: "params",
            msg: "The group_coordinator id is not valid",
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
        expect(deleteTeacher).not.toHaveBeenCalled();
        expect(deleteTeacher).not.toHaveBeenCalledWith({
          _id: invalidMockId,
          school_id: invalidMockId,
        });
      });
    });
    describe("group_coordinator::delete::04 - Passing a group_coordinator id but not deleting it", () => {
      it("should not delete a school", async () => {
        // mock services
        const deleteTeacher = mockService(
          groupCoordinatorNullPayload,
          "removeFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${otherValidMockId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({ msg: "Group_coordinator not deleted" });
        expect(statusCode).toBe(404);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: otherValidMockId,
          school_id: validMockSchoolId,
        });
      });
    });
    describe("group_coordinator::delete::05 - Passing a group_coordinator id correctly to delete", () => {
      it("should delete a group_coordinator", async () => {
        // mock services
        const deleteTeacher = mockService(
          groupCoordinatorPayload,
          "removeFilterGroupCoordinator"
        );
        // api call
        const { statusCode, body } = await supertest(server)
          .delete(`${endPointUrl}${validMockGroupCoordinatorId}`)
          .send({ school_id: validMockSchoolId });
        // assertions
        expect(body).toStrictEqual({ msg: "Group_coordinator deleted" });
        expect(statusCode).toBe(200);
        expect(deleteTeacher).toHaveBeenCalled();
        expect(deleteTeacher).toHaveBeenCalledWith({
          _id: validMockGroupCoordinatorId,
          school_id: validMockSchoolId,
        });
      });
    });
  });
});
