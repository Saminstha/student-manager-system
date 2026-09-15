"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../auth/authenticate");
const upload_1 = require("../middleware/upload");
const parseJsonFields_1 = require("../middleware/parseJsonFields");
const studentSchema_1 = require("../validation/studentSchema");
const router = (0, express_1.Router)();
// Every route below requires a logged-in user.
router.use(authenticate_1.authenticate);
router.get("/", studentController_1.listStudents);
router.get("/:id", (0, validate_1.validate)({ params: studentSchema_1.studentIdSchema }), studentController_1.getStudentById);
// upload.single("photo") first so multer can parse the multipart body
// (the photo is optional — a request with no file attached works the
// same as a plain JSON one), then parseJsonFields turns the
// JSON.stringify'd "courses" field back into a real array before Zod
// validates it.
router.post("/", upload_1.upload.single("photo"), (0, parseJsonFields_1.parseJsonFields)("courses"), (0, validate_1.validate)({ body: studentSchema_1.createStudentSchema }), studentController_1.createStudent);
router.put("/:id", upload_1.upload.single("photo"), (0, parseJsonFields_1.parseJsonFields)("courses"), (0, validate_1.validate)({ params: studentSchema_1.studentIdSchema, body: studentSchema_1.createStudentSchema }), studentController_1.updateStudent);
router.patch("/:id", (0, validate_1.validate)({ params: studentSchema_1.studentIdSchema, body: studentSchema_1.patchStudentSchema }), studentController_1.patchStudent);
router.delete("/:id", (0, validate_1.validate)({ params: studentSchema_1.studentIdSchema }), studentController_1.deleteStudent);
exports.default = router;
