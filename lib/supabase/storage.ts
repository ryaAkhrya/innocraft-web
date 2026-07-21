import { supabase } from "./client";

// Valid MIME types for each asset type
const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const VIDEO_MIME_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

// Size limits in bytes
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

export type UploadResult = {
  url: string;
  path: string;
  error?: string;
};

/**
 * Validates file before upload
 */
export function validateFile(
  file: File,
  type: "image" | "video",
): { valid: boolean; error?: string } {
  const maxSize = type === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  const validTypes = type === "image" ? IMAGE_MIME_TYPES : VIDEO_MIME_TYPES;

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${validTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
    };
  }

  return { valid: true };
}

/**
 * Generates a unique file path within a bucket
 */
function generatePath(bucket: string, originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split(".").pop() ?? "";
  const cleanName = originalName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "-");
  return `${cleanName}-${timestamp}-${random}.${extension}`;
}

/**
 * Uploads a file to Supabase storage and returns the public URL
 */
export async function uploadFile(
  bucket: string,
  file: File,
  type: "image" | "video" = "image",
): Promise<UploadResult> {
  const validation = validateFile(file, type);
  if (!validation.valid) {
    return { url: "", path: "", error: validation.error };
  }

  const path = generatePath(bucket, file.name);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    return { url: "", path: "", error: uploadError.message };
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

  return {
    url: publicUrlData.publicUrl,
    path,
  };
}

/**
 * Gets public URL for an existing path
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// Bucket names
export const BUCKETS = {
  HERO: "hero",
  ABOUT: "about",
  GALLERY: "gallery",
  MENTORS: "mentors",
  PROJECTS: "projects",
  SECTIONS: "sections",
} as const;
