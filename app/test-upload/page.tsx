"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/supabase/storage";

function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

function isVideoFile(file: File): boolean {
  return file.type.startsWith("video/");
}

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ url: string; path: string; isVideo: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && (isImageFile(selectedFile) || isVideoFile(selectedFile))) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setFile(null);
      setError("Please select a valid image or video file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadType = isVideoFile(file) ? "video" : "image";
      const uploadResult = await uploadFile("gallery", file, uploadType);
      if (uploadResult.error) {
        setError(uploadResult.error);
      } else {
        setResult({ url: uploadResult.url, path: uploadResult.path, isVideo: isVideoFile(file) });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>Test Upload</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="file"
          accept="image/*,video/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>

      <button
        onClick={handleUpload}
        disabled={!file || isUploading}
        style={{
          padding: "10px 20px",
          backgroundColor: isUploading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          cursor: !file || isUploading ? "not-allowed" : "pointer",
        }}
      >
        Upload Test
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>Error: {error}</p>
      )}

      {result && (
        <div style={{ marginTop: "20px" }}>
          <p>✅ URL: {result.url}</p>
          <p>✅ Path: {result.path}</p>
          {result.isVideo ? (
            <video
              src={result.url}
              controls
              style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
            />
          ) : (
            <img
              src={result.url}
              alt="Uploaded preview"
              style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}