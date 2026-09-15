import mongoose, { Schema } from "mongoose";

interface iMark {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  marks: number;
}

const markSchema = new Schema<iMark>({
  student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  marks: { type: Number, required: true, min: 0, max: 100 },
});

export const Mark = mongoose.model<iMark>("Mark", markSchema);
