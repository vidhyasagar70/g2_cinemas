import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Ticket, Film, Calendar, Clock, Armchair } from "lucide-react";
import { useBooking } from "../../context/BookingContext";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { SeatLayout } from "../../components/seats/SeatLayout";
import { BookingProgress } from "../../components/booking/BookingProgress";
import toast from "react-hot-toast";

export const SeatSelectionPage = () => {
  const navigate = useNavigate();
  const { movies, shows, screens } = useApp();
  const { isAuthenticated } = useAuth();
  const {
    selectedMovie,
    selectedShow,
    selectedSeats,
    toggleSeat,
    holdTimeRemaining,
    totalTicketPrice,
    selectMovie,
    selectShow
  } = useBooking();

  // Authentication Guard: Only signed-in users can book tickets
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book your movie tickets.");
      navigate("/login", { state: { from: "/book/seats" }, replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fallback if accessed directly without prior selection
  useEffect(() => {
    if (!selectedMovie || !selectedShow || !movies.some((m) => m.id === selectedMovie.id)) {
      const defaultMovie = movies[0];
      const defaultShow = shows.find((s) => s.movieId === defaultMovie.id && s.status !== "Sold Out") || shows[0];
      selectMovie(defaultMovie);
      selectShow(defaultShow, defaultShow?.date);
    }
  }, [selectedMovie, selectedShow, movies, shows, selectMovie, selectShow]);

  const activeMovie = selectedMovie || movies[0];
  const activeShow = selectedShow || shows[0];
  const activeScreen = screens.find((s) => s.id === activeShow?.screenId) || screens[0];

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least 1 seat to continue.");
      return;
    }
    navigate("/book/food");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Booking Step Progress */}
      <BookingProgress currentStep={2} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#141414] p-4 rounded-2xl border border-[#292929]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/movie/${activeMovie.id}`)}
              className="p-2 rounded-xl bg-[#1c1c1c] text-[#A1A1AA] hover:text-white hover:bg-[#252525] border border-[#2e2e2e] transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <h1 className="text-lg font-black text-white flex items-center gap-2">
                <span>{activeMovie.title}</span>
                <span className="text-xs bg-[#FFC914] text-black font-extrabold px-2 py-0.5 rounded">
                  {activeShow?.format || "Dolby Atmos 2D"}
                </span>
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#888] mt-0.5">
                <span className="text-[#FFC914] font-medium">{activeScreen.name}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {activeShow?.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {activeShow?.time}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs text-[#888] block">Auditorium Screen</span>
            <span className="text-xs font-bold text-white">{activeScreen.type}</span>
          </div>
        </div>

        {/* Interactive Cinema Seating Grid */}
        <SeatLayout
          screen={activeScreen}
          show={activeShow}
          selectedSeats={selectedSeats}
          onToggleSeat={toggleSeat}
          holdTimeRemaining={holdTimeRemaining}
          maxSeats={6}
        />
      </div>

      {/* 5.4 Fixed Bottom Booking Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-md border-t border-[#292929] px-3.5 sm:px-6 py-2.5 sm:py-3 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-3">
          {/* Selected Seat Details */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#FFC914]/15 border border-[#FFC914]/30 flex items-center justify-center text-[#FFC914] shrink-0">
              <Armchair className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs text-[#888] hidden xs:inline">Seats:</span>
                <span className="text-xs sm:text-sm font-mono font-black text-[#FFC914] truncate">
                  {selectedSeats.length > 0
                    ? selectedSeats.map((s) => s.id).join(", ")
                    : "No seats selected"}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#A1A1AA] truncate">
                {selectedSeats.length} {selectedSeats.length === 1 ? "Ticket" : "Tickets"} • Total:{" "}
                <span className="text-white font-bold">₹{totalTicketPrice}</span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="shrink-0">
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className={`px-3.5 sm:px-6 py-2 sm:py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer ${
                selectedSeats.length > 0
                  ? "bg-[#FFC914] hover:bg-[#EAB308] text-black shadow-lg shadow-[#FFC914]/25 scale-100 hover:scale-105"
                  : "bg-[#252525] text-[#666] cursor-not-allowed"
              }`}
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

