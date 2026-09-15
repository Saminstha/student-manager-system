import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),

  lastName: z.string().trim().min(1, "Last name is required"),

  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),

  email: z.email("Enter a valid email address"),

  password: z.string().min(8, "At least 8 characters"),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required"),

  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export type LoginInput = z.infer<typeof loginSchema>;
