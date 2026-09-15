"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
exports.getUserByIdService = getUserByIdService;
exports.updateUserService = updateUserService;
exports.deleteUserService = deleteUserService;
const roles_1 = require("../models/roles");
const users_1 = require("../models/users");
const httpError_1 = require("../types/httpError");
function getUsers() {
    return users_1.User.find().populate("role");
}
function getUserByIdService(id) {
    return users_1.User.findById(id).populate("role");
}
async function updateUserService(id, changes) {
    const { role: roleNames, ...rest } = changes;
    const update = { ...rest };
    if (roleNames) {
        const roles = await roles_1.Role.find({ name: { $in: roleNames } });
        if (roles.length !== roleNames.length) {
            throw new httpError_1.BadRequest("One or more roles were not found");
        }
        update.role = roles.map((role) => role.id);
    }
    return users_1.User.findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
    }).populate("role");
}
function deleteUserService(id) {
    return users_1.User.findByIdAndDelete(id);
}
