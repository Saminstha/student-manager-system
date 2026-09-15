"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teacherIdSchema = exports.patchTeacherSchema = exports.createTeacherSchema = void 0;
const zod_1 = require("zod");
exports.createTeacherSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80),
    // coerce — see the same comment in validation/studentSchema.ts
    age: zod_1.z.coerce.number().int().min(1).max(100),
    email: zod_1.z.email(),
    phone: zod_1.z.coerce.number(),
});
exports.patchTeacherSchema = exports.createTeacherSchema
    .partial()
    .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
});
exports.teacherIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid teacher ID"),
});
