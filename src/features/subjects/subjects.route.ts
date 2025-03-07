import { Router } from "express";
import {
  validateCreateSubject,
  validateGetSubjects,
  validateGetSubject,
  validateDeleteSubject,
  validateUpdateSubject,
} from "./subjects.validator";

import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from "./subjects.controller";

export const router = Router();

// @desc    Create a subject
// @route   POST /api/v?/subjects
// @access  Private
router.post("/", validateCreateSubject, createSubject);

// @desc    Get subjects data
// @route   GET /api/v?/subjects
// @access  Private
router.get("/", validateGetSubjects, getSubjects);

// @desc    Get a subject data
// @route   GET /api/v?/subjects/:id
// @access  Private
router.get("/:id", validateGetSubject, getSubject);

// @desc    Update a subject data
// @route   PUT /api/v?/subjects/:id
// @access  Private
router.put("/:id", validateUpdateSubject, updateSubject);

// @desc    Delete a subject data
// @route   PUT /api/v?/subjects/:id
// @access  Private
router.delete("/:id", validateDeleteSubject, deleteSubject);
