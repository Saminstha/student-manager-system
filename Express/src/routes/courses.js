"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../auth/authenticate");
const courseSchema_1 = require("../validation/courseSchema");
const router = (0, express_1.Router)();
// Every route below requires a logged-in user.
router.use(authenticate_1.authenticate);
// GET all courses
router.get("/", courseController_1.listCourses);
// GET course by ID
router.get("/:id", (0, validate_1.validate)({ params: courseSchema_1.courseIdSchema }), courseController_1.getCourseById);
// CREATE course
router.post("/", (0, validate_1.validate)({ body: courseSchema_1.createCourseSchema }), courseController_1.createCourse);
// PUT course
router.put("/:id", (0, validate_1.validate)({ params: courseSchema_1.courseIdSchema, body: courseSchema_1.createCourseSchema }), courseController_1.updateCourse);
// PATCH course
router.patch("/:id", (0, validate_1.validate)({ params: courseSchema_1.courseIdSchema, body: courseSchema_1.patchCourseSchema }), courseController_1.patchCourse);
// DELETE course
router.delete("/:id", (0, validate_1.validate)({
    params: courseSchema_1.courseIdSchema,
}), courseController_1.deleteCourse);
exports.default = router;
