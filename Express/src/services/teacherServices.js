"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeachers = getTeachers;
exports.getTeacherByIdService = getTeacherByIdService;
exports.createTeacherService = createTeacherService;
exports.updateTeacherService = updateTeacherService;
exports.patchTeacherService = patchTeacherService;
exports.deleteTeacherService = deleteTeacherService;
const teachers_1 = require("../models/teachers");
// GET all teachers
async function getTeachers() {
    return await teachers_1.Teacher.find();
}
// GET teacher by ID
async function getTeacherByIdService(id) {
    return await teachers_1.Teacher.findById(id);
}
// CREATE teacher
async function createTeacherService(data) {
    return await teachers_1.Teacher.create(data);
}
// PUT teacher
async function updateTeacherService(id, data) {
    return await teachers_1.Teacher.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}
// PATCH teacher
async function patchTeacherService(id, data) {
    return await teachers_1.Teacher.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}
// DELETE teacher
async function deleteTeacherService(id) {
    return await teachers_1.Teacher.findByIdAndDelete(id);
}
