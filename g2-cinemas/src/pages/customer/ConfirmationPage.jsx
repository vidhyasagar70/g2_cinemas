import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";
import {
  CheckCircle2,
  Printer,
  Download,
  Calendar,
  Clock,
  MapPin,
  Film,
  Ticket,
  Utensils,
  ArrowRight,
  Share2
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const ConfirmationPage = () => {
  const { bookingId } = useParams();
  const { bookings } = useApp();

  const booking = bookings.find((b) => b.id === bookingId) || bookings[0];

  useEffect(() => {
    // Fire celebratory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const qrPayload = JSON.stringify({
    bookingId: booking?.id,
    movie: booking?.movieTitle,
    screen: booking?.screenName,
    date: booking?.showDate,
    time: booking?.showTime,
    seats: booking?.seats
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 pb-12">
      {/* Top Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center mx-auto text-[#22C55E] animate-in zoom-in">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Booking Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-md mx-auto">
          Your e-ticket and admission pass have been generated. An SMS receipt has been sent to{" "}
          <span className="text-white font-bold">{booking?.customerMobile || "+91 98765 43210"}</span>.
        </p>
      </div>

      {/* Visual Boarding Pass Card */}
      <div
        id="cinema-ticket"
        className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden shadow-2xl relative"
      >
        {/* Ticket Top Golden Strip */}
        <div className="bg-[#FFC914] text-black px-6 py-2.5 flex items-center justify-between text-xs font-black tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 fill-black" />
            <span>G2 CINEMAS • OFFICIAL DIGITAL ADMISSION PASS</span>
          </div>
          <span className="font-mono text-xs">{booking?.id}</span>
        </div>

        {/* Ticket Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column (2 cols): Movie & Auditorium Details */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex gap-4 items-start">
              {booking?.moviePoster && (
                <img
                  src={booking.moviePoster}
                  alt={booking.movieTitle}
                  className="w-20 h-28 object-cover rounded-xl border border-[#333] shadow-md shrink-0"
                />
              )}
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FFC914]">
                  CONFIRMED SEATS
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {booking?.movieTitle}
                </h2>
                <p className="text-xs text-[#888]">
                  {booking?.format || "Dolby Atmos 2D"} • Tamil with English Subtitles
                </p>
                <div className="text-xs text-[#FFC914] font-semibold pt-1">
                  {booking?.screenName}
                </div>
              </div>
            </div>

            {/* Grid of Key Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#1a1a1a] p-4 rounded-2xl border border-[#2e2e2e] text-xs">
              <div>
                <span className="text-[11px] text-[#666] uppercase block">Date</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC914]" />
                  {booking?.showDate}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#666] uppercase block">Showtime</span>
                <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                  {booking?.showTime}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#666] uppercase block">Total Tickets</span>
                <span className="font-bold text-white mt-0.5 block">
                  {booking?.ticketCount} Seats
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-[11px] text-[#666] uppercase block">Confirmed Seat Numbers</span>
                <span className="font-mono text-base font-black text-[#FFC914] mt-0.5 block">
                  {Array.isArray(booking?.seats) ? booking.seats.join(", ") : booking?.seats}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-[#666] uppercase block">Total Paid</span>
                <span className="font-bold text-[#22C55E] mt-0.5 block text-sm">
                  ₹{booking?.totalAmount}
                </span>
              </div>
            </div>

            {/* Food Order Details if present */}
            {booking?.foodItems && booking.foodItems.length > 0 && (
              <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#2e2e2e] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#FFC914] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5" />
                    Canteen Order Linked (#{booking?.canteenOrderId})
                  </span>
                  <span className="text-[10px] uppercase bg-[#252525] px-2 py-0.5 rounded text-[#bbb]">
                    {booking.deliveryOption === "SEAT_DELIVERY"
                      ? "Direct Seat Delivery"
                      : "Express Counter Pickup"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {booking.foodItems.map((item, idx) => (
                    <span
                      key={idx}
                      className="bg-[#222] border border-[#333] px-2.5 py-1 rounded-lg text-white font-medium"
                    >
                      {item.quantity}x {item.name}
                    </span>
                  ))}
                </div>
                {booking.deliveryDetails?.instructions && (
                  <p className="text-[11px] text-[#777] italic mt-1">
                    Special note: "{booking.deliveryDetails.instructions}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: QR Code & Verification Stub */}
          <div className="border-t md:border-t-0 md:border-l border-dashed border-[#333] md:pl-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-3 bg-white rounded-2xl shadow-lg border border-gray-200">
              <QRCodeSVG value={qrPayload} size={135} level="H" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase text-[#888] tracking-widest block">
                Scan at Turnstile
              </span>
              <p className="text-xs text-white font-semibold">
                Entry Gate #01 (Level 3)
              </p>
              <div className="font-mono text-[10px] text-[#666] tracking-widest pt-2">
                |||| |||||||| ||||| |||||||
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#171717] hover:bg-[#252525] text-white border border-[#2e2e2e] px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#FFC914]" />
          <span>Print Physical Ticket</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#171717] hover:bg-[#252525] text-white border border-[#2e2e2e] px-5 py-3 rounded-xl text-xs font-bold transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#FFC914]" />
          <span>Download PDF</span>
        </button>

        <Link
          to="/my-bookings"
          className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-6 py-3 rounded-xl text-xs font-black transition shadow-lg shadow-[#FFC914]/20"
        >
          <span>View in My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

