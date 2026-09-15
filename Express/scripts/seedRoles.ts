// Creates the two roles the auth system expects to exist:
//   - "user"  — the default role every self-signup gets (no elevated
//               permissions yet, since students/teachers/courses/marks
//               aren't locked down behind permissions right now).
//   - "admin" — every permission, ready for whenever those routes do
//               get protected.
//
// Run once against your database: npm run seed:roles

import "dotenv/config";
import mongoose from "mongoose";
import { Role } from "../src/models/roles";

const RESOURCES = ["student", "teacher", "course", "mark", "user"] as const;
const ACTIONS = ["read", "create", "update", "delete"] as const;

const ALL_PERMISSIONS = RESOURCES.flatMap((resource) =>
  ACTIONS.map((action) => `${resource}:${action}`),
);

const ROLES = [
  { name: "user", permissions: [] },
  { name: "admin", permissions: ALL_PERMISSIONS },
];

async function seedRoles(): Promise<void> {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    console.error("MONGO_URI is not defined in the environment variables");
    process.exit(1);
  }

  await mongoose.connect(mongoURI);

  for (const role of ROLES) {
    const result = await Role.findOneAndUpdate(
      { name: role.name },
      { $set: { permissions: role.permissions } },
      { upsert: true, new: true },
    );

    console.log(`Seeded role "${result.name}" with ${result.permissions.length} permission(s)`);
  }

  await mongoose.disconnect();
}

seedRoles().catch((err) => {
  console.error("Failed to seed roles:", err);
  process.exit(1);
});
