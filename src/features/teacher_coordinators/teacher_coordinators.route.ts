import { Router } from "express";
import {
  validateCreateTeacherCoordinator,
  validateGetTeacherCoordinators,
  validateGetTeacherCoordinator,
  validateDeleteTeacherCoordinator,
  validateUpdateTeacherCoordinator,
} from "./teacher_coordinators.validator";

import {
  createTeacherCoordinator,
  getTeacherCoordinators,
  getTeacherCoordinator,
  updateTeacherCoordinator,
  deleteTeacherCoordinator,
} from "./teacher_coordinators.controller";

const router = Router();

// @desc    Create a teacher_coordinator
// @route   POST /api/v1/teacher_coordinators
// @access  Private
router.post("/", validateCreateTeacherCoordinator, createTeacherCoordinator);

// @desc    Get teacher_coordinators data
// @route   GET /api/v1/teacher_coordinators
// @access  Private
router.get("/", validateGetTeacherCoordinators, getTeacherCoordinators);

// @desc    Get a teacher_coordinator data
// @route   GET /api/v1/teacher_coordinators/:id
// @access  Private
router.get("/:id", validateGetTeacherCoordinator, getTeacherCoordinator);

// @desc    Update a teacher_coordinator data
// @route   PUT /api/v1/teacher_coordinators/:id
// @access  Private
router.put("/:id", validateUpdateTeacherCoordinator, updateTeacherCoordinator);

// @desc    Delete a teacher_coordinator data
// @route   PUT /api/v1/teacher_coordinators/:id
// @access  Private
router.delete(
  "/:id",
  validateDeleteTeacherCoordinator,
  deleteTeacherCoordinator
);

export { router };
