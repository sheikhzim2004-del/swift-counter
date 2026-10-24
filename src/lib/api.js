const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function apiFetch(endpoint, options = {}) {
    // ব্রাউজার লোকালস্টোরেজ থেকে টোকেন সংগ্রহ
    const token = typeof window !== "undefined" ? localStorage.getItem("pos_token") : null;

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // টোকেন অবৈধ বা এক্সপায়ার্ড হলে স্বয়ংক্রিয়ভাবে লগআউট ও রিডাইরেক্ট
    if (response.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("pos_token");
            localStorage.removeItem("pos_user");
            window.location.href = "/login";
        }
        throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "API request failed");
    }

    return data;
}