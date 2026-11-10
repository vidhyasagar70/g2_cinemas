import React, { useMemo } from "react";
import { seatService } from "../../services/seatService";
import { Clock, Armchair, Info } from "lucide-react";

export const SeatLayout = ({
  screen,
  show,
  selectedSeats = [],
  onToggleSeat,
  maxSeats = 6,
  holdTimeRemaining = 600
}) => {
  // Generate seat grid
  const seatGrid = useMemo(() => {
    if (!screen) return [];
    return seatService.generateSeatGrid(screen, show);
  }, [screen, show]);

  // Format countdown mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Group rows by categories for clear demarcation
  const reclinerRow = seatGrid.filter((r) => r.category === "Recliner");
  const premiumRows = seatGrid.filter((r) => r.category === "Premium");
  const standardRows = seatGrid.filter((r) => r.category === "Standard");

  const renderSeatRow = (rowObj) => {
    const { rowLetter, seats } = rowObj;
    return (
      <div key={rowLetter} className="flex items-center justify-center gap-2 sm:gap-3 my-1.5">
        {/* Row Label Left */}
        <span className="w-5 text-center text-xs font-bold text-[#666] select-none">
          {rowLetter}
        </span>

        {/* Row Seats with Aisle Gap in the Middle */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {seats.map((seat, index) => {
            const isSelected = selectedSeats.some((s) => s.id === seat.id);
            const isSold = seat.status === "SOLD";
            const isBlocked = seat.status === "BLOCKED";

            // Add center aisle gap between seat 6 and 7
            const isCenterAisle = index === 5;

            return (
              <React.Fragment key={seat.id}>
                <button
                  type="button"
                  disabled={isSold || isBlocked}
                  onClick={() => onToggleSeat(seat)}
                  title={`Seat ${seat.id} (${seat.category}) - ₹${seat.price}${
                    isSold ? " [Sold]" : isBlocked ? " [Blocked]" : ""
                  }`}
                  className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-t-lg text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-all duration-150 cursor-pointer select-none ${
                    isSelected
                      ? "bg-[#FFC914] text-black font-extrabold shadow-md shadow-[#FFC914]/40 scale-105"
                      : isSold
                      ? "bg-[#252525] text-[#555] border border-[#333] cursor-not-allowed opacity-60"
                      : isBlocked
                      ? "blocked-seat-pattern cursor-not-allowed"
                      : "bg-[#141414] hover:bg-[#202020] text-[#A1A1AA] hover:text-white border border-[#2e2e2e] hover:border-[#FFC914]"
                  }`}
                >
                  {seat.number}
                  {/* Subtle chair armrest visual */}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-1 rounded-b ${
                      isSelected ? "bg-[#d8a400]" : "bg-transparent"
                    }`}
                  />
                </button>

                {isCenterAisle && (
                  <div className="w-4 sm:w-8 text-center text-[10px] text-[#444] select-none">
                    •
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Row Label Right */}
        <span className="w-5 text-center text-xs font-bold text-[#666] select-none">
          {rowLetter}
        </span>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#111111] rounded-2xl border border-[#292929] p-4 sm:p-6 shadow-xl">
      {/* Top Bar: Hold Timer & Legends */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-[#222]">
        {/* Seat Hold Simulation Timer */}
        <div className="flex items-center gap-2 bg-[#171717] px-3.5 py-1.5 rounded-xl border border-[#292929]">
          <Clock className="w-4 h-4 text-[#FFC914] animate-spin" style={{ animationDuration: "6s" }} />
          <span className="text-xs text-[#A1A1AA]">Seat Hold:</span>
          <span className="text-xs font-mono font-bold text-[#FFC914]">
            {formatTime(holdTimeRemaining)}
          </span>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-t bg-[#141414] border border-[#2e2e2e] inline-block" />
            <span className="text-[#A1A1AA]">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-t bg-[#FFC914] inline-block" />
            <span className="text-white font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-t bg-[#252525] border border-[#333] inline-block opacity-60" />
            <span className="text-[#666]">Sold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-t blocked-seat-pattern inline-block" />
            <span className="text-[#EF4444]">Blocked</span>
          </div>
        </div>

        {/* Max Selection Notice */}
        <div className="text-xs text-[#888]">
          Max <span className="text-[#FFC914] font-bold">{maxSeats}</span> seats
        </div>
      </div>

      {/* Screen Curved Arc Display */}
      <div className="my-8 text-center">
        {/* Mobile Swipe Hint */}
        <div className="sm:hidden text-center text-[11px] text-[#FFC914] font-semibold bg-[#1a1708] border border-[#FFC914]/30 rounded-xl py-1.5 px-3 mb-6 inline-flex items-center justify-center gap-1.5 shadow-sm">
          <span>⇄ Swipe horizontally to view all seats</span>
        </div>

        <div className="relative mx-auto max-w-xl">
          <div className="screen-arc h-6 screen-glow" />
          <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#888]">
            SCREEN THIS WAY
          </p>
        </div>
      </div>

      {/* Seat Rows by Category */}
      <div className="space-y-6 overflow-x-auto py-2 scrollbar-none">
        <div className="min-w-[420px] sm:min-w-0">
          {/* Recliner Category */}
          {reclinerRow.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-4 text-[#FFC914] font-bold border-b border-[#222] pb-1">
                <span className="flex items-center gap-1.5">
                  <Armchair className="w-3.5 h-3.5" /> RECLINER LOUNGE
                </span>
                <span>₹{reclinerRow[0].price}</span>
              </div>
              {reclinerRow.map(renderSeatRow)}
            </div>
          )}

          {/* Premium Category */}
          {premiumRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-4 text-white font-bold border-b border-[#222] pb-1">
                <span>PREMIUM</span>
                <span>₹{premiumRows[0].price}</span>
              </div>
              {premiumRows.map(renderSeatRow)}
            </div>
          )}

          {/* Standard Category */}
          {standardRows.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs px-4 text-[#A1A1AA] font-bold border-b border-[#222] pb-1">
                <span>STANDARD</span>
                <span>₹{standardRows[0].price}</span>
              </div>
              {standardRows.map(renderSeatRow)}
            </div>
          )}
        </div>
      </div>

      {/* Notice info */}
      <div className="mt-6 pt-4 border-t border-[#222] flex items-center justify-between text-xs text-[#666]">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#FFC914]" />
          <span>Eye-level screen viewing starts from Row D & E.</span>
        </div>
        <span className="font-medium text-[#888]">
          Selected: {selectedSeats.length} / {maxSeats}
        </span>
      </div>
    </div>
  );
};
