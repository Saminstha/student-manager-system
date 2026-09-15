"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserByAdminSchema = exports.userIdSchema = void 0;
const zod_1 = require("zod");
exports.userIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});
exports.createUserByAdminSchema = zod_1.z.object({
    firstName: zod_1.z.string().trim().min(1, "First name is required"),
    lastName: zod_1.z.string().trim().min(1, "Last name is required"),
    username: zod_1.z
        .string()
        .trim()
        .min(3, "At least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),
    email: zod_1.z.email("Enter a valid email address"),
    password: zod_1.z.string().min(8, "At least 8 characters"),
    role: zod_1.z.string().trim().min(1, "Role is required").optional(),
});
exports.updateUserSchema = zod_1.z
    .object({
    firstName: zod_1.z.string().trim().min(1),
    lastName: zod_1.z.string().trim().min(1),
    email: zod_1.z.email("Enter a valid email address"),
    role: zod_1.z.array(zod_1.z.string().trim().min(1)).min(1),
})
    .partial()
    .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
});
