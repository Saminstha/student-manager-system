"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listRoles = listRoles;
const roles_1 = require("../models/roles");
// GET all roles — used by the user-edit form to populate a role picker.
async function listRoles(req, res) {
    const roles = await roles_1.Role.find();
    res.status(200).json({
        message: "Roles retrieved successfully",
        roles,
    });
}
