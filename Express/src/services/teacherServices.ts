import { Teacher } from "../models/teachers";

// GET all teachers
export async function getTeachers() {
  return await Teacher.find();
}

// GET teacher by ID
export async function getTeacherByIdService(id: string) {
  return await Teacher.findById(id);
}

// CREATE teacher
export async function createTeacherService(data: any) {
  return await Teacher.create(data);
}

// PUT teacher
export async function updateTeacherService(id: string, data: any) {
  return await Teacher.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// PATCH teacher
export async function patchTeacherService(id: string, data: any) {
  return await Teacher.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// DELETE teacher
export async function deleteTeacherService(id: string) {
  return await Teacher.findByIdAndDelete(id);
}
