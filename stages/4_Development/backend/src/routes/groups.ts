import { Router } from "express";
import {
  validateCreateGroup,
  validateGetGroups,
  validateGetGroup,
  validateDeleteGroup,
  validateUpdateGroup,
} from "../validators/groupsValidator";

import {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  deleteGroup,
} from "../controllers/groupsController";

const router = Router();

// @desc    Create a group
// @route   POST /api/v1/groups
// @access  Private
router.post("/", validateCreateGroup, createGroup);

// @desc    Get groups data
// @route   GET /api/v1/groups
// @access  Private
router.get("/", validateGetGroups, getGroups);

// @desc    Get a group data
// @route   GET /api/v1/groups/:id
// @access  Private
router.get("/:id", validateGetGroup, getGroup);

// @desc    Update a group data
// @route   PUT /api/v1/groups/:id
// @access  Private
router.put("/:id", validateUpdateGroup, updateGroup);

// @desc    Delete a group data
// @route   PUT /api/v1/groups/:id
// @access  Private
router.delete("/:id", validateDeleteGroup, deleteGroup);

export { router };
