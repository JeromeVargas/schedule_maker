import { Router } from "express";
import {
  validateCreateBreak,
  validateGetBreaks,
  validateGetBreak,
  validateDeleteBreak,
  validateUpdateBreak,
} from "./breaks.validator";

import {
  createBreak,
  getBreaks,
  getBreak,
  updateBreak,
  deleteBreak,
} from "./breaks.controller";

const router = Router();

// @desc    Create a break
// @route   POST /api/v1/breaks
// @access  Private
router.post("/", validateCreateBreak, createBreak);

// @desc    Get breaks data
// @route   GET /api/v1/breaks
// @access  Private
router.get("/", validateGetBreaks, getBreaks);

// @desc    Get a break data
// @route   GET /api/v1/breaks/:id
// @access  Private
router.get("/:id", validateGetBreak, getBreak);

// @desc    Update a break data
// @route   PUT /api/v1/breaks/:id
// @access  Private
router.put("/:id", validateUpdateBreak, updateBreak);

// @desc    Delete a break data
// @route   PUT /api/v1/breaks/:id
// @access  Private
router.delete("/:id", validateDeleteBreak, deleteBreak);

export { router };
