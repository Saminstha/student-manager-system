"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseIdSchema = exports.patchCourseSchema = exports.createCourseSchema = void 0;
const zod_1 = require("zod");
const objectIdSchema = zod_1.z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");
exports.createCourseSchema = zod_1.z.object({
    name: zod_1.z.string().trim(),
    code: zod_1.z.string().trim(),
    teacher: objectIdSchema,
    students: zod_1.z.array(objectIdSchema).default([]),
});
exports.patchCourseSchema = exports.createCourseSchema
    .partial()
    .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
});
exports.courseIdSchema = zod_1.z.object({
    id: objectIdSchema,
});
