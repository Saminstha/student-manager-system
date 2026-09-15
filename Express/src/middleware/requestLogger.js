"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
function requestLogger(req, res, next) {
    const startedAt = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - startedAt;
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
        if (req.method === "POST" || req.method === "PUT" || req.method === "PATCH") {
            console.log(`Body: ${JSON.stringify(req.body)}`);
        }
    });
    next();
}
;
