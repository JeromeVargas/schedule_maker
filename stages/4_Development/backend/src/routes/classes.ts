import { Router } from "express";
import {
  validateCreateClass,
  validateGetClasses,
  validateGetClass,
  validateDeleteClass,
  validateUpdateClass,
} from "../modules/classes/classesValidator";

import {
  createClass,
  getClasses,
  getClass,
  updateClass,
  deleteClass,
} from "../modules/classes/classesController";

const router = Router();

// @desc    Create a class
// @route   POST /api/v1/classes
// @access  Private
router.post("/", validateCreateClass, createClass);

// @desc    Get classes data
// @route   GET /api/v1/classes
// @access  Private
router.get("/", validateGetClasses, getClasses);

// @desc    Get a class data
// @route   GET /api/v1/classes/:id
// @access  Private
router.get("/:id", validateGetClass, getClass);

// @desc    Update a class data
// @route   PUT /api/v1/classes/:id
// @access  Private
router.put("/:id", validateUpdateClass, updateClass);

// @desc    Delete a class data
// @route   PUT /api/v1/classes/:id
// @access  Private
router.delete("/:id", validateDeleteClass, deleteClass);

export { router };
