import { Router } from "express";
import { flush, populate } from "./populate";

export const router = Router();

// @desc    Populate the database in development
// @route   POST /api/v?/populate/:index
// @access  Public / Development
router.post("/:index", ({ params }, res) => {
  populate(+params.index);
  res.json({ msg: "Database Populated" });
});

// @desc    flush the database in development
// @route   POST /api/v?/delete
// @access  Public / Development
router.delete("/", (_, res) => {
  flush();
  res.json({ msg: "Database flushed" });
});
