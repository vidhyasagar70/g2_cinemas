import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { DollarSign, Ticket, CreditCard, Banknote, Clock } from "lucide-react";
import { reportService } from "../../services/reportService";
import { useApp } from "../../context/AppContext";

export const POSReportsPage = () => {
  const { bookings } = useApp();
  const metrics = reportService.getOverviewMetrics();
  const paymentBreakdown = reportService.getPaymentMethodBreakdown();
  const moviePerformance = reportService.getMoviePerformance();

  const COLORS = ["#FFC914", "#3B82F6", "#22C55E", "#A855F7"];

  return (
    <div className="space-y-8">
      <div className="border-b border-[#292929] pb-4">
        <h1 className="text-2xl font-black text-white">Daily Counter Sales Report</h1>
        <p className="text-xs text-[#888]">
          Shift audit & payment reconciliation metrics.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Total Counter Collections</span>
          <span className="text-2xl font-black text-[#FFC914]">₹{metrics.posRevenue}</span>
          <p className="text-[11px] text-[#22C55E] mt-1">Direct cash, card & POS UPI</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Tickets Issued at Counter</span>
          <span className="text-2xl font-black text-white">{metrics.ticketsSold} Seats</span>
          <p className="text-[11px] text-[#888] mt-1">Audit verified transactions</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Average Ticket Yield</span>
          <span className="text-2xl font-black text-[#3B82F6]">₹265</span>
          <p className="text-[11px] text-[#888] mt-1">Standard & Recliner blend</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Breakdown */}
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
          <h3 className="font-extrabold text-sm text-white">Counter Payment Method Split</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 text-xs text-[#888]">
            {paymentBreakdown.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span>{item.name}: ₹{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Show-wise Performance */}
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
          <h3 className="font-extrabold text-sm text-white">Movie-wise Counter Revenue</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moviePerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="title" stroke="#666" tick={{ fontSize: 10 }} />
                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }}
                />
                <Bar dataKey="revenue" fill="#FFC914" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

