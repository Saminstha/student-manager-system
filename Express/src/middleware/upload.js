"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const node_path_1 = __importDefault(require("node:path"));
const node_crypto_1 = require("node:crypto");
const multer_1 = __importDefault(require("multer"));
// Shared local-disk multer config, used anywhere the app accepts an
// image upload (student photos, user avatars). One instance is fine to
// reuse across routes — each route just calls upload.single("<field>")
// with whatever field name it expects.
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename(_req, file, cb) {
        // Never trust the client's original filename for anything that
        // touches the filesystem — it could contain something like
        // "../../.env". Generate a fresh name instead, and this also avoids
        // two uploads with the same name overwriting each other.
        cb(null, `${(0, node_crypto_1.randomUUID)()}${node_path_1.default.extname(file.originalname)}`);
    },
});
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter(_req, file, cb) {
        cb(null, file.mimetype.startsWith("image/"));
    },
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
