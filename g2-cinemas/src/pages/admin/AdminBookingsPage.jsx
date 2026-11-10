import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Eye,
  XCircle,
  FileSpreadsheet,
  Calendar,
  Ticket
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { TicketModal } from "../../components/booking/TicketModal";
import toast from "react-hot-toast";

export const AdminBookingsPage = () => {
  const { bookings, movies, cancelBooking } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMovie, setSelectedMovie] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedBookingForModal, setSelectedBookingForModal] = useState(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerMobile?.includes(searchQuery);

      const matchesMovie =
        selectedMovie === "ALL" ? true : b.movieId === selectedMovie;

      const matchesStatus =
        selectedStatus === "ALL" ? true : b.bookingStatus === selectedStatus;

      return matchesSearch && matchesMovie && matchesStatus;
    });
  }, [bookings, searchQuery, selectedMovie, selectedStatus]);

  // Export Bookings as CSV
  const handleExportCSV = () => {
    const headers = [
      "Booking ID",
      "Customer Name",
      "Mobile",
      "Movie",
      "Screen",
      "Date",
      "Time",
      "Seats",
      "Ticket Amount",
      "Food Amount",
      "Total Amount",
      "Channel",
      "Payment Method",
      "Status"
    ];

    const rows = filteredBookings.map((b) => [
      b.id,
      b.customerName,
      b.customerMobile || "-",
      b.movieTitle,
      b.screenName,
      b.showDate,
      b.showTime,
      Array.isArray(b.seats) ? b.seats.join(";") : b.seats,
      b.ticketAmount,
      b.foodAmount,
      b.totalAmount,
      b.source,
      b.paymentMethod,
      b.bookingStatus
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `G2_Cinemas_Bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Bookings CSV exported successfully.");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Booking Management
          </h1>
          <p className="text-xs text-[#888]">
            Master reservations ledger and electronic ticketing register.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#171717] hover:bg-[#252525] text-white border border-[#2e2e2e] px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer self-start sm:self-center"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#22C55E]" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#141414] p-4 rounded-2xl border border-[#292929]">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, guest, mobile..."
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder-[#666] focus:border-[#FFC914]"
          />
        </div>

        {/* Filter by Movie */}
        <div>
          <select
            value={selectedMovie}
            onChange={(e) => setSelectedMovie(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="ALL">All Movies</option>
            {movies.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl px-3 py-2 text-xs text-white"
          >
            <option value="ALL">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292929] bg-[#101010] text-[#777] uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Movie</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Auditorium & Seats</th>
                <th className="py-3.5 px-4">Tickets</th>
                <th className="py-3.5 px-4">Food</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1a1a1a] transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#FFC914]">{b.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-white block">{b.customerName}</span>
                    <span className="text-[10px] text-[#777] font-mono">{b.customerMobile || "-"}</span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-white max-w-[150px] truncate">
                    {b.movieTitle}
                  </td>
                  <td className="py-3.5 px-4 text-[#888]">
                    <span className="text-white block">{b.showDate}</span>
                    <span className="text-[10px] text-[#777]">{b.showTime}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-white block">{b.screenName}</span>
                    <span className="text-[11px] font-mono font-bold text-[#FFC914]">
                      {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-white">₹{b.ticketAmount}</td>
                  <td className="py-3.5 px-4 text-[#888]">₹{b.foodAmount}</td>
                  <td className="py-3.5 px-4 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        b.source === "POS"
                          ? "bg-[#FFC914]/20 text-[#FFC914]"
                          : "bg-blue-500/20 text-blue-400"
                      }`}
                    >
                      {b.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.bookingStatus === "CANCELLED"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {b.bookingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedBookingForModal(b)}
                        className="p-1.5 rounded-lg bg-[#222] hover:bg-[#333] text-[#FFC914] cursor-pointer"
                        title="View Boarding Pass"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {b.bookingStatus !== "CANCELLED" && (
                        <button
                          onClick={() => {
                            if (window.confirm(`Cancel booking ${b.id}? Seats will be released.`)) {
                              cancelBooking(b.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-[#222] hover:bg-red-950/40 text-[#888] hover:text-red-400 cursor-pointer"
                          title="Cancel Booking"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedBookingForModal && (
        <TicketModal
          booking={selectedBookingForModal}
          onClose={() => setSelectedBookingForModal(null)}
        />
      )}
    </div>
  );
};

