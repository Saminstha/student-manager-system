import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";

// Shared local-disk multer config, used anywhere the app accepts an
// image upload (student photos, user avatars). One instance is fine to
// reuse across routes — each route just calls upload.single("<field>")
// with whatever field name it expects.
const storage = multer.diskStorage({
  destination: "uploads/",
  filename(_req, file, cb) {
    // Never trust the client's original filename for anything that
    // touches the filesystem — it could contain something like
    // "../../.env". Generate a fresh name instead, and this also avoids
    // two uploads with the same name overwriting each other.
    cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  fileFilter(_req, file, cb) {
    cb(null, file.mimetype.startsWith("image/"));
  },
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});
