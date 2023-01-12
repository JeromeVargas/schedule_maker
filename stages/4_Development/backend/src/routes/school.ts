import { Router } from "express";

import {
  getSchools,
  getSchool,
  createSchool,
  updateSchool,
  deleteSchool,
} from "../controllers/schoolController";

const router = Router();

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", getSchools);
// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", getSchool);
// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", createSchool);
// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", updateSchool);
// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", deleteSchool);

export { router };
