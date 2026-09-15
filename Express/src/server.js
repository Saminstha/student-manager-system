"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const students_1 = __importDefault(require("./routes/students"));
const teachers_1 = __importDefault(require("./routes/teachers"));
const courses_1 = __importDefault(require("./routes/courses"));
const marks_1 = __importDefault(require("./routes/marks"));
const users_1 = __importDefault(require("./routes/users"));
const roles_1 = __importDefault(require("./routes/roles"));
const authRoutes_1 = __importDefault(require("./auth/authRoutes"));
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const mongoose_1 = require("./config/mongoose");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:8000",
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(requestLogger_1.requestLogger);
app.use("/uploads", express_1.default.static("uploads"));
// app.get('/', (req, res) => {
//     res.json({message:'Hello World'});
// });
app.use("/students", students_1.default);
app.use("/teachers", teachers_1.default);
app.use("/courses", courses_1.default);
app.use("/marks", marks_1.default);
app.use("/users", users_1.default);
app.use("/roles", roles_1.default);
app.use("/auth", authRoutes_1.default);
// app.get("/test", (req, res) => {
//   res.json({ message: "Server is working" });
// });
app.use(errorHandler_1.errorHandler);
async function startServer() {
    await (0, mongoose_1.connectDB)();
    app.listen(PORT, () => {
        console.log("Server is running on port http://localhost:3000");
    });
}
startServer();
