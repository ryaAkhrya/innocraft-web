import { supabase } from "./client";

const BUCKET_NAME = "media";

/**
 * Generate a unique filename preserving the original extension
 */
function generateUniqueFilename(originalName: string): string {
  const extension = originalName.split(".").pop();
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return extension ? `${timestamp}-${random}.${extension}` : `${timestamp}-${random}`;
}

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param folder - The folder path within the bucket (e.g., 'hero', 'gallery', 'mentors', 'projects', 'logos', 'videos')
 * @returns Object containing the path and public URL of the uploaded file
 */
export async function uploadFile(
  file: File,
  folder: string
): Promise<{ path: string; publicUrl: string }> {
  if (!file) {
    throw new Error("No file provided for upload");
  }

  if (!folder || folder.trim() === "") {
    throw new Error("Folder path is required");
  }

  try {
    const uniqueFilename = generateUniqueFilename(file.name);
    const path = `${folder}/${uniqueFilename}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }

    if (!data) {
      throw new Error("Upload failed: No data returned from Supabase");
    }

    const publicUrl = getPublicUrl(data.path);

    return {
      path: data.path,
      publicUrl,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to upload file: Unknown error occurred");
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - The path of the file to delete
 */
export async function deleteFile(path: string): Promise<void> {
  if (!path || path.trim() === "") {
    throw new Error("File path is required for deletion");
  }

  try {
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);

    if (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to delete file: Unknown error occurred");
  }
}

/**
 * Get the public URL for a file in Supabase Storage
 * @param path - The path of the file
 * @returns The public URL of the file
 */
export function getPublicUrl(path: string): string {
  if (!path || path.trim() === "") {
    throw new Error("File path is required to get public URL");
  }

  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

  if (!data?.publicUrl) {
    throw new Error(`Failed to get public URL for path: ${path}`);
  }

  return data.publicUrl;
}