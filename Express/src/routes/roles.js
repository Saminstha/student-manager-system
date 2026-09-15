"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const roleController_1 = require("../controllers/roleController");
const authenticate_1 = require("../auth/authenticate");
const authorize_1 = require("../auth/authorize");
const router = (0, express_1.Router)();
// Same permission as viewing users — you need to be able to manage
// users to need to know what roles exist to assign them.
router.get("/", authenticate_1.authenticate, (0, authorize_1.requirePermission)("user:read"), roleController_1.listRoles);
exports.default = router;
