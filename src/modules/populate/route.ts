import { Router } from "express";
import populate from "./populate";

const router = Router();

// continue here --> move to a end point
// @desc    Populate the database in development
// @route   POST /api/v1/populate
// @access  Private
router.post("/:index", ({ params }, res) => {
  populate(+params.index);
  res.json({ msg: "Database Populated" });
});

export { router };
