"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Catches Supabase recovery tokens that land on the wrong page
// and redirects to /reset-password
export default function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) {
      router.replace("/reset-password" + hash);
    }
  }, [router]);

  return null;
}
