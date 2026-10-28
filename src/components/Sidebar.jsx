"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MdDashboard,
    MdPointOfSale,
    MdInventory,
    MdReceiptLong,
} from "react-icons/md";

// roles দিয়ে নির্ধারণ: Dashboard ও Products শুধু admin দেখবে, বাকিগুলো উভয়ই
const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: MdDashboard, roles: ["admin"] },
    { name: "POS Counter", href: "/pos", icon: MdPointOfSale, roles: ["admin", "cashier"] },
    { name: "Products", href: "/products", icon: MdInventory, roles: ["admin"] },
    { name: "Sales History", href: "/sales", icon: MdReceiptLong, roles: ["admin", "cashier"] },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        // শুধু ইউজারের রোল রিড করবে
        const storedUser = localStorage.getItem("pos_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUserRole(parsed.role?.toLowerCase() || "cashier");
            } catch (err) {
                console.error("Failed to parse user in sidebar:", err);
            }
        }
    }, []);

    // ইউজার রোল অনুযায়ী মেনু ফিল্টার করা
    const visibleNavItems = navItems.filter((item) => {
        if (!userRole) return false; // রোল লোড হওয়া পর্যন্ত অপেক্ষা করবে
        return item.roles.includes(userRole);
    });

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col justify-between p-4 border-r-4 border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-200">
            <div>
                {/* Brand Logo & Active Role Badge */}
                <div className="px-2 py-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
                            SC
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-wide dark:text-white">
                                SwiftCounter
                            </h1>
                            <p className="text-xs text-slate-400">Retail POS v1.0</p>
                        </div>
                    </div>

                    {/* Dynamic Role Indicator */}
                    <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60">
                            Role:
                        </span>
                        <span
                            className={`text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full border ${userRole === "admin"
                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30"
                                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                }`}
                        >
                            {userRole ? userRole.toUpperCase() : "AUTHENTICATING..."}
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon className="text-xl" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Quick Status */}
            <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/50 text-xs text-slate-600 dark:text-slate-400">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                    System Ready
                </p>
                <p className="text-[11px] text-emerald-500 dark:text-emerald-400 flex items-center gap-1.5 mt-1 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                    Terminal Connected
                </p>
            </div>
        </aside>
    );
}