import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import BadRequestError from "../../errors/bad-request";
import ConflictError from "../../errors/conflict";
import NotFoundError from "../../errors/not-found";

import {
  insertTeacherField,
  findFilterAllTeacherFields,
  findTeacherFieldByProperty,
  findFilterTeacherFieldByProperty,
  modifyFilterTeacherField,
  removeFilterTeacherField,
  /* Services from other entities */
  findPopulateTeacherById,
  findPopulateFieldById,
} from "./teacherFieldServices";

/* models */
const fieldModel = "field";
const teacherFieldModel = "teacherField";

// @desc create a teacher_field
// @route POST /api/v1/teacher_fields
// @access Private
// @fields: body {school_id:[string], teacher_id:[string], field_id:[string]}
const createTeacherField = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id, teacher_id, field_id } = body;
  /* find if the teacher has the field already assigned */
  const searchCriteria = { school_id, teacher_id, field_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldAlreadyAssigned = await findTeacherFieldByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (fieldAlreadyAssigned) {
    throw new ConflictError(
      "This teacher has already been assigned this field"
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
  /* find if the field already exists */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateFieldById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField
  );
  if (!fieldFound) {
    throw new NotFoundError("Please make sure the field exists");
  }
  if (fieldFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field belongs to the school"
    );
  }
  /* create the teacher_field record */
  const newTeacherField = {
    school_id: school_id,
    teacher_id: teacher_id,
    field_id: field_id,
  };
  const teacherFieldCreated = await insertTeacherField(newTeacherField);
  if (!teacherFieldCreated) {
    throw new BadRequestError(
      "The teacher has been successfully assigned the field"
    );
  }
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "The teacher has been successfully assigned the field" });
};

// @desc get all the teacher_fields
// @route GET /api/v1/teacher_fields
// @access Private
// @fields: body {school_id:[string]}
const getTeacherFields = async ({ body }: Request, res: Response) => {
  /* destructure the fields */
  const { school_id } = body;
  /* filter by school id */
  const filters = { school_id: school_id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherFieldsFound = await findFilterAllTeacherFields(
    filters,
    fieldsToReturn
  );
  /* get all fields */
  if (teacherFieldsFound?.length === 0) {
    throw new NotFoundError("No fields assigned to any teachers found");
  }
  res.status(StatusCodes.OK).json(teacherFieldsFound);
};

// @desc get the teacher_field by id
// @route GET /api/v1/teacher_fields/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const getTeacherField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: _id } = params;
  const { school_id } = body;
  /* get the teacher_field */
  const searchCriteria = { school_id, _id };
  const fieldsToReturn = "-createdAt -updatedAt";
  const teacherFieldFound = await findTeacherFieldByProperty(
    searchCriteria,
    fieldsToReturn
  );
  if (!teacherFieldFound) {
    throw new NotFoundError("Teacher_Field not found");
  }
  res.status(StatusCodes.OK).json(teacherFieldFound);
};

// @desc update a teacher_field
// @route PUT /api/v1/teacher_fields/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string], teacher_id:[string], field_id:[string]}
const updateTeacherField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherFieldId } = params;
  const { school_id, teacher_id, field_id } = body;
  /* check if the field already exists */
  const fieldsToReturnField = "-createdAt -updatedAt";
  const fieldsToPopulateField = "school_id";
  const fieldsToReturnPopulateField = "-createdAt -updatedAt";
  const fieldFound = await findPopulateFieldById(
    field_id,
    fieldsToReturnField,
    fieldsToPopulateField,
    fieldsToReturnPopulateField
  );
  if (!fieldFound) {
    throw new NotFoundError("Please make sure the field exists");
  }
  if (fieldFound.school_id?._id?.toString() !== school_id) {
    throw new BadRequestError(
      "Please make sure the field belongs to the school"
    );
  }
  /* check if the field has already been assigned to a teacher for the school */
  const filters = {
    school_id: school_id,
    teacher_id: teacher_id,
    field_id: field_id,
  };
  const fieldsToReturn = "-createdAt -updatedAt";
  const fieldAlreadyAssignedToTeacherFound =
    await findFilterTeacherFieldByProperty(filters, fieldsToReturn);
  if (fieldAlreadyAssignedToTeacherFound?.length !== 0) {
    throw new ConflictError(
      "This field has already been assigned to the teacher!"
    );
  }
  /* update if the teacher and school ids are the same one as the one passed and update the field */
  const filtersUpdate = {
    _id: teacherFieldId,
    school_id: school_id,
    teacher_id: teacher_id,
  };
  const newTeacherField = {
    school_id: school_id,
    teacher_id: teacher_id,
    field_id: field_id,
  };
  const fieldUpdated = await modifyFilterTeacherField(
    filtersUpdate,
    newTeacherField
  );
  if (!fieldUpdated) {
    throw new NotFoundError(
      "The teacher has not been assigned the updated field"
    );
  }
  res.status(StatusCodes.OK).json({
    msg: "The teacher has been successfully assigned the updated field",
  });
};

// @desc delete a teacher_field
// @route DELETE /api/v1/teacher_fields/:id
// @access Private
// @fields: params: {id:[string]},  body: {school_id:[string]}
const deleteTeacherField = async ({ params, body }: Request, res: Response) => {
  /* destructure the fields */
  const { id: teacherFieldId } = params;
  const { school_id } = body;
  /* delete field */
  const teacherFiltersDelete = { school_id: school_id, _id: teacherFieldId };
  const fieldDeleted = await removeFilterTeacherField(teacherFiltersDelete);
  if (!fieldDeleted) {
    throw new NotFoundError("Teacher_Field not deleted");
  }
  res.status(StatusCodes.OK).json({ msg: "Teacher_Field deleted" });
};

export {
  createTeacherField,
  getTeacherFields,
  getTeacherField,
  updateTeacherField,
  deleteTeacherField,
};
