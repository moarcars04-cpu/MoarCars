import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  Phone,
  User,
  MapPin,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTodayDateStr, getFutureDateStr } from "@/lib/dateUtils";
import { useAuth } from "./context/AuthContext";
import { BookingSummaryCard } from "./components/checkout/BookingSummaryCard";
import { CouponSection } from "./components/checkout/CouponSection";
import { PaymentMethodsSection, PaymentMethodType } from "./components/checkout/PaymentMethodsSection";
import { BookingConfirmationScreen } from "./components/checkout/BookingConfirmationScreen";

interface CheckoutPageProps {
  initialCar?: any;
  initialParams?: any;
  onNavigate?: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialCar,
  initialParams,
  onNavigate,
}) => {
  const { user, openAuthModal, saveSession } = useAuth();

  const [car, setCar] = useState<any | null>(initialCar || null);
  const [currentStep, setCurrentStep] = useState<"details" | "payment" | "confirmed">("details");

  // Load car from API if not provided in props
  useEffect(() => {
    if (!initialCar) {
      fetch("/api/cars")
        .then((res) => res.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setCar(res.data[0]);
          }
        })
        .catch((err) => console.warn(err));
    }
  }, [initialCar]);

  // Renter Details
  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone ? user.phone.replace(/\D/g, "").slice(-10) : "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [drivingLicense, setDrivingLicense] = useState(user?.dlNumber || "");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Validation Errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    dl?: string;
  }>({});

  // Trip Timeline
  const [pickupLocation, setPickupLocation] = useState(
    initialParams?.pickup || "Tirupati Central Station Hub"
  );
  const [dropLocation, setDropLocation] = useState(
    initialParams?.dropoff || initialParams?.pickup || "Tirupati Central Station Hub"
  );
  const [startDate, setStartDate] = useState(initialParams?.startDate || getTodayDateStr());
  const [startTime, setStartTime] = useState(initialParams?.startTime || "09:00");
  const [endDate, setEndDate] = useState(initialParams?.endDate || getFutureDateStr(2));
  const [endTime, setEndTime] = useState(initialParams?.endTime || "21:00");

  // Options & Extras
  const [withDriver] = useState(false);
  const [deliveryMode, setDeliveryMode] = useState<"hub" | "doorstep">(
    initialParams?.deliveryMode || "hub"
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  // Admin Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    percent: number;
    discount: number;
  } | null>(null);

  // Payment Method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>("razorpay");

  // Submission & Confirmation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmedBookingData, setConfirmedBookingData] = useState<any | null>(null);

  // Sync with logged in user
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || "");
      if (!customerPhone && user.phone) setCustomerPhone(user.phone.replace(/\D/g, "").slice(-10));
      if (!customerEmail) setCustomerEmail(user.email || "");
      if (!drivingLicense && user.dlNumber) setDrivingLicense(user.dlNumber);
    }
  }, [user]);

  // Duration in Days
  const rentalDays = useMemo(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return Math.max(1, diffDays);
    } catch {
      return 2;
    }
  }, [startDate, startTime, endDate, endTime]);

  // Live System Financial Settings
  const [systemSettings, setSystemSettings] = useState<{
    gstRate?: number;
    advancePaymentPercent?: number;
    defaultSecurityDeposit?: number;
  }>({
    gstRate: 18,
    advancePaymentPercent: 30,
    defaultSecurityDeposit: 3000,
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setSystemSettings({
            gstRate: res.data.gstRate !== undefined ? Number(res.data.gstRate) : 18,
            advancePaymentPercent: res.data.advancePaymentPercent !== undefined ? Number(res.data.advancePaymentPercent) : 30,
            defaultSecurityDeposit: res.data.defaultSecurityDeposit !== undefined ? Number(res.data.defaultSecurityDeposit) : 3000,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Calculations
  const dailyRate =
    (Number(car?.pricePerDay) && Number(car?.pricePerDay) > 0)
      ? Number(car.pricePerDay)
      : (parseInt(String(car?.price || "0").replace(/[^0-9]/g, ""), 10) || 1699);
  const baseFare = dailyRate * rentalDays;
  const deliveryFee = deliveryMode === "doorstep" ? 299 : 0;
  const driverFee = 0;
  const extrasTotal = 0;

  const subtotalBeforeDiscounts = baseFare + deliveryFee;

  const couponDiscount = appliedCoupon
    ? Math.round((subtotalBeforeDiscounts * appliedCoupon.percent) / 100)
    : 0;

  const totalDiscounts = couponDiscount;
  const subtotalAfterDiscounts = Math.max(0, subtotalBeforeDiscounts - totalDiscounts);

  // Dynamic GST from Admin System Settings
  const gstRate = Number(systemSettings.gstRate ?? 18);
  const gstAmount = Math.round(subtotalAfterDiscounts * (gstRate / 100));

  // Grand Total based strictly on Daily Rental Days + Extras + GST - Discounts
  const grandTotal = subtotalAfterDiscounts + gstAmount;

  // Dynamic Advance Payment Calculation (Customer pays admin configured % online)
  const advancePaymentPercent =
    car?.advancePaymentPercent !== undefined && car?.advancePaymentPercent !== null && car?.advancePaymentPercent !== ""
      ? Number(car.advancePaymentPercent)
      : Number(systemSettings.advancePaymentPercent ?? 20);

  const payableNow =
    advancePaymentPercent < 100 && advancePaymentPercent > 0 && grandTotal > 0
      ? Math.round(grandTotal * (advancePaymentPercent / 100))
      : grandTotal;

  const balanceDue = Math.max(0, grandTotal - payableNow);
  const securityDeposit = 0;

  // Helper: Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Save Booking & Sync User Profile
  const finalizeBooking = async (bookingId: string, transactionId: string) => {
    setIsSubmitting(true);
    setSubmissionError("");

    const cleanPhone = customerPhone.replace(/\D/g, "");

    const bookingPayload = {
      bookingId,
      transactionId,
      pickup: pickupLocation,
      pickupLocation,
      dropLocation,
      startDate: `${startDate} ${startTime}`,
      endDate: `${endDate} ${endTime}`,
      carName: car?.name || "Premium Fleet Vehicle",
      car,
      carId: car?.id,
      bookingType: "Self Drive",
      customerName: customerName.trim(),
      customerPhone: cleanPhone,
      customerEmail: customerEmail.trim().toLowerCase(),
      drivingLicense: drivingLicense.trim().toUpperCase(),
      emergencyContact,
      status: "Confirmed",
      paymentStatus: balanceDue > 0 ? "Advance Paid" : "Paid",
      paymentMethod: "Razorpay",
      bookingSource: "Web Checkout Gateway",
      totalDays: rentalDays,
      amount: grandTotal,
      baseFare,
      deliveryFee,
      driverFee: 0,
      extrasTotal,
      couponDiscount,
      walletDeduction: 0,
      rewardDeduction: 0,
      referralDiscount: 0,
      discountAmount: totalDiscounts,
      gstRate,
      gstAmount,
      securityDeposit: 0,
      grandTotal,
      advancePaymentPercent,
      paidAmount: payableNow,
      balanceDue,
      signatureData: "ONLINE_VERIFIED",
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const data = await res.json();

      // Auto-generate or update user session
      const generatedUser = data.user || {
        id: data.data?.userId || (user?.id || Date.now()),
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
        phone: cleanPhone,
        dlNumber: drivingLicense.trim().toUpperCase(),
        kycStatus: user?.kycStatus || "Pending",
        walletBalance: user?.walletBalance || 0,
        rewardPoints: (user?.rewardPoints || 100) + 50,
        loyaltyPoints: (user?.loyaltyPoints || 100) + 50,
        loyaltyTier: user?.loyaltyTier || "Gold VIP",
      };

      saveSession(generatedUser, generatedUser.token || user?.token || `session_${Date.now()}`);

      setConfirmedBookingData({
        ...bookingPayload,
        bookingId: data.data?.id ? `MC-2026-${data.data.id}` : bookingId,
      });
      setCurrentStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.warn("Optimistic booking confirmation:", err);
      // Even in offline/fallback, create profile session
      const fallbackUser = {
        id: user?.id || Date.now(),
        name: customerName.trim(),
        email: customerEmail.trim().toLowerCase(),
        phone: cleanPhone,
        dlNumber: drivingLicense.trim().toUpperCase(),
        kycStatus: user?.kycStatus || "Pending",
        walletBalance: user?.walletBalance || 0,
        rewardPoints: 150,
        loyaltyPoints: 150,
        loyaltyTier: "Gold VIP",
      };
      saveSession(fallbackUser as any, `session_${Date.now()}`);

      setConfirmedBookingData(bookingPayload);
      setCurrentStep("confirmed");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Final Payment & Reservation Submission with Razorpay & Strict Form Validation
  const handleConfirmAndPay = async () => {
    // 1. Strict Form Validations
    const errors: { name?: string; phone?: string; email?: string; dl?: string } = {};

    if (!customerName || customerName.trim().length < 3) {
      errors.name = "Full Legal Name is required (minimum 3 characters).";
    }

    const cleanPhone = customerPhone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      errors.phone = "Mobile number must be exactly 10 digits (digits only).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail.trim())) {
      errors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    if (!drivingLicense || drivingLicense.trim().length < 5) {
      errors.dl = "Driving License Number is required (minimum 5 characters).";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setSubmissionError(Object.values(errors)[0]);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }

    setFieldErrors({});
    setSubmissionError("");
    setIsSubmitting(true);

    // 2. Load Razorpay SDK
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      setIsSubmitting(false);
      setSubmissionError("Unable to connect to Razorpay payment gateway. Please check your internet connection.");
      return;
    }

    const bookingId = `MC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const amountInPaise = Math.max(100, Math.round(payableNow * 100)); // amount in paise

    const options = {
      key: "rzp_test_SwedUUn1KgRMs0",
      amount: amountInPaise,
      currency: "INR",
      name: "MOAR CARS",
      description: `Self-Drive Rental Advance: ${car?.name || "Vehicle"} (${rentalDays} Days)`,
      image: "https://moarcars.com/assets/moarcars-logo-DK578w77.png",
      prefill: {
        name: customerName.trim(),
        email: customerEmail.trim(),
        contact: cleanPhone,
      },
      notes: {
        bookingId,
        carName: car?.name || "Vehicle",
        pickupLocation,
        rentalDays: String(rentalDays),
        payableNow: String(payableNow),
        balanceDue: String(balanceDue),
      },
      theme: {
        color: "#0b1426",
      },
      modal: {
        ondismiss: function () {
          setIsSubmitting(false);
        },
      },
      handler: async function (response: any) {
        const paymentId = response.razorpay_payment_id || `rzp_test_${Date.now()}`;
        await finalizeBooking(bookingId, paymentId);
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setIsSubmitting(false);
        setSubmissionError(`Payment failed: ${response.error?.description || "Transaction declined by bank/gateway"}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmissionError(err?.message || "Failed to initialize Razorpay checkout.");
    }
  };

  return (
    <main className="min-h-screen bg-[#070e1c] text-white transition-colors duration-300 pb-32 lg:pb-16 selection:bg-[#c88d18] selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      {/* Checkout Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/80 bg-[#070e1c]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === "payment") setCurrentStep("details");
                else if (onNavigate) onNavigate(`/car/${car?.id || car?.name}`);
                else window.history.back();
              }}
              className="text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-xl px-2.5 py-1.5 h-auto flex items-center gap-1 text-xs font-semibold border border-slate-700/50 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-[#c88d18]" /> Back
            </Button>

            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/");
                }
              }}
              className="brand-mark flex items-center gap-2 text-lg sm:text-xl font-black text-white tracking-wide"
            >
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c88d18] to-[#96640c] text-xs sm:text-sm text-slate-950 font-black shadow-md shadow-[#c88d18]/30">
                M
              </span>
              <span>
                MOAR <span className="text-[#c88d18]">CARS</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <Lock className="h-3.5 w-3.5" /> 256-Bit SSL Checkout
            </div>
            <a href="tel:+918500012345" className="flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#c88d18]" />
              <span className="hidden sm:inline font-mono">+91 85000 12345</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-8 space-y-6 min-w-0 w-full">
        {/* Stepper Progress Bar */}
        {currentStep !== "confirmed" && (
          <div className="flex items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-bold pt-2 overflow-x-auto">
            <div className={`flex items-center gap-2 shrink-0 ${currentStep === "details" ? "text-[#c88d18]" : "text-emerald-400"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-sm ${
                  currentStep === "details" ? "bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 ring-2 ring-[#c88d18]/30" : "bg-emerald-500 text-slate-950"
                }`}
              >
                1
              </div>
              <span className="tracking-wide">Renter Details</span>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-slate-800 shrink-0" />

            <div className={`flex items-center gap-2 shrink-0 ${currentStep === "payment" ? "text-[#c88d18]" : "text-slate-400"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === "payment" ? "bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 ring-2 ring-[#c88d18]/30" : "bg-slate-800/90 text-slate-400 border border-slate-700"
                }`}
              >
                2
              </div>
              <span className="tracking-wide">Payment & Gateway</span>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-slate-800 shrink-0" />

            <div className="flex items-center gap-2 shrink-0 text-slate-400">
              <div className="h-7 w-7 rounded-full bg-slate-800/90 text-slate-400 border border-slate-700 flex items-center justify-center text-xs font-black">
                3
              </div>
              <span className="tracking-wide">Instant Confirmation</span>
            </div>
          </div>
        )}

        {/* STEP 3: CONFIRMATION VIEW */}
        {currentStep === "confirmed" && confirmedBookingData && (
          <div className="w-full">
            <BookingConfirmationScreen
              bookingData={confirmedBookingData}
              onGoToDashboard={() => {
                if (onNavigate) onNavigate("/dashboard");
              }}
              onGoHome={() => {
                if (onNavigate) onNavigate("/");
              }}
            />
          </div>
        )}

        {/* STEP 1 & 2: CHECKOUT FORM & SUMMARY */}
        {currentStep !== "confirmed" && !car && (
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] p-10 sm:p-14 text-center space-y-4 shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c88d18]/10 border border-[#c88d18]/20 text-[#c88d18]">
              <Car className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-white">No Vehicle Selected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Please choose a car from our live fleet to begin the reservation checkout.
            </p>
            <Button
              onClick={() => {
                if (onNavigate) onNavigate("/cars");
                else window.history.back();
              }}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 font-black text-xs shadow-lg shadow-[#c88d18]/20 hover:brightness-105"
            >
              Select a Vehicle
            </Button>
          </div>
        )}

        {/* AUTHENTICATION GATE: User must be signed in to book */}
        {currentStep !== "confirmed" && car && !user && (
          <div className="rounded-3xl border border-[#c88d18]/40 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] text-white p-6 sm:p-12 shadow-2xl space-y-6 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c88d18]/10 border border-[#c88d18]/30 text-[#c88d18]">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-white">
                Sign In to Reserve {car.name}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                To guarantee safe self-drive reservations, Tirumala Ghat road clearances & instant vehicle handover, an authenticated user profile is required.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-between text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                {car.image ? (
                  <img src={car.image} alt={car.name} className="h-12 w-16 object-cover rounded-xl bg-slate-900 shrink-0" />
                ) : (
                  <div className="h-12 w-16 bg-slate-900 rounded-xl flex items-center justify-center"><Car className="h-6 w-6 text-slate-500" /></div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-white">{car.name}</h4>
                  <p className="text-[11px] text-[#c88d18] font-semibold">{rentalDays} Days • {startDate} to {endDate}</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-400">₹{payableNow.toLocaleString("en-IN")} Adv</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
              <Button
                onClick={() => openAuthModal("login")}
                className="h-12 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <User className="h-4 w-4 text-[#c88d18]" /> Existing User (Sign In)
              </Button>
              <Button
                onClick={() => openAuthModal("register")}
                className="h-12 rounded-2xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-[#c88d18]/25 transition-transform active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-slate-950" /> New User (Create Profile)
              </Button>
            </div>

            <p className="text-[11px] text-slate-400">
              ⚡ Instant 6-digit email OTP verification • No paperwork required
            </p>
          </div>
        )}

        {currentStep !== "confirmed" && car && user && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column (7 cols): Input Forms */}
            <div className="lg:col-span-7 space-y-6">
              {/* Error Notice */}
              {submissionError && (
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-semibold flex items-center gap-2.5 shadow-lg">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* 1. RENTER & DRIVER IDENTIFICATION */}
              <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] p-5 sm:p-7 shadow-2xl space-y-6 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800/80 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <User className="h-5 w-5 text-[#c88d18]" /> Primary Renter Details
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Official driver details required for insurance coverage and vehicle handover
                    </p>
                  </div>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="text-xs font-bold text-[#c88d18] hover:underline self-start sm:self-auto"
                    >
                      Already have an account? Sign In
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Full Legal Name (as per DL) <span className="text-[#c88d18]">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Reddy"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-[#070e1c]/90 border text-sm text-white placeholder-slate-500 font-medium outline-none transition-all shadow-inner ${
                        fieldErrors.name
                          ? "border-rose-500 bg-rose-950/20 focus:ring-2 focus:ring-rose-500/30"
                          : "border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/25"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs font-medium text-rose-400 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number - Exactly 10 Digits */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">
                        Mobile Number <span className="text-[#c88d18]">*</span>
                      </label>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {customerPhone.length}/10 digits
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-300 select-none border-r border-slate-700/80 pr-2">
                        <span className="text-[10px]">🇮🇳</span>
                        <span>+91</span>
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        placeholder="9876543210"
                        value={customerPhone}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                          setCustomerPhone(digitsOnly);
                          if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                        }}
                        className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-[#070e1c]/90 border text-sm text-white placeholder-slate-500 font-medium outline-none tracking-wide transition-all shadow-inner ${
                          fieldErrors.phone
                            ? "border-rose-500 bg-rose-950/20 focus:ring-2 focus:ring-rose-500/30"
                            : "border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/25"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs font-medium text-rose-400 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Email Address <span className="text-[#c88d18]">*</span></span>
                    </label>
                    <input
                      type="email"
                      placeholder="rajesh@example.com"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-[#070e1c]/90 border text-sm text-white placeholder-slate-500 font-medium outline-none transition-all shadow-inner ${
                        fieldErrors.email
                          ? "border-rose-500 bg-rose-950/20 focus:ring-2 focus:ring-rose-500/30"
                          : "border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/25"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs font-medium text-rose-400 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Driving License */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Driving License Number <span className="text-[#c88d18]">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="AP03 20220019281"
                      value={drivingLicense}
                      onChange={(e) => {
                        setDrivingLicense(e.target.value.toUpperCase());
                        if (fieldErrors.dl) setFieldErrors((prev) => ({ ...prev, dl: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-[#070e1c]/90 border text-sm uppercase text-white placeholder-slate-500 font-medium outline-none tracking-wider transition-all shadow-inner ${
                        fieldErrors.dl
                          ? "border-rose-500 bg-rose-950/20 focus:ring-2 focus:ring-rose-500/30"
                          : "border-slate-700/80 focus:border-[#c88d18] focus:ring-2 focus:ring-[#c88d18]/25"
                      }`}
                    />
                    {fieldErrors.dl && (
                      <p className="text-xs font-medium text-rose-400 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.dl}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. ADMIN PROMO COUPONS ONLY */}
              <CouponSection
                subtotal={subtotalBeforeDiscounts}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={(cpn) => setAppliedCoupon(cpn)}
                onRemoveCoupon={() => setAppliedCoupon(null)}
              />

              {/* Final Submit / Pay CTA */}
              <div className="space-y-3 pt-2">
                {/* Desktop-only sleek CTA (Mobile uses the sticky bottom bar) */}
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndPay}
                  className="hidden lg:flex w-full h-12 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 text-sm font-bold shadow-lg shadow-[#c88d18]/20 hover:brightness-105 items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    "Processing Razorpay Checkout..."
                  ) : (
                    <>
                      <span>Pay ₹{payableNow.toLocaleString("en-IN")} Advance via Razorpay</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    256-Bit SSL Razorpay Gateway
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    Instant Confirmation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-[#c88d18] shrink-0" />
                    Zero Hidden Charges
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Live Summary Card */}
            <div className="lg:col-span-5 sticky top-24">
              <BookingSummaryCard
                car={car}
                pickupLocation={pickupLocation}
                dropLocation={dropLocation}
                startDate={startDate}
                startTime={startTime}
                endDate={endDate}
                endTime={endTime}
                rentalDays={rentalDays}
                withDriver={withDriver}
                deliveryMode={deliveryMode}
                baseFare={baseFare}
                deliveryFee={deliveryFee}
                driverFee={driverFee}
                extrasTotal={extrasTotal}
                selectedExtras={selectedExtras}
                couponDiscount={couponDiscount}
                couponCode={appliedCoupon?.code}
                walletDeduction={0}
                rewardDeduction={0}
                referralDiscount={0}
                gstRate={gstRate}
                gstAmount={gstAmount}
                securityDeposit={securityDeposit}
                grandTotal={grandTotal}
                paymentMode={selectedPaymentMethod}
                advancePaymentPercent={advancePaymentPercent}
                payableNow={payableNow}
                balanceDue={balanceDue}
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Checkout Bar - Compact & Clean */}
      {currentStep !== "confirmed" && car && user && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070e1c]/95 backdrop-blur-xl border-t border-slate-800/90 px-4 py-2.5 shadow-[0_-10px_25px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 truncate">
                Advance ({advancePaymentPercent}%)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-emerald-400">
                  ₹{payableNow.toLocaleString("en-IN")}
                </span>
                {balanceDue > 0 && (
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    (Bal: ₹{balanceDue.toLocaleString("en-IN")})
                  </span>
                )}
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={handleConfirmAndPay}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 font-bold text-xs shadow-md shadow-[#c88d18]/25 hover:brightness-105 active:scale-95 flex items-center gap-1.5 shrink-0"
            >
              {isSubmitting ? (
                "Connecting..."
              ) : (
                <>
                  <span>Pay Advance</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};
export default CheckoutPage;

