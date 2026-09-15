import { z } from "zod";

export const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID"),
});

export const createUserByAdminSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),

  email: z.email("Enter a valid email address"),

  password: z.string().min(8, "At least 8 characters"),

  role: z.string().trim().min(1, "Role is required").optional(),
});

export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1),

    lastName: z.string().trim().min(1),

    email: z.email("Enter a valid email address"),

    role: z.array(z.string().trim().min(1)).min(1),
  })
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    message: "Nothing to update",
  });

export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>;

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
