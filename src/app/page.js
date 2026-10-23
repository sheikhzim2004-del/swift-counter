"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaArrowTrendUp,
  FaReceipt,
  FaTriangleExclamation,
  FaCirclePlus,
  FaCashRegister,
  FaArrowRight
} from "react-icons/fa6";
import { MdOutlineShoppingBag } from "react-icons/md";
import TopSellingProducts from "@/components/TopSellingProducts";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalOrders: 0,
    todayOrders: 0,
    lowStockCount: 0,
    recentSales: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/analytics/dashboard`);
      const data = await res.json();
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (err) {
      console.error("Dashboard analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: "Today's Revenue",
      value: `৳${metrics.todayRevenue.toLocaleString()}`,
      subtitle: `${metrics.todayOrders} Orders completed today`,
      icon: FaArrowTrendUp,
      color: "from-emerald-500 to-teal-600",
      accent: "text-emerald-500",
      bgLight: "bg-emerald-50",
    },
    {
      title: "Total Revenue",
      value: `৳${metrics.totalRevenue.toLocaleString()}`,
      subtitle: `${metrics.totalOrders} Lifetime transactions`,
      icon: FaReceipt,
      color: "from-indigo-600 to-blue-700",
      accent: "text-indigo-600",
      bgLight: "bg-indigo-50",
    },
    {
      title: "Low Stock Alert",
      value: metrics.lowStockCount,
      subtitle: "Items below safe threshold (≤ 5)",
      icon: FaTriangleExclamation,
      color: "from-amber-500 to-orange-600",
      accent: "text-amber-500",
      bgLight: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick POS Launch CTA */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/10"
      >
        <div>
          <span className="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/20 px-3 py-1 rounded-full">
            Realtime Analytics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            Store Performance Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor incoming cash flow, checkouts and inventory shortages.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/pos"
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-2xl text-xs font-bold text-white shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
          >
            <FaCashRegister className="text-sm" /> Open POS Register
          </Link>
          <Link
            href="/products"
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-xs font-bold text-slate-200 transition flex items-center gap-2 cursor-pointer"
          >
            <FaCirclePlus /> Add Item
          </Link>
        </div>
      </motion.div>

      {/* KPI / Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.35 }}
              className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                  {stat.title}
                </span>
                <div className={`p-2.5 rounded-xl ${stat.bgLight} dark:bg-slate-800 ${stat.accent} dark:text-indigo-400`}>
                  <Icon className="text-base" />
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-3xl font-black text-slate-900 dark:text-slate-300 tracking-tight">
                  {loading ? "..." : stat.value}
                </h3>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                  {stat.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Sales History Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 items-stretch">
        {/* Left Column: Recent Completed Orders Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden transition-colors flex flex-col h-full"
        >
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                <MdOutlineShoppingBag className="text-lg" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">Recent Completed Orders</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Latest checkout memos synced with database</p>
              </div>
            </div>

            <Link
              href="/sales"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
            >
              Full History <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-950/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-5">Invoice</th>
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-5">Items</th>
                  <th className="py-3 px-5">Method</th>
                  <th className="py-3 px-5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500">
                      Loading recent orders...
                    </td>
                  </tr>
                ) : metrics.recentSales.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-400 dark:text-slate-500">
                      No sales recorded yet. Process an order from POS register.
                    </td>
                  </tr>
                ) : (
                  metrics.recentSales.map((sale) => (
                    <tr key={sale._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {sale.invoiceNumber}
                      </td>
                      <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">
                        {sale.customerName || "Walk-in"}
                      </td>
                      <td className="py-3 px-5">
                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 px-2 py-0.5 rounded-full font-bold">
                          {sale.items?.length || 0}
                        </span>
                      </td>
                      <td className="py-3 px-5">
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right font-black text-slate-900 dark:text-white">
                        ৳{sale.total}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Right Column: Top 5 Selling Products Card */}
        <div className="h-full">
          <TopSellingProducts
            topProducts={metrics?.topSellingProducts || []}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}