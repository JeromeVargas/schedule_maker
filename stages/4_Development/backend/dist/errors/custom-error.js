"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomAPIError extends Error {
    constructor(message) {
        super(message);
        this.statusCode = 400;
    }
}
exports.default = CustomAPIError;
