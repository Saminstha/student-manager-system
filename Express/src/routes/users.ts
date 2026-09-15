import { Router } from "express";
import {
  createUserByAdmin,
  deleteUser,
  getUserById,
  listUsers,
  updateUser,
} from "../controllers/userController";
import { authenticate } from "../auth/authenticate";
import { requirePermission } from "../auth/authorize";
import { validate } from "../middleware/validate";
import { upload } from "../middleware/upload";
import { parseJsonFields } from "../middleware/parseJsonFields";
import { createUserByAdminSchema, updateUserSchema, userIdSchema } from "../validation/userSchema";

const router = Router();

// Every route here requires both a valid access token (authenticate)
// and the matching permission (requirePermission) — see
// Docs/authentication-vs-authorization equivalent note in auth/authorize.ts.

router.get("/", authenticate, requirePermission("user:read"), listUsers);

router.get(
  "/:id",
  authenticate,
  requirePermission("user:read"),
  validate({ params: userIdSchema }),
  getUserById,
);

router.post(
  "/",
  authenticate,
  requirePermission("user:create"),
  validate({ body: createUserByAdminSchema }),
  createUserByAdmin,
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("user:update"),
  upload.single("avatar"),
  parseJsonFields("role"),
  validate({ params: userIdSchema, body: updateUserSchema }),
  updateUser,
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("user:delete"),
  validate({ params: userIdSchema }),
  deleteUser,
);

export default router;
