"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const httpError_1 = require("../types/httpError");
const tokens_1 = require("./tokens");
// Reads "Authorization: Bearer <token>", verifies it, and attaches the
// decoded identity to req.user for downstream middleware/handlers.
function authenticate(req, _res, next) {
    const header = req.get("authorization");
    if (!header?.startsWith("Bearer ")) {
        throw new httpError_1.Unauthorized("Missing or invalid Authorization header");
    }
    const token = header.slice("Bearer ".length);
    const payload = (0, tokens_1.verifyToken)(token);
    if (payload.type !== "access") {
        throw new httpError_1.Unauthorized("Invalid access token");
    }
    req.user = {
        id: payload.id,
        roles: payload.roles ?? [],
        permissions: payload.permissions ?? [],
    };
    next();
}
