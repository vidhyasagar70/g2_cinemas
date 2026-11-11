import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UtensilsCrossed,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  Check
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { PRODUCT_CATEGORIES } from "../../data/products";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const FoodSelectionPage = () => {
  const navigate = useNavigate();
  const { products } = useApp();
  const { isAuthenticated } = useAuth();
  const {
    foodCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    totalFoodPrice,
    selectedSeats
  } = useBooking();

  // Authentication guard
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with your booking.");
      navigate("/login", { state: { from: "/book/food" }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [filterVegOnly, setFilterVegOnly] = useState(false);

  const totalItems = useMemo(() => {
    return foodCart.reduce((sum, item) => sum + item.quantity, 0);
  }, [foodCart]);

  // Available and active products
  const availableProducts = useMemo(() => {
    return products.filter((p) => p.isAvailable);
  }, [products]);

  // Filtered by category
  const filteredProducts = useMemo(() => {
    return availableProducts.filter((product) => {
      let matchesCat = true;
      if (activeCategory === "Recommended") {
        matchesCat = product.isRecommended || product.isPopular;
      } else if (activeCategory !== "All") {
        matchesCat = product.category.toLowerCase() === activeCategory.toLowerCase();
      }

      const matchesVeg = filterVegOnly ? product.isVeg : true;
      return matchesCat && matchesVeg;
    });
  }, [availableProducts, activeCategory, filterVegOnly]);

  const scrollToSnacks = () => {
    const el = document.getElementById("snacks-catalog-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleContinue = () => {
    if (foodCart.length > 0) {
      navigate("/book/delivery");
    } else {
      navigate("/book/checkout");
    }
  };

  const handleSkip = () => {
    if (foodCart.length > 0) {
      clearCart();
    }
    navigate("/book/checkout");
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-28 sm:pb-20">
      {/* Step indicator */}
      <BookingProgress currentStep={3} />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Top Navigation & Seat Context */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            type="button"
            onClick={() => navigate("/book/seats")}
            className="inline-flex items-center gap-1.5 text-[#888] hover:text-[#FFC914] font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Seat Selection</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-[#666] hidden sm:inline">Seats:</span>
            <span className="font-mono text-[#FFC914] font-bold bg-[#141414] border border-[#292929] px-2 py-0.5 rounded">
              {selectedSeats.map((s) => s.id).join(", ") || "None"}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 1. PROMINENT OPTIONAL SNACK STEP BANNER                  */}
        {/* Clearly communicates snacks are optional with 2 actions  */}
        {/* ======================================================== */}
        <div className="bg-gradient-to-br from-[#1a1506] via-[#141414] to-[#121212] border border-[#FFC914]/40 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle ambient gold glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFC914]/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#FFC914]/15 border border-[#FFC914]/40 text-[#FFC914] text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#FFC914]" />
                  <span>OPTIONAL STEP</span>
                </span>
                <span className="text-[11px] text-[#888] font-semibold">
                  Step 3 of 5 • Cinema Canteen
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                Want some snacks for your movie?
              </h1>

              <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                Snacks are optional. Add your favourites or skip and continue to payment.
              </p>
            </div>

            {/* Two clearly distinguishable actions */}
            <div className="flex items-center gap-2.5 shrink-0 pt-1 md:pt-0">
              {/* Primary Action: Add Snacks */}
              <button
                type="button"
                onClick={scrollToSnacks}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs transition shadow-lg shadow-[#FFC914]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <UtensilsCrossed className="w-4 h-4 fill-black" />
                <span>Add Snacks</span>
              </button>

              {/* Secondary Action: Skip & Continue */}
              <button
                type="button"
                onClick={handleSkip}
                className="flex-1 md:flex-initial py-2.5 px-4 rounded-xl bg-[#202020] hover:bg-[#282828] text-white hover:text-[#FFC914] font-bold text-xs border border-[#383838] hover:border-[#FFC914]/50 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Skip & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Products on Left, Shopping Cart on Right */}
        <div id="snacks-catalog-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 pt-1">
          {/* Left Column (2 cols): Categories & Food Cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Category Filter Pills & Veg Only Toggle - Sticky on Mobile */}
            <div className="sticky top-0 md:static z-20 bg-[#080808]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none py-2 md:py-0 -mx-3 px-3 md:mx-0 md:px-0 border-b border-[#222] md:border-b-0 flex items-center justify-between gap-2 overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const count = cat === "All"
                    ? availableProducts.filter((p) => !filterVegOnly || p.isVeg).length
                    : cat === "Recommended"
                    ? availableProducts.filter((p) => (p.isRecommended || p.isPopular) && (!filterVegOnly || p.isVeg)).length
                    : availableProducts.filter((p) => p.category.toLowerCase() === cat.toLowerCase() && (!filterVegOnly || p.isVeg)).length;

                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        activeCategory === cat
                          ? "bg-[#FFC914] text-black shadow-md shadow-[#FFC914]/20 font-black"
                          : "bg-[#141414] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#262626]"
                      }`}
                    >
                      {cat} <span className="opacity-70 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Veg Toggle */}
              <button
                type="button"
                onClick={() => setFilterVegOnly(!filterVegOnly)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
                  filterVegOnly
                    ? "bg-[#22C55E]/15 border-[#22C55E] text-[#22C55E]"
                    : "bg-[#141414] border-[#292929] text-[#888] hover:text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span>Veg</span>
              </button>
            </div>

            {/* Food Products Grid - 2 per row on mobile */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2.5 sm:gap-4">
              {filteredProducts.map((product) => {
                const cartItem = foodCart.find((item) => item.id === product.id);
                const quantity = cartItem ? cartItem.quantity : 0;

                return (
                  <div
                    key={product.id}
                    className="bg-[#141414] rounded-xl sm:rounded-2xl border border-[#262626] p-2.5 sm:p-3.5 flex flex-col sm:flex-row gap-2 sm:gap-3.5 hover:border-[#FFC914]/40 transition-all group overflow-hidden shadow-sm"
                  >
                    {/* Food Image */}
                    <div className="w-full h-24 sm:w-24 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-[#1f1f1f] shrink-0 relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      {product.isPopular && (
                        <span className="absolute top-1 left-1 bg-[#FFC914] text-black text-[8px] sm:text-[9px] font-black px-1.5 py-0.2 rounded shadow">
                          POPULAR
                        </span>
                      )}
                    </div>

                    {/* Food Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {/* Veg/Non-Veg icon */}
                          <div
                            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 border rounded-xs flex items-center justify-center p-0.5 shrink-0 ${
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
                        <p className="text-[10px] sm:text-[11px] text-[#777] line-clamp-1 mt-0.5 leading-snug">
                          {product.description}
                        </p>
                      </div>

                      {/* Price and Add / Quantity Controller */}
                      <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-[#222]">
                        <span className="text-xs sm:text-sm font-extrabold text-white">
                          ₹{product.price}
                        </span>

                        {quantity > 0 ? (
                          <div className="flex items-center gap-1 sm:gap-2 bg-[#202020] px-1 sm:px-2 py-0.5 sm:py-1 rounded-lg border border-[#333]">
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, -1)}
                              className="text-[#FFC914] hover:text-white p-0.5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-[11px] sm:text-xs font-bold text-white w-3 text-center">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQty(product.id, 1)}
                              className="text-[#FFC914] hover:text-white p-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(product)}
                            className="bg-[#222] hover:bg-[#FFC914] hover:text-black text-white px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold border border-[#333] transition cursor-pointer flex items-center gap-1 shrink-0 active:scale-95"
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

          {/* Right Column: Desktop Shopping Cart (hidden on mobile, uses sticky bottom bar instead) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#141414] rounded-2xl border border-[#292929] p-5 space-y-4 sticky top-24 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#292929] pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FFC914]" />
                  <h3 className="font-bold text-sm text-white">Your Food Basket</h3>
                </div>
                <span className="text-xs bg-[#222] px-2 py-0.5 rounded text-[#888] font-mono">
                  {totalItems} items
                </span>
              </div>

              {foodCart.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#666] space-y-2">
                  <UtensilsCrossed className="w-8 h-8 text-[#333] mx-auto mb-1" />
                  <p>Your basket is empty.</p>
                  <p className="text-[11px] text-[#555]">
                    Select hot popcorn, drinks, and combos on the left.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {foodCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2.5 rounded-xl border border-[#2a2a2a]"
                    >
                      <div className="space-y-0.5 flex-1 pr-2">
                        <div className="font-bold text-white truncate">{item.name}</div>
                        <div className="text-[10px] text-[#888]">
                          ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center bg-[#252525] rounded-lg border border-[#3a3a3a] px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="text-[#aaa] hover:text-white cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center font-bold text-white text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="text-[#FFC914] hover:text-white cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#666] hover:text-[#EF4444] transition p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Calculation */}
              <div className="pt-3 border-t border-[#292929] space-y-2 text-xs">
                <div className="flex justify-between text-[#888]">
                  <span>Cinema Food Total</span>
                  <span className="font-bold text-white">₹{totalFoodPrice}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>Selected Seats ({selectedSeats.length})</span>
                  <span className="font-mono text-white">
                    {selectedSeats.map((s) => s.id).join(", ") || "None"}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Desktop */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-extrabold text-xs transition shadow-lg shadow-[#FFC914]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>
                    {foodCart.length > 0 ? "Continue to Delivery Mode" : "Continue to Payment"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] text-[#A1A1AA] hover:text-white font-semibold text-xs border border-[#2e2e2e] transition cursor-pointer"
                >
                  Skip Food & Pay Tickets Only
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. MOBILE FIXED STICKY BOTTOM ACTION BAR (lg:hidden)     */}
      {/* Remains visible while scrolling through snacks           */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 inset-x-0 z-50 lg:hidden bg-[#0c0c0c]/95 backdrop-blur-xl border-t border-[#292929] px-3.5 py-3 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]">
        {totalItems === 0 ? (
          /* When no snacks are selected: Skip & Continue is prominent action */
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-3 px-4 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-xl shadow-[#FFC914]/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>Skip Snacks & Continue</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* When snacks are selected: Show Skip on Left, Count & Total, and Continue to Delivery on Right */
          <div className="flex items-center justify-between gap-2.5">
            {/* Left: Skip Snacks option */}
            <button
              type="button"
              onClick={handleSkip}
              className="py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-[#aaa] hover:text-white border border-[#333] text-[11px] font-bold transition shrink-0 cursor-pointer active:scale-95"
            >
              <span>Skip Snacks</span>
            </button>

            {/* Middle: Cart item count and total */}
            <div className="flex-1 text-right pr-1">
              <span className="text-[10px] text-[#888] font-bold block leading-none">
                {totalItems} {totalItems === 1 ? "Item" : "Items"} Added
              </span>
              <span className="text-sm font-black text-[#FFC914] leading-tight block mt-0.5">
                ₹{totalFoodPrice}
              </span>
            </div>

            {/* Right: Continue to Delivery as prominent primary action */}
            <button
              type="button"
              onClick={handleContinue}
              className="py-2.5 px-4 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-lg shadow-[#FFC914]/25 flex items-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer"
            >
              <span>Continue to Delivery</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

