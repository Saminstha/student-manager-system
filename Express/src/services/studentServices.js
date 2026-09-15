"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudents = getStudents;
exports.getStudentByIdService = getStudentByIdService;
exports.createStudentService = createStudentService;
exports.updateStudentService = updateStudentService;
exports.patchStudentService = patchStudentService;
exports.deleteStudentService = deleteStudentService;
const students_1 = require("../models/students");
// GET all students
async function getStudents() {
    return await students_1.Student.find().populate("courses", "name code");
}
// GET student by ID
async function getStudentByIdService(id) {
    return await students_1.Student.findById(id).populate("courses", "name code");
}
// CREATE student
async function createStudentService(data) {
    const student = await students_1.Student.create(data);
    return student.populate("courses", "name code");
}
// PUT
async function updateStudentService(id, data) {
    return await students_1.Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("courses", "name code");
}
// PATCH
async function patchStudentService(id, data) {
    return await students_1.Student.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    }).populate("courses", "name code");
}
// DELETE student
async function deleteStudentService(id) {
    return await students_1.Student.findByIdAndDelete(id);
}
// Sets the photo path saved by the multer upload — see
// controllers/studentPhoto.ts
