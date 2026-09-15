"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    firstName: zod_1.z.string().trim().min(1, "First name is required"),
    lastName: zod_1.z.string().trim().min(1, "Last name is required"),
    username: zod_1.z
        .string()
        .trim()
        .min(3, "At least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),
    email: zod_1.z.email("Enter a valid email address"),
    password: zod_1.z.string().min(8, "At least 8 characters"),
});
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().trim().min(1, "Username is required"),
    password: zod_1.z.string().min(1, "Password is required"),
});
