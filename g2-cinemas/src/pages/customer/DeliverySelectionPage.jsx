import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Armchair,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare
} from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useAuth } from "../../context/AuthContext";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const DeliverySelectionPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    deliveryOption,
    setDeliveryOption,
    deliveryDetails,
    setDeliveryDetails,
    selectedMovie,
    selectedShow,
    selectedSeats,
    foodCart
  } = useBooking();

  // Authentication guard
  React.useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with your booking.");
      navigate("/login", { state: { from: "/book/delivery" }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleContinue = () => {
    navigate("/book/checkout");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Booking Progress Step 4 */}
      <BookingProgress currentStep={4} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#292929] pb-6">
          <button
            onClick={() => navigate("/book/food")}
            className="p-1.5 rounded-lg bg-[#171717] text-[#888] hover:text-white border border-[#292929] transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              How should we serve it?
            </h1>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Select your convenient refreshments delivery method for the auditorium.
            </p>
          </div>
        </div>

        {/* Two Selectable Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A: Deliver to My Seat */}
          <div
            onClick={() => setDeliveryOption("SEAT_DELIVERY")}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              deliveryOption === "SEAT_DELIVERY"
                ? "bg-[#181818] border-[#FFC914] shadow-xl shadow-[#FFC914]/15"
                : "bg-[#121212] border-[#292929] hover:border-[#444]"
            }`}
          >
            {deliveryOption === "SEAT_DELIVERY" && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-5 h-5 text-[#FFC914]" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFC914]/15 border border-[#FFC914]/30 flex items-center justify-center text-[#FFC914]">
                <Armchair className="w-6 h-6" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FFC914] block">
                  RECOMMENDED FOR VIP
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Deliver to My Seat
                </h3>
                <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                  Sit back and relax. Our service butler will deliver your hot snacks directly to your cinema seats.
                </p>
              </div>

              <div className="bg-[#1c1c1c] p-3.5 rounded-xl border border-[#2e2e2e] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Auditorium:</span>
                  <span className="text-white font-bold">{selectedShow?.screenName || "Screen 1"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Destination Seats:</span>
                  <span className="text-[#FFC914] font-mono font-bold">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(", ")
                      : "General Seats"}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#22C55E] pt-1 border-t border-[#292929]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Delivered right as the previews conclude</span>
                </div>
              </div>
            </div>
          </div>

          {/* Option B: Collect at Counter */}
          <div
            onClick={() => setDeliveryOption("COUNTER_PICKUP")}
            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
              deliveryOption === "COUNTER_PICKUP"
                ? "bg-[#181818] border-[#FFC914] shadow-xl shadow-[#FFC914]/15"
                : "bg-[#121212] border-[#292929] hover:border-[#444]"
            }`}
          >
            {deliveryOption === "COUNTER_PICKUP" && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-5 h-5 text-[#FFC914]" />
              </div>
            )}

            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#222] border border-[#333] flex items-center justify-center text-white">
                <ShoppingBag className="w-6 h-6 text-[#FFC914]" />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#A1A1AA] block">
                  EXPRESS SERVICE
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Collect at Express Counter
                </h3>
                <p className="text-xs text-[#888] mt-1.5 leading-relaxed">
                  Skip the long canteen lines. Pick up your ready tray directly from the G2 Express Counter before entering.
                </p>
              </div>

              <div className="bg-[#1c1c1c] p-3.5 rounded-xl border border-[#2e2e2e] space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#888]">Pickup Spot:</span>
                  <span className="text-white font-bold">G2 Express Canteen Counter #01</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#3B82F6] pt-1 border-t border-[#292929]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Estimated preparation: 8-10 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Order Instructions Textarea */}
        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929] space-y-2">
          <label className="text-xs font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#FFC914]" />
            <span>Special Food Preparation Instructions (Optional)</span>
          </label>
          <textarea
            value={deliveryDetails?.instructions || ""}
            onChange={(e) =>
              setDeliveryDetails({ ...deliveryDetails, instructions: e.target.value })
            }
            rows={3}
            placeholder='e.g., "Less salt on the cheese popcorn, please", "Keep sauce separate", "Cold drinks without ice"...'
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl p-3 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#FFC914] transition resize-none"
          />
        </div>

        {/* Continue Button */}
        <div className="flex justify-end pt-4">
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-extrabold text-xs transition-all shadow-xl shadow-[#FFC914]/25 flex items-center justify-center gap-2 hover:scale-105 cursor-pointer"
          >
            <span>Proceed to Review & Payment</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

