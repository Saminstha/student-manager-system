"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listStudents = listStudents;
exports.getStudentById = getStudentById;
exports.createStudent = createStudent;
exports.updateStudent = updateStudent;
exports.patchStudent = patchStudent;
exports.deleteStudent = deleteStudent;
const studentServices_1 = require("../services/studentServices");
const httpError_1 = require("../types/httpError");
// GET all students
async function listStudents(req, res, next) {
    const students = await (0, studentServices_1.getStudents)();
    res.status(200).json({
        message: "Students retrieved successfully",
        students,
    });
}
// GET student by ID
async function getStudentById(req, res, next) {
    const { id } = req.params;
    const student = await (0, studentServices_1.getStudentByIdService)(String(id));
    if (!student) {
        throw new httpError_1.NotFound("Student not found");
    }
    res.status(200).json({
        message: "Student retrieved successfully",
        student,
    });
}
// POST
async function createStudent(req, res, next) {
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const newStudent = await (0, studentServices_1.createStudentService)({ ...req.body, avatar });
    res.status(201).json({
        message: "Student created successfully",
        student: newStudent,
    });
}
// PUT
async function updateStudent(req, res, next) {
    const { id } = req.params;
    // Only overwrite the existing avatar if a new photo was actually
    // uploaded this time — no file attached means "leave it as is".
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = avatar ? { ...req.body, avatar } : req.body;
    const updatedStudent = await (0, studentServices_1.updateStudentService)(String(id), data);
    if (!updatedStudent) {
        throw new httpError_1.NotFound("Student not found");
    }
    res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent,
    });
}
// PATCH
async function patchStudent(req, res, next) {
    const { id } = req.params;
    const updatedStudent = await (0, studentServices_1.patchStudentService)(String(id), req.body);
    if (!updatedStudent) {
        throw new httpError_1.NotFound("Student not found");
    }
    res.status(200).json({
        message: "Student updated successfully",
        student: updatedStudent,
    });
}
// DELETE
async function deleteStudent(req, res, next) {
    const { id } = req.params;
    const deletedStudent = await (0, studentServices_1.deleteStudentService)(String(id));
    if (!deletedStudent) {
        throw new httpError_1.NotFound("Student not found");
    }
    res.status(200).json({
        message: "Student deleted successfully",
        student: deletedStudent,
    });
}
