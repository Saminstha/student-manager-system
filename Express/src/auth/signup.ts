import type { Request, Response } from "express";
import { createUser } from "./authService";

export async function signupUser(req: Request, res: Response): Promise<void> {
  const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

  const user = await createUser(req.body, undefined, avatar);

  res.status(201).json(user);
}
