import { Request, Response, NextFunction } from "express";

import {
    getStudents,
    getStudentByIdService,
    createStudentService,
    updateStudentService,
    patchStudentService,
    deleteStudentService,
} from "../services/studentServices";
import { NotFound } from "../types/httpError";

// GET all students
export async function listStudents(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const students = await getStudents();

    res.status(200).json({
        message: "Students retrieved successfully",
        students,
    });
}


// GET student by ID
export async function getStudentById(req: Request, res: Response, next: NextFunction): Promise<void> {
    
    const { id } = req.params;
    const student = await getStudentByIdService(String(id));

    if (!student) {
        throw new NotFound("Student not found");

    }

    res.status(200).json({
        message: "Student retrieved successfully",
        student,
    });
}


// POST
export async function createStudent(req: Request, res: Response, next: NextFunction): Promise<void> {

    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    const newStudent = await createStudentService({ ...req.body, avatar });

    res.status(201).json({
        message: "Student created successfully",
        student: newStudent,
    });
}

// PUT
export async function updateStudent(req: Request, res: Response, next: NextFunction): Promise<void> {

    const { id } = req.params;

    // Only overwrite the existing avatar if a new photo was actually
    // uploaded this time — no file attached means "leave it as is".
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = avatar ? { ...req.body, avatar } : req.body;

    const updatedStudent = await updateStudentService(
        String(id),
        data
    );

    if (!updatedStudent) {
        throw new NotFound(
            "Student not found"
        );
    }

    res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent,
    });

}

// PATCH
export async function patchStudent( req: Request, res: Response, next: NextFunction): Promise<void> {

    const { id } = req.params;

    const updatedStudent = await patchStudentService(
        String(id),
        req.body
    );

    if (!updatedStudent) {
        throw new NotFound(
            "Student not found"
        );
    }

    res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent,
    });
}

// DELETE
export async function deleteStudent(req: Request, res: Response, next: NextFunction): Promise<void> {
   
    const { id } = req.params;

    const deletedStudent =
        await deleteStudentService(String(id));

    if (!deletedStudent) {
        throw new NotFound(
            "Student not found"
        );
    }

    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent,
    });
}
