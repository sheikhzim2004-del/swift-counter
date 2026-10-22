// src/components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import { FaRegCalendarAlt, FaUserCircle } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";

export default function Navbar() {
    const [currentDate, setCurrentDate] = useState("");

    // Set date on client mount to avoid hydration mismatch
    useEffect(() => {
        const formatted = new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        setCurrentDate(formatted);
    }, []);

    return (
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
            {/* Store Location */}
            <div className="flex items-center gap-2 text-slate-900">
                <MdStorefront className="text-xl text-indigo-600" />
                <span className="font-semibold text-sm md:text-base">
                    Counter #01 - Main Branch
                </span>
            </div>

            {/* Date & User Info */}
            <div className="flex items-center gap-6 text-sm">
                <div className="hidden sm:flex items-center gap-2 text-slate-500">
                    <FaRegCalendarAlt className="text-slate-400" />
                    <span>{currentDate || "Loading date..."}</span>
                </div>

                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                    <FaUserCircle className="text-2xl text-slate-400" />
                    <div className="text-left">
                        <p className="font-medium text-xs text-slate-900 leading-tight">Cashier</p>
                        <p className="text-[11px] text-emerald-600 font-medium">Online</p>
                    </div>
                </div>
            </div>
        </header>
    );
}