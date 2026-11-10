import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Monitor, Coffee, Shield, RefreshCw, LogOut, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth, DEMO_STAFF_ACCOUNTS } from "../../context/AuthContext";

export const StaffPrototypeBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orders, bookings, resetData } = useApp();
  const { isAuthenticated, user, switchRole, logout } = useAuth();

  const currentPath = location.pathname;

  // Only display if authenticated and inside a staff route (/pos, /canteen, /admin)
  const isPos = currentPath.startsWith("/pos");
  const isCanteen = currentPath.startsWith("/canteen");
  const isAdmin = currentPath.startsWith("/admin");
  const isStaffRoute = isPos || isCanteen || isAdmin;

  if (!isAuthenticated || !isStaffRoute) {
    return null;
  }

  // Active counts for badges
  const pendingCanteenOrders = orders.filter(
    (o) => o.status === "NEW" || o.status === "PREPARING"
  ).length;

  const todayBookingsCount = bookings.length;

  const staffModules = [
    {
      id: "pos",
      role: "COUNTER_POS",
      name: "Counter POS",
      path: "/pos",
      icon: Monitor,
      active: isPos,
      badge: "Counter #02"
    },
    {
      id: "canteen",
      role: "CANTEEN_STAFF",
      name: "Canteen Staff",
      path: "/canteen",
      icon: Coffee,
      active: isCanteen,
      badge: pendingCanteenOrders > 0 ? `${pendingCanteenOrders} Orders` : null,
      badgeColor: "bg-red-500"
    },
    {
      id: "admin",
      role: "THEATRE_ADMIN",
      name: "Theatre Admin",
      path: "/admin",
      icon: Shield,
      active: isAdmin,
      badge: `${todayBookingsCount} Bookings`
    }
  ];

  const handleSwitchPortal = (module) => {
    // Switch the session role seamlessly for the prototype demonstration
    switchRole(module.role);
    navigate(module.path);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#101010]/95 backdrop-blur-md border-t border-[#292929] px-4 py-2.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Module Indicator for Staff */}
        <div className="hidden lg:flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-extrabold text-[#A1A1AA]">
            Staff Operations Portal
          </span>
          <span className="text-[10px] bg-[#1a1a1a] text-[#FFC914] font-bold px-2 py-0.5 rounded border border-[#333]">
            {user?.roleName || "Staff"}
          </span>
        </div>

        {/* Staff Module Switcher (Counter POS, Canteen Staff, Theatre Admin) */}
        <div className="flex items-center gap-1.5 sm:gap-2 mx-auto lg:mx-0 overflow-x-auto py-0.5">
          {staffModules.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => handleSwitchPortal(m)}
                className={`relative flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  m.active
                    ? "bg-[#FFC914] text-black shadow-lg shadow-[#FFC914]/20 font-bold scale-[1.02]"
                    : "bg-[#171717] text-[#A1A1AA] hover:text-white hover:bg-[#222222] border border-[#292929]"
                }`}
              >
                <Icon className={`w-4 h-4 ${m.active ? "text-black" : "text-[#FFC914]"}`} />
                <span>{m.name}</span>

                {m.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      m.active
                        ? "bg-black text-[#FFC914]"
                        : m.badgeColor
                        ? `${m.badgeColor} text-white`
                        : "bg-[#292929] text-[#FFC914]"
                    }`}
                  >
                    {m.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Staff Actions: Reset Demo & Logout */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.confirm("Reset all cinema demo data to default? This will not affect your staff login.")) {
                resetData();
              }
            }}
            title="Reset Mock Data"
            className="hidden sm:flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white bg-[#171717] hover:bg-[#222] px-2.5 py-1.5 rounded-xl border border-[#292929] transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#FFC914]" />
            <span>Reset Demo</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign out of staff portal"
            className="flex items-center gap-1.5 text-xs text-[#888] hover:text-red-400 bg-[#171717] hover:bg-red-950/30 px-3 py-1.5 rounded-xl border border-[#292929] hover:border-red-900/50 transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-400" />
            <span className="font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

