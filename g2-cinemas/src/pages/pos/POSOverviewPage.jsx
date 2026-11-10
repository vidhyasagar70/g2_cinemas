import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Ticket,
  DollarSign,
  TrendingUp,
  Film,
  PlusCircle,
  Clock,
  CheckCircle2,
  Calendar,
  Eye,
  User,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { reportService } from "../../services/reportService";

export const POSOverviewPage = () => {
  const navigate = useNavigate();
  const { bookings, shows, settings } = useApp();
  const metrics = reportService.getOverviewMetrics();
  const staff = settings.posStaff;

  const todayBookings = bookings.filter((b) => b.source === "POS");
  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-6 rounded-3xl border border-[#292929]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-extrabold text-[#FFC914]">
              {staff?.counter || "Counter #02"}
            </span>
            <span className="text-[#444]">•</span>
            <span className="text-xs text-[#22C55E] font-bold">Shift In Progress</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Hello, {staff?.name || "Counter POS Staff"}
          </h1>
          <p className="text-xs text-[#888]">
            Ready for walk-in audience counter ticketing and cash/card collections.
          </p>
        </div>

        <Link
          to="/pos/new-ticket"
          className="flex items-center gap-2.5 bg-[#FFC914] hover:bg-[#EAB308] text-black px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-[#FFC914]/25 hover:scale-105 cursor-pointer self-start sm:self-center"
        >
          <PlusCircle className="w-5 h-5 fill-black" />
          <span>New Walk-in Ticket</span>
        </Link>
      </div>

      {/* POS Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs font-bold uppercase tracking-wider">Today's POS Bookings</span>
            <Ticket className="w-4 h-4 text-[#FFC914]" />
          </div>
          <div className="text-2xl font-black text-white">{todayBookings.length}</div>
          <p className="text-[11px] text-[#22C55E]">Counter walk-in guests</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs font-bold uppercase tracking-wider">Tickets Sold Today</span>
            <Film className="w-4 h-4 text-[#FFC914]" />
          </div>
          <div className="text-2xl font-black text-white">{metrics.ticketsSold}</div>
          <p className="text-[11px] text-[#A1A1AA]">Across all auditoriums</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs font-bold uppercase tracking-wider">Counter Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-black text-[#FFC914]">₹{metrics.posRevenue}</div>
          <p className="text-[11px] text-[#888]">Total system: ₹{metrics.ticketRevenue}</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929] space-y-2">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs font-bold uppercase tracking-wider">Active Shows</span>
            <Clock className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-white">{shows.length}</div>
          <p className="text-[11px] text-[#888]">3 Screens active</p>
        </div>
      </div>

      {/* Recent Counter Transactions Table */}
      <div className="bg-[#141414] rounded-3xl border border-[#292929] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#222] pb-4">
          <div>
            <h3 className="font-extrabold text-base text-white">Recent Transactions</h3>
            <p className="text-xs text-[#888]">Live feed from counter and web ticket desks.</p>
          </div>
          <Link
            to="/pos/bookings"
            className="text-xs font-bold text-[#FFC914] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#292929] text-[#777] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-3">Booking ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Movie & Screen</th>
                <th className="py-3 px-3">Seats</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Payment</th>
                <th className="py-3 px-3">Channel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {recentBookings.map((b) => (
                <tr key={b.id} className="hover:bg-[#1a1a1a] transition">
                  <td className="py-3 px-3 font-mono font-bold text-[#FFC914]">{b.id}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white block">{b.customerName}</span>
                    <span className="text-[10px] text-[#777]">{b.customerMobile || "-"}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-white font-medium block">{b.movieTitle}</span>
                    <span className="text-[10px] text-[#888]">{b.screenName} • {b.showTime}</span>
                  </td>
                  <td className="py-3 px-3 font-mono text-white">
                    {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats}
                  </td>
                  <td className="py-3 px-3 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="py-3 px-3">
                    <span className="bg-[#202020] px-2 py-0.5 rounded text-[10px] text-[#bbb]">
                      {b.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

