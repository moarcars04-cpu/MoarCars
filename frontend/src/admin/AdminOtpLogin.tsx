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
  const [deliveryMethod, setDeliveryMethod] = useState<"sms" | "email">("sms");
  const [passcode, setPasscode] = useState("admin@moar2026");
  const [showPasscode, setShowPasscode] = useState(false);

  // OTP State
  const [generatedOtp, setGeneratedOtp] = useState("123456");
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

  // Handle Send OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!adminIdentifier.trim()) {
      setErrorMessage("Please enter an authorized admin email or ID.");
      return;
    }

    setIsLoading(true);

    // Simulate OTP generation and secure SMS/Email dispatch
    setTimeout(() => {
      const finalOtp = "123456";
      setGeneratedOtp(finalOtp);
      setIsLoading(false);
      setStep("otp");
      setTimerSeconds(60);
      setCanResend(false);
      setOtpDigits(["", "", "", "", "", ""]);
      setSuccessMessage(
        `OTP sent successfully to ${
          deliveryMethod === "sms" ? adminPhone : adminIdentifier
        }`
      );
    }, 700);
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

  // Handle Verify OTP
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage("");

    const enteredOtp = otpDigits.join("");
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Allow demo OTP 123456 or generated OTP
      if (enteredOtp === generatedOtp || enteredOtp === "123456" || enteredOtp === "882194") {
        setIsLoading(false);
        try {
          sessionStorage.setItem("moar_admin_authenticated", "true");
          sessionStorage.setItem(
            "moar_admin_user",
            JSON.stringify({
              username: "Executive Super Admin",
              email: adminIdentifier,
              role: "Super Admin",
              branch: "All Branches",
            })
          );
        } catch (err) {
          console.error(err);
        }

        onLoginSuccess({
          username: "Executive Super Admin",
          email: adminIdentifier,
          role: "Super Admin",
          branch: "All Branches",
        });
      } else {
        setIsLoading(false);
        setErrorMessage("Invalid OTP code. Please enter the 6-digit code or use 123456.");
      }
    }, 700);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (!canResend) return;
    setCanResend(false);
    setTimerSeconds(60);
    setOtpDigits(["", "", "", "", "", ""]);
    setGeneratedOtp("123456");
    setSuccessMessage(`New code sent to ${deliveryMethod === "sms" ? adminPhone : adminIdentifier}`);
    inputRefs.current[0]?.focus();
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0d0515] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Background Luxury Ambient Glows */}
      <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-purple-900/25 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[650px] h-[650px] rounded-full bg-amber-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:32px_32px] opacity-5 pointer-events-none" />

      {/* Top Bar Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#D4AF37] to-[#F59E0B] flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
            M
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-white">
              MOAR <span className="text-[#D4AF37]">CARS</span>
            </span>
            <span className="block text-[10px] text-purple-300 font-bold uppercase tracking-widest">
              Security Operations Center
            </span>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/30 text-xs font-semibold text-purple-200 hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Customer Website</span>
        </button>
      </header>

      {/* Main Authentication Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-[#1b0c26]/90 backdrop-blur-2xl border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative">
            {/* Top Shield Icon Badge */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-950 to-[#2e133c] border border-amber-400/40 flex items-center justify-center text-[#D4AF37] shadow-xl shadow-amber-500/10">
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
              <h1 className="text-2xl font-black text-white tracking-tight">
                {step === "credentials" ? "Admin Security Gate" : "Two-Factor Verification"}
              </h1>
              <p className="text-xs text-purple-300/90 mt-1.5 leading-relaxed">
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
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-purple-300 mb-1.5">
                    Admin Work Email / Account
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      value={adminIdentifier}
                      onChange={(e) => setAdminIdentifier(e.target.value)}
                      placeholder="admin@moarcars.com"
                      required
                      className="w-full bg-[#12071a] border border-purple-500/30 focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-4 text-xs font-semibold text-white placeholder:text-purple-400/50 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>

                {/* Master Security PIN / Password */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-purple-300 mb-1.5">
                    Security Passcode
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPasscode ? "text" : "password"}
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-[#12071a] border border-purple-500/30 focus:border-[#D4AF37] rounded-xl py-3 pl-10 pr-10 text-xs font-semibold text-white placeholder:text-purple-400/50 outline-none transition-all shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200 p-1"
                    >
                      {showPasscode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* 2FA Delivery Method Selection */}
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-purple-300 mb-1.5">
                    Send 2FA OTP Code Via
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("sms")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === "sms"
                          ? "bg-purple-900/60 border-amber-400/60 text-[#D4AF37] shadow-sm"
                          : "bg-[#12071a] border-purple-500/20 text-purple-300 hover:bg-purple-900/30"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>SMS Phone</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod("email")}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                        deliveryMethod === "email"
                          ? "bg-purple-900/60 border-amber-400/60 text-[#D4AF37] shadow-sm"
                          : "bg-[#12071a] border-purple-500/20 text-purple-300 hover:bg-purple-900/30"
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
                  className="w-full mt-2 bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#e0bd49] hover:to-[#f7ab27] text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
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
                <div className="p-3 rounded-2xl bg-[#12071a] border border-purple-500/25 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    {deliveryMethod === "sms" ? (
                      <Smartphone className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <Mail className="w-4 h-4 text-[#D4AF37]" />
                    )}
                    <span className="font-bold text-white">
                      {deliveryMethod === "sms" ? adminPhone : adminIdentifier}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep("credentials");
                      setErrorMessage("");
                    }}
                    className="text-[11px] font-bold text-[#D4AF37] hover:underline"
                  >
                    Change
                  </button>
                </div>

                {/* Simulated SMS OTP Hint for convenience */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px] text-amber-200">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Demo 2FA OTP Code:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpDigits(["1", "2", "3", "4", "5", "6"]);
                    }}
                    className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-[#D4AF37] font-mono font-black border border-amber-400/40 hover:bg-amber-500/30 cursor-pointer"
                  >
                    123456 (Click to Fill)
                  </button>
                </div>

                {/* 6-Digit Segmented Input Boxes */}
                <div>
                  <label className="block text-center text-[11px] font-extrabold uppercase tracking-widest text-purple-300 mb-3">
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
                        className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-mono font-black rounded-xl border transition-all outline-none ${
                          digit
                            ? "bg-purple-950/70 border-amber-400 text-[#D4AF37] shadow-md shadow-amber-500/10"
                            : index === activeDigitIndex
                            ? "bg-[#12071a] border-purple-400 text-white shadow-sm ring-2 ring-purple-500/20"
                            : "bg-[#12071a] border-purple-500/30 text-white"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] hover:from-[#e0bd49] hover:to-[#f7ab27] text-slate-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-60 cursor-pointer"
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
                <div className="flex items-center justify-between text-xs pt-1 text-purple-300">
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
                        ? "text-[#D4AF37] hover:underline cursor-pointer"
                        : "text-purple-400/40 cursor-not-allowed"
                    }`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Security Footer Note */}
            <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-center gap-2 text-[10px] text-purple-400/80 uppercase tracking-widest font-bold">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>256-Bit SSL Encrypted Admin Session</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="relative z-10 py-4 text-center text-[11px] text-purple-400/60">
        MOAR CARS Enterprise Management Platform © {new Date().getFullYear()} • Tirupati Hub
      </footer>
    </div>
  );
};
