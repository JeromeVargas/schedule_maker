import { Router } from "express";
import {
  validateCreateField,
  validateGetField,
  validateGetFields,
  validateDeleteField,
  validateUpdateField,
} from "./fields.validator";

import {
  getFields,
  getField,
  createField,
  updateField,
  deleteField,
} from "./fields.controller";

const router = Router();

// @desc    Create a school
// @route   POST /api/v?/school
// @access  Private
router.post("/", validateCreateField, createField);

// @desc    Get schools data
// @route   GET /api/v?/school
// @access  Private
router.get("/", validateGetFields, getFields);

// @desc    Get a school data
// @route   GET /api/v?/school/:id
// @access  Private
router.get("/:id", validateGetField, getField);

// @desc    Update a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.put("/:id", validateUpdateField, updateField);

// @desc    Delete a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.delete("/:id", validateDeleteField, deleteField);

export { router };
