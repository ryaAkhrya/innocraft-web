"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function StudioLogoutPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.signOut();
    router.replace("/studio/login");
  }, [router]);

  return null;
}