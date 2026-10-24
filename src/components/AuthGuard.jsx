"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // লগইন পেজে গার্ড চেক দরকার নেই
    if (pathname === "/login") {
      setChecking(false);
      return;
    }

    const token = localStorage.getItem("pos_token");
    const user = localStorage.getItem("pos_user");

    if (!token || !user) {
      router.replace("/login");
    } else {
      setChecking(false);
    }
  }, [pathname, router]);

  // লগইন পেজ হলে সরাসরি রেন্ডার
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // চেক চলাকালীন স্পিনার দেখাবে, কিন্তু DOM সেগমেন্ট ড্রপ করবে না
  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <FaSpinner className="animate-spin text-2xl text-indigo-500" />
        <p className="text-xs font-semibold tracking-wider uppercase">Verifying Terminal Session...</p>
      </div>
    );
  }

  return <>{children}</>;
}