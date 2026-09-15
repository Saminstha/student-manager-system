"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.refreshAccessToken = refreshAccessToken;
exports.logoutUser = logoutUser;
exports.getCurrentUser = getCurrentUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const users_1 = require("../models/users");
const httpError_1 = require("../types/httpError");
const authService_1 = require("./authService");
const tokens_1 = require("./tokens");
async function loginUser(req, res) {
    const { username, password } = req.body;
    const user = await users_1.User.findOne({ username })
        .select("+password")
        .populate("role");
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        throw new httpError_1.Unauthorized("Invalid credentials");
    }
    (0, tokens_1.setRefreshTokenCookie)(res, (0, tokens_1.signRefreshToken)(user.id, user.tokenVersion));
    res.json({ token: (0, tokens_1.signAccessToken)(user.id, (0, authService_1.resolveClaims)(user.role)) });
}
async function refreshAccessToken(req, res) {
    const token = req.cookies?.[tokens_1.REFRESH_TOKEN_COOKIE];
    if (!token) {
        throw new httpError_1.Unauthorized("Missing refresh token");
    }
    const payload = (0, tokens_1.verifyToken)(token);
    if (payload.type !== "refresh") {
        throw new httpError_1.Unauthorized("Invalid refresh token");
    }
    const user = await users_1.User.findById(payload.id).populate("role");
    if (!user || user.tokenVersion !== payload.tokenVersion) {
        throw new httpError_1.Unauthorized("Session expired, please log in again");
    }
    res.json({ token: (0, tokens_1.signAccessToken)(user.id, (0, authService_1.resolveClaims)(user.role)) });
}
async function logoutUser(req, res) {
    const user = await users_1.User.findById(req.user?.id);
    if (user) {
        // Invalidates every refresh token issued before this point (see
        // auth/tokens.ts) — otherwise a stolen refresh token would still work
        // after "logout".
        user.tokenVersion += 1;
        await user.save();
    }
    (0, tokens_1.clearRefreshTokenCookie)(res);
    res.status(204).send();
}
async function getCurrentUser(req, res) {
    const user = await users_1.User.findById(req.user?.id).populate("role");
    if (!user) {
        throw new httpError_1.Unauthorized("User not found");
    }
    res.json(user);
}
