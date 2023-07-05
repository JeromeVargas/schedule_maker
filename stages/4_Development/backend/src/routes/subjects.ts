import { Router } from "express";
import {
  validateCreateSubject,
  validateGetSubjects,
  validateGetSubject,
  validateDeleteSubject,
  validateUpdateSubject,
} from "../modules/subjects/subjectsValidator";

import {
  createSubject,
  getSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
} from "../modules/subjects/subjectsController";

const router = Router();

// @desc    Create a subject
// @route   POST /api/v1/subjects
// @access  Private
router.post("/", validateCreateSubject, createSubject);

// @desc    Get subjects data
// @route   GET /api/v1/subjects
// @access  Private
router.get("/", validateGetSubjects, getSubjects);

// @desc    Get a subject data
// @route   GET /api/v1/subjects/:id
// @access  Private
router.get("/:id", validateGetSubject, getSubject);

// @desc    Update a subject data
// @route   PUT /api/v1/subjects/:id
// @access  Private
router.put("/:id", validateUpdateSubject, updateSubject);

// @desc    Delete a subject data
// @route   PUT /api/v1/subjects/:id
// @access  Private
router.delete("/:id", validateDeleteSubject, deleteSubject);

export { router };
