"use strict";
// Creates the two roles the auth system expects to exist:
//   - "user"  — the default role every self-signup gets (no elevated
//               permissions yet, since students/teachers/courses/marks
//               aren't locked down behind permissions right now).
//   - "admin" — every permission, ready for whenever those routes do
//               get protected.
//
// Run once against your database: npm run seed:roles
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const roles_1 = require("../src/models/roles");
const RESOURCES = ["student", "teacher", "course", "mark", "user"];
const ACTIONS = ["read", "create", "update", "delete"];
const ALL_PERMISSIONS = RESOURCES.flatMap((resource) => ACTIONS.map((action) => `${resource}:${action}`));
const ROLES = [
    { name: "user", permissions: [] },
    { name: "admin", permissions: ALL_PERMISSIONS },
];
async function seedRoles() {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
        console.error("MONGO_URI is not defined in the environment variables");
        process.exit(1);
    }
    await mongoose_1.default.connect(mongoURI);
    for (const role of ROLES) {
        const result = await roles_1.Role.findOneAndUpdate({ name: role.name }, { $set: { permissions: role.permissions } }, { upsert: true, new: true });
        console.log(`Seeded role "${result.name}" with ${result.permissions.length} permission(s)`);
    }
    await mongoose_1.default.disconnect();
}
seedRoles().catch((err) => {
    console.error("Failed to seed roles:", err);
    process.exit(1);
});
