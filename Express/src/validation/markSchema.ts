import { z } from "zod";

export const createMarkSchema = z.object({
  student: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid student ID"),

  course: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid course ID"),

  marks: z
    .number()
    .min(0, "Marks cannot be less than 0")
    .max(100, "Marks cannot be greater than 100"),
});

export const patchMarkSchema = createMarkSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
  });

export const markIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid mark ID"),
});

export type CreateMarkInput = z.infer<typeof createMarkSchema>;

export type PatchMarkInput = z.infer<typeof patchMarkSchema>;
