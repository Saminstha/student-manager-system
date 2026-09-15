import bcrypt from "bcryptjs";
import { Role } from "../models/roles";
import { User } from "../models/users";
import type { SignupInput } from "./authSchemas";
import type { AccessTokenClaims } from "./tokens";

const SALT_ROUNDS = 10;

// Everyone who self-signs-up via POST /auth/signup gets this role. It's
// deliberately named "user" rather than "student" — a school Student
// record and a login account are unrelated concepts in this app, so
// reusing that name here would be confusing.
const DEFAULT_ROLE_NAME = "user";

export async function createUser(
  input: SignupInput,
  roleName = DEFAULT_ROLE_NAME,
  avatar?: string,
) {
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);

  const role = await Role.findOne({ name: roleName });

  if (!role) {
    throw new Error(`No "${roleName}" role found. Run "npm run seed:roles" first.`);
  }

  return User.create({ ...input, password, role: [role.id], avatar });
}

// Flattens a user's roles into the roles/permissions pair that gets
// embedded in their access token.
export function resolveClaims(roles: { name: string; permissions: string[] }[]): AccessTokenClaims {
  return {
    roles: roles.map((role) => role.name),
    permissions: [...new Set(roles.flatMap((role) => role.permissions))],
  };
}
