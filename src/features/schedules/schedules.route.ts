import { Router } from "express";
import {
  validateCreateSchedule,
  validateGetSchedules,
  validateGetSchedule,
  validateDeleteSchedule,
  validateUpdateSchedule,
} from "./schedules.validator";

import {
  createSchedule,
  getSchedules,
  getSchedule,
  updateSchedule,
  deleteSchedule,
} from "./schedules.controller";

export const router = Router();

// @desc    Create a schedule
// @route   POST /api/v?/schedules
// @access  Private
router.post("/", validateCreateSchedule, createSchedule);

// @desc    Get schedules data
// @route   GET /api/v?/schedules
// @access  Private
router.get("/", validateGetSchedules, getSchedules);

// @desc    Get a schedule data
// @route   GET /api/v?/schedules/:id
// @access  Private
router.get("/:id", validateGetSchedule, getSchedule);

// @desc    Update a schedule data
// @route   PUT /api/v?/schedules/:id
// @access  Private
router.put("/:id", validateUpdateSchedule, updateSchedule);

// @desc    Delete a schedule data
// @route   PUT /api/v?/schedules/:id
// @access  Private
router.delete("/:id", validateDeleteSchedule, deleteSchedule);
