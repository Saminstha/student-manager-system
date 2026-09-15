"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsonFields = parseJsonFields;
// When a form is submitted as multipart/form-data (because it includes
// a file), every field arrives as a plain string — including anything
// that's actually an array (like a student's course IDs, or a user's
// roles). The frontend JSON.stringifies those fields before appending
// them to the FormData; this middleware reverses that, so by the time
// Zod validates the body it looks the same as a plain JSON request.
//
// Must run after multer (which is what populates req.body from the
// multipart data) and before validate().
function parseJsonFields(...fields) {
    return (req, _res, next) => {
        for (const field of fields) {
            const value = req.body[field];
            if (typeof value === "string") {
                try {
                    req.body[field] = JSON.parse(value);
                }
                catch {
                    // Leave it as-is — an invalid shape here just means the Zod
                    // validation right after this will reject it with a clear
                    // error instead of a confusing JSON.parse crash.
                }
            }
        }
        next();
    };
}
