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
  ArrowLeft,
  Sparkles,
  Fingerprint,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Star,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import luxuryHeroImg from "../../assets/moar-hero-luxury.jpg";
import { MoarLogo } from "../common/MoarLogo";

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    login,
    register,
    sendRegistrationOtp,
    verifyRegistrationOtp,
    sendOtp,
    verifyOtp,
    socialLogin,
    forgotPassword,
    resetPassword,
    isLoading,
  } = useAuth();

  // Primary active mode: 'signin' | 'register' | 'forgot' | 'reset'
  const [mainMode, setMainMode] = useState<"signin" | "register" | "forgot" | "reset">("signin");
  // Sign-in sub-method: 'otp' | 'password'
  const [signInMethod, setSignInMethod] = useState<"otp" | "password">("otp");

  // Form states
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
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isRegisterOtpSent, setIsRegisterOtpSent] = useState(false);

  // Feedback & errors
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [biometricScanning, setBiometricScanning] = useState(false);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (authModalOpen) {
      if (authModalTab === "register") {
        setMainMode("register");
      } else if (authModalTab === "otp") {
        setMainMode("signin");
        setSignInMethod("otp");
      } else if (authModalTab === "forgot") {
        setMainMode("forgot");
      } else if (authModalTab === "reset") {
        setMainMode("reset");
      } else {
        setMainMode("signin");
        setSignInMethod("otp");
      }
      setErrorMsg("");
      setSuccessMsg("");
      setIsOtpSent(false);
      setIsRegisterOtpSent(false);
      setOtpTarget("");
    }
  }, [authModalOpen, authModalTab]);

  // Countdown timer for OTP
  useEffect(() => {
    let interval: any = null;
    if ((isOtpSent || isRegisterOtpSent || mainMode === "reset") && otpTimer > 0) {
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
  }, [isOtpSent, isRegisterOtpSent, mainMode, otpTimer]);

  if (!authModalOpen) return null;

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: "", color: "bg-slate-200 text-slate-400" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, text: "Weak", color: "bg-rose-500 text-rose-500" };
    if (score === 2 || score === 3) return { score: 2, text: "Good", color: "bg-[#c88d18] text-[#c88d18]" };
    return { score: 3, text: "Strong", color: "bg-emerald-500 text-emerald-500" };
  };

  const passwordStrength = getPasswordStrength(password);

  // OTP Input handlers
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
      setErrorMsg("Please enter your email/phone and password.");
      return;
    }

    const res = await login({ identifier: email, password, rememberMe });
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // 2. Handle Requesting Email or Mobile OTP for Sign-In
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const target = (email || phone).trim();
    if (!target) {
      setErrorMsg("Please enter your email address or mobile number.");
      return;
    }

    const isEmail = target.includes("@");
    if (!isEmail && target.replace(/\D/g, "").length < 10) {
      setErrorMsg("Please enter a valid email address or 10-digit mobile number.");
      return;
    }

    const res = await sendOtp(target, isEmail ? "EMAIL" : "SMS");
    if (res.success) {
      setOtpTarget(target);
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpTimer(60);
      setCanResendOtp(false);
      setIsOtpSent(true);
      setSuccessMsg(
        isEmail
          ? `Verification code sent to ${target}. Please check your inbox.`
          : `OTP sent to +91 ${target}`
      );
      setTimeout(() => otpInputRefs.current[0]?.focus(), 250);
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
      setErrorMsg("Please enter the 6-digit OTP.");
      return;
    }

    const res = await verifyOtp(otpTarget, otpCode, name, referralCode);
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  // 4. Handle Registration - Step 1: Validate Mandatory Fields & Send Email OTP
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanPassword = password.trim();

    if (!cleanName) {
      setErrorMsg("Full Name is mandatory. Please enter your name.");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMsg("A valid Email Address is mandatory for verification.");
      return;
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, "").length < 10) {
      setErrorMsg("A valid 10-digit Phone Number is mandatory.");
      return;
    }
    if (!cleanPassword || cleanPassword.length < 6) {
      setErrorMsg("Password is mandatory (at least 6 characters).");
      return;
    }
    if (!termsAccepted) {
      setErrorMsg("Please accept the Terms of Rental & Privacy Policy to proceed.");
      return;
    }

    const res = await sendRegistrationOtp({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    });

    if (res.success) {
      setOtpTarget(cleanEmail);
      setDemoOtpCode(res.demoOtp || "123456");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpTimer(60);
      setCanResendOtp(false);
      setIsRegisterOtpSent(true);
      setSuccessMsg(`Verification code sent to ${cleanEmail}`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 250);
    } else {
      setErrorMsg(res.message);
    }
  };

  // 4b. Handle Registration - Step 2: Verify Email OTP & Finalize Account Creation
  const handleVerifyRegisterOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const otpCode = otpDigits.join("");
    if (otpCode.length !== 6) {
      setErrorMsg("Please enter the complete 6-digit verification code.");
      return;
    }

    const res = await verifyRegistrationOtp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      referralCode: referralCode.trim(),
      otp: otpCode,
    });

    if (res.success) {
      setSuccessMsg(res.message || "Registration verified successfully! ₹250 added to your wallet.");
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleResendRegisterOtp = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    const res = await sendRegistrationOtp({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
    });
    if (res.success) {
      setDemoOtpCode(res.demoOtp || "123456");
      setOtpDigits(["", "", "", "", "", ""]);
      setOtpTimer(60);
      setCanResendOtp(false);
      setSuccessMsg(`New verification code sent to ${email.trim()}`);
    } else {
      setErrorMsg(res.message);
    }
  };

  // 5. Handle Social Login
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    const mockEmail = `user_${Math.floor(1000 + Math.random() * 9000)}@gmail.com`;
    const res = await socialLogin("google", {
      name: "Google Traveler",
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

  // 6. Handle Biometric Login
  const handleBiometricLogin = async () => {
    setBiometricScanning(true);
    setErrorMsg("");
    setTimeout(async () => {
      setBiometricScanning(false);
      const res = await login({ identifier: "traveler@moarcars.com", password: "Moarcars@123" });
      if (!res.success) {
        await register({
          name: "Verified Member",
          email: "traveler@moarcars.com",
          phone: "+91 99887 76655",
          password: "Moarcars@123",
        });
      }
    }, 1000);
  };

  // 7. Handle Forgot Password
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setErrorMsg("Please enter your email or phone.");
      return;
    }
    const target = email || phone;
    const res = await forgotPassword(target);
    if (res.success) {
      setOtpTarget(target);
      setDemoOtpCode(res.demoOtp || "123456");
      setOtpDigits(["", "", "", "", "", ""]);
      setMainMode("reset");
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
      setErrorMsg("Please enter the 6-digit code.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    const res = await resetPassword(otpTarget, otpCode, password);
    if (res.success) {
      setSuccessMsg("Password updated! Please sign in.");
      setMainMode("signin");
      setSignInMethod("password");
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      
      {/* Click outside to close */}
      <div className="fixed inset-0 -z-10" onClick={closeAuthModal} />

      {/* Clean Modal Container */}
      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Icon */}
        <button
          onClick={closeAuthModal}
          className="absolute right-3.5 top-3.5 z-30 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* LEFT PANEL: Showroom & Highlights */}
        <div className="relative hidden md:flex md:w-[38%] flex-col justify-between p-6 overflow-hidden bg-[#070e1c] text-white border-r border-slate-800/80">
          
          <div className="absolute inset-0 z-0">
            <img
              src={luxuryHeroImg}
              alt="MOAR CARS"
              className="w-full h-full object-cover object-center opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070e1c] via-[#070e1c]/80 to-[#070e1c]/40" />
          </div>

          {/* Logo & Sub-tag */}
          <div className="relative z-10 space-y-1.5">
            <MoarLogo variant="light" size="sm" showTagline={false} />
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#c88d18] font-medium">
              <Sparkles className="h-3 w-3" /> Tirupati & AP's Self-Drive Partner
            </div>
          </div>

          {/* Key Value Points */}
          <div className="relative z-10 space-y-3 my-auto py-2">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white tracking-tight">
                Drive Luxury. Drive <span className="text-[#c88d18]">MOAR.</span>
              </h3>
              <p className="text-xs text-slate-400">Self-drive freedom with zero hassle.</p>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="h-5 w-5 rounded-md bg-[#c88d18]/15 text-[#c88d18] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-semibold text-white">60s Quick Handover</span>
                  <p className="text-[11px] text-slate-400">Tirupati Airport & Railway Hub.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="h-5 w-5 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-semibold text-white">Transparent Pricing</span>
                  <p className="text-[11px] text-slate-400">Zero hidden fees, clean cars.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-slate-300">
                <div className="h-5 w-5 rounded-md bg-[#c88d18]/15 text-[#c88d18] flex items-center justify-center shrink-0 mt-0.5">
                  <Gift className="h-3 w-3" />
                </div>
                <div>
                  <span className="font-semibold text-white">₹250 Joining Bonus</span>
                  <p className="text-[11px] text-slate-400">Automatic wallet credit on signup.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Footer */}
          <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center gap-2">
            <div className="flex items-center text-[#c88d18]">
              <Star className="h-3 w-3 fill-[#c88d18]" />
              <span className="text-xs font-bold text-white ml-1">4.9 / 5</span>
            </div>
            <span className="text-slate-500 text-xs">•</span>
            <span className="text-slate-400 text-[11px]">12,000+ Happy Renters</span>
          </div>
        </div>

        {/* RIGHT PANEL: Clean & Uncluttered Form */}
        <div className="w-full md:w-[62%] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto bg-white [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-200">
          
          <div>
            {/* Top Switcher: Sign In / Create Account */}
            {(mainMode === "signin" || mainMode === "register") && !isRegisterOtpSent && (
              <div className="flex items-center p-1 rounded-xl bg-slate-100/90 mb-5 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    setMainMode("signin");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mainMode === "signin"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMainMode("register");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    mainMode === "register"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Create Account
                </button>
              </div>
            )}

            {/* Header Title & Subtitle */}
            <div className="mb-4 text-center sm:text-left">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {mainMode === "signin" && (isOtpSent ? "Verify Sign-In Code" : "Welcome Back")}
                {mainMode === "register" && (isRegisterOtpSent ? "Verify Your Email" : "Create Your Account")}
                {mainMode === "forgot" && "Reset Password"}
                {mainMode === "reset" && "Set New Password"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {mainMode === "signin" && !isOtpSent && "Sign in via Email OTP, Mobile OTP, or Password."}
                {mainMode === "signin" && isOtpSent && `Enter the 6-digit code sent to ${otpTarget}`}
                {mainMode === "register" && !isRegisterOtpSent && "All fields are mandatory. Get ₹250 wallet credit on your first trip."}
                {mainMode === "register" && isRegisterOtpSent && `Enter the 6-digit confirmation code sent to ${email.trim()}`}
                {mainMode === "forgot" && "Enter your registered email or phone to reset."}
                {mainMode === "reset" && "Enter the verification code and your new password."}
              </p>
            </div>

            {/* Sub-method switcher (OTP vs Password) */}
            {mainMode === "signin" && !isOtpSent && (
              <div className="flex items-center justify-center sm:justify-start gap-4 mb-4 text-xs font-medium border-b border-slate-100 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod("otp");
                    setErrorMsg("");
                  }}
                  className={`pb-1 transition-colors relative ${
                    signInMethod === "otp"
                      ? "text-[#c88d18] font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-[#c88d18]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Email / Mobile OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignInMethod("password");
                    setErrorMsg("");
                  }}
                  className={`pb-1 transition-colors relative ${
                    signInMethod === "password"
                      ? "text-[#c88d18] font-semibold after:absolute after:bottom-[-9px] after:left-0 after:right-0 after:h-0.5 after:bg-[#c88d18]"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Password Login
                </button>
              </div>
            )}

            {/* Alerts */}
            {errorMsg && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-100 px-3 py-2 text-xs text-rose-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN - EMAIL OR MOBILE OTP */}
            {mainMode === "signin" && signInMethod === "otp" && !isOtpSent && (
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      required
                      placeholder="name@example.com or 10-digit mobile"
                      value={email || phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        setPhone(val);
                      }}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-2 focus:ring-[#c88d18]/10 transition-all"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Enter your email or phone to receive a 6-digit one-time sign-in code.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !(email || phone).trim()}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isLoading ? "Sending Code..." : "Get Sign-In Code"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            {/* TAB 2: SIGN IN - VERIFY OTP */}
            {mainMode === "signin" && isOtpSent && (
              <form onSubmit={handleVerifyOtp} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-950">
                  {otpTarget.includes("@") ? (
                    <Mail className="h-4 w-4 text-[#c88d18] shrink-0 mt-0.5" />
                  ) : (
                    <Phone className="h-4 w-4 text-[#c88d18] shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">Sign-In Code Sent</p>
                    <p className="text-slate-600">
                      {otpTarget.includes("@") ? (
                        <>Please check your inbox or spam folder at <span className="font-medium text-slate-900">{otpTarget}</span> for your 6-digit code.</>
                      ) : (
                        <>Verification code sent via SMS to <span className="font-medium text-slate-900">+91 {otpTarget}</span>.</>
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5 text-center">
                    Enter 6-digit Verification Code
                  </label>
                  <div className="flex justify-center gap-2 py-0.5">
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
                        className="h-10 w-9 sm:h-11 sm:w-10 rounded-lg border border-slate-200 bg-white text-center text-base font-bold text-[#c88d18] focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/15 focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOtpSent(false);
                      setOtpDigits(["", "", "", "", "", ""]);
                    }}
                    className="hover:text-slate-800 underline text-slate-600 flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="h-3 w-3" /> Change {otpTarget.includes("@") ? "email" : "mobile"}
                  </button>
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#c88d18] hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Resend Code
                    </button>
                  ) : (
                    <span>Resend in {otpTimer}s</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isLoading ? "Verifying..." : "Verify & Sign In"}
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            {/* TAB 3: SIGN IN - PASSWORD */}
            {mainMode === "signin" && signInMethod === "password" && (
              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address or Mobile Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="name@example.com or mobile number"
                    value={email || phone}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                      setPhone(val);
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-2 focus:ring-[#c88d18]/10 transition-all"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-700">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setMainMode("forgot");
                        setErrorMsg("");
                      }}
                      className="text-xs text-[#c88d18] hover:underline"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-2 focus:ring-[#c88d18]/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-[#c88d18] focus:ring-0"
                    />
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5"
                >
                  {isLoading ? "Signing in..." : "Sign In with Password"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            {/* TAB 4: REGISTER FORM (Step 1 - Input Details) */}
            {mainMode === "register" && !isRegisterOtpSent && (
              <form onSubmit={handleRegister} className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-1 focus:ring-[#c88d18]/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-1 focus:ring-[#c88d18]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-0.5">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-xs text-slate-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Mobile number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-1 focus:ring-[#c88d18]/20"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Create password (min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none focus:ring-1 focus:ring-[#c88d18]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <div className="flex-1 h-1 rounded-full bg-slate-100 overflow-hidden flex gap-1">
                        <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                        <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                        <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color.split(" ")[0] : "bg-transparent"}`} />
                      </div>
                      <span className={`text-[10px] font-medium ${passwordStrength.color.split(" ")[1]}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter code for bonus coins"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none"
                  />
                </div>

                <label className="flex items-start gap-1.5 text-[11px] text-slate-500 pt-0.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#c88d18] focus:ring-0"
                  />
                  <span>
                    I agree to the <a href="/#terms" className="text-[#c88d18] underline">Terms of Rental</a> & <a href="/#terms" className="text-[#c88d18] underline">Privacy Policy</a> <span className="text-rose-500">*</span>
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isLoading ? "Sending Verification Code..." : "Create Account & Verify Email"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            {/* TAB 4b: REGISTER EMAIL OTP CONFIRMATION (Step 2 - Verify Code) */}
            {mainMode === "register" && isRegisterOtpSent && (
              <form onSubmit={handleVerifyRegisterOtp} className="space-y-3.5">
                <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/70 flex items-start gap-2.5 text-xs text-amber-950">
                  <Mail className="h-4 w-4 text-[#c88d18] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-900">Confirmation Code Sent</p>
                    <p className="text-slate-600">Please check your inbox or spam folder at <span className="font-medium text-slate-900">{email.trim()}</span> and enter the 6-digit code below.</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5 text-center">
                    Enter 6-digit Code Sent to Your Email
                  </label>
                  <div className="flex justify-center gap-2 py-0.5">
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
                        className="h-10 w-9 sm:h-11 sm:w-10 rounded-lg border border-slate-200 bg-white text-center text-base font-bold text-[#c88d18] focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/15 focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegisterOtpSent(false);
                      setErrorMsg("");
                      setSuccessMsg("");
                    }}
                    className="text-slate-600 hover:text-slate-900 underline flex items-center gap-1 font-medium"
                  >
                    <ArrowLeft className="h-3 w-3" /> Edit details
                  </button>
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendRegisterOtp}
                      className="text-[#c88d18] hover:underline font-semibold flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" /> Resend Code
                    </button>
                  ) : (
                    <span>Resend in {otpTimer}s</span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otpDigits.join("").length !== 6}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs tracking-wide transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-60"
                >
                  {isLoading ? "Verifying..." : "Verify & Complete Registration"}
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </button>
              </form>
            )}

            {/* TAB 5: FORGOT PASSWORD */}
            {mainMode === "forgot" && (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email or Phone
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMainMode("signin")}
                    className="flex-1 h-10 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs shadow-sm"
                  >
                    Send OTP
                  </button>
                </div>
              </form>
            )}

            {/* TAB 6: RESET PASSWORD */}
            {mainMode === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1 text-center">
                    Enter 6-digit Code
                  </label>
                  <div className="flex justify-center gap-2 py-0.5">
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
                        className="h-10 w-9 rounded-lg border border-slate-200 bg-white text-center text-base font-bold text-[#c88d18] focus:border-[#c88d18] focus:outline-none"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-0.5">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-900 placeholder:text-slate-300 placeholder:font-normal focus:border-[#c88d18] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-xl bg-[#c88d18] hover:bg-[#b57d14] text-white font-semibold text-xs shadow-sm"
                >
                  Save Password
                </button>
              </form>
            )}

            {/* Social Logins */}
            {(mainMode === "signin" || mainMode === "register") && !isOtpSent && !isRegisterOtpSent && (
              <div className="mt-4 pt-3 border-t border-slate-100">
                <div className="relative mb-2.5 text-center text-[10px] text-slate-400 font-medium">
                  <span>or continue with</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-2 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.7c-.2-.7-.4-1.4-.4-2.2s.2-1.5.4-2.2L1.9 7.4C.7 9.8 0 12 0 14.5s.7 4.7 1.9 7.1l3.7-6.9z" />
                      <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.2 7.5 23.5 12 23.5z" />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={handleAppleLogin}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 py-1.5 px-2 text-xs font-medium text-slate-700 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5 fill-current shrink-0 text-slate-800" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.8c.67-.82 1.13-1.96 1-3.1-.97.04-2.14.65-2.83 1.46-.61.71-1.14 1.87-1 2.98 1.09.08 2.19-.52 2.83-1.34z" />
                    </svg>
                    Apple
                  </button>

                  <button
                    type="button"
                    onClick={handleBiometricLogin}
                    disabled={biometricScanning}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/60 hover:bg-amber-100/60 py-1.5 px-2 text-xs font-medium text-[#c88d18] transition-colors"
                  >
                    <Fingerprint className={`h-3.5 w-3.5 ${biometricScanning ? "animate-pulse text-emerald-500" : ""}`} />
                    {biometricScanning ? "..." : "Touch ID"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="h-3 w-3 text-[#c88d18]" />
            <span>256-bit Encrypted SSL · Verified Fleet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
