import { Router } from "express";

import {
  listCourses,
  getCourseById,
  createCourse,
  updateCourse,
  patchCourse,
  deleteCourse,
} from "../controllers/courseController";

import { validate } from "../middleware/validate";
import { authenticate } from "../auth/authenticate";

import {
  createCourseSchema,
  patchCourseSchema,
  courseIdSchema,
} from "../validation/courseSchema";

const router = Router();

// Every route below requires a logged-in user.
router.use(authenticate);

// GET all courses
router.get("/", listCourses);

// GET course by ID
router.get("/:id", validate({ params: courseIdSchema }), getCourseById);

// CREATE course
router.post("/", validate({ body: createCourseSchema }), createCourse);

// PUT course
router.put(
  "/:id",
  validate({ params: courseIdSchema, body: createCourseSchema }),
  updateCourse,
);

// PATCH course
router.patch(
  "/:id",
  validate({ params: courseIdSchema, body: patchCourseSchema }),
  patchCourse,
);

// DELETE course
router.delete(
  "/:id",
  validate({
    params: courseIdSchema,
  }),
  deleteCourse,
);

export default router;
