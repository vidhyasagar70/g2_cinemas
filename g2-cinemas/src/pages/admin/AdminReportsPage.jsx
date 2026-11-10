import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  DollarSign,
  Ticket,
  UtensilsCrossed,
  Film
} from "lucide-react";
import { reportService } from "../../services/reportService";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

export const AdminReportsPage = () => {
  const { bookings } = useApp();
  const [activeReportTab, setActiveReportTab] = useState("REVENUE"); // REVENUE, MOVIES, OCCUPANCY, PAYMENTS

  const metrics = reportService.getOverviewMetrics();
  const revenueChartData = reportService.getRevenueChartData("week");
  const moviePerformance = reportService.getMoviePerformance();
  const occupancyData = reportService.getScreenOccupancy();
  const paymentBreakdown = reportService.getPaymentMethodBreakdown();

  const COLORS = ["#FFC914", "#3B82F6", "#22C55E", "#A855F7"];

  const handleExportReportCSV = () => {
    let rows = [];
    let filename = "G2_Cinema_Report";

    if (activeReportTab === "REVENUE") {
      rows = revenueChartData.map((d) => [d.name, d.online, d.pos, d.canteen, d.online + d.pos + d.canteen]);
      rows.unshift(["Day", "Online Revenue", "POS Revenue", "Canteen Revenue", "Total"]);
      filename = "G2_Revenue_Report";
    } else if (activeReportTab === "MOVIES") {
      rows = moviePerformance.map((m) => [m.title, m.tickets, m.revenue]);
      rows.unshift(["Movie Title", "Tickets Sold", "Gross Revenue"]);
      filename = "G2_Movie_Performance_Report";
    } else {
      rows = occupancyData.map((s) => [s.screen, s.totalSeats, s.soldSeats, s.availableSeats, s.occupancyRate + "%"]);
      rows.unshift(["Screen", "Total Capacity", "Sold Seats", "Available Seats", "Occupancy Rate"]);
      filename = "G2_Screen_Occupancy_Report";
    }

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Report exported to CSV.");
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Analytics & Executive Reports
          </h1>
          <p className="text-xs text-[#888]">
            Comprehensive multi-channel cinema performance and financial audits.
          </p>
        </div>

        <button
          onClick={handleExportReportCSV}
          className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-4 py-2.5 rounded-xl text-xs font-black transition shadow-lg shadow-[#FFC914]/20 cursor-pointer self-start sm:self-center"
        >
          <FileSpreadsheet className="w-4 h-4 fill-black" />
          <span>Export Current Report (CSV)</span>
        </button>
      </div>

      {/* Report Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222] pb-3 overflow-x-auto">
        {[
          { id: "REVENUE", label: "Revenue & Sales Report" },
          { id: "MOVIES", label: "Movie Performance Report" },
          { id: "OCCUPANCY", label: "Screen Occupancy Report" },
          { id: "PAYMENTS", label: "Payment Channel Report" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReportTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              activeReportTab === tab.id
                ? "bg-[#FFC914] text-black shadow-md"
                : "bg-[#141414] text-[#888] hover:text-white border border-[#292929]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Revenue Report */}
      {activeReportTab === "REVENUE" && (
        <div className="space-y-6">
          <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
            <h3 className="font-extrabold text-sm text-white">
              7-Day Channel Revenue Trajectory (₹)
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }} />
                  <Legend />
                  <Line type="monotone" dataKey="online" name="Online Web" stroke="#FFC914" strokeWidth={3} />
                  <Line type="monotone" dataKey="pos" name="Counter POS" stroke="#3B82F6" strokeWidth={3} />
                  <Line type="monotone" dataKey="canteen" name="Canteen Sales" stroke="#22C55E" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Table */}
          <div className="bg-[#141414] rounded-3xl border border-[#292929] overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#101010] text-[#777] uppercase text-[10px]">
                <tr>
                  <th className="p-4">Day</th>
                  <th className="p-4">Online Bookings</th>
                  <th className="p-4">Counter POS</th>
                  <th className="p-4">Canteen Concessions</th>
                  <th className="p-4 text-right">Daily Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222]">
                {revenueChartData.map((d) => (
                  <tr key={d.name} className="hover:bg-[#1a1a1a]">
                    <td className="p-4 font-bold text-white">{d.name}</td>
                    <td className="p-4 text-[#FFC914]">₹{d.online}</td>
                    <td className="p-4 text-[#3B82F6]">₹{d.pos}</td>
                    <td className="p-4 text-[#22C55E]">₹{d.canteen}</td>
                    <td className="p-4 text-right font-black text-white">
                      ₹{d.online + d.pos + d.canteen}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Movie Performance */}
      {activeReportTab === "MOVIES" && (
        <div className="space-y-6">
          <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
            <h3 className="font-extrabold text-sm text-white">Movie Gross Box Office Earnings</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moviePerformance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="title" stroke="#666" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }} />
                  <Bar dataKey="revenue" fill="#FFC914" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {moviePerformance.map((m) => (
              <div key={m.title} className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-2">
                <h4 className="font-bold text-sm text-white truncate">{m.title}</h4>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Tickets Sold:</span>
                  <span className="font-bold text-white">{m.tickets}</span>
                </div>
                <div className="flex justify-between text-xs text-[#888]">
                  <span>Gross Box Office:</span>
                  <span className="font-black text-[#FFC914]">₹{m.revenue}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Occupancy Report */}
      {activeReportTab === "OCCUPANCY" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {occupancyData.map((s) => (
            <div key={s.screen} className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
              <h4 className="font-black text-base text-white">{s.screen}</h4>
              <div className="text-3xl font-black text-[#FFC914]">{s.occupancyRate}%</div>
              <p className="text-xs text-[#888]">Capacity Utilization Rate</p>

              <div className="space-y-2 text-xs border-t border-[#222] pt-3">
                <div className="flex justify-between">
                  <span className="text-[#888]">Total Screen Seats</span>
                  <span className="text-white font-bold">{s.totalSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Sold Seats</span>
                  <span className="text-[#22C55E] font-bold">{s.soldSeats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#888]">Blocked / Maintenance</span>
                  <span className="text-[#EF4444] font-bold">{s.blockedSeats}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Payments Report */}
      {activeReportTab === "PAYMENTS" && (
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentBreakdown}
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4">
            <h3 className="font-extrabold text-base text-white">Payment Method Distribution</h3>
            <p className="text-xs text-[#888] leading-relaxed">
              UPI represents the most frequent online channel, while Cash and Card dominate POS walk-in bookings.
            </p>
            <div className="space-y-2 text-xs">
              {paymentBreakdown.map((item, idx) => (
                <div key={item.name} className="flex justify-between p-3 bg-[#191919] rounded-xl">
                  <span className="font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    {item.name}
                  </span>
                  <span className="font-black text-[#FFC914]">₹{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

