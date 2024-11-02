import { Router } from "express";
import {
  validateCreateSession,
  validateGetSessions,
  validateGetSession,
  validateDeleteSession,
  validateUpdateSession,
} from "./sessions.validator";

import {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} from "./sessions.controller";

const router = Router();

// @desc    Create a session
// @route   POST /api/v1/sessions
// @access  Private
router.post("/", validateCreateSession, createSession);

// @desc    Get sessions data
// @route   GET /api/v1/sessions
// @access  Private
router.get("/", validateGetSessions, getSessions);

// @desc    Get a session data
// @route   GET /api/v1/sessions/:id
// @access  Private
router.get("/:id", validateGetSession, getSession);

// @desc    Update a session data
// @route   PUT /api/v1/sessions/:id
// @access  Private
router.put("/:id", validateUpdateSession, updateSession);

// @desc    Delete a session data
// @route   PUT /api/v1/sessions/:id
// @access  Private
router.delete("/:id", validateDeleteSession, deleteSession);

export { router };
