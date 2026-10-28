// src/app/pos/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaSearch,
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaCheckCircle,
  FaReceipt,
  FaTag
} from "react-icons/fa";
import { MdOutlineShoppingBag, MdLayers } from "react-icons/md";
import QuickAddModal from "@/components/QuickAddModal";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // প্রোডাক্ট সফলভাবে অ্যাড হলে যা ঘটবে
  const handleQuickAddSuccess = (newProduct) => {
    if (typeof loadProducts === "function") {
      loadProducts(); // প্রডাক্ট তালিকা রিফ্রেশ
    }
    if (typeof addToCart === "function") {
      addToCart(newProduct); // সাথে সাথে কার্টে অ্যাড
    }
  };


  // Load products from inventory
  const loadProducts = async () => {
    try {
      // ১. লোকালস্টোরেজ থেকে টোকেনটি নেওয়া
      const token = localStorage.getItem("pos_token");

      // ২. ফেচ রিকোয়েস্টে headers এর ভেতর Authorization টোকেন পাঠানো
      const res = await fetch(`${API_BASE}/api/products?search=${encodeURIComponent(search)}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }

  }

  useEffect(() => {
    const delay = setTimeout(loadProducts, 250);
    return () => clearTimeout(delay);
  }, [search]);

  // Add Item to Cart with haptic bounce feedback
  const addToCart = (product) => {
    if (product.stockQuantity <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          alert(`Maximum stock reached for ${product.title}`);
          return prev;
        }
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [{ ...product, quantity: 1 }, ...prev];
    });
  };

  // Adjust Quantity
  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item._id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty > item.stockQuantity) {
              alert(`Maximum stock limit (${item.stockQuantity})`);
              return item;
            }
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove Item
  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  // Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const finalTotal = Math.max(0, subtotal - Number(discount));

  // Checkout Handler
  const handleCheckout = async () => {
    if (!cart.length) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("pos_token")}`
        },
        body: JSON.stringify({
          items: cart,
          subtotal,
          discount: Number(discount),
          total: finalTotal,
          paymentMethod,
          customerName,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessModal(data.data);
        setCart([]);
        setDiscount(0);
        setCustomerName("");
        loadProducts();
      } else {
        alert(data.message || "Failed to process sale");
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6.5rem)]">
      {/* ================= LEFT SECTION: Product Catalog (7 Cols) ================= */}
      <div className="lg:col-span-7 flex flex-col gap-4 h-full">
        <div className="flex items-center gap-3 w-full">

          {/* Search bar container with flex-1 to take available space */}
          <div className="relative group flex-1">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition" />
            <input
              type="text"
              placeholder="Search items by product title, brand or barcode SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:border-indigo-600 dark:focus:border-indigo-500 shadow-sm transition"
            />
          </div>

          {/* Quick Add Button pushed to the end */}
          <button
            type="button"
            onClick={() => setIsQuickAddOpen(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer shadow-lg shadow-emerald-950 shrink-0"
          >
            <span className="text-sm font-bold">+</span> Quick Add
          </button>
        </div>

        {/* Product Cards Grid with Stagger & Hover Scale */}
        <div className="flex-1 overflow-y-auto pr-1">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 gap-3.5"
          >
            {products.map((item) => {
              const outOfStock = item.stockQuantity <= 0;
              const isLowStock = item.stockQuantity > 0 && item.stockQuantity <= (item.lowStockThreshold || 5);

              return (
                <motion.button
                  layout
                  whileHover={!outOfStock ? { y: -4, scale: 1.015 } : {}}
                  whileTap={!outOfStock ? { scale: 0.97 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  key={item._id}
                  disabled={outOfStock}
                  onClick={() => addToCart(item)}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-shadow relative overflow-hidden ${outOfStock
                    ? "bg-slate-100/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-500/5 cursor-pointer"
                    }`}
                >
                  {/* Decorative Background Glow on Hover */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 dark:from-indigo-950/30 to-transparent -mr-6 -mt-6 rounded-full pointer-events-none group-hover:scale-110 transition duration-300" />

                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100/60 dark:border-indigo-800/40 px-2 py-0.5 rounded-md uppercase">
                        {item.category || "General"}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-400 dark:text-slate-500">
                        {item.sku}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg tracking-tight">
                      ৳{item.sellingPrice}
                    </span>

                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${outOfStock
                        ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/60"
                        : isLowStock
                          ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60"
                          : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/60"
                        }`}
                    >
                      {outOfStock ? "Out" : `${item.stockQuantity} left`}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ================= RIGHT SECTION: High-Contrast Cart Drawer (5 Cols) ================= */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl flex flex-col h-full shadow-lg shadow-slate-200/50 dark:shadow-none overflow-hidden transition-colors">
        {/* Header with Dark Contrast Badge */}
        <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <MdOutlineShoppingBag className="text-lg" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-wide">Register Billing</h2>
              <p className="text-[11px] text-slate-400">Ready for instant invoice</p>
            </div>
          </div>
          <motion.span
            key={totalItemCount}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="text-xs font-bold bg-indigo-600/80 text-white px-3 py-1 rounded-full border border-indigo-400/30"
          >
            {totalItemCount} Items
          </motion.span>
        </div>

        {/* Customer Input Field */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800">
          <input
            type="text"
            placeholder="Customer Name / Mobile (Optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="w-full text-xs font-medium py-2 px-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 transition placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        {/* Animated Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          <AnimatePresence initial={false}>
            {cart.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm space-y-2 py-12"
              >
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 dark:text-slate-600">
                  <MdLayers className="text-3xl" />
                </div>
                <p className="font-semibold text-slate-600 dark:text-slate-300">Cart is empty</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Click products from catalog to add bill</p>
              </motion.div>
            ) : (
              cart.map((item) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={item._id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100/70 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 transition"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{item.title}</h4>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      ৳{item.sellingPrice} <span className="text-slate-400 dark:text-slate-500 font-normal">× {item.quantity}</span> = ৳{item.sellingPrice * item.quantity}
                    </p>
                  </div>

                  {/* Quantity Stepper & Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item._id, -1)}
                        className="p-1.5 px-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <FaMinus className="text-[9px]" />
                      </button>
                      <span className="text-xs font-black px-2 text-slate-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, 1)}
                        className="p-1.5 px-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        <FaPlus className="text-[9px]" />
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeItem(item._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                    >
                      <FaTrashAlt className="text-xs" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pricing Summary & Checkout Drawer Bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 backdrop-blur-sm space-y-3.5">
          <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
            <div className="flex justify-between items-center">
              <span>Subtotal Amount</span>
              <span className="font-bold text-slate-900 dark:text-white text-sm">৳{subtotal}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1.5">
                <FaTag className="text-indigo-500 dark:text-indigo-400 text-[10px]" /> Instant Discount
              </span>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 dark:text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-20 py-1 px-2 text-right text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-between items-center text-base font-black text-slate-900 dark:text-white pt-2.5 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm">Payable Amount</span>
              <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">৳{finalTotal}</span>
            </div>
          </div>

          {/* Payment Method Selector Pills */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "Cash", icon: FaMoneyBillWave },
              { id: "Card", icon: FaCreditCard },
              { id: "MFS", icon: FaMobileAlt },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`py-2 px-1 text-xs rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${isSelected
                    ? "bg-indigo-600 text-white shadow-indigo-500/25 border-transparent"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                >
                  <Icon className="text-xs" />
                  {method.id}
                </button>
              );
            })}
          </div>

          {/* Checkout CTA Button with Glow Effect */}
          <motion.button
            whileHover={!loading && cart.length ? { scale: 1.015 } : {}}
            whileTap={!loading && cart.length ? { scale: 0.98 } : {}}
            disabled={!cart.length || loading}
            onClick={handleCheckout}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Finalizing Invoice...
              </span>
            ) : (
              <>
                <FaReceipt /> Complete Checkout (৳{finalTotal})
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ================= SUCCESS MODAL (Framer Motion) ================= */}
      <AnimatePresence>
        {successModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-center items-center p-4">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 flex items-center justify-center mx-auto text-3xl shadow-sm">
                <FaCheckCircle />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Invoice Generated!</h3>
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
                  Memo No: <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{successModal.invoiceNumber}</span>
                </p>
                <div className="my-4 py-3 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Collected Amount</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">৳{successModal.total}</p>
                </div>
              </div>

              <button
                onClick={() => setSuccessModal(null)}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-2xl text-sm font-bold shadow-md transition cursor-pointer"
              >
                Start Next Sale (Enter)
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= QUICK ADD MODAL ================= */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSuccess={handleQuickAddSuccess}
      />
    </div>
  );
}