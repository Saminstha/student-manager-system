import mongoose, { Schema } from "mongoose";

interface iStudent {
  name: string;
  age: number;
  email: string;
  phone: number;
  courses: mongoose.Types.ObjectId[];
  avatar?: string;
}

const studentSchema = new Schema<iStudent>({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, trim: true, unique: true },
  phone: { type: Number, required: true, unique: true },
  courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  avatar: { type: String },
});

export const Student = mongoose.model<iStudent>("Student", studentSchema);
