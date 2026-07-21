"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { uploadFile, type UploadResult } from "@/lib/supabase/storage";

type CmsFileUploadProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  bucket: string;
  accept?: string;
  isVideo?: boolean;
};

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isVideoMimeType(file: File): boolean {
  return file.type.startsWith("video/");
}

export function CmsFileUpload({
  label,
  value,
  onChange,
  bucket,
  accept = "image/*,video/*",
  isVideo: isVideoProp,
}: CmsFileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = isImageFile(file);
    const isVideo = isVideoMimeType(file);

    if (!isImage && !isVideo) {
      setError("Please select a valid image or video file");
      return;
    }

    setIsUploading(true);
    setError(null);

    const uploadType = isVideo ? "video" : "image";
    const result: UploadResult = await uploadFile(bucket, file, uploadType);

    if (result.error) {
      setError(result.error);
    } else {
      onChange(result.url);
    }

    setIsUploading(false);
    // Reset input
    e.target.value = "";
  };

  const clearFile = () => {
    onChange("");
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const hasUrl = !!value;
  const isVideoFile = isVideoProp ?? false;

  return (
    <div className="space-y-2">
      <label className="block">
        <span className="text-sm font-medium text-white/80">{label}</span>
      </label>

      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />

            <button
              type="button"
              onClick={openFileDialog}
              disabled={isUploading}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0B1020]/40 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/5 disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {isUploading ? "Uploading..." : "Upload"}
            </button>

            {hasUrl && (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 hover:bg-white/10"
              >
                Clear
              </button>
            )}
          </div>

          {error && (
            <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="h-3 w-3" />
              {error}
            </div>
          )}
        </div>
      </div>

      {hasUrl && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-white/10">
          <div className="aspect-video w-full max-w-xs bg-[#0B1020]/30">
            {isVideoFile ? (
              <video
                src={value}
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}