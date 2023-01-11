"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.router = router;
// @desc    Get school data
// @route   GET /api/
// @access  Public: later Private
router.get("/", (req, res) => {
    res.send({ data: "test" });
});
