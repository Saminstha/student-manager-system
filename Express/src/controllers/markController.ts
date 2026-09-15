import { Request, Response, NextFunction } from "express";

import {
  getMarks,
  getMarkByIdService,
  createMarkService,
  updateMarkService,
  patchMarkService,
  deleteMarkService,
} from "../services/markServices";

import { NotFound } from "../types/httpError";

// GET all marks
export async function listMarks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const marks = await getMarks();

  res.status(200).json({
    message: "Marks retrieved successfully",
    marks,
  });
}

// GET mark by ID
export async function getMarkById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const mark = await getMarkByIdService(String(id));

  if (!mark) {
    throw new NotFound("Mark not found");
  }

  res.status(200).json({
    message: "Mark retrieved successfully",
    mark,
  });
}

// POST
export async function createMark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const newMark = await createMarkService(req.body);

  res.status(201).json({
    message: "Mark created successfully",
    mark: newMark,
  });
}

// PUT
export async function updateMark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const updatedMark = await updateMarkService(String(id), req.body);

  if (!updatedMark) {
    throw new NotFound("Mark not found");
  }

  res.status(200).json({
    message: "Mark updated successfully",
    mark: updatedMark,
  });
}

// PATCH
export async function patchMark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const updatedMark = await patchMarkService(String(id), req.body);

  if (!updatedMark) {
    throw new NotFound("Mark not found");
  }

  res.status(200).json({
    message: "Mark updated successfully",
    mark: updatedMark,
  });
}

// DELETE
export async function deleteMark(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { id } = req.params;

  const deletedMark = await deleteMarkService(String(id));

  if (!deletedMark) {
    throw new NotFound("Mark not found");
  }

  res.status(200).json({
    message: "Mark deleted successfully",
    mark: deletedMark,
  });
}
