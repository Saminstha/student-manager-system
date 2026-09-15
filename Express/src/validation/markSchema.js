"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markIdSchema = exports.patchMarkSchema = exports.createMarkSchema = void 0;
const zod_1 = require("zod");
exports.createMarkSchema = zod_1.z.object({
    student: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID"),
    course: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),
    marks: zod_1.z
        .number()
        .min(0, "Marks cannot be less than 0")
        .max(100, "Marks cannot be greater than 100"),
});
exports.patchMarkSchema = exports.createMarkSchema
    .partial()
    .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
});
exports.markIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid mark ID"),
});
