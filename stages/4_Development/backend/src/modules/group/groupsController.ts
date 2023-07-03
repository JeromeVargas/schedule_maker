import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  deleteFilterResource,
  findFilterAllResources,
  findFilterResourceByProperty,
  findPopulateResourceById,
  findResourceByProperty,
  insertResource,
  updateFilterResource,
} from "../../services/mongoServices";
import { Group } from "../../typings/types";

/* models */
const groupModel = "group";
const levelModel = "level";
const userModel = "user";

// @desc create a group
// @route POST /api/v1/groups
// @access Private
// @fields: body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
const createGroup = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, level_id, coordinator_id, name, numberStudents } = body;
  /* check if the group name already exists for this school */
  const searchCriteria = { school_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateField = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    groupModel
  );
  if (duplicateField) {
    throw new ConflictError("This group name already exists");
  }
  /* find level by id, and populate its properties */
  const fieldsToReturnLevel = "-createdAt -updatedAt";
  const fieldsToPopulateLevel = "school_id";
  const fieldsToReturnPopulateLevel = "-createdAt -updatedAt";
  const levelFound = await findPopulateResourceById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel,
    levelModel
  );
  if (!levelFound) {
    throw new NotFoundError("Please make sure the level exists");
  }
  // find if the school exists for the level and matches the school in the body
  if (levelFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  // check if the number of students is larger than the max allowed number of students
  const maxNumberStudentsPerGroup = levelFound?.school_id?.groupMaxNumStudents;
  if (numberStudents > maxNumberStudentsPerGroup) {
    throw new BadRequestError(
      `Please take into account that the number of students for any group cannot exceed ${maxNumberStudentsPerGroup} students`
    );
  }
  /* find if the coordinator already exists, has a coordinator role and it is active */
  const fieldsToReturnCoordinator = "-password -createdAt -updatedAt";
  const fieldsToPopulateCoordinator = "school_id";
  const fieldsToReturnPopulateCoordinator = "-createdAt -updatedAt";
  const coordinatorFound = await findPopulateResourceById(
    coordinator_id,
    fieldsToReturnCoordinator,
    fieldsToPopulateCoordinator,
    fieldsToReturnPopulateCoordinator,
    userModel
  );
  if (!coordinatorFound) {
    throw new NotFoundError("Please make sure the coordinator exists");
  }
  // find if the school exists for the coordinator and matches the school in the body
  if (coordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the school"
    );
  }
  if (coordinatorFound?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (coordinatorFound?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* create group */
  const newGroup = {
    school_id: school_id,
    level_id: level_id,
    coordinator_id: coordinator_id,
    name: name,
    numberStudents: numberStudents,
  };
  const groupCreated = await insertResource(newGroup, groupModel);
  if (!groupCreated) {
    throw new BadRequestError("Group not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Group created!" });
};

// @desc get all the Groups
// @route GET /api/v1/Groups
// @access Private
// @fields: body {school_id:[string]}
const getGroups = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupsFound = await findFilterAllResources(
    filters,
    fieldsToReturn,
    groupModel
  );
  /* get all fields */
  if (groupsFound?.length === 0) {
    throw new NotFoundError("No groups found");
  }
  res.status(StatusCodes.OK).json(groupsFound);
};

// @desc get the Group by id
// @route GET /api/v1/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the group */
  const searchCriteria = { _id, school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupFound = await findResourceByProperty(
    searchCriteria,
    fieldsToReturn,
    groupModel
  );
  if (!groupFound) {
    throw new NotFoundError("Group not found");
  }
  res.status(StatusCodes.OK).json(groupFound);
};

// @desc update a Group
// @route PUT /api/v1/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
const updateGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: groupId } = params;
  const { school_id, level_id, coordinator_id, name, numberStudents } = body;
  /* check if the group name already exists for this school */
  const groupFilters = [{ school_id: school_id }, { name: name }];
  const groupFieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findFilterResourceByProperty(
    groupFilters,
    groupFieldsToReturn,
    groupModel
  );
  const duplicateGroupName = duplicateName?.some(
    (group: Group) => group?._id?.toString() !== groupId
  );
  if (duplicateGroupName) {
    throw new ConflictError("This group name already exists");
  }
  /* find level by id, and populate its properties */
  const fieldsToReturnLevel = "-createdAt -updatedAt";
  const fieldsToPopulateLevel = "school_id";
  const fieldsToReturnPopulateLevel = "-createdAt -updatedAt";
  const levelFound = await findPopulateResourceById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel,
    levelModel
  );
  if (!levelFound) {
    throw new NotFoundError("Please make sure the level exists");
  }
  // find if the school exists for the level and matches the school in the body
  if (levelFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  // check if the number of students is larger than the max allowed number of students
  const maxNumberStudentsPerGroup = levelFound?.school_id?.groupMaxNumStudents;
  if (numberStudents > maxNumberStudentsPerGroup) {
    throw new BadRequestError(
      `Please take into account that the number of students cannot exceed ${maxNumberStudentsPerGroup} students`
    );
  }
  /* find if the coordinator already exists, has a coordinator role and it is active */
  const fieldsToReturnCoordinator = "-password -createdAt -updatedAt";
  const fieldsToPopulateCoordinator = "school_id";
  const fieldsToReturnPopulateCoordinator = "-createdAt -updatedAt";
  const coordinatorFound = await findPopulateResourceById(
    coordinator_id,
    fieldsToReturnCoordinator,
    fieldsToPopulateCoordinator,
    fieldsToReturnPopulateCoordinator,
    userModel
  );
  if (!coordinatorFound) {
    throw new NotFoundError("Please make sure the coordinator exists");
  }
  // find if the school exists for the coordinator and matches the school in the body
  if (coordinatorFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the coordinator belongs to the school"
    );
  }
  if (coordinatorFound?.role !== "coordinator") {
    throw new BadRequestError("Please pass a user with a coordinator role");
  }
  if (coordinatorFound?.status !== "active") {
    throw new BadRequestError("Please pass an active coordinator");
  }
  /* update group */
  const newGroup = {
    school_id: school_id,
    level_id: level_id,
    coordinator_id: coordinator_id,
    name: name,
    numberStudents: numberStudents,
  };
  const filtersUpdate = [{ _id: groupId }, { school_id: school_id }];
  const groupUpdated = await updateFilterResource(
    filtersUpdate,
    newGroup,
    groupModel
  );
  if (!groupUpdated) {
    throw new NotFoundError("Group not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Group updated!" });
};

// @desc delete a Group
// @route DELETE /api/v1/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: groupId } = params;
  const { school_id } = body;
  /* delete group */
  const filtersDelete = { _id: groupId, school_id: school_id };
  const groupDeleted = await deleteFilterResource(filtersDelete, groupModel);
  if (!groupDeleted) {
    throw new NotFoundError("Group not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Group deleted" });
};

export { createGroup, getGroups, getGroup, updateGroup, deleteGroup };
