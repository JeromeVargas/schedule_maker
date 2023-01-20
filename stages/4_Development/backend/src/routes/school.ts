import { Router } from "express";
import {
  validateCreateASchool,
  validateDeleteASchool,
  validateGetASchool,
  validateUpdateASchool,
} from "../validators/schoolValidator";

import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController";

const router = Router();

// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", validateCreateASchool, createSchool);

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", getSchools);

// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", validateGetASchool, getSchool);

// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", validateUpdateASchool, updateSchool);

// @desc    Delete a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", validateDeleteASchool, deleteSchool);

export { router };
