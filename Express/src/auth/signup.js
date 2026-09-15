"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupUser = signupUser;
const authService_1 = require("./authService");
async function signupUser(req, res) {
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;
    const user = await (0, authService_1.createUser)(req.body, undefined, avatar);
    res.status(201).json(user);
}
