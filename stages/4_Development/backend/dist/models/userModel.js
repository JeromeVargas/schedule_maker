"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, "Please provide a first name for the user"],
    },
    lastName: {
        type: String,
        required: [true, "Please provide a last name for the user"],
    },
    school: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "School",
        required: [true, "Please provide a school name"],
    },
    email: {
        type: String,
        required: [true, "Please provide an email for the user"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password for the user"],
    },
    role: {
        type: String,
        enum: ["headmaster", "coordinator", "teacher"],
        required: [true, "Please provide a role for the user"],
    },
    status: {
        type: String,
        enum: ["active", "inactive", "suspended"],
        required: [true, "Please provide a status for the user"],
    },
}, {
    timestamps: true,
    versionKey: false,
});
const UserModel = (0, mongoose_1.model)("user", UserSchema);
exports.default = UserModel;
