import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertTeacherCoordinator,
  findFilterAllTeacherCoordinators,
  findTeacherCoordinatorByProperty,
  modifyFilterTeacherCoordinator,
  removeFilterTeacherCoordinator,
  /* Services from other entities */
  findPopulateTeacherById,
  findPopulateCoordinatorById,
} from "./teacher_coordinators.services";

// @desc create a teacher_coordinator
// @route POST /api/v?/teacher_coordinator
// @access Private
// @fields: body {school_id:[string], teacher_id:[string], coordinator_id:[string]}
export const createTeacherCoordinator = async (
  { body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { school_id, teacher_id, coordinator_id } = body;
  /* find if the teacher has the coordinator already assigned, so to avoid duplicity when you pass the field again for the same teacher */
  const searchCriteria = { school_id, teacher_id, coordinator_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const coordinatorAlreadyAssigned = await findTeacherCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (coordinatorAlreadyAssigned) {
    throw new ConflictError(
      "This teacher has already been assigned this coordinator"
    );
  }
  /* find if the teacher already exists */
  const fieldsToReturnTeacher = "-createdAt -updatedAt";
  const fieldsToPopulateTeacher = "school_id";
  const fieldsToReturnPopulateTeacher = "-createdAt -updatedAt";
  const teacherFound = await findPopulateTeacherById(
    teacher_id,
    fieldsToReturnTeacher,
    fieldsToPopulateTeacher,
    fieldsToReturnPopulateTeacher
  );
  if (!teacherFound) {
    throw new NotFoundError("Please make sure the teacher exists");
  }
  if (teacherFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the teacher belongs to the school"
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
  const newTeacherCoordinator = {
    school_id: school_id,
    teacher_id: teacher_id,
    coordinator_id: coordinator_id,
  };
  const teacherCoordinatorCreated = await insertTeacherCoordinator(
    newTeacherCoordinator
  );
  if (!teacherCoordinatorCreated) {
    throw new BadRequestError(
      "Coordinator has not been assigned the to teacher"
    );
  }
  res
    .status(StatusCodes.CREATED)
    .json({
      msg: "Coordinator has been successfully assigned the to teacher",
      success: true,
    });
};

// @desc get all the teacher_coordinator
// @route GET /api/v?/teacher_coordinator
// @access Private
// @fields: body {school_id:[string]}
export const getTeacherCoordinators = async (
  { body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherCoordinatorsFound = await findFilterAllTeacherCoordinators(
    filters,
    fieldsToReturn
  );
  /* get all fields */
  if (teacherCoordinatorsFound?.length === 0) {
    throw new NotFoundError("No coordinators assigned to any teachers yet");
  }
  const response = {
    payload: teacherCoordinatorsFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc get the teacher_coordinator by id
// @route GET /api/v?/teacher_coordinators/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const getTeacherCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the teacher_field */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherCoordinatorFound = await findTeacherCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!teacherCoordinatorFound) {
    throw new NotFoundError("Teacher_coordinator not found");
  }
  const response = {
    payload: teacherCoordinatorFound,
    success: true,
  };
  res.status(StatusCodes.OK).json(response);
};

// @desc update a teacher_field
// @route PUT /api/v?/teacher_fields/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], teacher_id:[string], coordinator_id:[string]}
export const updateTeacherCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: teacherCoordinatorId } = params;
  const { school_id, teacher_id, coordinator_id } = body;
  /* find if the teacher has the coordinator already assigned, so to avoid duplicity when you pass the coordinator again for the same teacher */
  const searchCriteria = { school_id, teacher_id, coordinator_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const coordinatorAlreadyAssigned = await findTeacherCoordinatorByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (coordinatorAlreadyAssigned) {
    throw new ConflictError(
      "This teacher has already been assigned this coordinator"
    );
  }
  /* find if the teacher already exists */
  const fieldsToReturnTeacher = "-createdAt -updatedAt";
  const fieldsToPopulateTeacher = "school_id";
  const fieldsToReturnPopulateTeacher = "-createdAt -updatedAt";
  const teacherFound = await findPopulateTeacherById(
    teacher_id,
    fieldsToReturnTeacher,
    fieldsToPopulateTeacher,
    fieldsToReturnPopulateTeacher
  );
  if (!teacherFound) {
    throw new NotFoundError("Please make sure the teacher exists");
  }
  if (teacherFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the teacher belongs to the school"
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
  /* update if the teacher and school ids are the same one as the one passed and update the field */
  const filtersUpdate = {
    _id: teacherCoordinatorId,
    school_id: school_id,
    teacher_id: teacher_id,
  };
  const newTeacherCoordinator = {
    school_id: school_id,
    teacher_id: teacher_id,
    coordinator_id: coordinator_id,
  };
  const teacherCoordinatorUpdated = await modifyFilterTeacherCoordinator(
    filtersUpdate,
    newTeacherCoordinator
  );
  if (!teacherCoordinatorUpdated) {
    throw new BadRequestError(
      "The coordinator has not been assigned the updated teacher"
    );
  }
  res.status(StatusCodes.OK).json({
    msg: "The coordinator has been successfully assigned the updated teacher",
    success: true,
  });
};

// @desc delete a teacher_coordinator
// @route DELETE /api/v?/teacher_coordinators/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
export const deleteTeacherCoordinator = async (
  { params, body }: Request,
  res: Response
) => {
  /* destructure the fields */
  const { id: teacherCoordinatorId } = params;
  const { school_id } = body;
  /* delete field */
  const teacherCoordinatorFiltersDelete = {
    school_id: school_id,
    _id: teacherCoordinatorId,
  };
  const teacherCoordinatorDeleted = await removeFilterTeacherCoordinator(
    teacherCoordinatorFiltersDelete
  );
  if (!teacherCoordinatorDeleted) {
    throw new NotFoundError("Teacher_coordinator not deleted");
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Teacher_coordinator deleted", success: true });
};
