import { Router } from "express";

import {
  listMarks,
  getMarkById,
  createMark,
  updateMark,
  patchMark,
  deleteMark,
} from "../controllers/markController";

import { validate } from "../middleware/validate";
import { authenticate } from "../auth/authenticate";

import {
  createMarkSchema,
  patchMarkSchema,
  markIdSchema,
} from "../validation/markSchema";

const router = Router();

// Every route below requires a logged-in user.
router.use(authenticate);

// GET all
router.get("/", listMarks);

// GET by ID
router.get(
  "/:id",
  validate({
    params: markIdSchema,
  }),
  getMarkById,
);

// POST
router.post(
  "/",
  validate({
    body: createMarkSchema,
  }),
  createMark,
);

// PUT
router.put(
  "/:id",
  validate({
    params: markIdSchema,
    body: createMarkSchema,
  }),
  updateMark,
);

// PATCH
router.patch(
  "/:id",
  validate({
    params: markIdSchema,
    body: patchMarkSchema,
  }),
  patchMark,
);

// DELETE
router.delete(
  "/:id",
  validate({
    params: markIdSchema,
  }),
  deleteMark,
);

export default router;
