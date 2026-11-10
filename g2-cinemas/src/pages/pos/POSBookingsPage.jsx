import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Ticket,
  Calendar,
  Clock,
  Eye,
  XCircle,
  FileText
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { TicketModal } from "../../components/booking/TicketModal";

export const POSBookingsPage = () => {
  const { bookings } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL"); // ALL, POS, ONLINE
  const [selectedBooking, setSelectedBooking] = useState(null);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerMobile?.includes(searchQuery) ||
        b.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSource =
        sourceFilter === "ALL" ? true : b.source === sourceFilter;

      return matchesSearch && matchesSource;
    });
  }, [bookings, searchQuery, sourceFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Counter Ticket Ledger
          </h1>
          <p className="text-xs text-[#888]">
            Full transaction records across counter POS and online bookings.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Booking ID, Guest, Movie..."
            className="w-full bg-[#141414] border border-[#292929] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#FFC914]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["ALL", "POS", "ONLINE"].map((source) => (
          <button
            key={source}
            onClick={() => setSourceFilter(source)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              sourceFilter === source
                ? "bg-[#FFC914] text-black"
                : "bg-[#141414] text-[#888] hover:text-white border border-[#292929]"
            }`}
          >
            {source === "ALL" ? "All Bookings" : source === "POS" ? "Counter Walk-ins" : "Online Web"}
          </button>
        ))}

        <div className="ml-auto text-xs text-[#888]">
          Found <span className="font-bold text-white">{filtered.length}</span> tickets
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292929] bg-[#101010] text-[#777] uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Guest Name</th>
                <th className="py-3.5 px-4">Mobile</th>
                <th className="py-3.5 px-4">Movie & Showtime</th>
                <th className="py-3.5 px-4">Screen & Seats</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Payment</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-[#1a1a1a] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FFC914]">{b.id}</td>
                  <td className="py-3.5 px-4 font-bold text-white">{b.customerName}</td>
                  <td className="py-3.5 px-4 text-[#888] font-mono">{b.customerMobile || "-"}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{b.movieTitle}</span>
                    <span className="text-[10px] text-[#777]">{b.showDate} • {b.showTime}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white block">{b.screenName}</span>
                    <span className="text-[11px] font-mono font-bold text-[#FFC914]">
                      {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.source === "POS"
                          ? "bg-[#FFC914]/20 text-[#FFC914]"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {b.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-[#202020] px-2 py-0.5 rounded text-[10px] text-[#ccc]">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedBooking(b)}
                      className="px-2.5 py-1 rounded-lg bg-[#222] hover:bg-[#333] text-[#FFC914] font-bold text-[11px] transition cursor-pointer"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBooking && (
        <TicketModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

