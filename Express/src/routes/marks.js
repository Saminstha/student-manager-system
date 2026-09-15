"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const markController_1 = require("../controllers/markController");
const validate_1 = require("../middleware/validate");
const authenticate_1 = require("../auth/authenticate");
const markSchema_1 = require("../validation/markSchema");
const router = (0, express_1.Router)();
// Every route below requires a logged-in user.
router.use(authenticate_1.authenticate);
// GET all
router.get("/", markController_1.listMarks);
// GET by ID
router.get("/:id", (0, validate_1.validate)({
    params: markSchema_1.markIdSchema,
}), markController_1.getMarkById);
// POST
router.post("/", (0, validate_1.validate)({
    body: markSchema_1.createMarkSchema,
}), markController_1.createMark);
// PUT
router.put("/:id", (0, validate_1.validate)({
    params: markSchema_1.markIdSchema,
    body: markSchema_1.createMarkSchema,
}), markController_1.updateMark);
// PATCH
router.patch("/:id", (0, validate_1.validate)({
    params: markSchema_1.markIdSchema,
    body: markSchema_1.patchMarkSchema,
}), markController_1.patchMark);
// DELETE
router.delete("/:id", (0, validate_1.validate)({
    params: markSchema_1.markIdSchema,
}), markController_1.deleteMark);
exports.default = router;
