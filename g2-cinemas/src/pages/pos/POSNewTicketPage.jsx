import React, { useState, useMemo, useEffect } from "react";
import {
  Film,
  Calendar,
  Clock,
  Armchair,
  CheckCircle2,
  DollarSign,
  Printer,
  PlusCircle,
  CreditCard,
  QrCode,
  Banknote,
  Search,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { SeatLayout } from "../../components/seats/SeatLayout";
import { TicketModal } from "../../components/booking/TicketModal";
import { getAvailableDates } from "../../data/shows";
import toast from "react-hot-toast";

export const POSNewTicketPage = () => {
  const { movies, shows, screens, createBooking } = useApp();

  const nowShowingMovies = useMemo(
    () => movies.filter((m) => m.status === "NOW_SHOWING"),
    [movies]
  );

  const availableDates = useMemo(() => getAvailableDates(), []);

  // Form State
  const [selectedMovie, setSelectedMovie] = useState(nowShowingMovies[0] || movies[0]);

  // Ensure valid selection when movies change
  useEffect(() => {
    if (!selectedMovie || !nowShowingMovies.some((m) => m.id === selectedMovie.id)) {
      if (nowShowingMovies.length > 0) {
        setSelectedMovie(nowShowingMovies[0]);
      }
    }
  }, [nowShowingMovies, selectedMovie]);
  const [selectedDate, setSelectedDate] = useState(availableDates[0].dateStr);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [customerMobile, setCustomerMobile] = useState("");
  const [customerName, setCustomerName] = useState("Walk-in Guest");
  const [paymentMethod, setPaymentMethod] = useState("CASH"); // CASH, UPI, CARD
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Filter shows for selected movie & date
  const filteredShows = useMemo(() => {
    if (!selectedMovie) return [];
    return shows.filter(
      (s) => s.movieId === selectedMovie.id && s.date === selectedDate
    );
  }, [shows, selectedMovie, selectedDate]);

  // Set default show if none selected or if movie changes
  const activeShow = selectedShow || filteredShows[0];
  const activeScreen = screens.find((s) => s.id === activeShow?.screenId) || screens[0];

  const handleToggleSeat = (seat) => {
    if (seat.status === "SOLD" || seat.status === "BLOCKED") {
      toast.error(`Seat ${seat.id} is not available.`);
      return;
    }

    const exists = selectedSeats.some((s) => s.id === seat.id);
    if (exists) {
      setSelectedSeats((prev) => prev.filter((s) => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 8) {
        toast.error("Max 8 seats per counter transaction.");
        return;
      }
      setSelectedSeats((prev) => [...prev, seat]);
    }
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleConfirmPayment = () => {
    if (!activeShow) {
      toast.error("Please select a showtime.");
      return;
    }
    if (selectedSeats.length === 0) {
      toast.error("Please select at least 1 seat for walk-in guest.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newBooking = createBooking({
        movie: selectedMovie,
        show: activeShow,
        selectedSeats,
        foodCart: [],
        deliveryOption: "NONE",
        deliveryDetails: null,
        customer: {
          name: customerName || "Walk-in Guest",
          mobile: customerMobile || "+91 99999 00000",
          email: "pos.counter@g2cinemas.com"
        },
        paymentMethod,
        source: "POS"
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      setSelectedSeats([]);
      toast.success(`Ticket Booked! ID: ${newBooking.id}`);
    }, 800);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Page Title */}
      <div className="border-b border-[#292929] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Counter Walk-in Ticketing
          </h1>
          <p className="text-xs text-[#888]">
            Rapid booking workflow: Select Movie → Showtime → Seats → Collect Payment.
          </p>
        </div>

        <div className="text-xs bg-[#171717] px-3.5 py-1.5 rounded-xl border border-[#292929] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
          <span className="text-[#A1A1AA]">Thermal Printer:</span>
          <span className="text-white font-bold">Online (EPSON TM-T88)</span>
        </div>
      </div>

      {/* Main Booking Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Steps 1, 2, 3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Select Movie */}
          <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#FFC914] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span>Select Movie</span>
              </span>
              <span className="text-xs text-[#888]">
                {nowShowingMovies.length} Available in Theatres
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {nowShowingMovies.map((movie) => {
                const isSelected = selectedMovie?.id === movie.id;
                return (
                  <button
                    key={movie.id}
                    onClick={() => {
                      setSelectedMovie(movie);
                      setSelectedShow(null);
                      setSelectedSeats([]);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-[#202020] border-[#FFC914] shadow-md shadow-[#FFC914]/20 scale-[1.02]"
                        : "bg-[#181818] border-[#292929] hover:border-[#444]"
                    }`}
                  >
                    <div className="aspect-[2/3] rounded-xl overflow-hidden mb-2 bg-[#111]">
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">
                        {movie.title}
                      </h4>
                      <p className="text-[10px] text-[#888]">{movie.duration}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Date & Showtime */}
          <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#FFC914] flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span>Select Showtime</span>
              </span>

              {/* Date Pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {availableDates.slice(0, 4).map((d) => (
                  <button
                    key={d.dateStr}
                    onClick={() => {
                      setSelectedDate(d.dateStr);
                      setSelectedShow(null);
                      setSelectedSeats([]);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      selectedDate === d.dateStr
                        ? "bg-[#FFC914] text-black"
                        : "bg-[#202020] text-[#888] hover:text-white"
                    }`}
                  >
                    {d.day}
                  </button>
                ))}
              </div>
            </div>

            {/* Shows List */}
            {filteredShows.length === 0 ? (
              <p className="text-xs text-[#666] italic py-2">
                No shows scheduled for this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {filteredShows.map((show) => {
                  const isSelected = activeShow?.id === show.id;
                  const isSoldOut = show.status === "Sold Out";

                  return (
                    <button
                      key={show.id}
                      disabled={isSoldOut}
                      onClick={() => {
                        setSelectedShow(show);
                        setSelectedSeats([]);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#FFC914] text-black border-[#FFC914] font-bold shadow-md shadow-[#FFC914]/20"
                          : isSoldOut
                          ? "bg-[#181818] border-[#292929] opacity-40 cursor-not-allowed"
                          : "bg-[#181818] hover:bg-[#202020] text-white border-[#292929]"
                      }`}
                    >
                      <div className="text-sm font-black">{show.time}</div>
                      <div className="text-[10px] opacity-80 mt-0.5 truncate">
                        {show.screenName}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider font-extrabold mt-1">
                        {show.status}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 3: Interactive Seat Selection */}
          {activeShow && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#FFC914] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FFC914] text-black text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <span>Select Seats ({activeScreen.name})</span>
                </span>
                <span className="text-xs text-[#888]">
                  Click on seats to select for guest
                </span>
              </div>

              <SeatLayout
                screen={activeScreen}
                show={activeShow}
                selectedSeats={selectedSeats}
                onToggleSeat={handleToggleSeat}
                maxSeats={8}
                isPos={true}
              />
            </div>
          )}
        </div>

        {/* Right Column: Counter Summary & Payment */}
        <div className="lg:col-span-1">
          <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-6 sticky top-20">
            <div className="flex items-center justify-between border-b border-[#292929] pb-3">
              <h3 className="font-extrabold text-base text-white">POS Order Summary</h3>
              <span className="text-xs bg-[#222] text-[#FFC914] font-mono px-2 py-0.5 rounded">
                Counter Desk
              </span>
            </div>

            {/* Selected Details */}
            <div className="space-y-3 text-xs">
              <div className="bg-[#1a1a1a] p-3.5 rounded-2xl border border-[#2e2e2e] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#888]">Movie</span>
                  <span className="text-white font-bold truncate max-w-[170px]">
                    {selectedMovie?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Auditorium</span>
                  <span className="text-white font-semibold">{activeScreen?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Showtime</span>
                  <span className="text-[#FFC914] font-bold">
                    {selectedDate} • {activeShow?.time}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#292929]">
                  <span className="text-[#888]">Selected Seats</span>
                  <span className="font-mono font-black text-[#FFC914]">
                    {selectedSeats.length > 0
                      ? selectedSeats.map((s) => s.id).join(", ")
                      : "None"}
                  </span>
                </div>
              </div>

              {/* Customer Mobile (Optional) */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[#888] font-bold block text-[11px]">
                  Customer Mobile Number (Optional for SMS Ticket)
                </label>
                <input
                  type="tel"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3 py-2 text-white placeholder-[#555] font-mono"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-[#888] font-bold block text-[11px]">
                  Counter Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "CASH", label: "Cash", icon: Banknote },
                    { id: "UPI", label: "POS UPI", icon: QrCode },
                    { id: "CARD", label: "Card", icon: CreditCard }
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = paymentMethod === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentMethod(m.id)}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          isSelected
                            ? "bg-[#FFC914] text-black border-[#FFC914] font-bold"
                            : "bg-[#1c1c1c] text-[#888] hover:text-white border-[#2e2e2e]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px]">{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-4 border-t border-[#292929] space-y-2">
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span className="text-white font-bold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Convenience Fee (POS Waived)</span>
                  <span className="text-[#22C55E] font-bold">₹0</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-[#292929]">
                  <span>Total Due</span>
                  <span className="text-[#FFC914] text-xl">₹{totalAmount}</span>
                </div>
              </div>

              {/* Confirm Payment Button */}
              <button
                type="button"
                disabled={isSubmitting || selectedSeats.length === 0}
                onClick={handleConfirmPayment}
                className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide uppercase transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer ${
                  selectedSeats.length > 0 && !isSubmitting
                    ? "bg-[#FFC914] hover:bg-[#EAB308] text-black shadow-[#FFC914]/25 hover:scale-[1.02]"
                    : "bg-[#252525] text-[#666] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span>Generating Ticket...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 fill-black" />
                    <span>Confirm & Print Ticket (₹{totalAmount})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Printable Ticket Modal */}
      {confirmedBooking && (
        <TicketModal
          booking={confirmedBooking}
          onClose={() => setConfirmedBooking(null)}
        />
      )}
    </div>
  );
};

