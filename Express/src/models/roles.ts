import mongoose, { Schema } from "mongoose";

// A Role bundles a set of permission strings (e.g. "student:create",
// "user:delete") under a name. A User can hold one or more Roles, and
// authorization checks compare a request's required permission against
// the union of permissions across all of a user's Roles.
interface iRole {
  name: string;
  permissions: string[];
}

const roleSchema = new Schema<iRole>({
  name: { type: String, required: true, trim: true, unique: true },
  permissions: [{ type: String, required: true }],
});

export const Role = mongoose.model<iRole>("Role", roleSchema);
