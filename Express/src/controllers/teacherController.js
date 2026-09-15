"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listTeachers = listTeachers;
exports.getTeacherById = getTeacherById;
exports.createTeacher = createTeacher;
exports.updateTeacher = updateTeacher;
exports.patchTeacher = patchTeacher;
exports.deleteTeacher = deleteTeacher;
const teacherServices_1 = require("../services/teacherServices");
const httpError_1 = require("../types/httpError");
// GET all teachers
async function listTeachers(req, res, next) {
    const teachers = await (0, teacherServices_1.getTeachers)();
    res.status(200).json({
        message: "Teachers retrieved successfully",
        teachers,
    });
}
// GET teacher by ID
async function getTeacherById(req, res, next) {
    const { id } = req.params;
    const teacher = await (0, teacherServices_1.getTeacherByIdService)(String(id));
    if (!teacher) {
        throw new httpError_1.NotFound("Teacher not found");
    }
    res.status(200).json({
        message: "Teacher retrieved successfully",
        teacher,
    });
}
// POST teacher
async function createTeacher(req, res, next) {
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const newTeacher = await (0, teacherServices_1.createTeacherService)({ ...req.body, avatar });
    res.status(201).json({
        message: "Teacher created successfully",
        teacher: newTeacher,
    });
}
// PUT teacher
async function updateTeacher(req, res, next) {
    const { id } = req.params;
    // Only overwrite the existing avatar if a new photo was actually
    // uploaded this time — no file attached means "leave it as is".
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = avatar ? { ...req.body, avatar } : req.body;
    const updatedTeacher = await (0, teacherServices_1.updateTeacherService)(String(id), data);
    if (!updatedTeacher) {
        throw new httpError_1.NotFound("Teacher not found");
    }
    res.status(200).json({
        message: "Teacher updated successfully",
        teacher: updatedTeacher,
    });
}
// PATCH teacher
async function patchTeacher(req, res, next) {
    const { id } = req.params;
    const updatedTeacher = await (0, teacherServices_1.patchTeacherService)(String(id), req.body);
    if (!updatedTeacher) {
        throw new httpError_1.NotFound("Teacher not found");
    }
    res.status(200).json({
        message: "Teacher updated successfully",
        teacher: updatedTeacher,
    });
}
// DELETE teacher
async function deleteTeacher(req, res, next) {
    const { id } = req.params;
    const deletedTeacher = await (0, teacherServices_1.deleteTeacherService)(String(id));
    if (!deletedTeacher) {
        throw new httpError_1.NotFound("Teacher not found");
    }
    res.status(200).json({
        message: "Teacher deleted successfully",
        teacher: deletedTeacher,
    });
}
