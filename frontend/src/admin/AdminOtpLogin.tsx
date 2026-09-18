import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  X,
  Shield,
  Zap,
  Check,
  Building2,
  Car,
} from "lucide-react";
import { UserRole } from "./types";
import luxuryHeroImg from "@/assets/moar-hero-luxury.jpg";
import { MoarLogo } from "@/components/common/MoarLogo";

interface AdminOtpLoginProps {
  onLoginSuccess: (user: {
    username: string;
    email: string;
    role: UserRole;
    branch: string;
  }) => void;
  onNavigateHome: () => void;
}

export const AdminOtpLogin: React.FC<AdminOtpLoginProps> = ({
  onLoginSuccess,
  onNavigateHome,
}) => {
  // Login Steps: "credentials" | "otp"
  const [step, setStep] = useState<"credentials" | "otp">("credentials");

  // Form State
  const [adminIdentifier, setAdminIdentifier] = useState("moarcars04@gmail.com");
  const [passcode, setPasscode] = useState("admin@moar2026");
  const [showPasscode, setShowPasscode] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second Countdown Timer for OTP
  useEffect(() => {
    let interval: any = null;
    if (step === "otp" && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, timerSeconds]);

  // Focus on first OTP input on step change
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Handle Send OTP via real backend API
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const targetEmail = adminIdentifier.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      setErrorMessage("Please enter a valid authorized admin email address.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStep("otp");
        setTimerSeconds(60);
        setCanResend(false);
        setOtpDigits(["", "", "", "", "", ""]);
        setSuccessMessage(
          data.message || `Verification code sent to ${targetEmail}. Please check your inbox.`
        );
      } else {
        setErrorMessage(data.message || "Failed to dispatch admin verification code.");
      }
    } catch (err: any) {
      console.error("Admin OTP request error:", err);
      setErrorMessage("Connection error. Please ensure backend server is active.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setErrorMessage("");

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle keydown for Backspace / Arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  // Handle Verify OTP via real backend API
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code sent to your email.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminIdentifier.trim().toLowerCase(),
          otp: enteredOtp,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const adminUser = {
          username: data.username || "Executive Super Admin",
          email: adminIdentifier.trim().toLowerCase(),
          role: (data.role || "Super Admin") as UserRole,
          branch: data.branch || "All Branches",
        };
        try {
          sessionStorage.setItem("moar_admin_authenticated", "true");
          sessionStorage.setItem("moar_admin_user", JSON.stringify(adminUser));
        } catch (storageErr) {
          console.error(storageErr);
        }
        onLoginSuccess(adminUser);
      } else {
        setErrorMessage(
          data.message || "Invalid OTP code. Please enter the real code received in your inbox."
        );
      }
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setErrorMessage("Network error during verification. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP via real backend API
  const handleResendOtp = async () => {
    if (!canResend) return;
    setCanResend(false);
    setTimerSeconds(60);
    setOtpDigits(["", "", "", "", "", ""]);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: adminIdentifier.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`New verification code sent to ${adminIdentifier.trim().toLowerCase()}`);
      } else {
        setErrorMessage(data.message || "Failed to resend verification code.");
      }
    } catch (err) {
      setErrorMessage("Failed to resend verification code. Please check your connection.");
    }
    inputRefs.current[0]?.focus();
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
      {/* Background ambient gold/blue glows */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#c88d18]/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Luxury Modal Card (Matching User Auth Modal Style) */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl shadow-black/80 border border-slate-800 bg-[#070e1c] text-white my-auto">
        
        {/* Close / Return to Website Button */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="absolute top-4 right-4 z-20 h-9 w-9 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-400 hover:text-white transition-all shadow-md cursor-pointer"
          title="Return to Customer Website"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LEFT PANEL: Brand Showcase & Security Highlights (38% on desktop) */}
        <div className="relative w-full md:w-[40%] bg-[#070e1c] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80 overflow-hidden shrink-0">
          {/* Subtle luxury vehicle photo underlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={luxuryHeroImg}
              alt="MOAR CARS"
              className="w-full h-full object-cover object-center opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-[#070e1c]/85 to-[#070e1c]/60" />
          </div>

          {/* Top Logo & Tag */}
          <div className="relative z-10 space-y-2">
            <MoarLogo variant="light" size="sm" showTagline={false} />
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#c88d18]/15 border border-[#c88d18]/30 text-[11px] text-[#c88d18] font-bold uppercase tracking-wider">
              <Shield className="h-3 w-3" /> Security Operations Center
            </div>
          </div>

          {/* Key Value Points */}
          <div className="relative z-10 space-y-4 my-auto py-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white tracking-tight">
                Enterprise Fleet <span className="text-[#c88d18]">Control</span>
              </h3>
              <p className="text-xs text-slate-400">
                Restricted portal for authorized fleet controllers & executives.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-[#c88d18]/15 border border-[#c88d18]/30 text-[#c88d18] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Live Fleet Telematics</span>
                  <p className="text-[11px] text-slate-400">Real-time GPS, statuses, & turnaround dispatch.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Strict 2FA Authentication</span>
                  <p className="text-[11px] text-slate-400">Encrypted single-use email OTP verification.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-slate-300">
                <div className="h-6 w-6 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold text-white">Central Hub Governance</span>
                  <p className="text-[11px] text-slate-400">Tirupati Central, Airport & Renigunta branches.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
          <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SOC-2 Encrypted
            </span>
            <span className="text-slate-500">v2.4 Enterprise</span>
          </div>
        </div>

        {/* RIGHT PANEL: Authentication Form & 6-Digit OTP */}
        <div className="w-full md:w-[60%] flex flex-col justify-between p-6 sm:p-8 bg-[#0b1426] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-700">
          
          <div>
            {/* Step Navigation Pill Indicator */}
            <div className="flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 max-w-xs mx-auto">
              <button
                type="button"
                onClick={() => {
                  setStep("credentials");
                  setErrorMessage("");
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  step === "credentials"
                    ? "bg-[#c88d18] text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Lock className="w-3 h-3" />
                <span>1. Credentials</span>
              </button>
              <button
                type="button"
                disabled={step === "credentials"}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  step === "otp"
                    ? "bg-[#c88d18] text-slate-950 font-bold shadow-sm"
                    : "text-slate-500 cursor-not-allowed"
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>2. 2FA OTP</span>
              </button>
            </div>

            {/* Header Title & Subtitle */}
            <div className="mb-5 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center justify-center sm:justify-start gap-2">
                {step === "credentials" ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-[#c88d18]" />
                    <span>Admin Portal Sign-In</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-5 h-5 text-[#c88d18] animate-pulse" />
                    <span>Enter 6-Digit OTP Code</span>
                  </>
                )}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                {step === "credentials"
                  ? "Enter your verified admin email to receive your one-time 2FA access code."
                  : `Enter the 6-digit security code sent to ${adminIdentifier.trim().toLowerCase()}`}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message Alert */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* STEP 1: CREDENTIALS */}
            {step === "credentials" && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {/* Admin Work Email */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Admin Work Email <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="moarcars04@gmail.com"
                      required
                      className="w-full bg-[#070e1c] border border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/20 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Security Passcode */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Administrative Passcode <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#070e1c] border border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/20 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1 cursor-pointer"
                    >
                      {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Delivery Channel Notice */}
                <div className="p-3 rounded-xl bg-[#070e1c]/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#c88d18] shrink-0" />
                  <span>
                    A secure 6-digit verification code will be dispatched to your registered Gmail inbox.
                  </span>
                </div>

                {/* Submit Request Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-gradient-to-r from-[#c88d18] to-[#e5a93c] hover:from-[#b57d14] hover:to-[#c88d18] text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Request Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: 6-DIGIT OTP VERIFICATION */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Target Address Card with Change Option */}
                <div className="p-3 rounded-xl bg-[#070e1c] border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#c88d18]" />
                    <span className="font-semibold text-white">
                      {adminIdentifier.trim().toLowerCase()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setErrorMessage("");
                    }}
                    className="text-[11px] font-bold text-[#c88d18] hover:underline cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                {/* 6-Digit Segmented OTP Input Grid */}
                <div>
                  <label className="block text-center text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wider">
                    Enter 6-Digit Code
                  </label>
                  <div className="flex justify-center gap-2 sm:gap-3" onPaste={handlePaste}>
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={`w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-xl border outline-none transition-all ${
                          digit
                            ? "bg-[#070e1c] border-[#c88d18] text-[#c88d18] ring-2 ring-[#c88d18]/20 shadow-md"
                            : "bg-[#070e1c] border-slate-700 text-white focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/20"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Countdown Timer & Resend Button */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <RefreshCw className={`w-3.5 h-3.5 ${timerSeconds > 0 ? "animate-spin" : ""}`} />
                    <span>
                      {timerSeconds > 0 ? (
                        <>
                          Expires in: <strong className="text-white">00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}</strong>
                        </>
                      ) : (
                        <span className="text-amber-400 font-semibold">Code expired</span>
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`font-semibold transition-all cursor-pointer ${
                      canResend
                        ? "text-[#c88d18] hover:underline"
                        : "text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    Resend Code
                  </button>
                </div>

                {/* Verify Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full bg-gradient-to-r from-[#c88d18] to-[#e5a93c] hover:from-[#b57d14] hover:to-[#c88d18] text-slate-950 font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Session...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>Verify & Enter Admin Portal</span>
                    </>
                  )}
                </button>

                {/* Back to Step 1 */}
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setErrorMessage("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Credentials</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Bottom Security Footer */}
          <div className="pt-5 mt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span>Moar Cars Security Gateway</span>
            <button
              onClick={onNavigateHome}
              className="text-slate-400 hover:text-[#c88d18] transition-colors cursor-pointer"
            >
              Customer Website →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
