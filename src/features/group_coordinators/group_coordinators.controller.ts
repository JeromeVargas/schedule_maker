import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertGroupCoordinator,
  findFilterAllGroupCoordinators,
  findGroupCoordinatorByProperty,
  modifyFilterGroupCoordinator,
  removeFilterGroupCoordinator,
  /* Services from other entities */
  findPopulateGroupById,
  findPopulateCoordinatorById,
} from "./group_coordinators.services";

// @desc create a group_coordinator
// @route POST /api/v1/group_coordinator
// @access Private
// @fields: body {school_id:[string], group_id:[string], coordinator_id:[string]}
const createGroupCoordinator = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, group_id, coordinator_id } = body;
  /* find if the group has the coordinator already assigned, so to avoid duplicity when you pass the field again for the same teacher */
  const searchCriteria = { school_id, group_id, coordinator_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const coordinatorAlreadyAssigned = await findGroupCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (coordinatorAlreadyAssigned) {
    throw new ConflictError(
      "This group has already been assigned this coordinator"
    );
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateGroupById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup
  );
  if (!groupFound) {
    throw new NotFoundError("Please make sure the group exists");
  }
  if (groupFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  /* find if the coordinator already exists */
  const fieldsToReturnCoordinator = "-createdAt -updatedAt";
  const fieldsToPopulateCoordinator = "school_id";
  const fieldsToReturnPopulateCoordinator = "-createdAt -updatedAt";
  const coordinatorFound = await findPopulateCoordinatorById(
    coordinator_id,
    fieldsToReturnCoordinator,
    fieldsToPopulateCoordinator,
    fieldsToReturnPopulateCoordinator
  );
  if (!coordinatorFound) {
    throw new NotFoundError("Please make sure the coordinator exists");
  }
  if (coordinatorFound.school_id?._id?.toString() !== school_id) {
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

  /* create the teacher_field record */
  const newGroupCoordinator = {
    school_id: school_id,
    group_id: group_id,
    coordinator_id: coordinator_id,
  };
  const groupCoordinatorCreated = await insertGroupCoordinator(
    newGroupCoordinator
  );
  if (!groupCoordinatorCreated) {
    throw new BadRequestError("Coordinator has not been assigned the to group");
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Coordinator has been successfully assigned the to group" });
};

// @desc get all the group_coordinator
// @route GET /api/v1/group_coordinator
// @access Private
// @fields: body {school_id:[string]}
const getGroupCoordinators = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupCoordinatorsFound = await findFilterAllGroupCoordinators(
    filters,
    fieldsToReturn
  );
  /* get all fields */
  if (groupCoordinatorsFound?.length === 0) {
    throw new NotFoundError("No coordinators assigned to any groups yet");
  }
  res.status(StatusCodes.OK).json(groupCoordinatorsFound);
};

// @desc get the group_coordinator by id
// @route GET /api/v1/group_coordinators/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getGroupCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the teacher_field */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const groupCoordinatorFound = await findGroupCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!groupCoordinatorFound) {
    throw new NotFoundError("Group_coordinator not found");
  }
  res.status(StatusCodes.OK).json(groupCoordinatorFound);
};

// @desc update a teacher_field
// @route PUT /api/v1/teacher_fields/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], group_id:[string], coordinator_id:[string]}
const updateGroupCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: groupCoordinatorId } = params;
  const { school_id, group_id, coordinator_id } = body;
  /* find if the group has the coordinator already assigned, so to avoid duplicity when you pass the coordinator again for the same group */
  const searchCriteria = { school_id, group_id, coordinator_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const coordinatorAlreadyAssigned = await findGroupCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (coordinatorAlreadyAssigned) {
    throw new ConflictError(
      "This group has already been assigned this coordinator"
    );
  }
  /* find if the group already exists */
  const fieldsToReturnGroup = "-createdAt -updatedAt";
  const fieldsToPopulateGroup = "school_id";
  const fieldsToReturnPopulateGroup = "-createdAt -updatedAt";
  const groupFound = await findPopulateGroupById(
    group_id,
    fieldsToReturnGroup,
    fieldsToPopulateGroup,
    fieldsToReturnPopulateGroup
  );
  if (!groupFound) {
    throw new NotFoundError("Please make sure the group exists");
  }
  if (groupFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the group belongs to the school"
    );
  }
  /* check if the field already exists */
  const fieldsToReturnCoordinator = "-createdAt -updatedAt";
  const fieldsToPopulateCoordinator = "school_id";
  const fieldsToReturnPopulateCoordinator = "-createdAt -updatedAt";
  const coordinatorFound = await findPopulateCoordinatorById(
    coordinator_id,
    fieldsToReturnCoordinator,
    fieldsToPopulateCoordinator,
    fieldsToReturnPopulateCoordinator
  );
  if (!coordinatorFound) {
    throw new NotFoundError("Please make sure the coordinator exists");
  }
  if (coordinatorFound.school_id?._id?.toString() !== school_id) {
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
  /* update if the group and school ids are the same one as the one passed and update the field */
  const filtersUpdate = {
    _id: groupCoordinatorId,
    school_id: school_id,
    group_id: group_id,
  };
  const newGroupCoordinator = {
    school_id: school_id,
    group_id: group_id,
    coordinator_id: coordinator_id,
  };
  const groupCoordinatorUpdated = await modifyFilterGroupCoordinator(
    filtersUpdate,
    newGroupCoordinator
  );
  if (!groupCoordinatorUpdated) {
    throw new BadRequestError(
      "The coordinator has not been assigned the updated group"
    );
  }
  res.status(StatusCodes.OK).json({
    msg: "The coordinator has been successfully assigned the updated group",
  });
};

// @desc delete a group_coordinator
// @route DELETE /api/v1/group_coordinators/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteGroupCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: groupCoordinatorId } = params;
  const { school_id } = body;
  /* delete field */
  const groupCoordinatorFiltersDelete = {
    school_id: school_id,
    _id: groupCoordinatorId,
  };
  const groupCoordinatorDeleted = await removeFilterGroupCoordinator(
    groupCoordinatorFiltersDelete
  );
  if (!groupCoordinatorDeleted) {
    throw new NotFoundError("Group_coordinator not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Group_coordinator deleted" });
};

export {
  createGroupCoordinator,
  getGroupCoordinators,
  getGroupCoordinator,
  updateGroupCoordinator,
  deleteGroupCoordinator,
};
