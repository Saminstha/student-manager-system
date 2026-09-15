import { Request, Response, NextFunction } from "express";

import {
  getTeachers,
  getTeacherByIdService,
  createTeacherService,
  updateTeacherService,
  patchTeacherService,
  deleteTeacherService,
} from "../services/teacherServices";

import { NotFound } from "../types/httpError";

// GET all teachers
export async function listTeachers(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const teachers = await getTeachers();

  res.status(200).json({
    message: "Teachers retrieved successfully",
    teachers,
  });
}

// GET teacher by ID
export async function getTeacherById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const teacher = await getTeacherByIdService(String(id));

  if (!teacher) {
    throw new NotFound("Teacher not found");
  }

  res.status(200).json({
    message: "Teacher retrieved successfully",
    teacher,
  });
}

// POST teacher
export async function createTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

  const newTeacher = await createTeacherService({ ...req.body, avatar });

  res.status(201).json({
    message: "Teacher created successfully",
    teacher: newTeacher,
  });
}

// PUT teacher
export async function updateTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  // Only overwrite the existing avatar if a new photo was actually
  // uploaded this time — no file attached means "leave it as is".
  const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
  const data = avatar ? { ...req.body, avatar } : req.body;

  const updatedTeacher = await updateTeacherService(String(id), data);

  if (!updatedTeacher) {
    throw new NotFound("Teacher not found");
  }

  res.status(200).json({
    message: "Teacher updated successfully",
    teacher: updatedTeacher,
  });
}

// PATCH teacher
export async function patchTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const updatedTeacher = await patchTeacherService(String(id), req.body);

  if (!updatedTeacher) {
    throw new NotFound("Teacher not found");
  }

  res.status(200).json({
    message: "Teacher updated successfully",
    teacher: updatedTeacher,
  });
}

// DELETE teacher
export async function deleteTeacher(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const deletedTeacher = await deleteTeacherService(String(id));

  if (!deletedTeacher) {
    throw new NotFound("Teacher not found");
  }

  res.status(200).json({
    message: "Teacher deleted successfully",
    teacher: deletedTeacher,
  });
}
