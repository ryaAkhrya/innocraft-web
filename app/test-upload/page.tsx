"use client";

import { useState } from "react";
import { uploadFile } from "@/lib/supabase/storage";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<{ path: string; publicUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setError(null);
      setResult(null);
    } else {
      setFile(null);
      setError("Please select a valid image file");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setResult(null);

    try {
      const uploadResult = await uploadFile(file, "test");
      setResult(uploadResult);
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
          accept="image/*"
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
          <p>✅ {result.publicUrl}</p>
          <p>✅ {result.path}</p>
          <img
            src={result.publicUrl}
            alt="Uploaded preview"
            style={{ maxWidth: "100%", maxHeight: "300px", marginTop: "10px" }}
          />
        </div>
      )}
    </div>
  );
}