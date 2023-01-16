"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.server = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const routes_1 = require("./routes");
exports.server = (0, express_1.default)();
const connect_1 = __importDefault(require("./config/connect"));
exports.server.use((0, cors_1.default)());
exports.server.use(express_1.default.json());
exports.server.use(routes_1.router);
const PORT = process.env.PORT || 3001;
exports.server.use(error_handler_1.default);
if (process.env.NODE_ENV !== "test") {
    (0, connect_1.default)().then(() => console.log("Database connection established"));
}
const createConnection = () => {
    if (process.env.NODE_ENV === "test") {
        return exports.server.listen(process.env.PORT_TEST);
    }
    else {
        return exports.server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
    }
};
exports.connection = createConnection();
