import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Navbar } from "../components/common/Navbar";
import { Footer } from "../components/common/Footer";
import { Film, Clapperboard, UtensilsCrossed, Ticket } from "lucide-react";
import { useApp } from "../context/AppContext";

export const CustomerLayout = () => {
  const location = useLocation();
  const { bookings, orders } = useApp();

  const isBookingFlow = location.pathname.startsWith("/book");
  const totalActivityCount = (bookings?.length || 0) + (orders?.length || 0);

  const navItems = [
    { name: "Home", path: "/", icon: Film, exact: true },
    { name: "Movies", path: "/movies", icon: Clapperboard },
    { name: "Snacks", path: "/food", icon: UtensilsCrossed },
    { name: "Bookings", path: "/my-bookings", icon: Ticket, count: totalActivityCount }
  ];

  const isCurrentActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col font-sans">
      <Navbar />
      <main className={`flex-1 ${!isBookingFlow ? "pb-20 md:pb-0" : ""}`}>
        <Outlet />
      </main>
      <Footer />

      {/* Mobile Sticky Bottom Navigation Bar (Hidden during /book checkout funnel) */}
      {!isBookingFlow && (
        <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0c0c0c]/95 backdrop-blur-lg border-t border-[#222] px-2 py-1.5 flex items-center justify-around shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isCurrentActive(item);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-150 ${
                  active ? "text-[#FFC914]" : "text-[#777] hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
                  {item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 bg-[#FFC914] text-black text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center shadow-sm">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-1 font-bold tracking-tight ${active ? "text-[#FFC914]" : "text-[#888]"}`}>
                  {item.name}
                </span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[#FFC914] mt-0.5" />
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};
