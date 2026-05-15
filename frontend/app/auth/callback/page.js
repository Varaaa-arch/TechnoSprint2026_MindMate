"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Menyelesaikan login...");

  useEffect(() => {
    if (!supabase) {
      setMessage("Supabase tidak dikonfigurasi.");
      return;
    }

    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setMessage(error.message);
        setTimeout(() => router.replace("/login?tab=signin"), 2000);
        return;
      }
      router.replace(session ? "/chat" : "/login?tab=signin");
    });
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white text-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400">{message}</p>
      </div>
    </div>
  );
}
