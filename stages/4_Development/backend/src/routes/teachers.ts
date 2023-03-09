import { Router } from "express";
import {
  validateCreateTeacher,
  validateGetTeachers,
  validateGetTeacher,
  validateUpdateTeacher,
  validateDeleteTeacher,
} from "../validators/teachersValidator";

import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teachersController";

const router = Router();

// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", validateCreateTeacher, createTeacher);

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", validateGetTeachers, getTeachers);

// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", validateGetTeacher, getTeacher);

// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", validateUpdateTeacher, updateTeacher);

// @desc    Delete a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", validateDeleteTeacher, deleteTeacher);

export { router };
