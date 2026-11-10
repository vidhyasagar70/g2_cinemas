import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Monitor, Clock, ShieldCheck, LogOut, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const POSSettingsPage = () => {
  const navigate = useNavigate();
  const { settings } = useApp();
  const { logout } = useAuth();
  const staff = settings.posStaff;

  const handleLogoutDemo = () => {
    logout();
    navigate("/staff-login");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="border-b border-[#292929] pb-4">
        <h1 className="text-2xl font-black text-white">POS Terminal & Staff Profile</h1>
        <p className="text-xs text-[#888]">
          Shift assignment and device workstation configuration.
        </p>
      </div>

      <div className="bg-[#141414] p-6 rounded-3xl border border-[#292929] space-y-6">
        <div className="flex items-center gap-4 border-b border-[#222] pb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#FFC914]/20 border border-[#FFC914]/40 flex items-center justify-center text-[#FFC914] font-black text-xl">
            POS
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{staff?.name}</h3>
            <p className="text-xs text-[#FFC914] font-semibold">{staff?.id} • Box Office Associate</p>
            <p className="text-xs text-[#888] mt-0.5">Assigned Station: {staff?.counter}</p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div className="flex justify-between py-2 border-b border-[#222]">
            <span className="text-[#888]">Current Counter</span>
            <span className="text-white font-bold">{staff?.counter}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#222]">
            <span className="text-[#888]">Shift Window</span>
            <span className="text-white font-bold">{staff?.shift}</span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#222]">
            <span className="text-[#888]">Shift Status</span>
            <span className="text-[#22C55E] font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              Active (Counter Clock In: 09:02 AM)
            </span>
          </div>

          <div className="flex justify-between py-2 border-b border-[#222]">
            <span className="text-[#888]">Receipt Printer</span>
            <span className="text-white">TM-T88VI Thermal (Serial 4821)</span>
          </div>
        </div>

        <div className="pt-4 flex justify-between items-center">
          <button
            onClick={handleLogoutDemo}
            className="flex items-center gap-2 bg-[#222] hover:bg-red-950/40 text-[#888] hover:text-red-400 border border-[#333] px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>End Shift / Demo Logout</span>
          </button>

          <span className="text-[11px] text-[#666]">
            Supervisor override PIN not required in demo mode
          </span>
        </div>
      </div>
    </div>
  );
};

