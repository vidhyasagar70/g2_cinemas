import React from "react";
import { Link } from "react-router-dom";
import { Film, Phone, Mail, MapPin, Award, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export const Footer = () => {
  const { settings } = useApp();
  const { isStaff } = useAuth();

  return (
    <footer className="bg-[#080808] border-t border-[#292929] pt-12 pb-12 text-sm text-[#A1A1AA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 ${isStaff ? "md:grid-cols-4" : "md:grid-cols-3"} gap-8 mb-12`}>
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] flex items-center justify-center font-black text-black text-2xl shadow-xl shadow-[#FFC914]/25 border-2 border-[#FFE885]/60 shrink-0">
                G2
              </div>
              <div>
                <span className="font-black text-2xl text-white tracking-wider block leading-none">
                  CINEMAS
                </span>
                <span className="text-[11px] text-[#FFC914] uppercase tracking-widest font-black flex items-center gap-1 block mt-1">
                  <MapPin className="w-3 h-3 text-[#FFC914]" />
                  <span>VADIPATTI</span>
                </span>
              </div>
            </div>
            <p className="text-xs text-[#888] leading-relaxed">
              Experience the unmatched thrill of Dolby Atmos 64-channel spatial sound and 4K Laser projection with luxury recliner seating and gourmet cinema dining.
            </p>
            <div className="flex items-center gap-3 text-xs text-[#FFC914]">
              <Award className="w-4 h-4" />
              <span>Certified Premium Sound & Screen</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#FFC914] transition">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-[#FFC914] transition">
                  Coming Soon
                </Link>
              </li>
              <li>
                <Link to="/food" className="hover:text-[#FFC914] transition">
                  G2 Canteen & Express Menu
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="hover:text-[#FFC914] transition">
                  Ticket History
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-[#FFC914] transition">
                  Customer Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#FFC914] transition">
                  Join G2 Club (Register)
                </Link>
              </li>
            </ul>
          </div>

          {/* Internal Portals - Only visible to Staff */}
          {isStaff && (
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
                Staff & Operations
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/pos" className="hover:text-white transition">
                    <span>Counter POS Terminal</span>
                  </Link>
                </li>
                <li>
                  <Link to="/canteen" className="hover:text-white transition">
                    <span>Canteen Kitchen Display</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="hover:text-white transition">
                    <span>Theatre Admin Dashboard</span>
                  </Link>
                </li>
                <li className="pt-2 text-[11px] text-[#666]">
                  Active Staff Session
                </li>
              </ul>
            </div>
          )}

          {/* Cinema Location & Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Cinema Hub
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#FFC914] shrink-0 mt-0.5" />
                <span>{settings.cinema?.location || "3X7J+P7, Chinnamanayakkanpatti, Vadipatti, Tamil Nadu 625218"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFC914] shrink-0" />
                <span>{settings.cinema?.phone || "+91 (080) 4567 8900"}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FFC914] shrink-0" />
                <span>{settings.cinema?.email || "support@g2cinemas.com"}</span>
              </li>
              <li className="pt-2 flex items-center gap-1.5 text-[11px] text-[#888]">
                <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                <span>100% Secure Paperless Ticketing</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-[#1a1a1a] flex flex-col sm:flex-row items-center justify-between text-xs text-[#555] gap-4">
          <p>© 2026 G2 Cinemas Ltd. All rights reserved. Built for client demonstration.</p>
          <div className="flex gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>FSSAI Lic. #11223344556677</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

