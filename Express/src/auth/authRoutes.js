"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signup_1 = require("./signup");
const authController_1 = require("./authController");
const authenticate_1 = require("./authenticate");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const authSchemas_1 = require("./authSchemas");
const router = (0, express_1.Router)();
// upload.single("avatar") runs first so multer can parse the multipart
// body into req.body + req.file — only then does the Zod validation (on
// the now-populated req.body) make sense. The avatar itself is optional,
// so a signup with no file attached is still valid.
router.post("/signup", upload_1.upload.single("avatar"), (0, validate_1.validate)({ body: authSchemas_1.signupSchema }), signup_1.signupUser);
router.post("/login", (0, validate_1.validate)({ body: authSchemas_1.loginSchema }), authController_1.loginUser);
router.post("/refresh", authController_1.refreshAccessToken);
router.post("/logout", authenticate_1.authenticate, authController_1.logoutUser);
router.get("/me", authenticate_1.authenticate, authController_1.getCurrentUser);
exports.default = router;
