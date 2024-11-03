import { Router } from "express";
import {
  validateCreateTeacherField,
  validateGetTeacherFields,
  validateGetTeacherField,
  validateDeleteTeacherField,
  validateUpdateTeacherField,
} from "./teacher_fields.validator";

import {
  createTeacherField,
  getTeacherFields,
  getTeacherField,
  updateTeacherField,
  deleteTeacherField,
} from "./teacher_fields.controller";

const router = Router();

// @desc    Create a teacher_field
// @route   POST /api/v?/teacher_fields
// @access  Private
router.post("/", validateCreateTeacherField, createTeacherField);

// @desc    Get teacher_fields data
// @route   GET /api/v?/teacher_fields
// @access  Private
router.get("/", validateGetTeacherFields, getTeacherFields);

// @desc    Get a teacher_field data
// @route   GET /api/v?/teacher_fields/:id
// @access  Private
router.get("/:id", validateGetTeacherField, getTeacherField);

// @desc    Update a teacher_field data
// @route   PUT /api/v?/teacher_fields/:id
// @access  Private
router.put("/:id", validateUpdateTeacherField, updateTeacherField);

// @desc    Delete a teacher_field data
// @route   PUT /api/v?/teacher_fields/:id
// @access  Private
router.delete("/:id", validateDeleteTeacherField, deleteTeacherField);

export { router };
