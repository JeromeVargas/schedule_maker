import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../errors/bad-request";
import ConflictError from "../errors/conflict";
import NotFoundError from "../errors/not-found";

import {
  deleteFilterResource,
  findFilterAllResources,
  findFilterResourceByProperty,
  findPopulateResourceById,
  insertResource,
  updateFilterResource,
} from "../services/mongoServices";

/* models */
const groupModel = "group";
const levelModel = "level";

// @desc create a group
// @route POST /api/v1/groups
// @access Private
// @fields: body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
const createGroup = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, level_id, name, numberStudents } = body;
  /* check if the level name already exists for this school */
  const groupFilters = [{ school_id: school_id }, { name: name }];
  const groupFieldsToReturn = "-createdAt -updatedAt";
  const duplicatedName = await findFilterResourceByProperty(
    groupFilters,
    groupFieldsToReturn,
    groupModel
  );
  if (duplicatedName?.length !== 0) {
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
  /* check if the school exists*/
  if (levelFound?.school_id?.toString() == null) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* check if the passed school id is the same as the level school id*/
  if (levelFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  // /* find if the coordinator already exists */
  // const fieldsToReturnCoordinator = "-createdAt -updatedAt";
  // const fieldsToPopulateCoordinator = "school_id";
  // const fieldsToReturnPopulateCoordinator = "-createdAt -updatedAt";
  // const coordinatorFound = await findPopulateResourceById(
  //   coordinator_id,
  //   fieldsToReturnCoordinator,
  //   fieldsToPopulateCoordinator,
  //   fieldsToReturnPopulateCoordinator,
  //   userModel
  // );
  // if (!coordinatorFound) {
  //   throw new BadRequestError("Please make sure the coordinator exists");
  // }
  // /* find if the school exists and matches the school in the body */
  // if (
  //   groupFound.school_id?._id?.toString() !== school_id ||
  //   coordinatorFound.school_id?._id?.toString() !== school_id ||
  //   fieldFound.school_id?._id?.toString() !== school_id
  // ) {
  //   throw new BadRequestError("The resources do not belong to this school");
  // }
  /* check if the number of students is larger than the max allowed number of students */
  const maxNumberStudentsPerGroup = levelFound?.school_id?.groupMaxNumStudents;
  if (numberStudents > maxNumberStudentsPerGroup) {
    throw new BadRequestError(
      `Please take into account that the number of students cannot exceed ${levelFound?.school_id?.groupMaxNumStudents} students`
    );
  }
  /* create group */
  const newGroup = body;
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
  const { id: groupId } = params;
  const { school_id } = body;
  /* get the field */
  const filters = [{ _id: groupId }, { school_id: school_id }];
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupFound = await findFilterResourceByProperty(
    filters,
    fieldsToReturn,
    groupModel
  );
  if (groupFound?.length === 0) {
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
  const { school_id, level_id, name, numberStudents } = body;
  /* check if the group name already exists for this school */
  const groupFilters = [{ school_id: school_id }, { name: name }];
  const groupFieldsToReturn = "-createdAt -updatedAt";
  const duplicatedName = await findFilterResourceByProperty(
    groupFilters,
    groupFieldsToReturn,
    groupModel
  );
  const duplicatedGroupName = duplicatedName?.some(
    (group: any) => group._id.toString() !== groupId
  );
  if (duplicatedGroupName) {
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
  /* check if the school exists*/
  if (levelFound?.school_id?.toString() == null) {
    throw new BadRequestError("Please make sure the school exists");
  }
  /* check if the passed school id is the same as the level school id*/
  if (levelFound?.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the level belongs to the school"
    );
  }
  /* check if the number of students is larger than the max allowed number of students */
  const maxNumberStudentsPerGroup = levelFound?.school_id?.groupMaxNumStudents;
  if (numberStudents > maxNumberStudentsPerGroup) {
    throw new BadRequestError(
      `Please take into account that the number of students cannot exceed ${levelFound?.school_id?.groupMaxNumStudents} students`
    );
  }
  /* update group */
  const newGroup = body;
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
