import { Router } from "express";

import { getSchool } from "../controllers/schoolController";

const router = Router();

// @desc    Get school data
// @route   GET /api/
// @access  Private
router.get("/", getSchool);

export { router };
