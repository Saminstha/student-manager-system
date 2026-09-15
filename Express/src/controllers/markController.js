"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMarks = listMarks;
exports.getMarkById = getMarkById;
exports.createMark = createMark;
exports.updateMark = updateMark;
exports.patchMark = patchMark;
exports.deleteMark = deleteMark;
const markServices_1 = require("../services/markServices");
const httpError_1 = require("../types/httpError");
// GET all marks
async function listMarks(req, res, next) {
    const marks = await (0, markServices_1.getMarks)();
    res.status(200).json({
        message: "Marks retrieved successfully",
        marks,
    });
}
// GET mark by ID
async function getMarkById(req, res, next) {
    const { id } = req.params;
    const mark = await (0, markServices_1.getMarkByIdService)(String(id));
    if (!mark) {
        throw new httpError_1.NotFound("Mark not found");
    }
    res.status(200).json({
        message: "Mark retrieved successfully",
        mark,
    });
}
// POST
async function createMark(req, res, next) {
    const newMark = await (0, markServices_1.createMarkService)(req.body);
    res.status(201).json({
        message: "Mark created successfully",
        mark: newMark,
    });
}
// PUT
async function updateMark(req, res, next) {
    const { id } = req.params;
    const updatedMark = await (0, markServices_1.updateMarkService)(String(id), req.body);
    if (!updatedMark) {
        throw new httpError_1.NotFound("Mark not found");
    }
    res.status(200).json({
        message: "Mark updated successfully",
        mark: updatedMark,
    });
}
// PATCH
async function patchMark(req, res, next) {
    const { id } = req.params;
    const updatedMark = await (0, markServices_1.patchMarkService)(String(id), req.body);
    if (!updatedMark) {
        throw new httpError_1.NotFound("Mark not found");
    }
    res.status(200).json({
        message: "Mark updated successfully",
        mark: updatedMark,
    });
}
// DELETE
async function deleteMark(req, res, next) {
    const { id } = req.params;
    const deletedMark = await (0, markServices_1.deleteMarkService)(String(id));
    if (!deletedMark) {
        throw new httpError_1.NotFound("Mark not found");
    }
    res.status(200).json({
        message: "Mark deleted successfully",
        mark: deletedMark,
    });
}
