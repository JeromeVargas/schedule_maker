"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SchoolSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "must provide name for the task"],
        unique: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
const SchoolModel = (0, mongoose_1.model)("school", SchoolSchema);
exports.default = SchoolModel;
