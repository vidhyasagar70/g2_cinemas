import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Ticket,
  UtensilsCrossed,
  Clock,
  Calendar,
  Film,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Eye
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useApp } from "../../context/AppContext";
import { reportService } from "../../services/reportService";

export const AdminDashboardPage = () => {
  const { settings, bookings, orders } = useApp();
  const [chartRange, setChartRange] = useState("week"); // today, week, month

  const metrics = reportService.getOverviewMetrics();
  const chartData = reportService.getRevenueChartData(chartRange);
  const occupancyData = reportService.getScreenOccupancy();

  const admin = settings.adminProfile || { name: "Theatre Admin" };

  return (
    <div className="space-y-8 pb-16">
      {/* 8.1 Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <span className="text-xs uppercase tracking-widest font-extrabold text-[#FFC914] block mb-1">
            EXECUTIVE CONTROL PANEL
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Good morning, {admin.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
            Here is your live multi-screen cinema occupancy and revenue performance overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/movies"
            className="bg-[#171717] hover:bg-[#222] text-white px-4 py-2 rounded-xl text-xs font-bold border border-[#2e2e2e] transition"
          >
            Manage Shows
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-[#FFC914]/20 transition"
          >
            All Bookings ({bookings.length})
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Ticket Revenue</span>
            <Ticket className="w-4 h-4 text-[#FFC914]" />
          </div>
          <div className="text-3xl font-black text-[#FFC914]">₹{metrics.ticketRevenue}</div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#22C55E]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Online ₹{metrics.onlineRevenue} • POS ₹{metrics.posRevenue}</span>
          </div>
        </div>

        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Tickets Sold</span>
            <Film className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-black text-white">{metrics.ticketsSold}</div>
          <p className="text-[11px] text-[#888]">Across 3 active auditoriums</p>
        </div>

        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Canteen Revenue</span>
            <UtensilsCrossed className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-3xl font-black text-[#22C55E]">₹{metrics.canteenRevenue}</div>
          <p className="text-[11px] text-[#888]">{orders.length} total snack orders</p>
        </div>

        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Pending Orders</span>
            <Clock className="w-4 h-4 text-[#F59E0B]" />
          </div>
          <div className="text-3xl font-black text-[#F59E0B]">{metrics.pendingOrders}</div>
          <p className="text-[11px] text-[#888]">New & in preparation kitchen</p>
        </div>
      </div>

      {/* Revenue Overview Chart Section */}
      <div className="bg-[#141414] p-6 sm:p-8 rounded-3xl border border-[#292929] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222] pb-4">
          <div>
            <h3 className="font-extrabold text-lg text-white">Revenue Overview</h3>
            <p className="text-xs text-[#888]">
              Comparison of Online Bookings, Counter POS, and Canteen Food Revenue.
            </p>
          </div>

          {/* Date Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-[#1a1a1a] p-1 rounded-2xl border border-[#333]">
            {[
              { id: "today", label: "Today" },
              { id: "week", label: "This Week" },
              { id: "month", label: "This Month" }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setChartRange(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  chartRange === f.id
                    ? "bg-[#FFC914] text-black shadow-md"
                    : "text-[#888] hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFC914" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#FFC914" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorPos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorCanteen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey={chartRange === "today" ? "time" : "name"} stroke="#666" tick={{ fontSize: 11 }} />
              <YAxis stroke="#666" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 12 }}
                labelStyle={{ color: "#fff", fontWeight: "bold" }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="online"
                name="Online Web Bookings"
                stroke="#FFC914"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorOnline)"
              />
              <Area
                type="monotone"
                dataKey="pos"
                name="Counter POS Walk-ins"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPos)"
              />
              <Area
                type="monotone"
                dataKey="canteen"
                name="Canteen Food Sales"
                stroke="#22C55E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCanteen)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Screen Occupancy Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-white">Auditorium Live Occupancy</h3>
            <p className="text-xs text-[#888]">Real-time seat utilization across active screens.</p>
          </div>
          <span className="text-xs text-[#FFC914] font-bold">3 Screens Active</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {occupancyData.map((screen) => (
            <div
              key={screen.screen}
              className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#222] pb-3">
                <h4 className="font-bold text-sm text-white">{screen.screen}</h4>
                <span className="text-xs font-black text-[#FFC914] bg-[#221c08] border border-[#FFC914]/30 px-2 py-0.5 rounded-full">
                  {screen.occupancyRate}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 rounded-full bg-[#202020] overflow-hidden">
                <div
                  className="h-full bg-[#FFC914] rounded-full transition-all duration-500"
                  style={{ width: `${screen.occupancyRate}%` }}
                />
              </div>

              {/* Details */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#191919] p-2 rounded-xl">
                  <span className="text-[10px] text-[#777] block uppercase">Sold</span>
                  <span className="font-bold text-white">{screen.soldSeats}</span>
                </div>
                <div className="bg-[#191919] p-2 rounded-xl">
                  <span className="text-[10px] text-[#777] block uppercase">Available</span>
                  <span className="font-bold text-[#22C55E]">{screen.availableSeats}</span>
                </div>
                <div className="bg-[#191919] p-2 rounded-xl">
                  <span className="text-[10px] text-[#777] block uppercase">Blocked</span>
                  <span className="font-bold text-[#EF4444]">{screen.blockedSeats}</span>
                </div>
              </div>

              <div className="text-[11px] text-[#888] pt-1 border-t border-[#222] flex items-center justify-between">
                <span>Next Show:</span>
                <span className="text-[#ddd] font-semibold truncate max-w-[170px]">
                  {screen.nextShow}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

