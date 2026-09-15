import { Role } from "../models/roles";
import { User } from "../models/users";
import { BadRequest } from "../types/httpError";
import type { UpdateUserInput } from "../validation/userSchema";

export function getUsers() {
  return User.find().populate("role");
}

export function getUserByIdService(id: string) {
  return User.findById(id).populate("role");
}

export async function updateUserService(
  id: string,
  changes: UpdateUserInput & { avatar?: string },
) {
  const { role: roleNames, ...rest } = changes;
  const update: Record<string, unknown> = { ...rest };

  if (roleNames) {
    const roles = await Role.find({ name: { $in: roleNames } });

    if (roles.length !== roleNames.length) {
      throw new BadRequest("One or more roles were not found");
    }

    update.role = roles.map((role) => role.id);
  }

  return User.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  }).populate("role");
}

export function deleteUserService(id: string) {
  return User.findByIdAndDelete(id);
}
