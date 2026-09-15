"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.createUserByAdmin = createUserByAdmin;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
const authService_1 = require("../auth/authService");
const httpError_1 = require("../types/httpError");
const userServices_1 = require("../services/userServices");
// GET all users
async function listUsers(req, res) {
    const users = await (0, userServices_1.getUsers)();
    res.status(200).json({
        message: "Users retrieved successfully",
        users,
    });
}
// GET user by ID
async function getUserById(req, res) {
    const { id } = req.params;
    const user = await (0, userServices_1.getUserByIdService)(String(id));
    if (!user) {
        throw new httpError_1.NotFound("User not found");
    }
    res.status(200).json({
        message: "User retrieved successfully",
        user,
    });
}
// POST — an admin creating another user's account directly, as opposed
// to that person self-signing-up via /auth/signup. This is the one place
// a caller can choose the new user's role.
async function createUserByAdmin(req, res) {
    const { role, ...input } = req.body;
    const user = await (0, authService_1.createUser)(input, role);
    res.status(201).json({
        message: "User created successfully",
        user,
    });
}
// PATCH
async function updateUser(req, res) {
    const { id } = req.params;
    // Only overwrite the existing avatar if a new photo was actually
    // uploaded this time — no file attached means "leave it as is".
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const data = avatar ? { ...req.body, avatar } : req.body;
    const updatedUser = await (0, userServices_1.updateUserService)(String(id), data);
    if (!updatedUser) {
        throw new httpError_1.NotFound("User not found");
    }
    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
    });
}
// DELETE
async function deleteUser(req, res) {
    const { id } = req.params;
    const deletedUser = await (0, userServices_1.deleteUserService)(String(id));
    if (!deletedUser) {
        throw new httpError_1.NotFound("User not found");
    }
    res.status(200).json({
        message: "User deleted successfully",
        user: deletedUser,
    });
}
