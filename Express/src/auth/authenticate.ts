import type { NextFunction, Request, Response } from "express";
import { Unauthorized } from "../types/httpError";
import { verifyToken } from "./tokens";

// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded identity to req.user for downstream middleware/handlers.
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    throw new Unauthorized("Missing or invalid Authorization header");
  }

  const token = header.slice("Bearer ".length);
  const payload = verifyToken(token);

  if (payload.type !== "access") {
    throw new Unauthorized("Invalid access token");
  }

  req.user = {
    id: payload.id,
    roles: payload.roles ?? [],
    permissions: payload.permissions ?? [],
  };

  next();
}
