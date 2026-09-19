import multer from "multer";
import { ApiError } from "./errors.js";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype) || !ALLOWED_EXTENSIONS.test(file.originalname)) {
      cb(new ApiError("UNSUPPORTED_FILE_TYPE", 400, "Please upload JPG, PNG or WEBP."));
      return;
    }
    cb(null, true);
  }
});
