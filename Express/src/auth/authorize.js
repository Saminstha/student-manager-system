"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = authorizeRoles;
exports.requirePermission = requirePermission;
const httpError_1 = require("../types/httpError");
// authenticate() must run before either of these — both read req.user,
// which only exists once a valid access token has already been checked.
// See Docs on authentication vs authorization: authentication answers
// "who is this", authorization answers "what are they allowed to do".
// Restrict a route to specific role names, e.g. authorizeRoles("admin").
function authorizeRoles(...allowedRoles) {
    return (req, _res, next) => {
        const roles = req.user?.roles ?? [];
        const hasRole = allowedRoles.some((role) => roles.includes(role));
        if (!hasRole) {
            throw new httpError_1.Forbidden("You don't have permission to do this");
        }
        next();
    };
}
// Restrict a route to specific permission strings, e.g.
// requirePermission("student:delete"). Passing more than one means "any
// of these is enough".
function requirePermission(...anyOf) {
    return (req, _res, next) => {
        const permissions = req.user?.permissions ?? [];
        const allowed = anyOf.some((permission) => permissions.includes(permission));
        if (!allowed) {
            throw new httpError_1.Forbidden("You don't have permission to do this");
        }
        next();
    };
}
