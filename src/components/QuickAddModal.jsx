"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function QuickAddModal({ isOpen, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        sku: "",
        category: "General",
        sellingPrice: "",
        stockQuantity: "10",
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("pos_token");
            if (!token) {
                toast.error("Session expired. Please log in again.");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001"}/api/products/quick-add`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const data = await res.json();

            if (data.success) {
                toast.success(`"${data.data.title}" added to inventory!`);
                // ফর্ম রিসেট
                setFormData({
                    title: "",
                    sku: "",
                    category: "General",
                    sellingPrice: "",
                    stockQuantity: "10",
                });
                // প্যারেন্ট কম্পোনেন্টকে নতুন প্রোডাক্ট পাস করা
                onSuccess(data.data);
                onClose();
            } else {
                toast.error(data.message || "Failed to add product");
            }
        } catch (err) {
            console.error("Quick add error:", err);
            toast.error("Network error while adding product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-white">Quick Add New Item</h3>
                        <p className="text-[11px] text-slate-400">
                            Instantly add product to POS counter & inventory
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-white text-lg p-1 cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Ice Cream Cup"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({ ...formData, title: e.target.value })
                            }
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-emerald-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Barcode / SKU
                            </label>
                            <input
                                type="text"
                                placeholder="Scan or auto-generated"
                                value={formData.sku}
                                onChange={(e) =>
                                    setFormData({ ...formData, sku: e.target.value })
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Snack, Beverage"
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Cost Price (৳)
                                </label>
                                <span className="text-[9px] bg-slate-800 text-amber-400 px-1.5 py-0.5 rounded">
                                    Admin Only
                                </span>
                            </div>
                            <input
                                type="text"
                                disabled
                                value="Locked (৳ 0)"
                                className="w-full bg-slate-950/60 border border-slate-800/60 rounded-xl px-3 py-2 text-xs text-slate-500 cursor-not-allowed select-none"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                Selling Price (৳) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="0.00"
                                value={formData.sellingPrice}
                                onChange={(e) =>
                                    setFormData({ ...formData, sellingPrice: e.target.value })
                                }
                                className="w-full bg-slate-950 border border-emerald-500/40 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-emerald-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Initial Stock
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={formData.stockQuantity}
                                onChange={(e) =>
                                    setFormData({ ...formData, stockQuantity: e.target.value })
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-emerald-500"
                            />
                        </div>
                        <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                                Status
                            </label>
                            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Available
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2.5 pt-3 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition cursor-pointer"
                        >
                            {loading ? "Adding..." : "Add & Select"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}