"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCourses = listCourses;
exports.getCourseById = getCourseById;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.patchCourse = patchCourse;
exports.deleteCourse = deleteCourse;
const courseServices_1 = require("../services/courseServices");
const httpError_1 = require("../types/httpError");
// GET all courses
async function listCourses(req, res, next) {
    const courses = await (0, courseServices_1.getCourses)();
    res.status(200).json({
        message: "Courses retrieved successfully",
        courses,
    });
}
// GET course by ID
async function getCourseById(req, res, next) {
    const { id } = req.params;
    const course = await (0, courseServices_1.getCourseByIdService)(String(id));
    if (!course) {
        throw new httpError_1.NotFound("Course not found");
    }
    res.status(200).json({
        message: "Course retrieved successfully",
        course,
    });
}
// POST course
async function createCourse(req, res, next) {
    const newCourse = await (0, courseServices_1.createCourseService)(req.body);
    res.status(201).json({
        message: "Course created successfully",
        course: newCourse,
    });
}
// PUT course
async function updateCourse(req, res, next) {
    const { id } = req.params;
    const updatedCourse = await (0, courseServices_1.updateCourseService)(String(id), req.body);
    if (!updatedCourse) {
        throw new httpError_1.NotFound("Course not found");
    }
    res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
    });
}
// PATCH course
async function patchCourse(req, res, next) {
    const { id } = req.params;
    const updatedCourse = await (0, courseServices_1.patchCourseService)(String(id), req.body);
    if (!updatedCourse) {
        throw new httpError_1.NotFound("Course not found");
    }
    res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
    });
}
// DELETE course
async function deleteCourse(req, res, next) {
    const { id } = req.params;
    const deletedCourse = await (0, courseServices_1.deleteCourseService)(String(id));
    if (!deletedCourse) {
        throw new httpError_1.NotFound("Course not found");
    }
    res.status(200).json({
        message: "Course deleted successfully",
        course: deletedCourse,
    });
}
