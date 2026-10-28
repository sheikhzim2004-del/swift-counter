"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("pos_token");
    const storedUser = localStorage.getItem("pos_user");

    if (!token) {
      router.replace("/login");
      return;
    }

    let role = "";
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        role = parsed.role?.toLowerCase() || "";
      } catch (err) {
        console.error(err);
      }
    }

    // অ্যাডমিন সরাসরি ড্যাশবোর্ডে যাবে, ক্যাশিয়ার সরাসরি POS কাউন্টারে যাবে
    if (role === "admin") {
      router.replace("/dashboard");
    } else {
      router.replace("/pos");
    }
  }, [router]);

  return null;
}