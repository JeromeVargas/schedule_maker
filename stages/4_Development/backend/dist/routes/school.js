"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const schoolValidator_1 = __importDefault(require("../validators/schoolValidator"));
const schoolController_1 = require("../controllers/schoolController");
const router = (0, express_1.Router)();
exports.router = router;
router.get("/", schoolController_1.getSchools);
router.get("/:id", schoolController_1.getSchool);
router.post("/", schoolValidator_1.default, schoolController_1.createSchool);
router.put("/:id", schoolController_1.updateSchool);
router.delete("/:id", schoolController_1.deleteSchool);
