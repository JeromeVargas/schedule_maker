import { Router } from "express";
import {
  validateCreateTeacherCoordinator,
  validateGetTeacherCoordinators,
  validateGetTeacherCoordinator,
  validateDeleteTeacherCoordinator,
  validateUpdateTeacherCoordinator,
} from "./teacherCoordinatorsValidator";

import {
  createTeacherCoordinator,
  getTeacherCoordinators,
  getTeacherCoordinator,
  updateTeacherCoordinator,
  deleteTeacherCoordinator,
} from "./teacherCoordinatorsController";

const router = Router();

// @desc    Create a teacher_field
// @route   POST /api/v1/teacher_fields
// @access  Private
router.post("/", validateCreateTeacherCoordinator, createTeacherCoordinator);

// @desc    Get teacher_fields data
// @route   GET /api/v1/teacher_fields
// @access  Private
router.get("/", validateGetTeacherCoordinators, getTeacherCoordinators);

// @desc    Get a teacher_field data
// @route   GET /api/v1/teacher_fields/:id
// @access  Private
router.get("/:id", validateGetTeacherCoordinator, getTeacherCoordinator);

// @desc    Update a teacher_field data
// @route   PUT /api/v1/teacher_fields/:id
// @access  Private
router.put("/:id", validateUpdateTeacherCoordinator, updateTeacherCoordinator);

// @desc    Delete a teacher_field data
// @route   PUT /api/v1/teacher_fields/:id
// @access  Private
router.delete(
  "/:id",
  validateDeleteTeacherCoordinator,
  deleteTeacherCoordinator
);

export { router };
