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
  Check,
  Film,
  Calendar,
  Clock,
  Ticket,
  ChevronUp,
  ChevronDown,
  X
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { PRODUCT_CATEGORIES } from "../../data/products";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const FoodSelectionPage = () => {
  const navigate = useNavigate();
  const { products, movies, shows, screens } = useApp();
  const { isAuthenticated } = useAuth();
  const {
    foodCart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    totalFoodPrice,
    selectedSeats,
    selectedMovie,
    selectedShow,
    selectedDate,
    totalTicketPrice
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
  const [showMobileSummaryModal, setShowMobileSummaryModal] = useState(false);

  // Active movie and show resolution with safe fallbacks
  const activeMovie = selectedMovie || movies[0];
  const activeShow =
    selectedShow || shows.find((s) => s.movieId === activeMovie?.id) || shows[0];
  const activeScreen =
    screens.find((s) => s.id === activeShow?.screenId) || screens[0];
  const activeScreenName =
    activeShow?.screenName || activeScreen?.name || "Screen 1 - Dolby Atmos";

  // Effective ticket price and seats calculation
  const effectiveTicketPrice =
    totalTicketPrice > 0
      ? totalTicketPrice
      : selectedSeats.length > 0
      ? selectedSeats.reduce((sum, s) => sum + (s.price || 190), 0)
      : 380;
  const effectiveSeatsCount = selectedSeats.length > 0 ? selectedSeats.length : 2;
  const effectiveGrandTotal = effectiveTicketPrice + totalFoodPrice;

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
        {/* Top Navigation & Context */}
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
            <span className="text-[#666] hidden sm:inline">Selected Seats:</span>
            <span className="font-mono text-[#FFC914] font-bold bg-[#141414] border border-[#292929] px-2 py-0.5 rounded">
              {selectedSeats.length > 0
                ? selectedSeats.map((s) => s.id).join(", ")
                : "D9, D10"}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE MOVIE TICKET CART CARD (lg:hidden)                 */}
        {/* Shows movie poster, title, screen, seats & ticket rate   */}
        {/* ======================================================== */}
        <div className="lg:hidden bg-gradient-to-r from-[#171717] via-[#141414] to-[#171717] rounded-2xl border border-[#2e2e2e] p-3.5 shadow-xl relative overflow-hidden">
          <div className="flex gap-3 items-center">
            {/* Movie Poster Image Thumbnail */}
            <div className="w-16 h-22 rounded-xl overflow-hidden bg-[#222] border border-[#383838] shrink-0 relative shadow-md">
              {activeMovie?.poster ? (
                <img
                  src={activeMovie.poster}
                  alt={activeMovie.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#202020] text-[#666]">
                  <Film className="w-6 h-6" />
                </div>
              )}
              {activeMovie?.certification && (
                <span className="absolute bottom-1 left-1 bg-black/85 text-[#FFC914] text-[8px] font-black px-1 py-0.2 rounded border border-[#FFC914]/30">
                  {activeMovie.certification}
                </span>
              )}
            </div>

            {/* Movie Info & Ticket Rate */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] uppercase font-bold text-[#FFC914] tracking-wider block">
                    MOVIE IN CART
                  </span>
                  <h3 className="font-black text-sm text-white truncate" title={activeMovie?.title}>
                    {activeMovie?.title || "Movie"}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] text-[#888] block">Ticket Rate</span>
                  <span className="font-black text-sm text-[#FFC914] block">
                    ₹{effectiveTicketPrice}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 truncate">
                <span className="text-[#FFC914] font-semibold">{activeMovie?.language || "Tamil"}</span>
                <span>•</span>
                <span className="text-white font-medium">{activeShow?.format || "Dolby Atmos 2D"}</span>
                <span>•</span>
                <span className="text-[#888]">{activeScreenName}</span>
              </p>

              <div className="flex items-center gap-2 text-[10px] text-[#bbb]">
                <Calendar className="w-3 h-3 text-[#FFC914] shrink-0" />
                <span>{activeShow?.date || selectedDate || "Today"}</span>
                <span>•</span>
                <Clock className="w-3 h-3 text-[#FFC914] shrink-0" />
                <span className="font-bold text-white">{activeShow?.time || "07:00 PM"}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-[#292929] text-[11px]">
                <span className="text-[#888]">
                  Seats ({effectiveSeatsCount}):
                </span>
                <span className="font-mono text-[#FFC914] font-bold">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((s) => s.id).join(", ")
                    : "D9, D10"}
                </span>
              </div>
            </div>
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

          {/* ======================================================== */}
          {/* DESKTOP SHOPPING BASKET & MOVIE SUMMARY (lg:col-span-1)   */}
          {/* ======================================================== */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#141414] rounded-2xl border border-[#292929] p-5 space-y-4 sticky top-24 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#292929] pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-[#FFC914]" />
                  <h3 className="font-extrabold text-sm text-white tracking-wide">
                    Your Booking Summary
                  </h3>
                </div>
                <span className="text-[11px] bg-[#1f1a08] border border-[#FFC914]/30 text-[#FFC914] px-2.5 py-0.5 rounded-full font-bold">
                  Step 3 of 5
                </span>
              </div>

              {/* 1. MOVIE TICKET CART DETAILS */}
              <div className="bg-[#181818] rounded-xl p-3 border border-[#2c2c2c] space-y-3 relative overflow-hidden group">
                <div className="flex gap-3">
                  {/* Movie Poster Image Thumbnail */}
                  <div className="w-16 h-22 rounded-lg overflow-hidden bg-[#242424] border border-[#383838] shrink-0 relative shadow-md">
                    {activeMovie?.poster ? (
                      <img
                        src={activeMovie.poster}
                        alt={activeMovie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#202020] text-[#666]">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                    {activeMovie?.certification && (
                      <span className="absolute bottom-1 left-1 bg-black/85 backdrop-blur-xs text-[#FFC914] text-[8px] font-black px-1 rounded border border-[#FFC914]/30">
                        {activeMovie.certification}
                      </span>
                    )}
                  </div>

                  {/* Movie Meta Information */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] uppercase font-bold text-[#FFC914] tracking-wider">
                          MOVIE TICKETS
                        </span>
                      </div>
                      <h4 className="font-black text-sm text-white truncate" title={activeMovie?.title}>
                        {activeMovie?.title || "Movie"}
                      </h4>
                      <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1.5 mt-0.5 truncate">
                        <span className="text-[#FFC914] font-semibold">{activeMovie?.language || "Tamil"}</span>
                        <span>•</span>
                        <span className="text-white font-medium">{activeShow?.format || "Dolby Atmos 2D"}</span>
                      </p>
                      <p className="text-[10px] text-[#888] truncate mt-0.5">
                        {activeScreenName}
                      </p>
                    </div>

                    {/* Date & Time pill */}
                    <div className="flex items-center gap-2 text-[10px] text-[#ccc] bg-[#111] px-2 py-1 rounded border border-[#262626] mt-1.5">
                      <Calendar className="w-3 h-3 text-[#FFC914] shrink-0" />
                      <span className="truncate">{activeShow?.date || selectedDate || "Today"}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-[#FFC914] shrink-0" />
                      <span className="font-bold text-white">{activeShow?.time || "07:00 PM"}</span>
                    </div>
                  </div>
                </div>

                {/* Seats & Ticket Rate Bar */}
                <div className="pt-2.5 border-t border-[#292929] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0 flex-1 pr-2">
                    <Ticket className="w-3.5 h-3.5 text-[#FFC914] shrink-0" />
                    <span className="text-[11px] text-[#888]">Seats:</span>
                    <span className="font-mono text-[#FFC914] font-bold text-xs truncate bg-[#101010] px-1.5 py-0.5 rounded border border-[#2a2a2a]">
                      {selectedSeats.length > 0
                        ? selectedSeats.map((s) => s.id).join(", ")
                        : "D9, D10"}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#888] block leading-none">
                      {effectiveSeatsCount} {effectiveSeatsCount === 1 ? "Ticket" : "Tickets"}
                    </span>
                    <span className="font-black text-white text-xs mt-0.5 block">
                      ₹{effectiveTicketPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. FOOD & BEVERAGES BASKET */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between border-b border-[#242424] pb-2">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-[#FFC914]" />
                    <h4 className="font-bold text-xs text-white">Food & Refreshments</h4>
                  </div>
                  <span className="text-[10px] bg-[#222] px-2 py-0.5 rounded text-[#888] font-mono">
                    {totalItems} {totalItems === 1 ? "item" : "items"}
                  </span>
                </div>

                {foodCart.length === 0 ? (
                  <div className="py-4 px-3 text-center rounded-xl bg-[#181818] border border-[#262626] space-y-1">
                    <UtensilsCrossed className="w-5 h-5 text-[#444] mx-auto mb-1" />
                    <p className="text-xs font-semibold text-[#888]">No snacks added yet (Optional)</p>
                    <p className="text-[10px] text-[#666]">
                      Select popcorn, drinks, or combos on the left, or skip directly to payment.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {foodCart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between text-xs bg-[#1a1a1a] p-2 rounded-xl border border-[#2a2a2a]"
                      >
                        <div className="space-y-0.5 flex-1 pr-2 min-w-0">
                          <div className="font-bold text-white truncate">{item.name}</div>
                          <div className="text-[10px] text-[#888]">
                            ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
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
              </div>

              {/* 3. ORDER PRICING BREAKDOWN */}
              <div className="pt-3 border-t border-[#292929] space-y-2 text-xs">
                <div className="flex justify-between text-[#888]">
                  <span>Movie Tickets ({effectiveSeatsCount})</span>
                  <span className="font-bold text-white">₹{effectiveTicketPrice}</span>
                </div>
                <div className="flex justify-between text-[#888]">
                  <span>Cinema Food & Drinks ({totalItems})</span>
                  <span className="font-bold text-white">₹{totalFoodPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-black text-white pt-2.5 border-t border-[#262626]">
                  <span>Estimated Total</span>
                  <span className="text-base text-[#FFC914] font-black">
                    ₹{effectiveGrandTotal}
                  </span>
                </div>
              </div>

              {/* 4. ACTION BUTTONS */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-extrabold text-xs transition shadow-lg shadow-[#FFC914]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <span>
                    {foodCart.length > 0 ? "Continue to Delivery Mode" : "Continue to Payment"}
                  </span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-2.5 rounded-xl bg-[#202020] hover:bg-[#282828] text-[#A1A1AA] hover:text-white font-semibold text-xs border border-[#2e2e2e] transition cursor-pointer"
                >
                  {foodCart.length > 0 ? "Clear Snacks & Pay Tickets Only" : "Skip Snacks & Pay Tickets Only"}
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
          /* When no snacks are selected: Show Ticket Rate and Clear Skip & Pay action */
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <Ticket className="w-3.5 h-3.5 text-[#FFC914] shrink-0" />
                <span className="text-[11px] text-[#A1A1AA] truncate">
                  {effectiveSeatsCount} Tickets ({selectedSeats.length > 0 ? selectedSeats.map((s) => s.id).join(", ") : "D9, D10"})
                </span>
              </div>
              <div className="text-sm font-black text-white mt-0.5 flex items-center gap-1.5">
                <span>Total:</span>
                <span className="text-[#FFC914]">₹{effectiveTicketPrice}</span>
                <span className="text-[10px] text-[#777] font-normal">(No snacks)</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="py-3 px-5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-xl shadow-[#FFC914]/25 transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
            >
              <span>Skip & Pay</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        ) : (
          /* When snacks are selected: Show Tickets + Food breakdown and Continue */
          <div className="flex items-center justify-between gap-2.5">
            {/* Left: Skip Snacks option */}
            <button
              type="button"
              onClick={handleSkip}
              className="py-2.5 px-3 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-[#aaa] hover:text-white border border-[#333] text-[11px] font-bold transition shrink-0 cursor-pointer active:scale-95"
            >
              <span>Skip Snacks</span>
            </button>

            {/* Middle: Cart breakdown */}
            <div
              onClick={() => setShowMobileSummaryModal(true)}
              className="flex-1 text-center cursor-pointer px-1 py-0.5 rounded-lg active:bg-[#1a1a1a]"
            >
              <div className="text-[10px] text-[#A1A1AA] leading-tight flex items-center justify-center gap-1">
                <span>{effectiveSeatsCount} Seats + {totalItems} Snacks</span>
                <ChevronUp className="w-3 h-3 text-[#FFC914]" />
              </div>
              <span className="text-sm font-black text-[#FFC914] leading-tight block mt-0.5">
                ₹{effectiveGrandTotal}
              </span>
            </div>

            {/* Right: Continue to Delivery */}
            <button
              type="button"
              onClick={handleContinue}
              className="py-2.5 px-4 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs shadow-lg shadow-[#FFC914]/25 flex items-center gap-1.5 shrink-0 transition active:scale-95 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. MOBILE ORDER SUMMARY SLIDE-OVER MODAL (OPTIONAL POPUP) */}
      {/* ======================================================== */}
      {showMobileSummaryModal && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div
            className="flex-1"
            onClick={() => setShowMobileSummaryModal(false)}
          />
          <div className="bg-[#141414] rounded-t-3xl border-t border-[#292929] p-5 max-h-[80vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-[#FFC914]" />
                <h3 className="font-black text-sm text-white">Cart Breakdown</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowMobileSummaryModal(false)}
                className="p-1 rounded-full bg-[#202020] text-[#aaa] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Movie Info */}
            <div className="flex gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-[#2a2a2a]">
              <img
                src={activeMovie?.poster}
                alt={activeMovie?.title}
                className="w-12 h-16 rounded-lg object-cover border border-[#333] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-xs text-white truncate">{activeMovie?.title}</h4>
                <p className="text-[10px] text-[#888]">{activeScreenName}</p>
                <p className="text-[10px] text-[#aaa] mt-0.5">
                  Seats: {selectedSeats.length > 0 ? selectedSeats.map((s) => s.id).join(", ") : "D9, D10"}
                </p>
                <p className="text-xs font-bold text-[#FFC914] mt-1">₹{effectiveTicketPrice}</p>
              </div>
            </div>

            {/* Snacks List */}
            {foodCart.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white">Selected Snacks ({totalItems})</h4>
                <div className="space-y-1.5">
                  {foodCart.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-[#1a1a1a] p-2 rounded-lg text-xs"
                    >
                      <span className="text-white">{item.quantity}x {item.name}</span>
                      <span className="text-[#FFC914] font-bold">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="pt-2 border-t border-[#292929] space-y-1 text-xs">
              <div className="flex justify-between text-[#888]">
                <span>Tickets Total:</span>
                <span className="text-white">₹{effectiveTicketPrice}</span>
              </div>
              <div className="flex justify-between text-[#888]">
                <span>Snacks Total:</span>
                <span className="text-white">₹{totalFoodPrice}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-white pt-2 border-t border-[#222]">
                <span>Total Amount:</span>
                <span className="text-[#FFC914]">₹{effectiveGrandTotal}</span>
              </div>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => {
                setShowMobileSummaryModal(false);
                handleContinue();
              }}
              className="w-full py-3 rounded-xl bg-[#FFC914] text-black font-black text-xs flex items-center justify-center gap-1.5"
            >
              <span>Continue to Next Step</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

