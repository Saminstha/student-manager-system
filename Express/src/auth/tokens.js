"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.REFRESH_TOKEN_COOKIE = void 0;
exports.signAccessToken = signAccessToken;
exports.signRefreshToken = signRefreshToken;
exports.verifyToken = verifyToken;
exports.setRefreshTokenCookie = setRefreshTokenCookie;
exports.clearRefreshTokenCookie = clearRefreshTokenCookie;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;
exports.REFRESH_TOKEN_COOKIE = "refreshToken";
// The access token is what the client sends on every request (as an
// "Authorization: Bearer <token>" header). It's short-lived on purpose —
// if one leaks, the damage window is small.
function signAccessToken(userId, claims) {
    return jsonwebtoken_1.default.sign({ id: userId, type: "access", roles: claims.roles, permissions: claims.permissions }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
}
// The refresh token lives much longer and is only ever sent to POST
// /auth/refresh, via an httpOnly cookie the client-side JS can't read.
// tokenVersion is copied from the user at sign time, then compared
// against the user's current value on every refresh. Bumping the stored
// value (on logout) makes every refresh token signed before that moment
// stop working.
function signRefreshToken(userId, tokenVersion) {
    return jsonwebtoken_1.default.sign({ id: userId, type: "refresh", tokenVersion }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
}
function setRefreshTokenCookie(res, token) {
    res.cookie(exports.REFRESH_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    });
}
function clearRefreshTokenCookie(res) {
    res.clearCookie(exports.REFRESH_TOKEN_COOKIE);
}
