import { Router } from "express";
import {
  validateCreateSchool,
  validateGetSchool,
  validateDeleteSchool,
  validateUpdateSchool,
} from "../validators/schoolValidator";

import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolsController";

const router = Router();

// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", validateCreateSchool, createSchool);

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", getSchools);

// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", validateGetSchool, getSchool);

// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", validateUpdateSchool, updateSchool);

// @desc    Delete a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", validateDeleteSchool, deleteSchool);

export { router };
