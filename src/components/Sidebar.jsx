"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MdDashboard,
    MdPointOfSale,
    MdInventory,
    MdReceiptLong
} from "react-icons/md";

const navItems = [
    { name: "Dashboard", href: "/", icon: MdDashboard },
    { name: "POS Counter", href: "/pos", icon: MdPointOfSale },
    { name: "Products", href: "/products", icon: MdInventory },
    { name: "Sales History", href: "/sales", icon: MdReceiptLong },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen flex flex-col justify-between p-4 border-r-4 border-slate-200 dark:border-slate-800 shrink-0 transition-colors duration-200">
            <div>
                {/* Brand Logo */}
                <div className="flex items-center gap-3 px-2 py-4 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl text-white shadow-md">
                        SC
                    </div>
                    <div>
                        <h1 className="text-lg font-bold tracking-wide dark:text-white">SwiftCounter</h1>
                        <p className="text-xs text-slate-400">Retail POS v1.0</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-600 text-white shadow-sm"
                                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
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
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/50 text-xs text-slate-400">
                <p className="font-semibold text-slate-200">System Ready</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    Terminal Connected
                </p>
            </div>
        </aside>
    );
}