import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  QrCode,
  Wallet,
  ShieldCheck,
  Film,
  Calendar,
  Clock,
  Armchair,
  ShoppingBag,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { createBooking, movies, shows, screens } = useApp();
  const { isAuthenticated, customerUser, isCustomerAuthenticated, user } = useAuth();
  const {
    selectedMovie,
    selectedShow,
    selectedDate,
    selectedSeats,
    foodCart,
    deliveryOption,
    deliveryDetails,
    customerDetails,
    setCustomerDetails,
    totalTicketPrice,
    totalFoodPrice,
    convenienceFee,
    grandTotal,
    resetBooking
  } = useBooking();

  // Authentication guard
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to complete your movie ticket booking.");
      navigate("/login", { state: { from: "/book/checkout" }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Active movie, show & screen with safe fallbacks
  const activeMovie = selectedMovie || movies[0];
  const activeShow =
    selectedShow || shows.find((s) => s.movieId === activeMovie?.id) || shows[0];
  const activeScreen =
    screens.find((s) => s.id === activeShow?.screenId) || screens[0];
  const activeScreenName =
    activeShow?.screenName || activeScreen?.name || "Screen 1 - Dolby Atmos";

  const effectiveTicketPrice =
    totalTicketPrice > 0
      ? totalTicketPrice
      : selectedSeats.length > 0
      ? selectedSeats.reduce((sum, s) => sum + (s.price || 190), 0)
      : 380;
  const effectiveSeatsCount = selectedSeats.length > 0 ? selectedSeats.length : 2;
  const effectiveConvenienceFee =
    convenienceFee > 0 ? convenienceFee : Math.round(effectiveTicketPrice * 0.05 + 20);
  const effectiveGrandTotal =
    effectiveTicketPrice + totalFoodPrice + effectiveConvenienceFee;

  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("aaravkumar@okhdfcbank");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (!customerDetails.name || !customerDetails.mobile) {
      toast.error("Please enter your name and mobile number.");
      return;
    }

    if (selectedSeats.length === 0) {
      toast.error("No seats selected. Please select seats first.");
      navigate("/book/seats");
      return;
    }

    setIsProcessing(true);

    // Simulate payment gateway verification
    setTimeout(() => {
      const newBooking = createBooking({
        movie: activeMovie,
        show: activeShow,
        selectedSeats,
        foodCart,
        deliveryOption,
        deliveryDetails,
        customer: customerDetails,
        paymentMethod,
        source: "ONLINE"
      });

      setIsProcessing(false);
      resetBooking();
      navigate(`/book/confirmation/${newBooking.id}`);
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Booking Progress Step 5 */}
      <BookingProgress currentStep={5} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#292929] pb-4">
          <button
            onClick={() => navigate(foodCart.length > 0 ? "/book/delivery" : "/book/food")}
            className="p-1.5 rounded-lg bg-[#171717] text-[#888] hover:text-white border border-[#292929] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Review & Pay
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-0.5">
              Finalize your cinema booking details and complete secure checkout.
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE ORDER SUMMARY CARD (lg:hidden)                     */}
        {/* Displays movie poster, title, seats, snacks & rates      */}
        {/* ======================================================== */}
        <div className="lg:hidden bg-gradient-to-r from-[#171717] via-[#141414] to-[#171717] rounded-2xl border border-[#2e2e2e] p-3.5 shadow-xl relative overflow-hidden space-y-3">
          <div className="flex gap-3 items-center">
            {/* Movie Poster Image */}
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
                <span className="absolute bottom-1 left-1 bg-black/85 text-[#FFC914] text-[8px] font-black px-1 rounded border border-[#FFC914]/30">
                  {activeMovie.certification}
                </span>
              )}
            </div>

            {/* Movie Meta Information */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-black text-sm text-white truncate" title={activeMovie?.title}>
                  {activeMovie?.title || "Movie"}
                </h3>
                <span className="font-black text-sm text-[#FFC914] shrink-0">
                  ₹{effectiveGrandTotal}
                </span>
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

          {/* Quick Rate & Snacks Breakdown on Mobile */}
          <div className="bg-[#1a1a1a] p-2.5 rounded-xl border border-[#262626] flex items-center justify-between text-xs">
            <div className="text-[11px] text-[#888]">
              <span>Tickets: </span>
              <strong className="text-white">₹{effectiveTicketPrice}</strong>
              {foodCart.length > 0 && (
                <span> • Snacks: <strong className="text-white">₹{totalFoodPrice}</strong></span>
              )}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#888] block leading-none">Total Payable</span>
              <span className="font-black text-xs text-[#FFC914]">₹{effectiveGrandTotal}</span>
            </div>
          </div>
        </div>

        {/* 2 Columns: Details & Payment Methods on Left, Order Summary on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Details Form */}
            <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Customer Contact Information
                </h3>
                <span className="text-[11px] text-[#22C55E] flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  SMS & E-Ticket Sent Here
                </span>
              </div>

              {isCustomerAuthenticated && customerUser ? (
                <div className="flex items-center justify-between bg-[#191919] px-3.5 py-2 rounded-xl border border-[#2a2a2a] text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    <span className="text-[#888]">
                      Signed in as <strong className="text-white">{customerUser.name}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-[#FFC914] font-bold">
                    ★ {customerUser.membership || "VIP Member"}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-[#191919] px-3.5 py-2 rounded-xl border border-[#2a2a2a] text-xs">
                  <span className="text-[#888]">Have a G2 Cinemas account?</span>
                  <Link
                    to="/login"
                    state={{ from: "/book/checkout" }}
                    className="text-[#FFC914] font-bold hover:underline"
                  >
                    Sign In for instant booking →
                  </Link>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-[#888] font-bold block mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerDetails.name}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, name: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition"
                  />
                </div>

                <div>
                  <label className="text-[#888] font-bold block mb-1.5">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerDetails.mobile}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, mobile: e.target.value })
                    }
                    placeholder="e.g. 9876543210"
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[#888] font-bold block mb-1.5">
                    Email Address (For Tax Invoice & PDF Ticket)
                  </label>
                  <input
                    type="email"
                    value={customerDetails.email}
                    onChange={(e) =>
                      setCustomerDetails({ ...customerDetails, email: e.target.value })
                    }
                    placeholder="name@example.com"
                    className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-5">
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Payment Method
                </h3>
                <span className="text-[11px] text-[#888] flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#FFC914]" />
                  256-Bit Encrypted
                </span>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {[
                  { id: "UPI", label: "Instant UPI", icon: QrCode, desc: "GPay, PhonePe, Paytm" },
                  { id: "CARD", label: "Debit / Credit Card", icon: CreditCard, desc: "Visa, Mastercard, RuPay" },
                  { id: "WALLET", label: "Digital Wallet", icon: Wallet, desc: "Paytm, Amazon Pay" }
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 sm:p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex sm:flex-col items-center sm:items-start gap-3 sm:gap-0 ${
                        isSelected
                          ? "bg-[#1f1f1f] border-[#FFC914] shadow-md shadow-[#FFC914]/15"
                          : "bg-[#181818] border-[#292929] hover:border-[#444]"
                      }`}
                    >
                      <Icon className={`w-5 h-5 sm:mb-2 shrink-0 ${isSelected ? "text-[#FFC914]" : "text-[#777]"}`} />
                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white">{m.label}</div>
                        <div className="text-[10px] text-[#777] truncate mt-0.5">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Details Simulation */}
              <div className="bg-[#1c1c1c] p-4 rounded-2xl border border-[#2e2e2e] space-y-3">
                {paymentMethod === "UPI" && (
                  <div className="space-y-2 text-xs">
                    <label className="text-[#888] font-semibold block">Enter Virtual Payment Address (VPA / UPI ID)</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <p className="text-[11px] text-[#666]">
                      A demo collect request simulation will be approved automatically upon clicking Pay.
                    </p>
                  </div>
                )}

                {paymentMethod === "CARD" && (
                  <div className="space-y-2 text-xs">
                    <label className="text-[#888] font-semibold block">Card Number (Simulated)</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
                    />
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <input
                        type="text"
                        defaultValue="12/28"
                        placeholder="MM/YY"
                        className="bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
                      />
                      <input
                        type="password"
                        defaultValue="888"
                        placeholder="CVV"
                        className="bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "WALLET" && (
                  <div className="text-xs text-[#888] space-y-1">
                    <p>Connected Wallet: <span className="text-white font-bold">G2 FastPay / Paytm</span></p>
                    <p className="text-[11px] text-[#22C55E]">Available Balance: ₹5,000.00 (Demo)</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-6 sticky top-24">
              <h3 className="font-extrabold text-base text-white border-b border-[#292929] pb-3">
                Order Summary
              </h3>

              {/* Movie Brief */}
              <div className="flex gap-3">
                <div className="w-16 h-22 rounded-xl overflow-hidden bg-[#242424] border border-[#383838] shrink-0 relative shadow-md">
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
                    <span className="absolute bottom-1 left-1 bg-black/85 text-[#FFC914] text-[8px] font-black px-1 rounded border border-[#FFC914]/30">
                      {activeMovie.certification}
                    </span>
                  )}
                </div>
                <div className="space-y-1 overflow-hidden flex-1">
                  <h4 className="font-bold text-sm text-white truncate" title={activeMovie?.title}>
                    {activeMovie?.title || "Movie Title"}
                  </h4>
                  <div className="text-[11px] text-[#FFC914] font-medium">
                    {activeMovie?.language || "Tamil"} • {activeShow?.format || "Dolby Atmos 2D"}
                  </div>
                  <div className="text-[11px] text-[#888]">
                    {activeScreenName}
                  </div>
                </div>
              </div>

              {/* Show Timing & Seats */}
              <div className="bg-[#1a1a1a] p-3.5 rounded-2xl border border-[#2a2a2a] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Date & Time</span>
                  <span className="text-white font-bold">
                    {activeShow?.date || selectedDate || "Today"} • {activeShow?.time || "07:00 PM"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Selected Seats</span>
                  <span className="font-mono font-bold text-[#FFC914]">
                    {selectedSeats.length > 0 ? selectedSeats.map((s) => s.id).join(", ") : "D9, D10"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Total Tickets</span>
                  <span className="text-white">{effectiveSeatsCount} Tickets</span>
                </div>
              </div>

              {/* Food Order Brief */}
              {foodCart.length > 0 ? (
                <div className="bg-[#1a1a1a] p-3.5 rounded-2xl border border-[#2a2a2a] space-y-2 text-xs">
                  <div className="flex justify-between text-[#FFC914] font-bold">
                    <span>Food & Refreshments</span>
                    <span className="text-[10px] uppercase bg-[#242424] px-2 py-0.5 rounded text-[#bbb]">
                      {deliveryOption === "SEAT_DELIVERY" ? "Seat Delivery" : "Counter Pickup"}
                    </span>
                  </div>
                  <ul className="space-y-1 text-[#aaa] text-[11px]">
                    {foodCart.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="bg-[#181818] p-3 rounded-2xl border border-[#262626] text-xs text-[#777] flex items-center justify-between">
                  <span>Food & Refreshments:</span>
                  <span className="text-[#888] font-semibold">None added (Optional)</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs border-t border-[#292929] pt-4">
                <div className="flex justify-between text-[#888]">
                  <span>Ticket Base Price ({effectiveSeatsCount} Seats)</span>
                  <span className="text-white font-semibold">₹{effectiveTicketPrice}</span>
                </div>
                {foodCart.length > 0 && (
                  <div className="flex justify-between text-[#888]">
                    <span>Canteen Refreshments</span>
                    <span className="text-white font-semibold">₹{totalFoodPrice}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#888]">
                  <span>Integrated Convenience Fee</span>
                  <span className="text-white font-semibold">₹{effectiveConvenienceFee}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white border-t border-[#292929] pt-3">
                  <span>Total Payable</span>
                  <span className="text-[#FFC914] text-xl">₹{effectiveGrandTotal}</span>
                </div>
              </div>

              {/* Prominent Yellow Pay Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full py-4 rounded-2xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-sm tracking-wide uppercase transition-all shadow-xl shadow-[#FFC914]/25 hover:scale-[1.02] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 fill-black" />
                    <span>Pay ₹{effectiveGrandTotal}</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#666]">
                By proceeding, you agree to G2 Cinemas Terms of Ticketing & Cancellation policies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

