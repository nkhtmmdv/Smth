const ACCEPTED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION = 1800;

export type FileValidationError = "UNSUPPORTED_FILE_TYPE" | "FILE_TOO_LARGE";

export function validateImageFile(file: File): FileValidationError | null {
  if (!ACCEPTED_TYPES.has(file.type)) return "UNSUPPORTED_FILE_TYPE";
  if (file.size > MAX_FILE_SIZE_BYTES) return "FILE_TOO_LARGE";
  return null;
}

/**
 * Downscales very large photos client-side before upload so the AI request
 * stays fast and reliable during a live demo. Falls back to the original
 * file if canvas processing fails for any reason.
 */
export async function compressImageIfNeeded(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    if (bitmap.width <= MAX_DIMENSION && bitmap.height <= MAX_DIMENSION) {
      bitmap.close();
      return file;
    }

    const scale = MAX_DIMENSION / Math.max(bitmap.width, bitmap.height);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    if (!blob) return file;

    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}
