"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaReceipt,
    FaPrint,
    FaSearch,
    FaTimes,
    FaMoneyBillWave,
    FaCreditCard,
    FaMobileAlt
} from "react-icons/fa";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SalesHistoryPage() {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    // Load Sales Data
    const fetchSales = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/sales`);
            const data = await res.json();
            if (data.success) {
                setSales(data.data);
            }
        } catch (err) {
            console.error("Failed to load sales history:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Filter by Invoice or Customer Name
    const filteredSales = sales.filter((item) => {
        const term = search.toLowerCase();
        const inv = item.invoiceNumber?.toLowerCase() || "";
        const customer = item.customerName?.toLowerCase() || "";
        return inv.includes(term) || customer.includes(term);
    });

    // Native Print Trigger
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-6">
            {/* Header section with Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FaReceipt className="text-indigo-600" /> Sales & Invoices
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Track daily transaction logs, audit bills and print receipts
                    </p>
                </div>

                {/* Search input */}
                <div className="relative w-full sm:w-72">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search invoice or customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-72 pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600"
                    />
                </div>
            </div>

            {/* Sales Logs Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                                <th className="py-3.5 px-4">Invoice No</th>
                                <th className="py-3.5 px-4">Date & Time</th>
                                <th className="py-3.5 px-4">Customer</th>
                                <th className="py-3.5 px-4">Items Count</th>
                                <th className="py-3.5 px-4">Payment</th>
                                <th className="py-3.5 px-4 text-right">Net Total</th>
                                <th className="py-3.5 px-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-slate-400">
                                        Loading transactions...
                                    </td>
                                </tr>
                            ) : filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-slate-400">
                                        No sales records found.
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((sale) => {
                                    const dateStr = new Date(sale.createdAt).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    });

                                    return (
                                        <tr key={sale._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                            <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                                                {sale.invoiceNumber}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{dateStr}</td>
                                            <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                                                {sale.customerName || "Walk-in"}
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full font-bold border border-slate-200/60 dark:border-slate-700">
                                                    {sale.items?.length || 0}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/50">
                                                    {sale.paymentMethod === "Cash" && <FaMoneyBillWave />}
                                                    {sale.paymentMethod === "Card" && <FaCreditCard />}
                                                    {sale.paymentMethod === "MFS" && <FaMobileAlt />}
                                                    {sale.paymentMethod}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-black text-slate-900 dark:text-white text-sm">
                                                ৳{sale.total}
                                            </td>
                                            <td className="py-3.5 px-4 text-center">
                                                <button
                                                    onClick={() => setSelectedInvoice(sale)}
                                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white rounded-lg font-bold border border-slate-200/60 dark:border-slate-700 transition flex items-center gap-1.5 mx-auto cursor-pointer"
                                                >
                                                    <FaPrint className="text-xs" /> View & Print
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ================= Printable Receipt Modal ================= */}
            <AnimatePresence>
                {selectedInvoice && (
                    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Control Bar (Excluded from print) */}
                            <div className="print:hidden p-4 bg-slate-900 text-white flex items-center justify-between">
                                <span className="font-bold text-xs">Receipt Preview</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrint}
                                        className="p-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                                    >
                                        <FaPrint /> Print Receipt
                                    </button>
                                    <button
                                        onClick={() => setSelectedInvoice(null)}
                                        className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            </div>

                            {/* Thermal Paper Body (Formatted for 80mm POS receipt printers) */}
                            <div
                                id="receipt-print-area"
                                className="p-6 overflow-y-auto font-mono text-slate-900 text-xs space-y-3 bg-white"
                            >
                                {/* Store Header */}
                                <div className="text-center pb-3 border-b border-dashed border-slate-300">
                                    <h2 className="text-base font-black tracking-tight text-slate-900">
                                        SWIFT COUNTER POS
                                    </h2>
                                    <p className="text-[10px] text-slate-500 mt-0.5">Counter #01 - Main Branch</p>
                                    <p className="text-[10px] text-slate-500">Contact: +880 1700-000000</p>
                                </div>

                                {/* Memo Meta details */}
                                <div className="text-[11px] space-y-1 pb-2 border-b border-dashed border-slate-300">
                                    <div className="flex justify-between">
                                        <span>Invoice:</span>
                                        <span className="font-bold">{selectedInvoice.invoiceNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Date:</span>
                                        <span>
                                            {new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB")}{" "}
                                            {new Date(selectedInvoice.createdAt).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Customer:</span>
                                        <span>{selectedInvoice.customerName || "Walk-in"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Method:</span>
                                        <span>{selectedInvoice.paymentMethod}</span>
                                    </div>
                                </div>

                                {/* Items Summary Table */}
                                <div className="pt-1">
                                    <table className="w-full text-[11px]">
                                        <thead>
                                            <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                                                <th className="text-left pb-1">Item</th>
                                                <th className="text-center pb-1">Qty</th>
                                                <th className="text-right pb-1">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-dotted divide-slate-200">
                                            {selectedInvoice.items?.map((prod, idx) => (
                                                <tr key={idx} className="py-1">
                                                    <td className="py-1 pr-1">
                                                        <p className="font-semibold">{prod.title}</p>
                                                        <span className="text-[9px] text-slate-400">@৳{prod.price}</span>
                                                    </td>
                                                    <td className="py-1 text-center font-bold">{prod.quantity}</td>
                                                    <td className="py-1 text-right font-bold">
                                                        ৳{prod.price * prod.quantity}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Calculation breakdown */}
                                <div className="pt-2 border-t border-dashed border-slate-300 text-[11px] space-y-1">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>৳{selectedInvoice.subtotal}</span>
                                    </div>
                                    {selectedInvoice.discount > 0 && (
                                        <div className="flex justify-between text-rose-600">
                                            <span>Discount:</span>
                                            <span>-৳{selectedInvoice.discount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-800">
                                        <span>NET TOTAL:</span>
                                        <span>৳{selectedInvoice.total}</span>
                                    </div>
                                </div>

                                {/* Receipt Footer Message */}
                                <div className="text-center pt-4 text-[10px] text-slate-500 border-t border-dashed border-slate-300">
                                    <p>Thank you for shopping with us!</p>
                                    <p className="mt-0.5">Software by SwiftCounter POS</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}