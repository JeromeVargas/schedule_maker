import { Router } from "express";
import {
  validateCreateAUser,
  validateGetAUser,
  validateUpdateAUser,
  validateDeleteAUser,
} from "../validators/userValidator";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController";

const router = Router();

// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", validateCreateAUser, createUser);

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", getUsers);

// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", validateGetAUser, getUser);

// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", validateUpdateAUser, updateUser);

// @desc    Delete a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", validateDeleteAUser, deleteUser);

export { router };
