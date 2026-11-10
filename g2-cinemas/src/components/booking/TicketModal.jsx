import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Printer, Download, Film, CheckCircle2, MapPin, Calendar, Clock, Armchair } from "lucide-react";

export const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const qrValue = JSON.stringify({
    bookingId: booking.id,
    movie: booking.movieTitle,
    screen: booking.screenName,
    date: booking.showDate,
    time: booking.showTime,
    seats: booking.seats
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#141414] border border-[#292929] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#292929] bg-[#101010]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#22C55E]" />
            <span className="font-bold text-white text-sm">G2 Digital Boarding Pass</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#888] hover:text-white hover:bg-[#222] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Ticket Body */}
        <div id="printable-ticket" className="p-6 overflow-y-auto space-y-6">
          {/* Cinema Header */}
          <div className="flex items-center justify-between border-b border-dashed border-[#333] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFC914] text-black font-black flex items-center justify-center text-lg">
                G2
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base tracking-wider">
                  G2 CINEMAS
                </h3>
                <p className="text-[11px] text-[#888]">Vadipatti, Tamil Nadu 625218</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-[#888] block">
                Booking ID
              </span>
              <span className="font-mono font-bold text-[#FFC914] text-base">
                {booking.id}
              </span>
            </div>
          </div>

          {/* Movie Details Banner */}
          <div className="flex gap-4 items-center bg-[#1a1a1a] p-3.5 rounded-xl border border-[#2a2a2a]">
            {booking.moviePoster && (
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-16 h-20 object-cover rounded-lg shadow-md"
              />
            )}
            <div className="space-y-1">
              <h2 className="text-base font-extrabold text-white leading-tight">
                {booking.movieTitle}
              </h2>
              <p className="text-xs text-[#FFC914] font-medium">
                {booking.format || "IMAX Laser 2D"}
              </p>
              <div className="flex items-center gap-2 text-xs text-[#888]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#FFC914]" />
                  {booking.showDate}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#FFC914]" />
                  {booking.showTime}
                </span>
              </div>
            </div>
          </div>

          {/* Screen & Seat Grid */}
          <div className="grid grid-cols-2 gap-3 bg-[#171717] p-4 rounded-xl border border-[#292929]">
            <div>
              <span className="text-[11px] text-[#666] uppercase block">Auditorium</span>
              <span className="text-sm font-bold text-white">{booking.screenName}</span>
            </div>
            <div>
              <span className="text-[11px] text-[#666] uppercase block">Selected Seats</span>
              <span className="text-sm font-mono font-bold text-[#FFC914]">
                {Array.isArray(booking.seats) ? booking.seats.join(", ") : booking.seats}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#666] uppercase block">Guest Name</span>
              <span className="text-xs font-semibold text-white">
                {booking.customerName}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-[#666] uppercase block">Total Paid</span>
              <span className="text-xs font-bold text-[#22C55E]">
                ₹{booking.totalAmount} ({booking.paymentMethod})
              </span>
            </div>
          </div>

          {/* Food order if present */}
          {booking.foodItems && booking.foodItems.length > 0 && (
            <div className="bg-[#171717] p-3.5 rounded-xl border border-[#292929] text-xs">
              <div className="flex items-center justify-between text-[#FFC914] font-semibold mb-2">
                <span>Canteen Refreshments</span>
                <span className="text-[11px] uppercase bg-[#222] px-2 py-0.5 rounded text-[#aaa]">
                  {booking.deliveryOption === "SEAT_DELIVERY" ? "Seat Delivery" : "Express Counter"}
                </span>
              </div>
              <ul className="space-y-1 text-[#aaa]">
                {booking.foodItems.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {item.quantity}x {item.name}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>
              {booking.deliveryDetails?.instructions && (
                <p className="mt-2 text-[11px] text-[#777] italic">
                  Note: "{booking.deliveryDetails.instructions}"
                </p>
              )}
            </div>
          )}

          {/* QR Code and Barcode Verification */}
          <div className="flex items-center justify-between bg-white text-black p-4 rounded-xl">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">
                Gate Security Scan
              </span>
              <p className="text-xs font-bold">Present this code at Gate #1</p>
              <p className="text-[10px] text-gray-600">Audio Visual Hall Entry Verified</p>
              <div className="pt-1 font-mono text-[10px] font-bold text-gray-800 tracking-widest">
                |||||||||||||| |||||||||| ||||||||
              </div>
            </div>
            <div className="p-1 bg-white rounded border border-gray-200">
              <QRCodeSVG value={qrValue} size={84} level="M" />
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#292929] bg-[#101010]">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FFC914]" />
            <span>Print Ticket</span>
          </button>
          <button
            onClick={() => {
              window.print();
            }}
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

