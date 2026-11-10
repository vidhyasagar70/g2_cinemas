import React, { useState, useMemo } from "react";
import {
  UtensilsCrossed,
  Clock,
  CheckCircle2,
  AlertCircle,
  Armchair,
  ShoppingBag,
  Search,
  Sparkles,
  ChevronRight,
  Filter,
  ArrowRight
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export const CanteenDashboardPage = () => {
  const { orders, updateOrderStatus } = useApp();

  const [activeTab, setActiveTab] = useState("ALL"); // ALL, SEAT_DELIVERY, COUNTER_PICKUP
  const [searchQuery, setSearchQuery] = useState("");

  // Summary Metrics
  const newOrdersCount = orders.filter((o) => o.status === "NEW").length;
  const preparingCount = orders.filter((o) => o.status === "PREPARING").length;
  const readyCount = orders.filter((o) => o.status === "READY").length;
  const todaySales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.seats?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.screen?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "ALL" ? true : o.orderType === activeTab;

      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  return (
    <div className="space-y-8 pb-16">
      {/* 7.1 Dashboard Overview Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">New Orders</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFC914] animate-ping" />
          </div>
          <div className="text-3xl font-black text-[#FFC914]">{newOrdersCount}</div>
          <p className="text-[11px] text-[#A1A1AA]">Awaiting kitchen acceptance</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FFC914]" />
        </div>

        <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Preparing</span>
            <Clock className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-3xl font-black text-[#3B82F6]">{preparingCount}</div>
          <p className="text-[11px] text-[#A1A1AA]">Currently cooking / packing</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#3B82F6]" />
        </div>

        <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Ready to Serve</span>
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-3xl font-black text-[#22C55E]">{readyCount}</div>
          <p className="text-[11px] text-[#A1A1AA]">For butler dispatch or counter</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#22C55E]" />
        </div>

        <div className="bg-[#141414] p-5 rounded-3xl border border-[#292929] space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#888]">
            <span className="text-xs uppercase font-extrabold tracking-wider">Today's Sales</span>
            <Sparkles className="w-4 h-4 text-[#FFC914]" />
          </div>
          <div className="text-3xl font-black text-white">₹{todaySales}</div>
          <p className="text-[11px] text-[#22C55E] font-semibold">{orders.length} total orders</p>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white" />
        </div>
      </div>

      {/* Controls Bar: Order Tabs & Search by Order ID or Seat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-4 rounded-3xl border border-[#292929]">
        {/* Tabs */}
        <div className="flex items-center gap-2">
          {[
            { id: "ALL", label: "All Orders", count: orders.length },
            { id: "SEAT_DELIVERY", label: "Seat Delivery", count: orders.filter((o) => o.orderType === "SEAT_DELIVERY").length },
            { id: "COUNTER_PICKUP", label: "Counter Pickup", count: orders.filter((o) => o.orderType === "COUNTER_PICKUP").length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#FFC914] text-black shadow-md shadow-[#FFC914]/20"
                  : "bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#222]"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? "bg-black text-[#FFC914]" : "bg-[#292929] text-[#aaa]"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#888] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Order ID (e.g. F-2048) or Seat..."
            className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-[#666] focus:outline-none focus:border-[#FFC914]"
          />
        </div>
      </div>

      {/* Orders Cards Grid */}
      {filteredOrders.length === 0 ? (
        <div className="py-20 text-center bg-[#141414] rounded-3xl border border-[#292929] p-8 space-y-2">
          <UtensilsCrossed className="w-12 h-12 text-[#444] mx-auto" />
          <p className="text-sm font-bold text-white">No active orders in this view.</p>
          <p className="text-xs text-[#777]">
            New orders from customer portal & POS will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isDelivery = order.orderType === "SEAT_DELIVERY";

            // Status Badge configuration
            // New: Yellow, Preparing: Blue, Ready: Green, Delivered/Collected: Grey
            const statusConfig = {
              NEW: { bg: "bg-[#FFC914]/15", border: "border-[#FFC914]/40", text: "text-[#FFC914]", label: "NEW ORDER" },
              PREPARING: { bg: "bg-[#3B82F6]/15", border: "border-[#3B82F6]/40", text: "text-[#3B82F6]", label: "PREPARING" },
              READY: { bg: "bg-[#22C55E]/15", border: "border-[#22C55E]/40", text: "text-[#22C55E]", label: "READY" },
              DELIVERED: { bg: "bg-[#222]", border: "border-[#333]", text: "text-[#888]", label: "DELIVERED" },
              COLLECTED: { bg: "bg-[#222]", border: "border-[#333]", text: "text-[#888]", label: "COLLECTED" }
            }[order.status] || { bg: "bg-[#222]", border: "border-[#333]", text: "text-[#888]", label: order.status };

            return (
              <div
                key={order.id}
                className="bg-[#141414] rounded-3xl border border-[#292929] p-5 flex flex-col justify-between space-y-5 hover:border-[#444] transition-all shadow-lg"
              >
                {/* Order Card Top Bar */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base text-[#FFC914]">
                        {order.id}
                      </span>
                      <span className="text-[10px] text-[#777] font-mono">
                        {order.orderTime}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Destination / Order Type Bar */}
                  <div className="bg-[#1a1a1a] p-3 rounded-2xl border border-[#2a2a2a] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {isDelivery ? (
                        <div className="w-7 h-7 rounded-lg bg-[#FFC914]/15 text-[#FFC914] flex items-center justify-center">
                          <Armchair className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-[#222] text-[#888] flex items-center justify-center">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="font-extrabold text-white block">
                          {isDelivery ? "Seat Delivery" : "Express Counter"}
                        </span>
                        <span className="text-[11px] text-[#888]">
                          {order.screen} {order.seats && `• Seat ${order.seats}`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#666] block">Guest</span>
                      <span className="font-bold text-white text-xs">{order.customerName}</span>
                    </div>
                  </div>

                  {/* Food Items List */}
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#666] block">
                      Kitchen Items ({order.items?.length || 0})
                    </span>
                    <ul className="space-y-1.5 text-xs">
                      {order.items?.map((item, idx) => (
                        <li
                          key={idx}
                          className="flex items-center justify-between bg-[#191919] px-3 py-2 rounded-xl border border-[#262626]"
                        >
                          <span className="font-semibold text-white">
                            <span className="text-[#FFC914] font-bold mr-1.5">
                              {item.quantity}x
                            </span>
                            {item.name}
                          </span>
                          <span className="text-[#888] font-mono">
                            ₹{item.price * item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Special Cooking Instructions if any */}
                  {order.instructions && (
                    <div className="bg-[#1f1a0e] border border-[#FFC914]/30 p-2.5 rounded-xl text-[11px] text-[#FFC914] italic">
                      <span className="font-bold not-italic">Note: </span>
                      "{order.instructions}"
                    </div>
                  )}
                </div>

                {/* Bottom Action Buttons Based on Status */}
                <div className="pt-4 border-t border-[#222] space-y-2">
                  <div className="flex justify-between items-center text-xs text-[#888] pb-1">
                    <span>Order Value</span>
                    <span className="font-black text-white text-sm">₹{order.totalAmount}</span>
                  </div>

                  {order.status === "NEW" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "PREPARING")}
                      className="w-full py-2.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-extrabold text-xs transition shadow-md shadow-[#FFC914]/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Accept Order & Start</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => updateOrderStatus(order.id, "READY")}
                      className="w-full py-2.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-extrabold text-xs transition shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready for Pickup/Dispatch</span>
                    </button>
                  )}

                  {order.status === "READY" && (
                    <button
                      onClick={() =>
                        updateOrderStatus(
                          order.id,
                          isDelivery ? "DELIVERED" : "COLLECTED"
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white font-extrabold text-xs transition shadow-md shadow-green-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>
                        {isDelivery ? "Mark Delivered to Seat" : "Mark Collected at Counter"}
                      </span>
                    </button>
                  )}

                  {(order.status === "DELIVERED" || order.status === "COLLECTED") && (
                    <div className="text-center py-2 text-xs text-[#666] font-semibold bg-[#181818] rounded-xl border border-[#262626]">
                      Order Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

