"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { motion } from "framer-motion";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        sku: "",
        category: "General",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        lowStockThreshold: 5,
    });

    // Fetch Products
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(search)}`);
            const data = await res.json();
            if (data.success) {
                setProducts(data.data);
            }
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 300);
        return () => clearTimeout(delayDebounce);
    }, [search]);

    // Handle Form Submit
    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/api/products`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setModalOpen(false);
                setFormData({
                    title: "",
                    sku: "",
                    category: "General",
                    costPrice: "",
                    sellingPrice: "",
                    stockQuantity: "",
                    lowStockThreshold: 5,
                });
                fetchProducts();
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error("Submission error:", err);
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products & Inventory</h1>
                    <p className="text-sm text-slate-500">Track and manage store item stock levels</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-slate-200">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by title or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-indigo-600"
                    />
                </div>
                <button
                    onClick={fetchProducts}
                    title="Refresh List"
                    className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                    <MdRefresh className="text-lg" />
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                                <th className="p-4">Product Info</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Cost Price</th>
                                <th className="p-4">Selling Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">No products found in inventory.</td>
                                </tr>
                            ) : (
                                products.map((p, index) => {
                                    const isOutOfStock = p.stockQuantity <= 0;
                                    const isLowStock = p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold;

                                    return (
                                        <motion.tr
                                            key={p._id || index}
                                            initial={{ opacity: 0, y: 15 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.04,
                                                ease: "easeOut",
                                            }}
                                            className="hover:bg-slate-50/70 transition"
                                        >
                                            <td className="p-4">
                                                <p className="font-semibold text-slate-800 text-xl text-violet-600">{p.title}</p>
                                                <p className="text-[11px] font-mono text-slate-400 mt-0.5">SKU: {p.sku}</p>
                                            </td>

                                            <td className="p-4">
                                                <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                                                    {p.category}
                                                </span>
                                            </td>

                                            <td className="p-4 text-sm text-slate-500 font-medium">৳{p.costPrice}</td>

                                            <td className="p-4">
                                                <span className="text-sm font-bold text-violet-600">৳{p.sellingPrice}</span>
                                            </td>

                                            <td className="p-4">
                                                <span className="text-sm font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                                                    {p.stockQuantity}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                {isOutOfStock ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-rose-50 text-rose-600 font-semibold border border-rose-200">
                                                        Out of Stock
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-amber-50 text-amber-600 font-semibold border border-amber-200 w-max">
                                                        <FaExclamationTriangle className="text-[10px]" /> Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-600 font-semibold border border-emerald-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                                        Available
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Product Modal */}
            {modalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-100">
                        <h2 className="text-lg font-bold text-slate-900 mb-4">Add New Item to Inventory</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-900">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Dettol Soap 75g"
                                    className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">SKU / Barcode</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="e.g. DET-01"
                                        className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">Category</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">Cost Price (৳)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">Selling Price (৳)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">Initial Stock</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                        className="w-full mt-1 p-2 border text-slate-900 rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900">Low Stock Alert at</label>
                                    <input
                                        type="number"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                        className="w-full mt-1 p-2 border rounded-lg text-sm border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}