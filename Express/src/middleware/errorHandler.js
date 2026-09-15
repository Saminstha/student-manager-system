"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const httpError_1 = require("../types/httpError");
function errorHandler(err, _req, res, _next) {
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            errors: err.issues,
        });
        return;
    }
    if (err instanceof Error && err.name === "MulterError") {
        res.status(400).json({
            error: err.message,
        });
        return;
    }
    if (err instanceof Error &&
        (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")) {
        res.status(401).json({
            error: "Invalid or expired token",
        });
        return;
    }
    const status = err instanceof httpError_1.HttpError
        ? err.status
        : getStatus(err);
    const message = err instanceof Error
        ? err.message
        : "Internal Server Error";
    if (status >= 500) {
        console.error(err);
    }
    res.status(status).json({
        error: message,
    });
}
function getStatus(err) {
    if (typeof err === "object" &&
        err !== null &&
        "status" in err) {
        const { status } = err;
        if (typeof status === "number") {
            return status;
        }
    }
    return httpError_1.HttpError.statusCode;
}
