import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customerRegister } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const redirectDest = location.state?.from || "/";

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMessage("");
  };

  const handleQuickFill = () => {
    setFormData({
      name: "Siddharth Raman",
      email: "siddharth.raman@gmail.com",
      phone: "9842109876",
      password: "G2Customer@2026",
      confirmPassword: "G2Customer@2026"
    });
    setErrorMessage("");
    toast.success("Loaded sample registration details!");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Service to create an account.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const result = customerRegister({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });

      setIsLoading(false);

      if (result.success) {
        navigate(redirectDest, { replace: true });
      } else {
        setErrorMessage(result.error);
      }
    }, 400);
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
        <div className="flex items-center gap-2 text-[11px] text-[#666]">
          <span>Already registered?</span>
          <Link to="/login" className="text-[#FFC914] font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Register Box */}
      <div className="max-w-md w-full mx-auto my-6 space-y-5">
        <div className="bg-[#141414] border border-[#292929] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo & Heading */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-block">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFE169] via-[#FFC914] to-[#EAB308] text-black font-black flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-[#FFC914]/30 border-2 border-[#FFE885]/70 hover:scale-105 transition-transform">
                G2
              </div>
            </Link>
            <h1 className="text-2xl font-black text-white tracking-tight">
              G2 Cinemas • <span className="text-[#FFC914]">Vadipatti</span>
            </h1>
            <p className="text-xs text-[#888]">
              Join the G2 Movie Club for paperless tickets and snack perks.
            </p>
          </div>

          {/* Quick Fill Button */}
          <div className="flex items-center justify-between bg-[#191919] p-3 rounded-2xl border border-[#2a2a2a]">
            <div className="text-[11px] text-[#888]">
              <span className="text-[#FFC914] font-bold">Fast Testing:</span> Auto-fill new user info
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="px-3 py-1 bg-[#242424] hover:bg-[#FFC914] hover:text-black text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3" />
              <span>Fill Form</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-950/40 border border-red-800/50 p-3 rounded-2xl text-xs text-red-300 leading-relaxed flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[#888] font-bold block">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Siddharth Raman"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-sans"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-[#888] font-bold block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., siddharth@gmail.com"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-sans"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div className="space-y-1">
              <label className="text-[#888] font-bold block">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., 9842109876"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[#888] font-bold block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min 6 chars)"
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

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[#888] font-bold block">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full bg-[#1c1c1c] border border-[#2e2e2e] rounded-xl pl-10 pr-3.5 py-2.5 text-white placeholder-[#555] focus:outline-none focus:border-[#FFC914] transition font-mono"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-[#202020] border-[#333] accent-[#FFC914] mt-0.5 shrink-0"
                />
                <span className="text-[#888] text-[11px] leading-relaxed">
                  I agree to G2 Cinemas Terms of Service, Privacy Policy, and SMS ticket delivery updates.
                </span>
              </label>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register & Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Already have account */}
          <div className="pt-2 text-center text-xs text-[#888] border-t border-[#222]">
            <span>Already have an account? </span>
            <Link
              to="/login"
              state={{ from: redirectDest }}
              className="text-[#FFC914] font-bold hover:underline"
            >
              Sign In here
            </Link>
          </div>
        </div>

        {/* Staff Notice */}
        <div className="bg-[#101010] border border-[#242424] rounded-2xl p-3.5 flex items-center justify-between text-xs">
          <span className="text-[#777]">Cinema staff member?</span>
          <Link
            to="/staff-login"
            className="text-[#FFC914] font-bold hover:underline text-[11px]"
          >
            Staff Portal Login →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#555] py-2">
        G2 Cinemas • Secure Paperless Ticketing & Member Club
      </div>
    </div>
  );
};

