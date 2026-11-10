import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Armchair,
  Film,
  LogIn,
  AlertCircle,
  Check,
  User,
  Phone
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { PRODUCT_CATEGORIES } from "../../data/products";
import toast from "react-hot-toast";

const AUDITORIUM_SCREENS = [
  {
    id: "Screen 1",
    name: "Screen 1 - Dolby Atmos",
    format: "4K Laser • 64-Channel Dolby Atmos",
    tag: "Dolby Atmos Auditorium"
  },
  {
    id: "Screen 2",
    name: "Screen 2 - Dolby Atmos",
    format: "Dual 4K • 64-Channel Dolby Atmos",
    tag: "Dolby Atmos Auditorium"
  }
];

const SEAT_ROWS = [
  { row: "G", type: "Recliner VIP", color: "text-[#FFC914]" },
  { row: "F", type: "Premium", color: "text-blue-400" },
  { row: "E", type: "Premium", color: "text-blue-400" },
  { row: "D", type: "Premium", color: "text-blue-400" },
  { row: "C", type: "Standard", color: "text-neutral-400" },
  { row: "B", type: "Standard", color: "text-neutral-400" },
  { row: "A", type: "Standard", color: "text-neutral-400" }
];

export const FoodPage = () => {
  const navigate = useNavigate();
  const { products, createStandaloneOrder } = useApp();
  const { isAuthenticated, user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [filterVegOnly, setFilterVegOnly] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Screen & Seat Selection State (Required before checkout)
  const [selectedScreen, setSelectedScreen] = useState("Screen 1");
  const [selectedRow, setSelectedRow] = useState("E");
  const [selectedSeatNum, setSelectedSeatNum] = useState(6);

  // Customer contact state
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || "Aarav Kumar",
    mobile: user?.phone || "9876543210",
    instructions: ""
  });

  const [placedOrder, setPlacedOrder] = useState(null);

  // Sync customerInfo when user logs in/changes
  useEffect(() => {
    if (user) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: user.name || prev.name,
        mobile: user.phone || prev.mobile
      }));
    }
  }, [user]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p.isAvailable) return false;

      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase());

      let matchesCat = true;
      if (activeCategory === "Recommended") {
        matchesCat = p.isRecommended || p.isPopular;
      } else if (activeCategory !== "All") {
        matchesCat = p.category === activeCategory;
      }

      const matchesVeg = filterVegOnly ? p.isVeg : true;

      return matchesSearch && matchesCat && matchesVeg;
    });
  }, [products, searchQuery, activeCategory, filterVegOnly]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`Added ${product.name}`);
  };

  const updateQty = (id, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Open checkout modal - only allowed after sign in
  const handleOpenCheckout = () => {
    if (cart.length === 0) return;
    if (!isAuthenticated) {
      toast.error("Please sign in to order snacks and select your seat.");
      navigate("/login", { state: { from: "/food" } });
      return;
    }
    setShowCheckoutModal(true);
  };

  // Place order with selected screen & seat
  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your snack order.");
      navigate("/login", { state: { from: "/food" } });
      return;
    }
    if (!selectedScreen) {
      toast.error("Please choose Screen 1 or Screen 2.");
      return;
    }
    if (!selectedRow || !selectedSeatNum) {
      toast.error("Please choose your seat number for delivery.");
      return;
    }
    if (!customerInfo.name || !customerInfo.mobile) {
      toast.error("Please provide your name and mobile number.");
      return;
    }

    const seatLabel = `${selectedRow}-${String(selectedSeatNum).padStart(2, "0")}`;

    const order = createStandaloneOrder({
      customerName: customerInfo.name,
      customerMobile: customerInfo.mobile,
      orderType: "SEAT_DELIVERY",
      screen: selectedScreen,
      seats: seatLabel,
      items: cart,
      instructions: customerInfo.instructions
    });

    setPlacedOrder(order);
    setShowCheckoutModal(false);
    setCart([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#FFC914] block mb-1">
            G2 GOURMET KITCHEN & CANTEEN • VADIPATTI
          </span>
          <h1 className="text-3xl font-black text-white">
            Cinematic Food & Beverages
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Order theatre-fresh popcorn, combos, and snacks delivered directly to your seat in Screen 1 or Screen 2.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search snacks, popcorn, drinks..."
            className="w-full bg-[#141414] border border-[#292929] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#FFC914] transition"
          />
        </div>
      </div>

      {/* Authentication Notice Banner */}
      {!isAuthenticated ? (
        <div className="bg-[#1f1908] border border-[#FFC914]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-[#FFC914]/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFC914]/20 border border-[#FFC914]/40 flex items-center justify-center text-[#FFC914] shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white">
                Sign in to Order Snacks to Your Seat
              </h4>
              <p className="text-xs text-[#A1A1AA] mt-0.5">
                Browse our full canteen menu now. Sign in is required before selecting Screen 1 or Screen 2 and your seat number.
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login", { state: { from: "/food" } })}
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl font-black text-xs transition shadow-md shadow-[#FFC914]/20 shrink-0 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Order</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#292929] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#22C55E] flex items-center justify-center shrink-0">
              <Armchair className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[#888]">Logged in as: </span>
              <span className="text-white font-bold">{user?.name}</span>
              <span className="text-[#666] ml-1">({user?.email || user?.phone})</span>
              <div className="text-[11px] text-[#FFC914] font-medium mt-0.5">
                ✓ Seat delivery active for Screen 1 & Screen 2
              </div>
            </div>
          </div>
          <span className="text-[11px] bg-[#1f1f1f] border border-[#333] px-3 py-1 rounded-full text-[#aaa]">
            Vadipatti G2 Canteen
          </span>
        </div>
      )}

      {/* Main Grid: Products on Left, Cart on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Categories and Veg Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {PRODUCT_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-[#FFC914] text-black shadow-md shadow-[#FFC914]/20"
                      : "bg-[#141414] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#292929]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setFilterVegOnly(!filterVegOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                filterVegOnly
                  ? "bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E]"
                  : "bg-[#141414] border-[#292929] text-[#888] hover:text-white"
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full border border-green-500 flex items-center justify-center p-0.5">
                <span className="w-full h-full rounded-full bg-green-500" />
              </span>
              <span>Veg Only</span>
            </button>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredProducts.map((product) => {
              const inCart = cart.find((i) => i.id === product.id);
              const qty = inCart ? inCart.quantity : 0;

              return (
                <div
                  key={product.id}
                  className="bg-[#141414] rounded-xl sm:rounded-2xl border border-[#292929] p-3 sm:p-4 flex gap-3 sm:gap-4 hover:border-[#FFC914]/40 transition-all group overflow-hidden"
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-[#1f1f1f] shrink-0 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {product.isPopular && (
                      <span className="absolute top-1 left-1 bg-[#FFC914] text-black text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                        POPULAR
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between overflow-hidden">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 border rounded-sm flex items-center justify-center p-0.5 shrink-0 ${
                            product.isVeg ? "border-[#22C55E]" : "border-[#EF4444]"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              product.isVeg ? "bg-[#22C55E]" : "bg-[#EF4444]"
                            }`}
                          />
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                          {product.name}
                        </h4>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#777] line-clamp-1 sm:line-clamp-2 mt-0.5 leading-snug">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-[#222]">
                      <span className="text-xs sm:text-sm font-extrabold text-white">
                        ₹{product.price}
                      </span>

                      {qty > 0 ? (
                        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#202020] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg sm:rounded-xl border border-[#333]">
                          <button
                            onClick={() => updateQty(product.id, -1)}
                            className="text-[#FFC914] hover:text-white p-0.5 cursor-pointer"
                          >
                            <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <span className="text-[11px] sm:text-xs font-bold text-white w-3 sm:w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQty(product.id, 1)}
                            className="text-[#FFC914] hover:text-white p-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(product)}
                          className="bg-[#222] hover:bg-[#FFC914] hover:text-black text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold border border-[#333] transition cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Reduced Size Cart Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] rounded-xl sm:rounded-2xl border border-[#292929] p-3.5 sm:p-5 space-y-3 sm:space-y-4 sticky top-24">
            <div className="flex items-center justify-between border-b border-[#292929] pb-2.5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#FFC914]" />
                <h3 className="font-bold text-xs sm:text-sm text-white">Canteen Basket</h3>
              </div>
              <span className="text-[11px] bg-[#222] px-2 py-0.5 rounded text-[#888] font-mono">
                {cart.reduce((s, i) => s + i.quantity, 0)} items
              </span>
            </div>

            {cart.length === 0 ? (
              <div className="py-6 sm:py-8 text-center text-xs text-[#666] space-y-1.5">
                <p>No snacks added yet.</p>
                <p className="text-[10px] sm:text-[11px] text-[#555]">
                  Select popcorn, combos, or drinks for seat delivery.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 sm:max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2 sm:p-2.5 rounded-lg sm:rounded-xl border border-[#2a2a2a] gap-2"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0 pr-1">
                      <div className="font-bold text-white text-xs truncate">{item.name}</div>
                      <div className="text-[10px] text-[#888]">
                        ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="flex items-center bg-[#252525] rounded-md border border-[#3a3a3a] px-1 py-0.5">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="text-[#aaa] hover:text-white cursor-pointer"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="w-4 text-center font-bold text-white text-[10px]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="text-[#FFC914] hover:text-white cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#666] hover:text-[#EF4444] transition p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total and Checkout Button */}
            <div className="pt-2.5 border-t border-[#292929] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#888] text-[11px]">
                <span>Service</span>
                <span className="text-[#FFC914] font-semibold flex items-center gap-1">
                  <Armchair className="w-3 h-3" />
                  <span>Auditorium Delivery</span>
                </span>
              </div>
              <div className="flex justify-between text-[#888] text-[11px]">
                <span>Auditoriums</span>
                <span className="text-white font-medium">Screen 1 & Screen 2</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-extrabold text-white pt-1.5 border-t border-[#222]">
                <span>Total Amount</span>
                <span className="text-[#FFC914] text-lg sm:text-xl">₹{totalAmount}</span>
              </div>
            </div>

            <button
              onClick={handleOpenCheckout}
              disabled={cart.length === 0}
              className={`w-full py-2.5 sm:py-3.5 rounded-xl font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                cart.length > 0
                  ? "bg-[#FFC914] hover:bg-[#EAB308] text-black shadow-lg shadow-[#FFC914]/20"
                  : "bg-[#252525] text-[#666] cursor-not-allowed"
              }`}
            >
              <span>Choose Screen, Seat & Checkout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Sticky Checkout Bar */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 sm:bottom-4 inset-x-3 z-40 lg:hidden bg-[#141414]/95 backdrop-blur-md border border-[#FFC914]/50 p-3 rounded-2xl flex items-center justify-between shadow-2xl animate-in slide-in-from-bottom-4">
          <div>
            <div className="text-[10px] text-[#888] font-bold">
              {cart.reduce((s, i) => s + i.quantity, 0)} Items Added
            </div>
            <div className="text-base font-black text-[#FFC914]">
              ₹{totalAmount}
            </div>
          </div>

          <button
            onClick={handleOpenCheckout}
            className="bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl font-black text-xs shadow-md shadow-[#FFC914]/25 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Select Seat & Order</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Screen & Seat Selection Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="w-full max-w-xl bg-[#141414] border border-[#292929] rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-2xl my-4 sm:my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#292929] pb-3 sm:pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FFC914] block">
                  DELIVERY DESTINATION
                </span>
                <h3 className="font-black text-base sm:text-lg text-white">
                  Choose Screen & Seat Number
                </h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-[#202020] hover:bg-[#333] text-[#888] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* STEP 1: CHOOSE SCREEN (Screen 1 or Screen 2) */}
            <div className="space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black flex items-center justify-center text-[10px] font-black">
                  1
                </span>
                <span>Select Auditorium Screen</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {AUDITORIUM_SCREENS.map((sc) => {
                  const isSelected = selectedScreen === sc.id;
                  return (
                    <div
                      key={sc.id}
                      onClick={() => setSelectedScreen(sc.id)}
                      className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-[#1f1a08] border-[#FFC914] shadow-lg shadow-[#FFC914]/15"
                          : "bg-[#181818] border-[#292929] hover:bg-[#202020] hover:border-[#444]"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#FFC914] text-black flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      )}
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? "bg-[#FFC914] text-black"
                              : "bg-[#252525] text-[#888]"
                          }`}
                        >
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <h4
                            className={`text-sm font-black ${
                              isSelected ? "text-[#FFC914]" : "text-white"
                            }`}
                          >
                            {sc.id}
                          </h4>
                          <span className="text-[10px] text-[#888] block">
                            {sc.format}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: CHOOSE SEAT NUMBER */}
            <div className="space-y-3 bg-[#181818] p-4 rounded-2xl border border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  <span>Select Your Seat Number in {selectedScreen}</span>
                </label>
                <span className="text-[11px] font-bold text-[#FFC914]">
                  Selected: {selectedRow}-{String(selectedSeatNum).padStart(2, "0")}
                </span>
              </div>

              {/* Visual Curved Screen Bar */}
              <div className="pt-2 text-center">
                <div className="w-3/4 mx-auto h-1.5 rounded-full bg-gradient-to-r from-transparent via-[#FFC914] to-transparent shadow-sm shadow-[#FFC914]" />
                <span className="text-[9px] uppercase tracking-widest text-[#777] block mt-1">
                  {selectedScreen} AUDITORIUM SCREEN
                </span>
              </div>

              {/* Interactive Mini Seat Grid */}
              <div className="space-y-1.5 pt-2 max-w-sm mx-auto overflow-x-auto pb-1 scrollbar-none text-center">
                <div className="inline-block min-w-max mx-auto space-y-1.5">
                  {SEAT_ROWS.map(({ row, type, color }) => (
                    <div key={row} className="flex items-center justify-center gap-1 sm:gap-1.5">
                      <span className={`w-4 text-center font-bold text-[10px] ${color}`}>
                        {row}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
                          const isSelected = selectedRow === row && selectedSeatNum === num;
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => {
                                setSelectedRow(row);
                                setSelectedSeatNum(num);
                              }}
                              className={`w-5 h-5 sm:w-6 sm:h-6 rounded text-[9px] sm:text-[10px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                                isSelected
                                  ? "bg-[#FFC914] text-black font-black scale-110 shadow-md shadow-[#FFC914]/40"
                                  : "bg-[#252525] text-[#888] hover:bg-[#333] hover:text-white"
                              }`}
                            >
                              {num}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Selection Summary Pill */}
              <div className="bg-[#121212] p-3 rounded-xl border border-[#2f2f2f] flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Armchair className="w-4 h-4 text-[#FFC914]" />
                  <span className="text-[#888]">Delivery Seat:</span>
                  <span className="font-black text-white bg-[#222] px-2 py-0.5 rounded border border-[#333]">
                    {selectedScreen} • Row {selectedRow}, Seat {selectedSeatNum}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#22C55E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Seat Confirmed
                </span>
              </div>
            </div>

            {/* STEP 3: GUEST INFORMATION & INSTRUCTIONS */}
            <div className="space-y-3 text-xs">
              <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black flex items-center justify-center text-[10px] font-black">
                  3
                </span>
                <span>Recipient & Cooking Instructions</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#888] block mb-1">Your Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl pl-9 pr-3 py-2 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#888] block mb-1">Mobile (For Delivery Updates)</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-[#666] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={customerInfo.mobile}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                      className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl pl-9 pr-3 py-2 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[#888] block mb-1">Special Cooking / Delivery Request (Optional)</label>
                <textarea
                  value={customerInfo.instructions}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, instructions: e.target.value })}
                  placeholder="e.g. Extra butter seasoning, deliver during intermission..."
                  rows={2}
                  className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white placeholder-[#555] resize-none focus:outline-none focus:border-[#FFC914]"
                />
              </div>

              {/* Order Amount Bar */}
              <div className="bg-[#1c1c1c] p-3.5 rounded-2xl border border-[#2e2e2e] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#888] block">Total Payable at Delivery:</span>
                  <span className="text-[11px] text-[#aaa]">
                    {cart.reduce((s, i) => s + i.quantity, 0)} snacks • Free seat delivery
                  </span>
                </div>
                <span className="text-[#FFC914] font-black text-xl">₹{totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#222]">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#888] hover:text-white cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handlePlaceOrder}
                className="px-6 py-3 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-lg shadow-[#FFC914]/25 flex items-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Send to Kitchen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Placed Success Alert */}
      {placedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#141414] border border-[#292929] rounded-3xl p-6 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] text-[#22C55E] flex items-center justify-center mx-auto shadow-lg shadow-[#22C55E]/15">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#22C55E] bg-[#22C55E]/15 border border-[#22C55E]/30 px-3 py-1 rounded-full">
                Order Dispatched
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Order Sent to Kitchen!
              </h3>
              <p className="text-xs text-[#888] mt-1">
                Your snacks are being prepared fresh at G2 Canteen.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#2a2a2a] space-y-2.5 text-xs text-left">
              <div className="flex justify-between items-center border-b border-[#252525] pb-2">
                <span className="text-[#888]">Order Token:</span>
                <span className="font-mono font-black text-[#FFC914] text-base">{placedOrder.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">Delivery Destination:</span>
                <span className="text-[#FFC914] font-bold text-xs bg-[#FFC914]/15 px-2 py-0.5 rounded border border-[#FFC914]/30">
                  {placedOrder.screen} • Seat {placedOrder.seats}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">Recipient:</span>
                <span className="text-white font-bold">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#888]">Status:</span>
                <span className="text-[#22C55E] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                  Sent to Kitchen Display
                </span>
              </div>
            </div>

            <div className="bg-[#171717] p-3 rounded-xl border border-[#252525] text-[11px] text-[#A1A1AA] flex items-center gap-2">
              <Armchair className="w-4 h-4 text-[#FFC914] shrink-0" />
              <span>Please remain in your seat inside <strong>{placedOrder.screen}</strong>. Our cinema crew will deliver your refreshments directly to you.</span>
            </div>

            <button
              onClick={() => setPlacedOrder(null)}
              className="w-full py-3.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-lg shadow-[#FFC914]/20 cursor-pointer transition-all"
            >
              Done & Return to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};