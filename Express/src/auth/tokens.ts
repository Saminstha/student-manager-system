import jwt from "jsonwebtoken";
import type { Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE = "refreshToken";

export interface AccessTokenClaims {
  roles: string[];
  permissions: string[];
}

// The access token is what the client sends on every request (as an
// "Authorization: Bearer <token>" header). It's short-lived on purpose —
// if one leaks, the damage window is small.
export function signAccessToken(userId: string, claims: AccessTokenClaims): string {
  return jwt.sign(
    { id: userId, type: "access", roles: claims.roles, permissions: claims.permissions },
    JWT_SECRET as string,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

// The refresh token lives much longer and is only ever sent to POST
// /auth/refresh, via an httpOnly cookie the client-side JS can't read.
// tokenVersion is copied from the user at sign time, then compared
// against the user's current value on every refresh. Bumping the stored
// value (on logout) makes every refresh token signed before that moment
// stop working.
export function signRefreshToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ id: userId, type: "refresh", tokenVersion }, JWT_SECRET as string, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET as string) as {
    id: string;
    type: string;
    tokenVersion?: number;
    roles?: string[];
    permissions?: string[];
  };
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE);
}
