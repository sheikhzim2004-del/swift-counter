"use client";

import { motion } from "framer-motion";
import { FaFire, FaTrophy } from "react-icons/fa";

export default function TopSellingProducts({ topProducts = [], loading = false }) {
    const maxSold = topProducts.length > 0 ? Math.max(...topProducts.map((p) => p.totalSold)) : 1;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm p-5 flex flex-col justify-between transition-colors"
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
                        <FaFire className="text-lg" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">Top 5 Selling Items</h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Highest volume performers by units sold</p>
                    </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800/50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <FaTrophy className="text-[9px]" /> All Time
                </span>
            </div>

            {/* Product List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-2">
                {loading ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        Calculating bestsellers...
                    </div>
                ) : topProducts.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
                        No sales records available yet.
                    </div>
                ) : (
                    topProducts.map((item, index) => {
                        const percentage = Math.round((item.totalSold / maxSold) * 100);

                        return (
                            <div key={item._id || index} className="py-3 first:pt-2 last:pb-1 group">
                                <div className="flex items-center justify-between gap-3 mb-1.5">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <span
                                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black shrink-0 ${index === 0
                                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60"
                                                    : index === 1
                                                        ? "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
                                                        : index === 2
                                                            ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                                                            : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                                }`}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {item.title}
                                        </span>
                                        {item.sku && (
                                            <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 shrink-0">
                                                ({item.sku})
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-right shrink-0">
                                        <span className="text-xs font-black text-slate-900 dark:text-white">
                                            {item.totalSold}{" "}
                                            <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
                                                pcs
                                            </span>
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className={`h-full rounded-full ${index === 0
                                                ? "bg-indigo-600 dark:bg-indigo-500"
                                                : "bg-slate-400 dark:bg-slate-600"
                                            }`}
                                    />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}