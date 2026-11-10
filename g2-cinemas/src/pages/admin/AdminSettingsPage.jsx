import React, { useState } from "react";
import {
  Settings,
  Building,
  CreditCard,
  Users,
  ShieldCheck,
  Save,
  RotateCcw
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import toast from "react-hot-toast";

export const AdminSettingsPage = () => {
  const { settings, updateSettings, resetData } = useApp();

  const [cinema, setCinema] = useState({
    name: settings.cinema?.name || "G2 Cinemas",
    tagline: settings.cinema?.tagline || "The Pinnacle of Cinematic Excellence",
    location: settings.cinema?.location || "3X7J+P7, Chinnamanayakkanpatti, Vadipatti, Tamil Nadu 625218",
    phone: settings.cinema?.phone || "+91 94433 12345",
    email: settings.cinema?.email || "support@g2cinemas.com",
    gstNumber: settings.cinema?.gstNumber || "33AABCU9603R1ZM"
  });

  const [pricing, setPricing] = useState({
    baseStandard: settings.pricing?.baseStandard || 190,
    basePremium: settings.pricing?.basePremium || 290,
    baseRecliner: settings.pricing?.baseRecliner || 420,
    convenienceFeeFlat: settings.pricing?.convenienceFeeFlat || 35
  });

  const [posStaff, setPosStaff] = useState({
    name: settings.posStaff?.name || "Counter POS Staff",
    counter: settings.posStaff?.counter || "Counter #02",
    shift: settings.posStaff?.shift || "Morning Shift (09:00 AM - 05:00 PM)"
  });

  const [adminProfile, setAdminProfile] = useState({
    name: settings.adminProfile?.name || "Theatre Admin",
    role: settings.adminProfile?.role || "Theatre Administrator",
    email: settings.adminProfile?.email || "theatreadmin@g2cinemas.com"
  });

  const handleSaveAll = (e) => {
    e.preventDefault();
    updateSettings({
      cinema,
      pricing,
      posStaff: { ...settings.posStaff, ...posStaff },
      adminProfile
    });
  };

  return (
    <div className="max-w-4xl space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292929] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            System & Cinema Settings
          </h1>
          <p className="text-xs text-[#888]">
            Configure theatre details, baseline pricing, fees, and staff rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.confirm("Reset all cinema demo data?")) {
                resetData();
              }
            }}
            className="flex items-center gap-2 bg-[#171717] hover:bg-[#252525] text-[#888] hover:text-white border border-[#2e2e2e] px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#FFC914]" />
            <span>Reset Demo State</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-2 bg-[#FFC914] hover:bg-[#EAB308] text-black px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[#FFC914]/20 transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Cinema Information */}
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-[#222] pb-3">
            <Building className="w-4 h-4 text-[#FFC914]" />
            <span>Theatre & Facility Details</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[#888] block mb-1">Cinema Name</label>
              <input
                type="text"
                value={cinema.name}
                onChange={(e) => setCinema({ ...cinema, name: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">Brand Tagline</label>
              <input
                type="text"
                value={cinema.tagline}
                onChange={(e) => setCinema({ ...cinema, tagline: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[#888] block mb-1">Location Address</label>
              <input
                type="text"
                value={cinema.location}
                onChange={(e) => setCinema({ ...cinema, location: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">Contact Phone</label>
              <input
                type="text"
                value={cinema.phone}
                onChange={(e) => setCinema({ ...cinema, phone: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">GST Registration #</label>
              <input
                type="text"
                value={cinema.gstNumber}
                onChange={(e) => setCinema({ ...cinema, gstNumber: e.target.value })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Convenience Fees */}
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-[#222] pb-3">
            <CreditCard className="w-4 h-4 text-[#FFC914]" />
            <span>Ticket Pricing & Fees Matrix (₹)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-[#888] block mb-1">Standard Row Price</label>
              <input
                type="number"
                value={pricing.baseStandard}
                onChange={(e) => setPricing({ ...pricing, baseStandard: Number(e.target.value) })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">Premium Row Price</label>
              <input
                type="number"
                value={pricing.basePremium}
                onChange={(e) => setPricing({ ...pricing, basePremium: Number(e.target.value) })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">Recliner Lounge Price</label>
              <input
                type="number"
                value={pricing.baseRecliner}
                onChange={(e) => setPricing({ ...pricing, baseRecliner: Number(e.target.value) })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[#888] block mb-1">Convenience Fee Base</label>
              <input
                type="number"
                value={pricing.convenienceFeeFlat}
                onChange={(e) => setPricing({ ...pricing, convenienceFeeFlat: Number(e.target.value) })}
                className="w-full bg-[#1c1c1c] border border-[#333] rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Staff & Operator Details */}
        <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-4">
          <div className="flex items-center gap-2 text-white font-extrabold text-sm border-b border-[#222] pb-3">
            <Users className="w-4 h-4 text-[#FFC914]" />
            <span>Active Staff Configuration</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3 bg-[#191919] p-4 rounded-2xl border border-[#262626]">
              <span className="font-bold text-[#FFC914] block">Counter POS Operator</span>
              <div>
                <label className="text-[#888] block mb-1">Operator Name</label>
                <input
                  type="text"
                  value={posStaff.name}
                  onChange={(e) => setPosStaff({ ...posStaff, name: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-[#888] block mb-1">Counter Identifier</label>
                <input
                  type="text"
                  value={posStaff.counter}
                  onChange={(e) => setPosStaff({ ...posStaff, counter: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="space-y-3 bg-[#191919] p-4 rounded-2xl border border-[#262626]">
              <span className="font-bold text-[#FFC914] block">Theatre Admin Lead</span>
              <div>
                <label className="text-[#888] block mb-1">Admin Name</label>
                <input
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-[#888] block mb-1">Official Email</label>
                <input
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({ ...adminProfile, email: e.target.value })}
                  className="w-full bg-[#121212] border border-[#333] rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

