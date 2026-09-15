import mongoose, { Schema } from "mongoose";

interface iTeacher {
  name: string;
  age: number;
  email: string;
  phone: number;
  avatar?: string;
}

const teacherSchema = new Schema<iTeacher>({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, trim: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  avatar: { type: String },
});

export const Teacher = mongoose.model<iTeacher>("Teacher", teacherSchema);
