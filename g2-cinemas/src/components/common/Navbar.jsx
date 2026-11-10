import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Film,
  MapPin,
  Ticket,
  User,
  Utensils,
  ChevronDown,
  Check,
  LogOut,
  Sparkles,
  Monitor,
  UtensilsCrossed,
  Shield,
  Layers,
  Menu,
  X
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth, ALL_DEMO_ACCOUNTS } from "../../context/AuthContext";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLocation, setSelectedLocation, settings, bookings, orders } = useApp();
  const { isAuthenticated, user, isCustomer, isStaff, logout, switchPortal } = useAuth();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowProfileModal(false);
  }, [location.pathname]);

  const availableCities = settings.cinema?.availableCities || ["Vadipatti"];

  const totalActivityCount = (bookings?.length || 0) + (orders?.length || 0);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Food & Beverages", path: "/food" },
    { name: "My Bookings", path: "/my-bookings", count: totalActivityCount }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const staffPortals = [
    { name: "Counter POS", path: "/pos", role: "COUNTER_POS", icon: Monitor },
    { name: "Canteen Kitchen", path: "/canteen", role: "CANTEEN_STAFF", icon: UtensilsCrossed },
    { name: "Theatre Admin", path: "/admin", role: "THEATRE_ADMIN", icon: Shield }
  ];

  const handleSwitchStaffPortal = (portal) => {
    switchPortal(portal.role);
    setShowProfileModal(false);
    setIsMobileMenuOpen(false);
    navigate(portal.path);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#292929]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-24 flex items-center justify-between">
        {/* Brand Logo - Prominent & Enlarged G2 Main Brand with Landmark Location */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-4 group py-1.5 shrink-0">
          <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] flex items-center justify-center font-black text-black text-xl sm:text-4xl tracking-tighter shadow-lg shadow-[#FFC914]/25 border-2 border-[#FFE885]/70 group-hover:scale-105 group-hover:shadow-[#FFC914]/40 transition-all duration-300 shrink-0">
            G2
          </div>
          <div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <span className="font-black text-lg sm:text-3xl tracking-wider text-white group-hover:text-[#FFC914] transition-colors leading-none">
                CINEMAS
              </span>
              <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FFC914] shadow-sm shadow-[#FFC914] animate-pulse"></span>
            </div>
            <p className="text-[9px] sm:text-xs text-[#FFC914] uppercase tracking-widest font-black flex items-center gap-1 mt-0.5 sm:mt-1">
              <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFC914] shrink-0" />
              <span>VADIPATTI</span>
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative px-3.5 lg:px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 flex items-center gap-2 ${
                isActive(link.path)
                  ? "text-[#FFC914] bg-[#171717]"
                  : "text-[#A1A1AA] hover:text-white hover:bg-[#141414]"
              }`}
            >
              <span>{link.name}</span>
              {link.count !== undefined && link.count > 0 && (
                <span className="bg-[#292929] text-[#FFC914] text-[11px] font-bold px-1.5 py-0.2 rounded-full">
                  {link.count}
                </span>
              )}
              {isActive(link.path) && (
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#FFC914] rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Section: Location Selector & Profile / Auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Staff Quick Hub Button (Desktop only) */}
          {isStaff && (
            <div className="hidden lg:flex items-center gap-1 bg-[#1c1c1c] p-1 rounded-xl border border-[#FFC914]/40">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFC914] px-2 flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>Portals:</span>
              </span>
              {staffPortals.map((p) => {
                const isCurrentPortal = user?.role === p.role;
                return (
                  <button
                    key={p.role}
                    onClick={() => handleSwitchStaffPortal(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                      isCurrentPortal
                        ? "bg-[#FFC914] text-black shadow-sm"
                        : "text-[#A1A1AA] hover:text-white hover:bg-[#252525]"
                    }`}
                  >
                    <span>{p.name.split(" ")[0]}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Cinema Location Badge (Vadipatti Only) */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#171717] text-white px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-[#292929] text-xs font-bold">
            <MapPin className="w-3.5 h-3.5 text-[#FFC914]" />
            <span>Vadipatti</span>
          </div>

          {/* User Profile / Login Button */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileModal(!showProfileModal)}
                className={`flex items-center gap-1.5 sm:gap-2 bg-[#171717] hover:bg-[#222] border rounded-xl px-2 sm:px-2.5 py-1.5 text-xs text-white transition cursor-pointer group ${
                  isStaff ? "border-[#FFC914]/50" : "border-[#292929]"
                }`}
              >
                <div
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center font-bold text-[11px] sm:text-xs ${
                    isStaff
                      ? "bg-[#FFC914] text-black shadow-md shadow-[#FFC914]/20"
                      : "bg-[#FFC914]/20 border border-[#FFC914]/40 text-[#FFC914]"
                  }`}
                >
                  {getInitials(user.name)}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="font-bold block truncate max-w-[90px] leading-tight">
                    {user.name.split(" ")[0]}
                  </span>
                  {isStaff && (
                    <span className="text-[9px] text-[#FFC914] font-extrabold uppercase tracking-wider block">
                      {user.roleName}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#888] group-hover:text-white" />
              </button>

              {showProfileModal && (
                <div className="absolute right-0 mt-2 w-72 bg-[#171717] border border-[#292929] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                  {/* Profile Header */}
                  <div className="flex items-center gap-3 border-b border-[#292929] pb-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        isStaff
                          ? "bg-[#FFC914] text-black font-black"
                          : "bg-[#FFC914]/20 border border-[#FFC914]/40 text-[#FFC914]"
                      }`}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
                      <p className="text-xs text-[#A1A1AA] truncate">{user.email || user.phone}</p>
                      <span className="text-[10px] text-[#FFC914] font-bold bg-[#242424] px-2 py-0.5 rounded-full inline-block mt-0.5">
                        {user.roleName || "User"}
                      </span>
                    </div>
                  </div>

                  {/* 1. If Staff: Show Operations Portals to switch between */}
                  {isStaff && (
                    <div className="space-y-1.5 border-b border-[#292929] pb-3">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFC914] flex items-center gap-1 px-1">
                        <Layers className="w-3 h-3" />
                        <span>Operations Portals Access</span>
                      </div>
                      <div className="space-y-1">
                        {staffPortals.map((p) => {
                          const Icon = p.icon;
                          const isActivePortal = user.role === p.role;
                          return (
                            <button
                              key={p.role}
                              onClick={() => handleSwitchStaffPortal(p)}
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                isActivePortal
                                  ? "bg-[#FFC914] text-black font-bold shadow-sm"
                                  : "text-[#ccc] hover:text-white hover:bg-[#222]"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="w-3.5 h-3.5" />
                                <span>{p.name}</span>
                              </div>
                              {isActivePortal && (
                                <span className="text-[9px] font-extrabold bg-black text-[#FFC914] px-1.5 py-0.2 rounded">
                                  Active
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Customer Links */}
                  <div className="space-y-1">
                    <Link
                      to="/my-bookings"
                      onClick={() => setShowProfileModal(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-[#FFC914] hover:bg-[#222] rounded-lg transition"
                    >
                      <Ticket className="w-4 h-4" />
                      <span>My Bookings & Orders ({totalActivityCount})</span>
                    </Link>
                    <Link
                      to="/food"
                      onClick={() => setShowProfileModal(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-[#FFC914] hover:bg-[#222] rounded-lg transition"
                    >
                      <Utensils className="w-4 h-4" />
                      <span>Order Snacks Only</span>
                    </Link>
                  </div>

                  {/* Sign Out */}
                  <button
                    onClick={() => {
                      logout();
                      setShowProfileModal(false);
                      navigate("/login");
                    }}
                    className="w-full pt-2.5 border-t border-[#292929] flex items-center justify-center gap-2 text-xs text-red-400 hover:text-red-300 font-bold transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Link
                to="/login"
                className="flex items-center gap-1 bg-[#FFC914] hover:bg-[#EAB308] text-black px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black transition shadow-md shadow-[#FFC914]/20 cursor-pointer"
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/register"
                className="hidden sm:inline-block text-xs font-bold text-[#888] hover:text-white px-2 py-1 transition"
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-[#171717] hover:bg-[#222] border border-[#292929] text-[#A1A1AA] hover:text-white transition cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-[#FFC914]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-b border-[#292929] px-4 py-4 space-y-4 animate-in slide-in-from-top-3 duration-200">
          {/* Cinema Location on Mobile (Vadipatti Only) */}
          <div className="bg-[#141414] p-3 rounded-2xl border border-[#252525] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFC914]/15 border border-[#FFC914]/30 text-[#FFC914] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFC914] block leading-none">
                  THEATRE LOCATION
                </span>
                <span className="text-xs font-bold text-white mt-1 block">
                  Vadipatti • Tamil Nadu
                </span>
              </div>
            </div>
            <span className="text-[10px] bg-[#1a1a1a] border border-[#333] px-2.5 py-0.5 rounded text-[#FFC914] font-semibold">
              Screens 1 & 2
            </span>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition ${
                  isActive(link.path)
                    ? "bg-[#1a1a1a] text-[#FFC914] border border-[#FFC914]/30"
                    : "text-[#ccc] hover:bg-[#161616] hover:text-white"
                }`}
              >
                <span>{link.name}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="bg-[#FFC914] text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {link.count}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* If Staff: Operations Portals on Mobile */}
          {isStaff && (
            <div className="bg-[#141414] p-3 rounded-2xl border border-[#FFC914]/30 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#FFC914] flex items-center gap-1">
                <Layers className="w-3 h-3" />
                <span>Switch Staff Portal</span>
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {staffPortals.map((p) => {
                  const Icon = p.icon;
                  const isCurrent = user?.role === p.role;
                  return (
                    <button
                      key={p.role}
                      onClick={() => handleSwitchStaffPortal(p)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isCurrent
                          ? "bg-[#FFC914] text-black font-black"
                          : "bg-[#1c1c1c] text-[#ccc] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{p.name}</span>
                      </div>
                      {isCurrent && (
                        <span className="text-[9px] bg-black text-[#FFC914] px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Auth options on Mobile if not logged in */}
          {!isAuthenticated && (
            <div className="pt-2 border-t border-[#222] flex items-center gap-2">
              <Link
                to="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#FFC914] text-black font-black text-xs text-center shadow-md shadow-[#FFC914]/20"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1c1c1c] text-white font-bold text-xs text-center border border-[#2e2e2e]"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
