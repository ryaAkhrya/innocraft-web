"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { setStudioSessionCookie } from "@/lib/studio/mock-auth";

export default function StudioLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const correctPassword = useMemo(() => "innocraftkerenbanget", []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Hardcoded auth for first iteration
      if (password === correctPassword) {
        setStudioSessionCookie();
        router.replace("/studio");
        return;
      }

      // Mock-only: keep behavior local to the client
      setError("Incorrect password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-4">
      <div className="rounded-[2rem] border border-border bg-white/80 p-8 shadow-soft backdrop-blur">
        <h1 className="text-3xl font-semibold tracking-tight text-heading">Studio Login</h1>
        <p className="mt-3 text-paragraph">Enter the password to continue.</p>

        <form onSubmit={onSubmit} className="mt-6 w-full">
          <label className="block text-sm font-medium text-paragraph" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border border-border bg-white/70 px-4 py-3 text-paragraph shadow-sm outline-none focus:ring-2 focus:ring-primary"
            autoComplete="current-password"
            required
          />

          {error ? <p className="mt-3 text-sm font-medium text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-buttonBg px-6 py-3 text-sm font-semibold text-white transition hover:bg-buttonHover disabled:opacity-60"
          >
            {isSubmitting ? "Checking…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

