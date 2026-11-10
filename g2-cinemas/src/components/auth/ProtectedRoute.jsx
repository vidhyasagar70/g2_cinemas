import React, { useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ShieldAlert, ArrowRight, LogOut, Ticket } from "lucide-react";
import { useAuth, ALL_DEMO_ACCOUNTS } from "../../context/AuthContext";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isCustomer, isStaff, logout, switchPortal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. If not authenticated, redirect to the one common login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // 2. If user is a Customer, block access to all staff operational portals
  if (isCustomer) {
    return (
      <div className="min-h-screen bg-[#080808] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#141414] border border-[#292929] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-500 mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-red-500 bg-red-950/40 px-3 py-1 rounded-full border border-red-800/40">
              Staff Only Portal
            </span>
            <h2 className="text-2xl font-black text-white pt-1">
              Customer Access Denied
            </h2>
            <p className="text-xs text-[#888] leading-relaxed">
              You are currently signed in as a <span className="text-[#FFC914] font-bold">Movie Customer</span>.
              Counter POS, Kitchen Display, and Administration consoles are restricted to cinema operations staff.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-2xl border border-[#262626] text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-[#777]">Active Account:</span>
              <span className="font-mono text-white">{user.name} ({user.email})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#777]">Account Role:</span>
              <span className="text-[#22C55E] font-bold">Customer Portal</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => navigate("/")}
              className="w-full py-3.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-[#FFC914]/20 cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Return to Customer Portal</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#252525] text-white border border-[#333] text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign In with Staff Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. For Staff members:
  // If the active role does not match the required portal role, auto-switch to it seamlessly
  // (e.g., POS staff navigating to Canteen or Admin gets immediate portal access)
  useEffect(() => {
    if (isStaff && requiredRole && user?.role !== requiredRole) {
      switchPortal(requiredRole);
    }
  }, [isStaff, requiredRole, user?.role, switchPortal]);

  return children;
};
