"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authenticate_1 = require("../auth/authenticate");
const authorize_1 = require("../auth/authorize");
const validate_1 = require("../middleware/validate");
const upload_1 = require("../middleware/upload");
const parseJsonFields_1 = require("../middleware/parseJsonFields");
const userSchema_1 = require("../validation/userSchema");
const router = (0, express_1.Router)();
// Every route here requires both a valid access token (authenticate)
// and the matching permission (requirePermission) — see
// Docs/authentication-vs-authorization equivalent note in auth/authorize.ts.
router.get("/", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:read"), userController_1.listUsers);
router.get("/:id", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:read"), (0, validate_1.validate)({ params: userSchema_1.userIdSchema }), userController_1.getUserById);
router.post("/", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:create"), (0, validate_1.validate)({ body: userSchema_1.createUserByAdminSchema }), userController_1.createUserByAdmin);
router.patch("/:id", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:update"), upload_1.upload.single("avatar"), (0, parseJsonFields_1.parseJsonFields)("role"), (0, validate_1.validate)({ params: userSchema_1.userIdSchema, body: userSchema_1.updateUserSchema }), userController_1.updateUser);
router.delete("/:id", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:delete"), (0, validate_1.validate)({ params: userSchema_1.userIdSchema }), userController_1.deleteUser);
exports.default = router;
