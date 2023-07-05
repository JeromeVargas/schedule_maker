import { Router } from "express";
import {
  validateCreateUser,
  validateGetUser,
  validateGetUsers,
  validateUpdateUser,
  validateDeleteUser,
} from "../modules/users/usersValidator";

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../modules/users/usersController";

const router = Router();

// @desc    Create a school
// @route   POST /api/v1/school
// @access  Private
router.post("/", validateCreateUser, createUser);

// @desc    Get schools data
// @route   GET /api/v1/school
// @access  Private
router.get("/", validateGetUsers, getUsers);

// @desc    Get a school data
// @route   GET /api/v1/school/:id
// @access  Private
router.get("/:id", validateGetUser, getUser);

// @desc    Update a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.put("/:id", validateUpdateUser, updateUser);

// @desc    Delete a school data
// @route   PUT /api/v1/school/:id
// @access  Private
router.delete("/:id", validateDeleteUser, deleteUser);

export { router };
