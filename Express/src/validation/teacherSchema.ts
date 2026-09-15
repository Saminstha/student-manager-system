import { z } from "zod";

export const createTeacherSchema = z.object({
  name: z.string().trim().min(2).max(80),

  // coerce — see the same comment in validation/studentSchema.ts
  age: z.coerce.number().int().min(1).max(100),

  email: z.email(),

  phone: z.coerce.number(),
});

export const patchTeacherSchema = createTeacherSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
  });

export const teacherIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid teacher ID"),
});

export type CreateTeacherInput = z.infer<typeof createTeacherSchema>;

export type PatchTeacherInput = z.infer<typeof patchTeacherSchema>;
