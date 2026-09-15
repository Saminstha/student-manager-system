import { Router } from "express";
import { listRoles } from "../controllers/roleController";
import { authenticate } from "../auth/authenticate";
import { requirePermission } from "../auth/authorize";

const router = Router();

// Same permission as viewing users — you need to be able to manage
// users to need to know what roles exist to assign them.
router.get("/", authenticate, requirePermission("user:read"), listRoles);

export default router;
