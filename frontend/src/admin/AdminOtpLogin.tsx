import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Mail,
  ArrowRight,
  KeyRound,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { UserRole } from "./types";

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
  const [adminPhone, setAdminPhone] = useState("+91 98765 43210");
  const [deliveryMethod, setDeliveryMethod] = useState<"sms" | "email">("email");
  const [passcode, setPasscode] = useState("admin@moar2026");
  const [showPasscode, setShowPasscode] = useState(false);

  // OTP State
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeDigitIndex, setActiveDigitIndex] = useState(0);
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
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setCanResend(true);
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

    const targetEmail = adminIdentifier.trim();
    if (!targetEmail) {
      setErrorMessage("Please enter an authorized admin email address.");
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
        setErrorMessage(data.message || "Failed to send admin verification code.");
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
    // Only accept numeric character
    const cleaned = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    setErrorMessage("");

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveDigitIndex(index + 1);
    }
  };

  // Handle keydown for Backspace / Arrow navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        setActiveDigitIndex(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveDigitIndex(index - 1);
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
      setActiveDigitIndex(index + 1);
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
    setActiveDigitIndex(nextIdx);
  };

  // Handle Verify OTP via real backend API
  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: adminIdentifier.trim(),
          otp: enteredOtp,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const adminUser = {
          username: data.username || "Executive Super Admin",
          email: adminIdentifier.trim(),
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
        setErrorMessage(data.message || "Invalid OTP code. Please enter the code received on your email.");
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
        body: JSON.stringify({ email: adminIdentifier.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMessage(`New verification code sent to ${adminIdentifier.trim()}`);
      } else {
        setErrorMessage(data.message || "Failed to resend verification code.");
      }
    } catch (err) {
      setErrorMessage("Failed to resend verification code. Please check connection.");
    }
    inputRefs.current[0]?.focus();
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glows matching Home Page */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#c88d18]/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-blue-600/5 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#c88d18_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.03] pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#c88d18] to-[#d49b29] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            M
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white">
              MOAR <span className="text-[#c88d18]">CARS</span>
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              Security Operations Center
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Customer Website</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-[#0b1426]/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
            {/* Top Shield Icon Badge */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#070e1c] to-[#0f1d38] border border-[#c88d18]/40 flex items-center justify-center text-[#c88d18] shadow-xl shadow-amber-500/10">
                  {step === "credentials" ? (
                    <ShieldCheck className="w-8 h-8 stroke-[1.8]" />
                  ) : (
                    <KeyRound className="w-8 h-8 stroke-[1.8] animate-pulse" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-[10px] font-black shadow-md">
                  2FA
                </div>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {step === "credentials" ? "Admin Security Gate" : "Two-Factor Verification"}
              </h1>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                {step === "credentials"
                  ? "Restricted Enterprise Portal • Authorized Fleet Personnel Only"
                  : `Enter the 6-digit OTP code sent to your registered ${deliveryMethod === "sms" ? "phone" : "email"}.`}
              </p>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Notification Alert */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ----------------- STEP 1: CREDENTIALS & 2FA REQUEST ----------------- */}
            {step === "credentials" && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                {/* Admin Email / ID */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Admin Work Email / Account
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="admin@moarcars.com"
                      required
                      className="w-full bg-[#070e1c] border border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/15 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Master Security PIN / Password */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#070e1c] border border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/15 rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                    >
                      {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 2FA Delivery Method Selection */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Send 2FA OTP Code Via
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("sms")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === "sms"
                          ? "bg-[#c88d18]/15 border-[#c88d18] text-[#c88d18] shadow-sm"
                          : "bg-[#070e1c] border-slate-800 text-slate-400 hover:bg-slate-900/60"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>SMS Phone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("email")}
                      className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === "email"
                          ? "bg-[#c88d18]/15 border-[#c88d18] text-[#c88d18] shadow-sm"
                          : "bg-[#070e1c] border-slate-800 text-slate-400 hover:bg-slate-900/60"
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Work Email</span>
                    </button>
                  </div>
                </div>

                {/* Send OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 bg-[#c88d18] hover:bg-[#b57d14] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating 2FA Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ----------------- STEP 2: 6-DIGIT OTP VERIFICATION ----------------- */}
            {step === "otp" && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                {/* Target Address Display */}
                <div className="p-3 rounded-2xl bg-[#070e1c] border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {deliveryMethod === "sms" ? (
                      <Smartphone className="w-4 h-4 text-[#c88d18]" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#c88d18]" />
                    )}
                    <span className="font-semibold text-white">
                      {deliveryMethod === "sms" ? adminPhone : adminIdentifier}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setErrorMessage("");
                    }}
                    className="text-[11px] font-bold text-[#c88d18] hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Real Email OTP Security Notice */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200/90 leading-relaxed">
                  <Sparkles className="w-4 h-4 text-[#c88d18] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#c88d18] block mb-0.5">Real Email OTP Dispatched</span>
                    <span>Please check your inbox (and spam folder) at <strong className="text-white">{adminIdentifier}</strong> for your 6-digit security code.</span>
                  </div>
                </div>

                {/* 6-Digit Segmented Input Boxes */}
                <div>
                  <label className="block text-center text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-3">
                    Enter 6-Digit Code
                  </label>

                  <div
                    className="flex items-center justify-center gap-2 sm:gap-2.5"
                    onPaste={handlePaste}
                  >
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
                          digit
                            ? "bg-[#070e1c] border-[#c88d18] text-[#c88d18] shadow-md shadow-amber-500/10"
                            : index === activeDigitIndex
                            ? "bg-[#070e1c] border-[#c88d18]/60 text-white shadow-sm ring-2 ring-[#c88d18]/15"
                            : "bg-[#070e1c] border-slate-800 text-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#c88d18] hover:bg-[#b57d14] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      <span>Verify & Access Admin Console</span>
                    </>
                  )}
                </button>

                {/* Resend OTP & Timer */}
                <div className="flex items-center justify-between text-xs pt-1 text-slate-400">
                  <span className="text-[11px]">
                    {timerSeconds > 0 ? (
                      <>Resend code in <strong className="text-white">{timerSeconds}s</strong></>
                    ) : (
                      "Didn't receive code?"
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    className={`text-[11px] font-bold flex items-center gap-1 ${
                      canResend
                        ? "text-[#c88d18] hover:underline cursor-pointer"
                        : "text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Security Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
              <Lock className="w-3 h-3 text-[#c88d18]" />
              <span>256-Bit SSL Encrypted Admin Session</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-slate-500">
        MOAR CARS Enterprise Management Platform © {new Date().getFullYear()} • Tirupati Hub
      </footer>
    </div>
  );
};
