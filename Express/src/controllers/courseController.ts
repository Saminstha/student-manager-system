import { Request, Response, NextFunction } from "express";

import {
  getCourses,
  getCourseByIdService,
  createCourseService,
  updateCourseService,
  patchCourseService,
  deleteCourseService,
} from "../services/courseServices";

import { NotFound } from "../types/httpError";

// GET all courses
export async function listCourses(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const courses = await getCourses();

  res.status(200).json({
    message: "Courses retrieved successfully",
    courses,
  });
}

// GET course by ID
export async function getCourseById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const course = await getCourseByIdService(String(id));

  if (!course) {
    throw new NotFound("Course not found");
  }

  res.status(200).json({
    message: "Course retrieved successfully",
    course,
  });
}

// POST course
export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const newCourse = await createCourseService(req.body);

  res.status(201).json({
    message: "Course created successfully",
    course: newCourse,
  });
}

// PUT course
export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const updatedCourse = await updateCourseService(String(id), req.body);

  if (!updatedCourse) {
    throw new NotFound("Course not found");
  }

  res.status(200).json({
    message: "Course updated successfully",
    course: updatedCourse,
  });
}

// PATCH course
export async function patchCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const updatedCourse = await patchCourseService(String(id), req.body);

  if (!updatedCourse) {
    throw new NotFound("Course not found");
  }

  res.status(200).json({
    message: "Course updated successfully",
    course: updatedCourse,
  });
}

// DELETE course
export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const deletedCourse = await deleteCourseService(String(id));

  if (!deletedCourse) {
    throw new NotFound("Course not found");
  }

  res.status(200).json({
    message: "Course deleted successfully",
    course: deletedCourse,
  });
}
