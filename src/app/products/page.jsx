"use client";

import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaExclamationTriangle, FaEdit, FaTrash, FaTimes, FaBoxOpen } from "react-icons/fa";
import { MdRefresh } from "react-icons/md";
import { motion } from "framer-motion";
import { toast } from "react-toastify";


const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    // Delete confirmation modal state
    const [deleteTarget, setDeleteTarget] = useState(null); // { id: "...", title: "..." }

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
            const token = localStorage.getItem("pos_token"); // ১. লোকালস্টোরেজ থেকে টোকেন নেওয়া
            if (!token) {
                toast.error("Session expired. Please log in again.");
                return;
            }

            const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(search)}`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ২. হেডারে টোকেন পাঠানো
                }
            });
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
            const url = editingId ? `${API_BASE}/api/products/${editingId}` : `${API_BASE}/api/products`;
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("pos_token")}`
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success) {
                setModalOpen(false);
                setEditingId(null);
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

    //  Edit button e caple modale ager data boshanor handler
    const handleOpenEdit = (product) => {
        setEditingId(product._id);
        setFormData({
            title: product.title,
            sku: product.sku,
            category: product.category || "General",
            costPrice: product.costPrice,
            sellingPrice: product.sellingPrice,
            stockQuantity: product.stockQuantity,
            lowStockThreshold: product.lowStockThreshold || 5,
        });
        setModalOpen(true);
    };

    // টেবিলে ট্র্যাশ আইকনে চাপ দিলে মডালটি খুলবে
    const promptDelete = (product) => {
        setDeleteTarget(product);
    };

    // Product delete handler
    const handleDelete = async () => {
        // deleteTarget না থাকলে রিটার্ন করবে
        if (!deleteTarget) return;

        try {
            const token = localStorage.getItem("pos_token");
            if (!token) {
                toast.error("Session expired. Please log in again.");
                return;
            }

            // id-এর জায়গায় deleteTarget._id হবে
            const res = await fetch(`${API_BASE}/api/products/${deleteTarget._id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (data.success) {
                // title-এর জায়গায় deleteTarget.title হবে
                toast.success(`"${deleteTarget.title}" deleted successfully!`);
                fetchProducts(); // টেবিল রিফ্রেশ করা
            } else {
                toast.error(data.message || "Failed to delete");
            }
        } catch (err) {
            toast.error("Something went wrong while deleting");
        } finally {
            setDeleteTarget(null); // মডাল বন্ধ করা
        }
    };

    return (
        <div className="space-y-6">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Products & Inventory</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage store item stock levels</p>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition shadow-sm"
                >
                    <FaPlus /> Add New Product
                </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex gap-4 items-center bg-white p-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3.5 top-3 text-slate-400 dark:text-slate-500 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by title or SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-1.5 text-sm rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition-colors"
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
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                            <tr>
                                <th className="p-4">Product Info</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Cost Price</th>
                                <th className="p-4">Selling Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 dark:text-slate-500">
                                        Loading products...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400 dark:text-slate-500">
                                        No products found in inventory.
                                    </td>
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
                                            className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                                        >
                                            <td className="p-4">
                                                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                                                    {p.title}
                                                </p>
                                                <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">
                                                    SKU: {p.sku}
                                                </p>
                                            </td>

                                            <td className="p-4">
                                                <span className="px-2.5 py-0.5 text-xs font-medium rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    {p.category}
                                                </span>
                                            </td>

                                            <td className="p-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                ৳{p.costPrice}
                                            </td>

                                            <td className="p-4">
                                                <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                                                    ৳{p.sellingPrice}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800">
                                                    {p.stockQuantity}
                                                </span>
                                            </td>

                                            <td className="p-4">
                                                {isOutOfStock ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-semibold border border-rose-200 dark:border-rose-800/60">
                                                        Out of Stock
                                                    </span>
                                                ) : isLowStock ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 font-semibold border border-amber-200 dark:border-amber-800/60">
                                                        <FaExclamationTriangle className="text-[10px]" /> Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-800/60">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                                                        Available
                                                    </span>
                                                )}
                                            </td>

                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleOpenEdit(p)}
                                                        className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors cursor-pointer"
                                                        title="Edit Product"
                                                    >
                                                        <FaEdit className="text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => promptDelete(p)} // পুরো product অবজেক্ট পাঠানো হচ্ছে
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition"
                                                        title="Delete Product"
                                                    >
                                                        <FaTrash className="text-xs" />
                                                    </button>
                                                </div>
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
                <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-100 dark:border-slate-800 transition-colors">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Add New Item to Inventory</h2>
                        <form onSubmit={handleCreateProduct} className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g. Dettol Soap 75g"
                                    className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">SKU / Barcode</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.sku}
                                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                        placeholder="e.g. DET-01"
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Category</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="e.g. Toiletries"
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Cost Price (৳)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.costPrice}
                                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Selling Price (৳)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.sellingPrice}
                                        onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Initial Stock</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.stockQuantity}
                                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-slate-900 dark:text-slate-200">Low Stock Alert at</label>
                                    <input
                                        type="number"
                                        value={formData.lowStockThreshold}
                                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                                        className="w-full mt-1 p-2 border bg-white dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 rounded-lg text-sm border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:focus:ring-indigo-500 transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Custom Delete Confirmation Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mx-auto text-xl">
                            🗑️
                        </div>

                        <div>
                            <h3 className="text-base font-bold text-white">Delete Product</h3>
                            <p className="text-xs text-slate-400 mt-1">
                                Are you sure you want to remove{" "}
                                <span className="text-rose-400 font-semibold">
                                    "{deleteTarget.title}"
                                </span>
                                ? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}