"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.resolveClaims = resolveClaims;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const roles_1 = require("../models/roles");
const users_1 = require("../models/users");
const SALT_ROUNDS = 10;
// Everyone who self-signs-up via POST /auth/signup gets this role. It's
// deliberately named "user" rather than "student" — a school Student
// record and a login account are unrelated concepts in this app, so
// reusing that name here would be confusing.
const DEFAULT_ROLE_NAME = "user";
async function createUser(input, roleName = DEFAULT_ROLE_NAME, avatar) {
    const password = await bcryptjs_1.default.hash(input.password, SALT_ROUNDS);
    const role = await roles_1.Role.findOne({ name: roleName });
    if (!role) {
        throw new Error(`No "${roleName}" role found. Run "npm run seed:roles" first.`);
    }
    return users_1.User.create({ ...input, password, role: [role.id], avatar });
}
// Flattens a user's roles into the roles/permissions pair that gets
// embedded in their access token.
function resolveClaims(roles) {
    return {
        roles: roles.map((role) => role.name),
        permissions: [...new Set(roles.flatMap((role) => role.permissions))],
    };
}
