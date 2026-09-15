import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

export const createCourseSchema = z.object({
  name: z.string().trim(),

  code: z.string().trim(),

  teacher: objectIdSchema,

  students: z.array(objectIdSchema).default([]),
});

export const patchCourseSchema = createCourseSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
  });

export const courseIdSchema = z.object({
  id: objectIdSchema,
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

export type PatchCourseInput = z.infer<typeof patchCourseSchema>;
