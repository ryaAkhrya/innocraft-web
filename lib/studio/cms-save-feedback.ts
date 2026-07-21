import { useState } from "react";

export type SaveStatus = "idle" | "saving" | "success" | "error";

export interface SaveFeedback {
  status: SaveStatus;
  error: string | null;
}

export function useSaveFeedback() {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  const startSaving = () => {
    setStatus("saving");
    setError(null);
  };

  const saveSuccess = () => {
    setStatus("success");
    // Clear success after 2 seconds
    setTimeout(() => setStatus("idle"), 2000);
  };

  const saveError = (errorMessage: string) => {
    setStatus("error");
    setError(errorMessage);
  };

  const reset = () => {
    setStatus("idle");
    setError(null);
  };

  const isSaving = status === "saving";
  const isSuccess = status === "success";
  const hasError = status === "error";

  return {
    status,
    error,
    isSaving,
    isSuccess,
    hasError,
    startSaving,
    saveSuccess,
    saveError,
    reset,
  };
}