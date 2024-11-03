import { Router } from "express";
import {
  validateCreateTeacher,
  validateGetTeachers,
  validateGetTeacher,
  validateUpdateTeacher,
  validateDeleteTeacher,
} from "./teachers.validator";

import {
  createTeacher,
  getTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher,
} from "./teachers.controller";

const router = Router();

// @desc    Create a school
// @route   POST /api/v?/school
// @access  Private
router.post("/", validateCreateTeacher, createTeacher);

// @desc    Get schools data
// @route   GET /api/v?/school
// @access  Private
router.get("/", validateGetTeachers, getTeachers);

// @desc    Get a school data
// @route   GET /api/v?/school/:id
// @access  Private
router.get("/:id", validateGetTeacher, getTeacher);

// @desc    Update a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.put("/:id", validateUpdateTeacher, updateTeacher);

// @desc    Delete a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.delete("/:id", validateDeleteTeacher, deleteTeacher);

export { router };
