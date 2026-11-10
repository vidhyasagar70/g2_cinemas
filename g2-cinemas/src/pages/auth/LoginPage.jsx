import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  User,
  Shield,
  Monitor,
  UtensilsCrossed,
  ShieldAlert,
  CheckCircle2,
  Ticket
} from "lucide-react";
import { useAuth, ALL_DEMO_ACCOUNTS } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, allDemoAccounts } = useAuth();

  const [selectedRole, setSelectedRole] = useState("CUSTOMER");
  const [identifier, setIdentifier] = useState(allDemoAccounts[0].email);
  const [password, setPassword] = useState(allDemoAccounts[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // If a user was redirected from a protected route, preserve it
  const destinationState = location.state?.from;

  const handleRoleSelect = (account) => {
    setSelectedRole(account.role);
    setIdentifier(account.email);
    setPassword(account.password);
    setErrorMessage("");
    toast.success(`Selected ${account.roleName} demo credentials`);
  };

  const handleDirectLogin = (account) => {
    setSelectedRole(account.role);
    setIdentifier(account.email);
    setPassword(account.password);
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const result = login(account.email, account.password);
      setIsLoading(false);

      if (result.success) {
        // If there was a redirect destination matching staff/customer, use it, else portal default
        const target = destinationState || result.redirectPath;
        navigate(target, { replace: true });
      } else {
        setErrorMessage(result.error);
      }
    }, 300);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      const result = login(identifier, password);
      setIsLoading(false);

      if (result.success) {
        const target = destinationState || result.redirectPath;
        navigate(target, { replace: true });
      } else {
        setErrorMessage(result.error);
      }
    }, 350);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "CUSTOMER":
        return Ticket;
      case "COUNTER_POS":
        return Monitor;
      case "CANTEEN_STAFF":
        return UtensilsCrossed;
      case "THEATRE_ADMIN":
        return Shield;
      default:
        return User;
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Header */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-[#888] hover:text-[#FFC914] transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to G2 Cinemas</span>
        </Link>
        <span className="text-[11px] text-[#666] uppercase font-bold tracking-widest hidden sm:inline">
          G2 Cinemas • Unified Access Gateway
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl w-full mx-auto my-6 space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] text-black font-black flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-[#FFC914]/30 border-2 border-[#FFE885]/70 hover:scale-105 transition-transform">
              G2
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            G2 Cinemas • <span className="text-[#FFC914]">Vadipatti</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#888] max-w-md mx-auto">
            One unified sign-in for Movie Customers, Counter POS, Canteen Kitchen, and Theatre Administration.
          </p>
        </div>

        {/* 1-Click Role Accounts Selector Grid (Desktop/Tablet Only - Hidden on Mobile) */}
        <div className="hidden sm:block space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FFC914] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Select Your Role to Test (Instant 1-Click Access)</span>
            </span>
            <span className="text-[10px] text-[#777]">Credentials auto-route based on account</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allDemoAccounts.map((account) => {
              const Icon = getRoleIcon(account.role);
              const isSelected = selectedRole === account.role;

              return (
                <div
                  key={account.role}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between gap-3 text-left ${
                    isSelected
                      ? "bg-[#181818] border-[#FFC914] shadow-lg shadow-[#FFC914]/15 scale-[1.02]"
                      : "bg-[#121212] border-[#252525] hover:border-[#383838] hover:bg-[#161616]"
                  }`}
                  onClick={() => handleRoleSelect(account)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-[#FFC914] text-black"
                            : "bg-[#1c1c1c] text-[#FFC914] border border-[#2e2e2e]"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? "bg-[#FFC914]/20 text-[#FFC914] border border-[#FFC914]/30"
                            : "bg-[#1c1c1c] text-[#777]"
                        }`}
                      >
                        {account.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                        <span>{account.roleName}</span>
                      </h3>
                      <p className="text-[11px] text-[#777] line-clamp-2 mt-0.5 leading-relaxed">
                        {account.description}
                      </p>
                    </div>

                    <div className="text-[10px] font-mono text-[#888] pt-1 border-t border-[#202020] space-y-0.5">
                      <div className="truncate">{account.email}</div>
                      <div className="text-[#666]">Pass: {account.password}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDirectLogin(account);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-[#FFC914] hover:bg-[#EAB308] text-black shadow-md shadow-[#FFC914]/20"
                        : "bg-[#1e1e1e] hover:bg-[#252525] text-white border border-[#2e2e2e]"
                    }`}
                  >
                    <span>Instant Login</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Manual Login Card (On mobile: Clean customer login only) */}
        <div className="max-w-md mx-auto w-full bg-[#141414] border border-[#292929] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="border-b border-[#242424] pb-3 text-center sm:text-left">
            <h2 className="text-base font-extrabold text-white">
              <span className="sm:hidden">Customer Sign In</span>
              <span className="hidden sm:inline">Sign In with Custom Credentials</span>
            </h2>
            <p className="text-xs text-[#777] mt-0.5">
              <span className="sm:hidden">Enter your email and password to book tickets and order snacks.</span>
              <span className="hidden sm:inline">Enter any customer, staff, or admin account details below.</span>
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-2xl text-xs text-red-300 leading-relaxed flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email/Identifier */}
            <div className="space-y-1.5">
              <label className="text-[#888] font-bold block">
                Email Address or Customer Mobile
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="name@g2cinemas.com or 9876543210"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-sans"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[#888] font-bold block">Password</label>
                <button
                  type="button"
                  onClick={() =>
                    toast("Customer demo credentials: aarav@gmail.com / pass123", {
                      icon: "🔑"
                    })
                  }
                  className="text-[11px] text-[#FFC914] hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#666] hover:text-white transition p-0.5 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember & Encryption */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#202020] border-[#333] accent-[#FFC914]"
                />
                <span className="text-[#888] text-[11px]">Remember workstation</span>
              </label>
              <span className="text-[10px] text-[#666]">SSL 256-bit Encrypted</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs tracking-wide uppercase transition-all shadow-xl shadow-[#FFC914]/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span className="sm:hidden">Sign In</span>
                  <span className="hidden sm:inline">Sign In to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Register Link for Customers */}
          <div className="pt-2 text-center text-xs text-[#888] border-t border-[#222]">
            <span>Need a customer account? </span>
            <Link
              to="/register"
              state={{ from: destinationState }}
              className="text-[#FFC914] font-bold hover:underline"
            >
              Register for G2 Club
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#555] py-2">
        G2 Cinemas • Single Unified Access Gateway • Chinnamanayakkanpatti, Vadipatti, Tamil Nadu 625218
      </div>
    </div>
  );
};
