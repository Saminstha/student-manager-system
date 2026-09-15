import { Mark } from "../models/marks";

// GET all marks
export async function getMarks() {
  return await Mark.find();
}

// GET mark by ID
export async function getMarkByIdService(id: string) {
  return await Mark.findById(id);
}

// CREATE mark
export async function createMarkService(data: any) {
  return await Mark.create(data);
}

// PUT
export async function updateMarkService(id: string, data: any) {
  return await Mark.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// PATCH
export async function patchMarkService(id: string, data: any) {
  return await Mark.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
}

// DELETE
export async function deleteMarkService(id: string) {
  return await Mark.findByIdAndDelete(id);
}
