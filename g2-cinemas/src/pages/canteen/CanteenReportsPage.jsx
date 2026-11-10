import React from "react";
import { useApp } from "../../context/AppContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Utensils, CheckCircle, Clock } from "lucide-react";

export const CanteenReportsPage = () => {
  const { orders } = useApp();

  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED" || o.status === "COLLECTED").length;
  const pendingCount = orders.filter((o) => o.status === "NEW" || o.status === "PREPARING").length;

  // Item frequency
  const itemCounts = {};
  orders.forEach((o) => {
    o.items?.forEach((item) => {
      itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
    });
  });

  const chartData = Object.keys(itemCounts).map((key) => ({
    name: key.length > 15 ? key.substring(0, 15) + "..." : key,
    qty: itemCounts[key]
  }));

  return (
    <div className="space-y-8">
      <div className="border-b border-[#292929] pb-4">
        <h1 className="text-2xl font-black text-white">Canteen Kitchen Analytics</h1>
        <p className="text-xs text-[#888]">
          Food prep timings, popular snacks, and revenue velocity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Canteen Gross Revenue</span>
          <span className="text-2xl font-black text-[#FFC914]">₹{totalSales}</span>
          <p className="text-[11px] text-[#22C55E] mt-1">{orders.length} orders prepared</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Delivered to Seat / Picked</span>
          <span className="text-2xl font-black text-[#22C55E]">{deliveredCount} Orders</span>
          <p className="text-[11px] text-[#888] mt-1">100% fulfill rate</p>
        </div>

        <div className="bg-[#141414] p-5 rounded-2xl border border-[#292929]">
          <span className="text-xs text-[#888] font-bold block mb-1">Active Queue in Kitchen</span>
          <span className="text-2xl font-black text-[#3B82F6]">{pendingCount} Pending</span>
          <p className="text-[11px] text-[#888] mt-1">Average wait: 6.5 mins</p>
        </div>
      </div>

      <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
        <h3 className="font-extrabold text-sm text-white">Top Sold Kitchen Items (Units)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
              <YAxis stroke="#666" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#171717", borderColor: "#333", borderRadius: 8 }}
              />
              <Bar dataKey="qty" fill="#FFC914" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

