import { Router } from "express";
import { signupUser } from "./signup";
import { getCurrentUser, loginUser, logoutUser, refreshAccessToken } from "./authController";
import { authenticate } from "./authenticate";
import { validate } from "../middleware/validate";
import { upload } from "../middleware/upload";
import { loginSchema, signupSchema } from "./authSchemas";

const router = Router();

// upload.single("avatar") runs first so multer can parse the multipart
// body into req.body + req.file — only then does the Zod validation (on
// the now-populated req.body) make sense. The avatar itself is optional,
// so a signup with no file attached is still valid.
router.post("/signup", upload.single("avatar"), validate({ body: signupSchema }), signupUser);

router.post("/login", validate({ body: loginSchema }), loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", authenticate, logoutUser);

router.get("/me", authenticate, getCurrentUser);

export default router;
