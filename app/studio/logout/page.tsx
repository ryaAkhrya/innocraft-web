"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearStudioSessionCookie } from "@/lib/studio/mock-auth";

export default function StudioLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    clearStudioSessionCookie();
    router.replace("/studio/login");
  }, [router]);

  return null;
}

