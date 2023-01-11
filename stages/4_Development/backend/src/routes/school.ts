import { Request, Response, Router } from "express";

const router = Router();

// @desc    Get school data
// @route   GET /api/
// @access  Public: later Private

router.get("/", (req: Request, res: Response) => {
  res.send({ data: "test" });
});

export { router };
