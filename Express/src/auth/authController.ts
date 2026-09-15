import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/users";
import type { Role } from "../models/roles";
import { Unauthorized } from "../types/httpError";
import type { LoginInput } from "./authSchemas";
import { resolveClaims } from "./authService";
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
  setRefreshTokenCookie,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "./tokens";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as LoginInput;

  const user = await User.findOne({ username })
    .select("+password")
    .populate<{ role: InstanceType<typeof Role>[] }>("role");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized("Invalid credentials");
  }

  setRefreshTokenCookie(res, signRefreshToken(user.id, user.tokenVersion));

  res.json({ token: signAccessToken(user.id, resolveClaims(user.role)) });
}

export async function refreshAccessToken(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE];

  if (!token) {
    throw new Unauthorized("Missing refresh token");
  }

  const payload = verifyToken(token);

  if (payload.type !== "refresh") {
    throw new Unauthorized("Invalid refresh token");
  }

  const user = await User.findById(payload.id).populate<{ role: InstanceType<typeof Role>[] }>(
    "role"
  );

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new Unauthorized("Session expired, please log in again");
  }

  res.json({ token: signAccessToken(user.id, resolveClaims(user.role)) });
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id);

  if (user) {
    // Invalidates every refresh token issued before this point (see
    // auth/tokens.ts) — otherwise a stolen refresh token would still work
    // after "logout".
    user.tokenVersion += 1;
    await user.save();
  }

  clearRefreshTokenCookie(res);
  res.status(204).send();
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user?.id).populate("role");

  if (!user) {
    throw new Unauthorized("User not found");
  }

  res.json(user);
}
