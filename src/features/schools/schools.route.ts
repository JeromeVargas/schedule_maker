import { Router } from "express";
import {
  validateCreateSchool,
  validateGetSchool,
  validateDeleteSchool,
  validateUpdateSchool,
} from "./schools.validator";

import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from "./schools.controller";

const router = Router();

// @desc    Create a school
// @route   POST /api/v?/school
// @access  Private
router.post("/", validateCreateSchool, createSchool);

// @desc    Get schools data
// @route   GET /api/v?/school
// @access  Private
router.get("/", getSchools);

// @desc    Get a school data
// @route   GET /api/v?/school/:id
// @access  Private
router.get("/:id", validateGetSchool, getSchool);

// @desc    Update a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.put("/:id", validateUpdateSchool, updateSchool);

// @desc    Delete a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.delete("/:id", validateDeleteSchool, deleteSchool);

export { router };
