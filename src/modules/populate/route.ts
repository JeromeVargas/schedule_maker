import { Router } from "express";
import populate from "./populate";

const router = Router();

// @desc    Populate the database in development
// @route   POST /api/v1/populate
// @access  Private
router.post("/:index", ({ params }, res) => {
  populate(+params.index);
  res.json({ msg: "Database Populated" });
});

export { router };
