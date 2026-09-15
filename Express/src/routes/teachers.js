"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const teacherController_1 = require("../controllers/teacherController");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../auth/authenticate");
const upload_1 = require("../middleware/upload");
const teacherSchema_1 = require("../validation/teacherSchema");
const router = (0, express_1.Router)();
// Every route below requires a logged-in user (no specific
// permission needed, just a valid access token).
router.use(authenticate_1.authenticate);
router.get("/", teacherController_1.listTeachers);
router.get("/:id", (0, validate_1.validate)({ params: teacherSchema_1.teacherIdSchema }), teacherController_1.getTeacherById);
router.post("/", upload_1.upload.single("photo"), (0, validate_1.validate)({ body: teacherSchema_1.createTeacherSchema }), teacherController_1.createTeacher);
router.put("/:id", upload_1.upload.single("photo"), (0, validate_1.validate)({ params: teacherSchema_1.teacherIdSchema, body: teacherSchema_1.createTeacherSchema }), teacherController_1.updateTeacher);
router.patch("/:id", (0, validate_1.validate)({ params: teacherSchema_1.teacherIdSchema, body: teacherSchema_1.patchTeacherSchema }), teacherController_1.patchTeacher);
router.delete("/:id", (0, validate_1.validate)({ params: teacherSchema_1.teacherIdSchema }), teacherController_1.deleteTeacher);
exports.default = router;
