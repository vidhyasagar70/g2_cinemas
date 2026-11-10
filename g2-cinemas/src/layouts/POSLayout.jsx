import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  Film,
  BarChart3,
  Settings,
  UserCheck,
  LogOut,
  Bell,
  Clock
} from "lucide-react";
import { PrototypeBar } from "../components/common/PrototypeBar";
import { useApp } from "../context/AppContext";

export const POSLayout = () => {
  const location = useLocation();
  const { settings } = useApp();
  const staff = settings.posStaff || {
    name: "Counter POS Staff",
    counter: "Counter #02",
    shift: "09:00 AM - 05:00 PM",
    status: "Active"
  };

  const navItems = [
    { name: "Overview", path: "/pos", icon: LayoutDashboard },
    { name: "New Ticket", path: "/pos/new-ticket", icon: PlusCircle, isHighlight: true },
    { name: "Bookings", path: "/pos/bookings", icon: Ticket },
    { name: "Movies & Shows", path: "/pos/shows", icon: Film },
    { name: "Reports", path: "/pos/reports", icon: BarChart3 },
    { name: "Settings", path: "/pos/settings", icon: Settings }
  ];

  const isActive = (path) => {
    if (path === "/pos" && location.pathname === "/pos") return true;
    if (path !== "/pos" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#101010] border-r border-[#292929] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-[#292929] flex items-center justify-between">
            <Link to="/pos" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] text-black font-black flex items-center justify-center text-2xl shadow-lg shadow-[#FFC914]/25 border border-[#FFE885]/60 group-hover:scale-105 transition-transform shrink-0">
                G2
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white block leading-tight">
                  POS DESK
                </span>
                <span className="text-[10px] text-[#FFC914] uppercase tracking-widest block font-extrabold mt-0.5">
                  VADIPATTI • {staff.counter}
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
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    active
                      ? "bg-[#FFC914] text-black font-bold shadow-md shadow-[#FFC914]/20"
                      : item.isHighlight
                      ? "bg-[#171717] text-[#FFC914] hover:bg-[#202020] border border-[#FFC914]/30"
                      : "text-[#A1A1AA] hover:text-white hover:bg-[#171717]"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? "text-black" : item.isHighlight ? "text-[#FFC914]" : "text-[#888]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Staff Information Footer */}
        <div className="p-4 border-t border-[#292929] bg-[#0c0c0c] mb-12">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#22C55E]">
                Shift Active
              </span>
            </div>
            <span className="text-[10px] bg-[#1a1a1a] text-[#888] px-2 py-0.5 rounded border border-[#333]">
              {staff.counter}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFC914]/15 border border-[#FFC914]/30 flex items-center justify-center text-[#FFC914] font-bold text-[11px]">
              POS
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
              Counter POS System
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-xs text-[#FFC914] font-semibold">
              Walk-in Express Ticketing
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/pos/new-ticket"
              className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-3.5 py-1.5 rounded-lg text-xs font-extrabold transition shadow-md shadow-[#FFC914]/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Book Ticket</span>
            </Link>

            <div className="text-xs text-[#888] font-mono hidden sm:block">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short"
              })}
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

