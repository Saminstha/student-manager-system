import type { Request, Response } from "express";
import { Role } from "../models/roles";

// GET all roles — used by the user-edit form to populate a role picker.
export async function listRoles(req: Request, res: Response): Promise<void> {
  const roles = await Role.find();

  res.status(200).json({
    message: "Roles retrieved successfully",
    roles,
  });
}
