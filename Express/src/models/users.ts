import mongoose, { Schema } from "mongoose";

// Note: this is a login account, unrelated to the Student records
// elsewhere in this app (a school student and a system user are two
// different concepts here — a teacher, an admin, or a student could all
// have a User account).
interface iUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  tokenVersion: number;
  role: mongoose.Types.ObjectId[];
  avatar?: string;
}

const userSchema = new Schema<iUser>({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  username: { type: String, required: true, trim: true, unique: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  // select: false keeps the hash out of every query result by default;
  // login explicitly opts back in with .select("+password").
  password: { type: String, required: true, select: false },
  // Bumped on logout (or a future password change) to invalidate every
  // refresh token that was signed before that point — see auth/tokens.ts.
  tokenVersion: { type: Number, default: 0 },
  role: [{ type: Schema.Types.ObjectId, ref: "Role" }],
  avatar: { type: String },
});

export const User = mongoose.model<iUser>("User", userSchema);
