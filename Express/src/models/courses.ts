import mongoose, { Schema } from "mongoose";

interface iCourse {
  name: string;
  code: string;
  teacher: mongoose.Types.ObjectId;
  students: mongoose.Types.ObjectId[];
}

const courseSchema = new Schema<iCourse>({
  name: { type: String, required: true, trim: true },
  code: { type: String, required: true, unique: true, trim: true },
  teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
});

export const Course = mongoose.model<iCourse>("Course", courseSchema);
