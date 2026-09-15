import { Router } from "express";

import {
  listTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  patchTeacher,
  deleteTeacher,
} from "../controllers/teacherController";

import { validate } from "../middleware/validate";
import { authenticate } from "../auth/authenticate";
import { upload } from "../middleware/upload";

import {
  createTeacherSchema,
  patchTeacherSchema,
  teacherIdSchema,
} from "../validation/teacherSchema";

const router = Router();

// Every route below requires a logged-in user (no specific
// permission needed, just a valid access token).
router.use(authenticate);

router.get("/", listTeachers);

router.get("/:id", validate({ params: teacherIdSchema }), getTeacherById);

router.post(
  "/",
  upload.single("photo"),
  validate({ body: createTeacherSchema }),
  createTeacher,
);

router.put(
  "/:id",
  upload.single("photo"),
  validate({ params: teacherIdSchema, body: createTeacherSchema }),
  updateTeacher,
);

router.patch(
  "/:id",
  validate({ params: teacherIdSchema, body: patchTeacherSchema }),
  patchTeacher,
);

router.delete("/:id", validate({ params: teacherIdSchema }), deleteTeacher);

export default router;
