"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCourses = getCourses;
exports.getCourseByIdService = getCourseByIdService;
exports.createCourseService = createCourseService;
exports.updateCourseService = updateCourseService;
exports.patchCourseService = patchCourseService;
exports.deleteCourseService = deleteCourseService;
const courses_1 = require("../models/courses");
// GET all courses
async function getCourses() {
    return await courses_1.Course.find()
        .populate("teacher", "name email")
        .populate("students", "name email");
}
// GET course by ID
async function getCourseByIdService(id) {
    return await courses_1.Course.findById(id)
        .populate("teacher", "name email")
        .populate("students", "name email");
}
// CREATE course
async function createCourseService(data) {
    const course = await courses_1.Course.create(data);
    return course.populate([
        { path: "teacher", select: "name email" },
        { path: "students", select: "name email" },
    ]);
}
// PUT course
async function updateCourseService(id, data) {
    return await courses_1.Course.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
        .populate("teacher", "name email")
        .populate("students", "name email");
}
// PATCH course
async function patchCourseService(id, data) {
    return await courses_1.Course.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    })
        .populate("teacher", "name email")
        .populate("students", "name email");
}
// DELETE course
async function deleteCourseService(id) {
    return await courses_1.Course.findByIdAndDelete(id);
}
