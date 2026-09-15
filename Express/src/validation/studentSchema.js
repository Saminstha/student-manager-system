"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentIdSchema = exports.patchStudentSchema = exports.createStudentSchema = void 0;
const zod_1 = require("zod");
exports.createStudentSchema = zod_1.z.object({
    name: zod_1.z.string().trim().min(2).max(80),
    // coerce, not plain number — when this comes from a multipart form
    // (photo upload alongside the other fields), every field arrives as a
    // string. z.coerce still accepts a real number fine, so this doesn't
    // break JSON-only callers either.
    age: zod_1.z.coerce.number().int().min(1).max(100),
    email: zod_1.z.email(),
    phone: zod_1.z.coerce.number(),
    courses: zod_1.z.array(zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID")).optional(),
});
exports.patchStudentSchema = exports.createStudentSchema
    .partial()
    .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
});
exports.studentIdSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID"),
});
