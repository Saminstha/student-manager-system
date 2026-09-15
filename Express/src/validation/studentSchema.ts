import { z } from "zod";

export const createStudentSchema = z.object({
  name: z.string().trim().min(2).max(80),

  // coerce, not plain number — when this comes from a multipart form
  // (photo upload alongside the other fields), every field arrives as a
  // string. z.coerce still accepts a real number fine, so this doesn't
  // break JSON-only callers either.
  age: z.coerce.number().int().min(1).max(100),

  email: z.email(),

  phone: z.coerce.number(),
  
  courses: z.array(
        z.string().regex(
            /^[0-9a-fA-F]{24}$/,
            "Invalid course ID"
        )
    ).optional(),
});

export const patchStudentSchema = createStudentSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
  });

export const studentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export type PatchStudentInput = z.infer<typeof patchStudentSchema>;
