import type {
    NextFunction,
    Request,
    Response,
} from "express";

import { ZodError } from "zod";

import { HttpError } from "../types/httpError";

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof ZodError) {
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

    if (
        err instanceof Error &&
        (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
    ) {
        res.status(401).json({
            error: "Invalid or expired token",
        });

        return;
    }

    const status =
        err instanceof HttpError
            ? err.status
            : getStatus(err);

    const message =
        err instanceof Error
            ? err.message
            : "Internal Server Error";

    if (status >= 500) {
        console.error(err);
    }

    res.status(status).json({
        error: message,
    });
}

function getStatus(
    err: unknown
): number {
    if (
        typeof err === "object" &&
        err !== null &&
        "status" in err
    ) {
        const { status } = err as {
            status?: unknown;
        };

        if (typeof status === "number") {
            return status;
        }
    }

    return HttpError.statusCode;
}