import { Router } from "express";
import {
  listStudents,
  getStudentById,
  createStudent,
  updateStudent,
  patchStudent,
  deleteStudent,
} from "../controllers/studentController";

import { validate } from "../middleware/validate";
import { authenticate } from "../auth/authenticate";
import { upload } from "../middleware/upload";
import { parseJsonFields } from "../middleware/parseJsonFields";
import {
  createStudentSchema,
  patchStudentSchema,
  studentIdSchema,
} from "../validation/studentSchema";

const router = Router();

// Every route below requires a logged-in user.
router.use(authenticate);

router.get("/", listStudents);

router.get("/:id", validate({ params: studentIdSchema }), getStudentById);

// upload.single("photo") first so multer can parse the multipart body
// (the photo is optional — a request with no file attached works the
// same as a plain JSON one), then parseJsonFields turns the
// JSON.stringify'd "courses" field back into a real array before Zod
// validates it.
router.post(
  "/",
  upload.single("photo"),
  parseJsonFields("courses"),
  validate({ body: createStudentSchema }),
  createStudent,
);

router.put(
  "/:id",
  upload.single("photo"),
  parseJsonFields("courses"),
  validate({ params: studentIdSchema, body: createStudentSchema }),
  updateStudent,
);

router.patch(
  "/:id",
  validate({ params: studentIdSchema, body: patchStudentSchema }),
  patchStudent,
);

router.delete("/:id", validate({ params: studentIdSchema }), deleteStudent);

export default router;
