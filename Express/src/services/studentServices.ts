import { Student } from "../models/students";

// GET all students
export async function getStudents() {
  return await Student.find().populate("courses", "name code");
}

// GET student by ID
export async function getStudentByIdService(id: string) {
  return await Student.findById(id).populate("courses", "name code");
}

// CREATE student
export async function createStudentService(data: any) {
  const student = await Student.create(data);
  return student.populate("courses", "name code");
}

// PUT
export async function updateStudentService(id: string, data: any) {
  return await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("courses", "name code");
}

// PATCH
export async function patchStudentService(id: string, data: any) {
  return await Student.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("courses", "name code");
}

// DELETE student
export async function deleteStudentService(id: string) {
  return await Student.findByIdAndDelete(id);
}

// Sets the photo path saved by the multer upload — see
// controllers/studentPhoto.ts

