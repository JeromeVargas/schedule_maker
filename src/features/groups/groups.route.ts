import { Router } from "express";
import {
  validateCreateGroup,
  validateGetGroups,
  validateGetGroup,
  validateDeleteGroup,
  validateUpdateGroup,
} from "./groups.validator";

import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} from "./groups.controller";

export const router = Router();

// @desc    Create a group
// @route   POST /api/v?/groups
// @access  Private
router.post("/", validateCreateGroup, createGroup);

// @desc    Get groups data
// @route   GET /api/v?/groups
// @access  Private
router.get("/", validateGetGroups, getGroups);

// @desc    Get a group data
// @route   GET /api/v?/groups/:id
// @access  Private
router.get("/:id", validateGetGroup, getGroup);

// @desc    Update a group data
// @route   PUT /api/v?/groups/:id
// @access  Private
router.put("/:id", validateUpdateGroup, updateGroup);

// @desc    Delete a group data
// @route   PUT /api/v?/groups/:id
// @access  Private
router.delete("/:id", validateDeleteGroup, deleteGroup);
