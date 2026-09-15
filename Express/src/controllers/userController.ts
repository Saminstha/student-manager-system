import { Request, Response } from "express";
import { createUser } from "../auth/authService";
import { NotFound } from "../types/httpError";
import {
  deleteUserService,
  getUserByIdService,
  getUsers,
  updateUserService,
} from "../services/userServices";
import type { CreateUserByAdminInput } from "../validation/userSchema";

// GET all users
export async function listUsers(req: Request, res: Response): Promise<void> {
  const users = await getUsers();

  res.status(200).json({
    message: "Users retrieved successfully",
    users,
  });
}

// GET user by ID
export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const user = await getUserByIdService(String(id));

  if (!user) {
    throw new NotFound("User not found");
  }

  res.status(200).json({
    message: "User retrieved successfully",
    user,
  });
}

// POST — an admin creating another user's account directly, as opposed
// to that person self-signing-up via /auth/signup. This is the one place
// a caller can choose the new user's role.
export async function createUserByAdmin(req: Request, res: Response): Promise<void> {
  const { role, ...input } = req.body as CreateUserByAdminInput;

  const user = await createUser(input, role);

  res.status(201).json({
    message: "User created successfully",
    user,
  });
}

// PATCH
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  // Only overwrite the existing avatar if a new photo was actually
  // uploaded this time — no file attached means "leave it as is".
  const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
  const data = avatar ? { ...req.body, avatar } : req.body;

  const updatedUser = await updateUserService(String(id), data);

  if (!updatedUser) {
    throw new NotFound("User not found");
  }

  res.status(200).json({
    message: "User updated successfully",
    user: updatedUser,
  });
}

// DELETE
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  const deletedUser = await deleteUserService(String(id));

  if (!deletedUser) {
    throw new NotFound("User not found");
  }

  res.status(200).json({
    message: "User deleted successfully",
    user: deletedUser,
  });
}
