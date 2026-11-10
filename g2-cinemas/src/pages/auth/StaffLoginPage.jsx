import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Shield,
  Monitor,
  UtensilsCrossed,
  ArrowRight,
  CheckCircle2,
  Copy,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { useAuth, DEMO_STAFF_ACCOUNTS } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const StaffLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [selectedRole, setSelectedRole] = useState("COUNTER_POS");
  const [email, setEmail] = useState("counterpos@g2cinemas.com");
  const [password, setPassword] = useState("G2Counter@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle role switch from selector
  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setErrorMessage("");
    const matched = DEMO_STAFF_ACCOUNTS.find((a) => a.role === roleKey);
    if (matched) {
      setEmail(matched.email);
      setPassword(matched.password);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(email, password, selectedRole);
      setIsSubmitting(false);

      if (result.success) {
        const dest = location.state?.from || result.redirectPath;
        navigate(dest, { replace: true });
      } else {
        setErrorMessage(result.error);
        toast.error(result.error);
      }
    }, 400);
  };

  const handleFillCredentials = (account) => {
    setSelectedRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
    setErrorMessage("");
    toast.success(`Loaded credentials for ${account.roleName}`);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col justify-between p-4 sm:p-6 font-sans">
      {/* Top Bar with back to Customer link */}
      <div className="max-w-5xl mx-auto w-full flex items-center justify-between py-2">
        <Link to="/" className="flex items-center gap-2 text-xs text-[#888] hover:text-[#FFC914] transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customer Portal</span>
        </Link>
        <span className="text-[11px] text-[#666] uppercase font-bold tracking-widest">
          G2 Cinemas • Internal Operations
        </span>
      </div>

      {/* Center Login Card Container */}
      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="bg-[#141414] border border-[#292929] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC914] text-black font-black flex items-center justify-center text-2xl mx-auto shadow-lg shadow-[#FFC914]/25">
              G2
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Staff Portal Login
            </h1>
            <p className="text-xs text-[#888]">
              Sign in to access your G2 Cinemas operations dashboard.
            </p>
          </div>

          {/* Role Selection Tabs */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#777] block">
              Operational Department
            </label>
            <div className="grid grid-cols-3 gap-2 bg-[#0d0d0d] p-1.5 rounded-2xl border border-[#242424]">
              {DEMO_STAFF_ACCOUNTS.map((acc) => {
                const isSelected = selectedRole === acc.role;
                const Icon =
                  acc.role === "COUNTER_POS"
                    ? Monitor
                    : acc.role === "CANTEEN_STAFF"
                    ? UtensilsCrossed
                    : Shield;

                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleRoleSelect(acc.role)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                      isSelected
                        ? "bg-[#FFC914] text-black font-extrabold shadow-md shadow-[#FFC914]/20 scale-100"
                        : "text-[#888] hover:text-white hover:bg-[#1a1a1a]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] leading-tight font-bold">{acc.roleName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-2xl text-xs text-red-300 leading-relaxed animate-in fade-in">
              {errorMessage}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[#888] font-bold block">Staff Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@g2cinemas.com"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[#888] font-bold block">Password</label>
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

            {/* Remember Me */}
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

              <span className="text-[10px] text-[#666]">Demo Prototype Mode</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#FFC914] hover:bg-[#EAB308] text-black font-black text-xs tracking-wide uppercase transition-all shadow-xl shadow-[#FFC914]/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>Authenticating Staff...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Demo Credentials Box for Client Testing */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFC914] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Demo Staff Credentials</span>
            </span>
            <span className="text-[10px] text-[#666]">Click any role to auto-fill</span>
          </div>

          <div className="space-y-2 text-xs">
            {DEMO_STAFF_ACCOUNTS.map((acc) => (
              <div
                key={acc.role}
                onClick={() => handleFillCredentials(acc)}
                className="p-2.5 rounded-xl bg-[#171717] hover:bg-[#1f1f1f] border border-[#2a2a2a] hover:border-[#FFC914]/40 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="font-bold text-white group-hover:text-[#FFC914] transition-colors flex items-center gap-1.5">
                    <span>{acc.roleName}</span>
                    <span className="text-[10px] text-[#666] font-normal font-mono">({acc.portalPath})</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#888] mt-0.5">
                    {acc.email} • <span className="text-[#aaa]">{acc.password}</span>
                  </div>
                </div>

                <button
                  type="button"
                  title="Auto-fill credentials"
                  className="px-2 py-1 rounded bg-[#222] text-[10px] text-[#FFC914] font-bold group-hover:bg-[#FFC914] group-hover:text-black transition"
                >
                  Use
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer Disclaimer */}
      <div className="text-center text-[11px] text-[#555] py-2">
        G2 Cinemas Operational Systems • Confidential & Authorized Personnel Only
      </div>
    </div>
  );
};

