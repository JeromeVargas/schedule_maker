import { Router } from "express";
import {
  validateCreateUser,
  validateGetUser,
  validateGetUsers,
  validateUpdateUser,
  validateDeleteUser,
} from "./users.validator";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "./users.controller";

const router = Router();

// @desc    Create a school
// @route   POST /api/v?/school
// @access  Private
router.post("/", validateCreateUser, createUser);

// @desc    Get schools data
// @route   GET /api/v?/school
// @access  Private
router.get("/", validateGetUsers, getUsers);

// @desc    Get a school data
// @route   GET /api/v?/school/:id
// @access  Private
router.get("/:id", validateGetUser, getUser);

// @desc    Update a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.put("/:id", validateUpdateUser, updateUser);

// @desc    Delete a school data
// @route   PUT /api/v?/school/:id
// @access  Private
router.delete("/:id", validateDeleteUser, deleteUser);

export { router };
