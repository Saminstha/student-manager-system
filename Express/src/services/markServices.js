"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMarks = getMarks;
exports.getMarkByIdService = getMarkByIdService;
exports.createMarkService = createMarkService;
exports.updateMarkService = updateMarkService;
exports.patchMarkService = patchMarkService;
exports.deleteMarkService = deleteMarkService;
const marks_1 = require("../models/marks");
// GET all marks
async function getMarks() {
    return await marks_1.Mark.find();
}
// GET mark by ID
async function getMarkByIdService(id) {
    return await marks_1.Mark.findById(id);
}
// CREATE mark
async function createMarkService(data) {
    return await marks_1.Mark.create(data);
}
// PUT
async function updateMarkService(id, data) {
    return await marks_1.Mark.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}
// PATCH
async function patchMarkService(id, data) {
    return await marks_1.Mark.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
    });
}
// DELETE
async function deleteMarkService(id) {
    return await marks_1.Mark.findByIdAndDelete(id);
}
