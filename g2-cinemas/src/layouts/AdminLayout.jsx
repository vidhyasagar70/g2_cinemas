import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Ticket,
  Film,
  UtensilsCrossed,
  BarChart3,
  Settings,
  Shield,
  User,
  SlidersHorizontal
} from "lucide-react";
import { PrototypeBar } from "../components/common/PrototypeBar";
import { useApp } from "../context/AppContext";

export const AdminLayout = () => {
  const location = useLocation();
  const { settings, bookings } = useApp();
  const admin = settings.adminProfile || {
    name: "Theatre Admin",
    role: "Theatre Administrator",
    email: "theatreadmin@g2cinemas.com"
  };

  const navItems = [
    { name: "Overview", path: "/admin", icon: LayoutDashboard },
    { name: "Bookings", path: "/admin/bookings", icon: Ticket, badge: bookings.length },
    { name: "Movies & Shows", path: "/admin/movies", icon: Film },
    { name: "Canteen Admin", path: "/admin/canteen", icon: UtensilsCrossed },
    { name: "Reports & Analytics", path: "/admin/reports", icon: BarChart3 },
    { name: "System Settings", path: "/admin/settings", icon: Settings }
  ];

  const isActive = (path) => {
    if (path === "/admin" && location.pathname === "/admin") return true;
    if (path !== "/admin" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#101010] border-r border-[#292929] flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Logo */}
          <div className="p-5 border-b border-[#292929] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3.5 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] text-black font-black flex items-center justify-center text-2xl shadow-lg shadow-[#FFC914]/25 border border-[#FFE885]/60 group-hover:scale-105 transition-transform shrink-0">
                G2
              </div>
              <div>
                <span className="font-black text-lg tracking-wider text-white block leading-tight">
                  ADMIN CONSOLE
                </span>
                <span className="text-[10px] text-[#FFC914] uppercase tracking-widest block font-extrabold mt-0.5">
                  VADIPATTI • ADMIN
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
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        active ? "bg-black text-[#FFC914]" : "bg-[#222] text-[#888]"
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

        {/* Admin Profile Footer */}
        <div className="p-4 border-t border-[#292929] bg-[#0c0c0c] mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#FFC914] text-black font-black flex items-center justify-center text-xs shadow-md">
              TA
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-white truncate">{admin.name}</h5>
              <p className="text-[10px] text-[#A1A1AA] truncate">{admin.role}</p>
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
              G2 Cinemas Administration
            </span>
            <span className="text-[#333]">/</span>
            <span className="text-xs text-[#FFC914] font-semibold">
              Operations & Control
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-[#888] bg-[#171717] px-3 py-1 rounded-lg border border-[#292929] hidden sm:inline">
              Super Admin Access
            </span>
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

