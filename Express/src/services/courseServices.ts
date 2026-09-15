import { Course } from "../models/courses";

// GET all courses
export async function getCourses() {
  return await Course.find()
    .populate("teacher", "name email")
    .populate("students", "name email");
}

// GET course by ID
export async function getCourseByIdService(id: string) {
  return await Course.findById(id)
    .populate("teacher", "name email")
    .populate("students", "name email");
}

// CREATE course
export async function createCourseService(data: any) {
  const course = await Course.create(data);
  return course.populate([
    { path: "teacher", select: "name email" },
    { path: "students", select: "name email" },
  ]);
}

// PUT course
export async function updateCourseService(id: string, data: any) {
  return await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("teacher", "name email")
    .populate("students", "name email");
}

// PATCH course
export async function patchCourseService(id: string, data: any) {
  return await Course.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  })
    .populate("teacher", "name email")
    .populate("students", "name email");
}

// DELETE course
export async function deleteCourseService(id: string) {
  return await Course.findByIdAndDelete(id);
}
