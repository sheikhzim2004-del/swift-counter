"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaSun,
    FaMoon,
    FaStore,
    FaWifi,
    FaCalendarAlt,
    FaBell
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [todayDate, setTodayDate] = useState("");

    useEffect(() => {
        setMounted(true);
        const date = new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
        setTodayDate(date);
    }, []);

    const isDark = theme === "dark";

    return (
        <header className="h-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-40 transition-colors duration-300">

            {/* Left: Store & Counter Identity with Pulse Badge */}
            <div className="flex items-center gap-3">
                <motion.div
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/20"
                >
                    <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <FaStore className="text-lg" />
                    </div>
                </motion.div>

                <div>
                    <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                            Counter #01
                        </h2>
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/60">
                            <HiSparkles className="text-[10px]" /> Main Branch
                        </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium">
                        <FaCalendarAlt className="text-[10px] text-indigo-500" />
                        <span>{todayDate || "Loading date..."}</span>
                    </p>
                </div>
            </div>

            {/* Right Controls: Quick Status, Notifications, Theme Toggle & Profile */}
            <div className="flex items-center gap-3 sm:gap-4">

                {/* Network & Terminal Connectivity Pill */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <FaWifi className="text-[11px] text-slate-400" />
                    <span className="text-[11px]">POS Terminal Active</span>
                </div>

                {/* Quick Alert Bell */}
                <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative p-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200/60 dark:border-slate-800 transition cursor-pointer"
                >
                    <FaBell className="text-sm" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950"></span>
                </motion.button>

                {/* ================= Fluid Animated Theme Toggle Switch ================= */}
                {mounted && (
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setTheme(isDark ? "light" : "dark")}
                        className={`w-16 h-8 rounded-full p-1 transition-colors duration-300 flex items-center relative cursor-pointer border ${isDark
                                ? "bg-slate-900 border-slate-700 shadow-inner"
                                : "bg-gradient-to-r from-amber-100 to-indigo-100 border-indigo-200/70 shadow-sm"
                            }`}
                        aria-label="Toggle theme"
                    >
                        {/* Sliding Knob with Spring Physics */}
                        <motion.div
                            layout
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md ${isDark
                                    ? "ml-auto bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-indigo-900/50"
                                    : "bg-gradient-to-tr from-amber-400 to-orange-400 text-white shadow-amber-500/40"
                                }`}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isDark ? (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaMoon className="text-[10px]" />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FaSun className="text-[10px]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.button>
                )}

                {/* ================= Eye-Catching Interactive Profile Badge ================= */}
                <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 pl-3 py-1 pr-2 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100/80 dark:from-slate-900 dark:to-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition cursor-pointer group"
                >
                    {/* Avatar with Gradient Border and Glow */}
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition">
                            <div className="w-full h-full bg-slate-900 text-white rounded-[10px] flex items-center justify-center font-black text-xs tracking-wider">
                                SC
                            </div>
                        </div>

                        {/* Live Indicator Dot */}
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-950 rounded-full"></span>
                    </div>

                    {/* Details */}
                    <div className="hidden sm:block text-left pr-1">
                        <div className="flex items-center gap-1.5">
                            <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                                Sheikh Jim
                            </p>
                            <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                PRO
                            </span>
                        </div>
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                            Cashier & Manager
                        </p>
                    </div>
                </motion.div>

            </div>
        </header>
    );
}