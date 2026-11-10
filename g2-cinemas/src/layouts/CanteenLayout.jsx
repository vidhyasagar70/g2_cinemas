import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  UtensilsCrossed,
  ChefHat,
  ShoppingBag,
  BarChart2,
  Clock,
  Sparkles
} from "lucide-react";
import { PrototypeBar } from "../components/common/PrototypeBar";
import { useApp } from "../context/AppContext";

export const CanteenLayout = () => {
  const location = useLocation();
  const { settings, orders } = useApp();
  const staff = settings.canteenStaff || {
    name: "Canteen Staff",
    station: "Main Kitchen & Express Dispense",
    shift: "10:00 AM - 06:00 PM",
    status: "Active"
  };

  const pendingCount = orders.filter(
    (o) => o.status === "NEW" || o.status === "PREPARING"
  ).length;

  const navItems = [
    { name: "Live Orders", path: "/canteen", icon: UtensilsCrossed, badge: pendingCount },
    { name: "Kitchen Menu & Stock", path: "/canteen/menu", icon: ShoppingBag },
    { name: "Canteen Reports", path: "/canteen/reports", icon: BarChart2 }
  ];

  const isActive = (path) => {
    if (path === "/canteen" && location.pathname === "/canteen") return true;
    if (path !== "/canteen" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#101010] border-r border-[#292929] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-[#292929] flex items-center justify-between">
            <Link to="/canteen" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] text-black font-black flex items-center justify-center text-2xl shadow-lg shadow-[#FFC914]/25 border border-[#FFE885]/60 group-hover:scale-105 transition-transform shrink-0">
                G2
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white block leading-tight">
                  CANTEEN
                </span>
                <span className="text-[10px] text-[#FFC914] uppercase tracking-widest block font-extrabold mt-0.5">
                  VADIPATTI • KITCHEN
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#FFC914] text-black font-bold shadow-md shadow-[#FFC914]/20"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? "text-black" : "text-[#FFC914]"}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active
                          ? "bg-black text-[#FFC914]"
                          : "bg-red-500 text-white animate-pulse"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Staff Information */}
        <div className="p-4 border-t border-[#292929] bg-[#0c0c0c] mb-12">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#22C55E]">
                Kitchen Live
              </span>
            </div>
            <ChefHat className="w-4 h-4 text-[#FFC914]" />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFC914]/15 border border-[#FFC914]/30 flex items-center justify-center text-[#FFC914] font-bold text-xs">
              CS
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-white truncate">{staff.name}</h5>
              <p className="text-[10px] text-[#777] truncate flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FFC914]" />
                {staff.shift}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16">
        {/* Top Header */}
        <header className="h-16 bg-[#101010]/90 backdrop-blur-md border-b border-[#292929] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-wider text-[#A1A1AA] font-bold">
              Food & Beverage Service
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-xs text-[#FFC914] font-semibold">
              Live Order Management & Dispatch
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#171717] border border-[#292929] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC914]" />
              <span className="text-[#A1A1AA]">Active Queue:</span>
              <span className="font-bold text-[#FFC914]">{pendingCount} orders</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      <PrototypeBar />
    </div>
  );
};

