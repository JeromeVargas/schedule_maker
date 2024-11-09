import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import { Group } from "../../typings/types";
import {
  insertGroup,
  findFilterAllGroups,
  findFilterGroupByProperty,
  findGroupByProperty,
  modifyFilterGroup,
  removeFilterGroup,
  /* Services from other entities */
  findPopulateLevelById,
} from "./groups.services";

// @desc create a group
// @route POST /api/v?/groups
// @access Private
// @fields: body {school_id:[string], level_id:[string], name:[string], numberStudents:[number]}
export const createGroup = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, level_id, name, numberStudents } = body;
  /* check if the group name already exists for this school */
  const searchCriteria = { school_id, name };
  const fieldsToReturn = "-createdAt -updatedAt";
  const duplicateGroupName = await findGroupByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (duplicateGroupName) {
    throw new ConflictError("This group name already exists");
  }
  /* find level by id, and populate its properties */
  const fieldsToReturnLevel = "-createdAt -updatedAt";
  const fieldsToPopulateLevel = "school_id";
  const fieldsToReturnPopulateLevel = "-createdAt -updatedAt";
  const levelFound = await findPopulateLevelById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel
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
  /* create group */
  const newGroup = {
    school_id: school_id,
    level_id: level_id,
    name: name,
    numberStudents: numberStudents,
  };
  const groupCreated = await insertGroup(newGroup);
  if (!groupCreated) {
    throw new BadRequestError("Group not created!");
  }
  res.status(StatusCodes.OK).json({ msg: "Group created!", success: true });
};

// @desc get all the Groups
// @route GET /api/v?/Groups
// @access Private
// @fields: body {school_id:[string]}
export const getGroups = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupsFound = await findFilterAllGroups(filters, fieldsToReturn);
  /* get all fields */
  if (groupsFound?.length === 0) {
    throw new NotFoundError("No groups found");
  }
  const response = {
    payload: groupsFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc get the Group by id
// @route GET /api/v?/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const getGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the group */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupFound = await findGroupByProperty(searchCriteria, fieldsToReturn);
  if (!groupFound) {
    throw new NotFoundError("Group not found");
  }
  const response = {
    payload: groupFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc update a Group
// @route PUT /api/v?/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body {school_id:[string] , schedule_id:[string], name:[string], numberStudents:[number]}
export const updateGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: groupId } = params;
  const { school_id, level_id, name, numberStudents } = body;
  /* check if the group name already exists for this school */
  const groupFilters = { school_id, name };
  const groupFieldsToReturn = "-createdAt -updatedAt";
  const duplicateName = await findFilterGroupByProperty(
    groupFilters,
    groupFieldsToReturn
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
  const levelFound = await findPopulateLevelById(
    level_id,
    fieldsToReturnLevel,
    fieldsToPopulateLevel,
    fieldsToReturnPopulateLevel
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
  /* update group */
  const newGroup = {
    school_id: school_id,
    level_id: level_id,
    name: name,
    numberStudents: numberStudents,
  };
  const filtersUpdate = {
    _id: groupId,
    school_id: school_id,
    level_id: level_id,
  };
  const groupUpdated = await modifyFilterGroup(filtersUpdate, newGroup);
  if (!groupUpdated) {
    throw new BadRequestError("Group not updated");
  }
  res.status(StatusCodes.OK).json({ msg: "Group updated!", success: true });
};

// @desc delete a Group
// @route DELETE /api/v?/Groups/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const deleteGroup = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields from the params and body */
  const { id: groupId } = params;
  const { school_id } = body;
  /* delete group */
  const filtersDelete = { school_id: school_id, _id: groupId };
  const groupDeleted = await removeFilterGroup(filtersDelete);
  if (!groupDeleted) {
    throw new NotFoundError("Group not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Group deleted", success: true });
};
