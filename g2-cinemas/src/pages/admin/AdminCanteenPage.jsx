import React, { useState } from "react";
import {
  UtensilsCrossed,
  PlusCircle,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  X,
  Search,
  ShoppingBag
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { PRODUCT_CATEGORIES } from "../../data/products";
import toast from "react-hot-toast";

export const AdminCanteenPage = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductAvailability
  } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "Popcorn",
    description: "",
    price: 180,
    stock: 50,
    image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    isRecommended: false,
    isAvailable: true
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === "All" ? true : p.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      category: "Popcorn",
      description: "",
      price: 180,
      stock: 50,
      image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=600&q=80",
      isVeg: true,
      isPopular: false,
      isRecommended: false,
      isAvailable: true
    });
    setShowProductModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProduct(p);
    setForm({
      name: p.name,
      category: p.category,
      description: p.description,
      price: p.price,
      stock: p.stock,
      image: p.image,
      isVeg: p.isVeg,
      isPopular: p.isPopular || false,
      isRecommended: p.isRecommended || false,
      isAvailable: p.isAvailable !== undefined ? p.isAvailable : true
    });
    setShowProductModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name) {
      toast.error("Product name is required.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
    } else {
      addProduct(payload);
    }

    setShowProductModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Canteen & Concessions Administration
          </h1>
          <p className="text-xs text-[#888]">
            Manage cinema snacks, combo offers, stock quantities, and pricing.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2.5 rounded-xl text-xs font-black transition shadow-lg shadow-[#FFC914]/20 cursor-pointer self-start sm:self-center"
        >
          <PlusCircle className="w-4 h-4 fill-black" />
          <span>Add Canteen Product</span>
        </button>
      </div>

      {/* Filter and Categories Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 rounded-2xl border border-[#292929]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {["All", "Popcorn", "Combos", "Beverages", "Burgers", "Nachos", "More"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-[#FFC914] text-black"
                    : "bg-[#1c1c1c] text-[#888] hover:text-white"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#888] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#666] focus:border-[#FFC914]"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden flex flex-col justify-between hover:border-[#444] transition"
          >
            <div className="p-5 flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#1f1f1f] shrink-0 relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                {p.isPopular && (
                  <span className="absolute top-1 left-1 bg-[#FFC914] text-black text-[8px] font-black px-1 rounded">
                    POPULAR
                  </span>
                )}
              </div>

              <div className="space-y-1 overflow-hidden flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#FFC914] font-bold uppercase">
                    {p.category}
                  </span>
                  <div
                    className={`w-3.5 h-3.5 border rounded-sm flex items-center justify-center p-0.5 ${
                      p.isVeg ? "border-[#22C55E]" : "border-[#EF4444]"
                    }`}
                  >
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        p.isVeg ? "bg-[#22C55E]" : "bg-[#EF4444]"
                      }`}
                    />
                  </div>
                </div>

                <h4 className="font-extrabold text-sm text-white truncate">{p.name}</h4>
                <p className="text-[11px] text-[#888] line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-sm font-black text-white">₹{p.price}</span>
                  <span className="text-[11px] text-[#aaa]">Stock: {p.stock} units</span>
                </div>
              </div>
            </div>

            <div className="bg-[#191919] px-5 py-3 border-t border-[#242424] flex items-center justify-between text-xs">
              <button
                onClick={() => toggleProductAvailability(p.id)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                  p.isAvailable
                    ? "bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30"
                    : "bg-red-500/15 text-red-400 border border-red-500/30"
                }`}
              >
                {p.isAvailable ? "Active in Menu" : "Temporarily Disabled"}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-[#FFC914] cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Delete ${p.name}?`)) {
                      deleteProduct(p.id);
                    }
                  }}
                  className="p-1.5 rounded-lg bg-[#222] hover:bg-red-950/40 text-[#888] hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-[#141414] border border-[#292929] rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <h3 className="font-extrabold text-base text-white">
                {editingProduct ? "Edit Product" : "Add Canteen Product"}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="text-[#888] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-[#888] block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  >
                    {["Popcorn", "Combos", "Beverages", "Burgers", "Nachos", "More"].map(
                      (cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#888] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#888] block mb-1">Food Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isVeg}
                    onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                    className="rounded bg-[#222] border-[#444] text-[#FFC914]"
                  />
                  <span className="text-white">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={(e) => setForm({ ...form, isPopular: e.target.checked })}
                    className="rounded bg-[#222] border-[#444] text-[#FFC914]"
                  />
                  <span className="text-white">Popular / Bestseller</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isAvailable}
                    onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
                    className="rounded bg-[#222] border-[#444] text-[#FFC914]"
                  />
                  <span className="text-white">Currently Available</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#292929]">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#888] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#FFC914] text-black font-extrabold text-xs hover:bg-[#EAB308]"
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
};

