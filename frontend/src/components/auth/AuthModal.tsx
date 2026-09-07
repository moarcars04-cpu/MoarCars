import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Mail,
  Lock,
  Phone,
  User,
  Gift,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Fingerprint,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    login,
    register,
    sendOtp,
    verifyOtp,
    socialLogin,
    forgotPassword,
    resetPassword,
    isLoading,
  } = useAuth();

  // Form states
  const [tab, setTab] = useState<"login" | "otp" | "register" | "forgot" | "reset">("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // OTP states
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [demoOtpCode, setDemoOtpCode] = useState<string | null>(null);
  const [otpTarget, setOtpTarget] = useState("");

  // Feedback & errors
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [biometricScanning, setBiometricScanning] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (authModalOpen) {
      setTab(authModalTab === "otp" ? "otp" : authModalTab);
      setErrorMsg("");
      setSuccessMsg("");
    }
  }, [authModalOpen, authModalTab]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if ((tab === "otp" || tab === "reset") && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [tab, otpTimer]);

  if (!authModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 2) return { score: 1, text: "Weak", color: "bg-rose-500 text-rose-500" };
    if (score === 3 || score === 4) return { score: 2, text: "Good", color: "bg-amber-500 text-amber-500" };
    return { score: 3, text: "Strong & Secure", color: "bg-emerald-500 text-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // OTP Input handler
  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (/^\d+$/.test(pasted)) {
      const newDigits = pasted.split("");
      while (newDigits.length < 6) newDigits.push("");
      setOtpDigits(newDigits);
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  // 1. Handle Email / Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please enter both email/phone and password.");
      return;
    }

    const res = await login({ identifier: email, password, rememberMe });
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // 2. Handle Requesting SMS OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const target = phone || email;
    if (!target) {
      setErrorMsg("Please enter your mobile phone number.");
      return;
    }

    const res = await sendOtp(target, "SMS");
    if (res.success) {
      setOtpTarget(target);
      setDemoOtpCode(res.demoOtp || "123456");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpTimer(60);
      setCanResendOtp(false);
      setTab("otp");
      setSuccessMsg(`Verification code sent to ${target}`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 200);
    } else {
      setErrorMsg(res.message);
    }
  };

  // 3. Handle Verifying OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setErrorMsg("Please enter all 6 digits of the OTP.");
      return;
    }

    const res = await verifyOtp(otpTarget, otpCode, name, referralCode);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // 4. Handle Registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !phone || !password) {
      setErrorMsg("Please fill in all mandatory fields.");
      return;
    }

    if (!termsAccepted) {
      setErrorMsg("You must accept the Terms of Service & Privacy Policy to continue.");
      return;
    }

    const res = await register({ name, email, phone, password, referralCode });
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // 5. Handle Social Login
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    const mockEmail = `user_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    const res = await socialLogin("google", {
      name: "Google Pilgrim Traveler",
      email: mockEmail,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
    });
    if (!res.success) setErrorMsg(res.message);
  };

  const handleAppleLogin = async () => {
    setErrorMsg("");
    const mockEmail = `apple_member_${Math.floor(1000 + Math.random() * 9000)}@privaterelay.appleid.com`;
    const res = await socialLogin("apple", {
      name: "Apple Member",
      email: mockEmail,
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
    });
    if (!res.success) setErrorMsg(res.message);
  };

  // 6. Handle Biometric Login Simulation
  const handleBiometricLogin = async () => {
    setBiometricScanning(true);
    setErrorMsg("");
    setTimeout(async () => {
      setBiometricScanning(false);
      const res = await login({ identifier: "traveler@moarcars.com", password: "Moarcars@123" });
      if (!res.success) {
        // Auto register if demo user not yet created
        await register({
          name: "Biometric Verified Member",
          email: "traveler@moarcars.com",
          phone: "+91 99887 76655",
          password: "Moarcars@123",
        });
      }
    }, 1200);
  };

  // 7. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setErrorMsg("Enter your registered email or phone.");
      return;
    }
    const target = email || phone;
    const res = await forgotPassword(target);
    if (res.success) {
      setOtpTarget(target);
      setDemoOtpCode(res.demoOtp || "123456");
      setOtpDigits(["", "", "", "", "", ""]);
      setTab("reset");
      setOtpTimer(60);
      setSuccessMsg(`Reset code sent to ${target}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  // 8. Handle Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setErrorMsg("Enter the 6-digit reset code.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    const res = await resetPassword(otpTarget, otpCode, password);
    if (res.success) {
      setSuccessMsg("Password reset successfully! Please log in.");
      setTab("login");
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0f172a] via-[#0b1120] to-[#070b14] border border-amber-500/20 shadow-2xl shadow-black/80 text-white overflow-hidden">
        
        {/* Decorative Top Amber Glow Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-600 via-brand-gold to-emerald-400" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-bold tracking-widest uppercase text-brand-gold mb-2">
            <Sparkles className="h-3 w-3" /> Moar Cars Member Access
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {tab === "login" && "Welcome Back"}
            {tab === "otp" && "Verify Your Phone"}
            {tab === "register" && "Create Your Account"}
            {tab === "forgot" && "Reset Password"}
            {tab === "reset" && "Enter New Password"}
          </h2>
          <p className="mt-1 text-xs text-white/60">
            {tab === "login" && "Sign in to manage bookings, track trips, and earn reward coins."}
            {tab === "otp" && `Enter the 6-digit code sent to ${otpTarget || "your phone"}`}
            {tab === "register" && "Join Moar Cars and get 250 bonus coins + ₹250 wallet credit."}
            {tab === "forgot" && "We'll send you an OTP code to securely reset your password."}
            {tab === "reset" && "Enter the verification code and your new account password."}
          </p>
        </div>

        {/* Auth Mode Tabs (Only for Login, OTP, Register) */}
        {(tab === "login" || tab === "otp" || tab === "register") && (
          <div className="px-6">
            <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setTab("login");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-lg transition-all ${
                  tab === "login"
                    ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("otp");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-lg transition-all ${
                  tab === "otp"
                    ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("register");
                  setErrorMsg("");
                }}
                className={`py-2 rounded-lg transition-all ${
                  tab === "register"
                    ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>
        )}

        {/* Alerts */}
        <div className="px-6 pt-3">
          {errorMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/15 border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-300 animate-shake">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Body / Tab Forms */}
        <div className="p-6 pt-3 max-h-[75vh] overflow-y-auto">
          {/* TAB 1: EMAIL / PASSWORD LOGIN */}
          {tab === "login" && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Email Address or Mobile Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 9876543210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setTab("forgot")}
                    className="text-xs font-semibold text-brand-gold hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-white/75">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/20 bg-slate-800 text-brand-gold focus:ring-0"
                  />
                  Remember my session
                </label>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-brand-gold text-brand-navy font-black tracking-wide uppercase text-xs hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? "Signing In..." : "Sign In to Moar Cars"}
                <ArrowRight className="h-4 w-4" />
              </Button>

              {/* Social Login Options */}
              <div className="relative py-2 text-center text-xs text-white/40">
                <span className="bg-[#0b1120] px-2 relative z-10 font-semibold uppercase tracking-wider text-[10px]">
                  Or Instant Sign In With
                </span>
                <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-px bg-white/10" />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 py-2 px-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.6 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.4C.7 9.8 0 12 0 14.5s.7 4.7 1.9 7.1l3.7-6.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z"
                    />
                  </svg>
                  Google
                </button>

                <button
                  type="button"
                  onClick={handleAppleLogin}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-slate-900/80 py-2 px-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.8c.67-.82 1.13-1.96 1-3.1-.97.04-2.14.65-2.83 1.46-.61.71-1.14 1.87-1 2.98 1.09.08 2.19-.52 2.83-1.34z" />
                  </svg>
                  Apple
                </button>

                <button
                  type="button"
                  onClick={handleBiometricLogin}
                  disabled={biometricScanning}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2 px-3 text-xs font-bold text-brand-gold hover:bg-amber-500/20 transition-colors"
                >
                  <Fingerprint className={`h-4 w-4 ${biometricScanning ? "animate-pulse text-emerald-400" : ""}`} />
                  {biometricScanning ? "Scanning..." : "Face/Touch"}
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MOBILE OTP LOGIN */}
          {tab === "otp" && (
            <div className="space-y-4">
              {!otpTarget ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                      Enter Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-brand-gold flex items-center gap-1">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-16 pr-4 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || phone.length < 10}
                    className="w-full h-11 rounded-xl bg-brand-gold text-brand-navy font-black tracking-wide uppercase text-xs hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Sending OTP..." : "Get Verification Code"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {/* Demo OTP Helper Badge */}
                  {demoOtpCode && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                      <p className="text-[11px] text-brand-gold font-bold">
                        ⚡ Verification Code (Simulated): <span className="font-mono text-base tracking-widest text-white">{demoOtpCode}</span>
                      </p>
                    </div>
                  )}

                  {/* 6 Digit Input Boxes */}
                  <div className="flex justify-center gap-2 sm:gap-3 py-2">
                    {otpDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={idx === 0 ? handleOtpPaste : undefined}
                        className="h-12 w-11 sm:h-14 sm:w-12 rounded-xl border border-white/20 bg-slate-900 text-center text-xl font-black text-brand-gold shadow-inner focus:border-brand-gold focus:ring-2 focus:ring-brand-gold/30 focus:outline-none"
                      />
                    ))}
                  </div>

                  {/* Resend OTP countdown */}
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <button
                      type="button"
                      onClick={() => setOtpTarget("")}
                      className="text-white/60 hover:text-white underline"
                    >
                      Change Phone Number
                    </button>
                    {canResendOtp ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="flex items-center gap-1 font-bold text-brand-gold hover:underline"
                      >
                        <RotateCcw className="h-3 w-3" /> Resend OTP
                      </button>
                    ) : (
                      <span className="font-mono text-white/50">Resend in {otpTimer}s</span>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || otpDigits.join("").length !== 6}
                    className="w-full h-11 rounded-xl bg-brand-gold text-brand-navy font-black tracking-wide uppercase text-xs hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Verifying..." : "Verify & Sign In"}
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REGISTRATION FORM */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Full Name (as per Driving License) *
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Reddy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                    <input
                      type="email"
                      required
                      placeholder="ramesh@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-xs font-bold text-brand-gold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      className="w-full rounded-xl border border-white/10 bg-slate-900/80 pl-11 pr-3 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Create Account Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-white/40 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="flex-1 h-1 rounded-full bg-white/10 overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                      <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                      <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${passwordStrength.color.split(" ")[1]}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Referral / Promo Code (Optional)
                </label>
                <div className="relative">
                  <Gift className="absolute left-3.5 top-3 h-4 w-4 text-brand-gold" />
                  <input
                    type="text"
                    placeholder="Enter friend's code for +150 bonus coins"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-amber-500/30 bg-amber-500/5 px-10 py-2.5 text-sm font-bold text-brand-gold placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-white/70 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 bg-slate-800 text-brand-gold focus:ring-0"
                />
                <span>
                  I agree to the <a href="#about" className="text-brand-gold underline">Terms of Rental</a> & <a href="#about" className="text-brand-gold underline">Privacy Policy</a>
                </span>
              </label>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-brand-gold text-brand-navy font-black tracking-wide uppercase text-xs hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? "Creating Account..." : "Join & Claim ₹250 Welcome Bonus"}
                <Gift className="h-4 w-4" />
              </Button>
            </form>
          )}

          {/* TAB 4: FORGOT PASSWORD */}
          {tab === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Registered Email Address or Phone
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 h-4 w-4 text-white/40" />
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or 9876543210"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-10 py-2.5 text-sm font-medium text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTab("login")}
                  className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 h-11 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft"
                >
                  Send Reset OTP
                </Button>
              </div>
            </form>
          )}

          {/* TAB 5: RESET PASSWORD */}
          {tab === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {demoOtpCode && (
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs text-brand-gold font-bold">
                  ⚡ Reset Code: <span className="font-mono text-base text-white">{demoOtpCode}</span>
                </div>
              )}

              {/* 6 Digit Input Boxes */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1 text-center">
                  Enter 6-Digit Reset Code
                </label>
                <div className="flex justify-center gap-2 py-1">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={idx === 0 ? handleOtpPaste : undefined}
                      className="h-11 w-10 rounded-xl border border-white/20 bg-slate-900 text-center text-lg font-black text-brand-gold focus:border-brand-gold focus:outline-none"
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter new strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-4 py-2.5 text-sm font-medium text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft"
              >
                Reset Password & Log In
              </Button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-white/10 bg-slate-950/80 px-6 py-3 text-center text-[11px] text-white/40 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-brand-gold" />
          <span>256-bit Encrypted · Moar Cars Security Guaranteed</span>
        </div>
      </div>
    </div>
  );
};
