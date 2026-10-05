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
  const [customerAddress, setCustomerAddress] = useState(user?.address || "");
  const [customerCity, setCustomerCity] = useState(user?.city || "Tirupati");
  const [drivingLicense, setDrivingLicense] = useState(user?.dlNumber || "");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Validation Errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
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
      if (!customerAddress && user.address) setCustomerAddress(user.address);
      if (!customerCity && user.city) setCustomerCity(user.city);
      if (!drivingLicense && user.dlNumber) setDrivingLicense(user.dlNumber);
    }
  }, [user]);

  // Accurate Duration Calculation (Exact Hours & 24h Days Tariff)
  const rentalDuration = useMemo(() => {
    try {
      const start = new Date(`${startDate}T${startTime}`);
      const end = new Date(`${endDate}T${endTime}`);
      const diffMs = end.getTime() - start.getTime();
      if (isNaN(diffMs) || diffMs <= 0) {
        return { totalHours: 24, totalDays: 1, durationLabel: "24 Hours (1 Day Tariff)" };
      }
      const totalHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
      const totalDays = Math.max(1, Math.ceil(totalHours / 24));
      return {
        totalHours,
        totalDays,
        durationLabel: `${totalHours} Hours (${totalDays} ${totalDays === 1 ? "Day" : "Days"} Tariff)`,
      };
    } catch {
      return { totalHours: 48, totalDays: 2, durationLabel: "48 Hours (2 Days Tariff)" };
    }
  }, [startDate, startTime, endDate, endTime]);

  const rentalDays = rentalDuration.totalDays;

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

  // Exact 10% Non-Refundable Booking Advance Calculation
  const advancePaymentPercent = 10;
  const payableNow = Math.round(grandTotal * (advancePaymentPercent / 100));
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
    const keyPin = String(Math.floor(1000 + (Math.abs(bookingId.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 9000)));

    const bookingPayload = {
      bookingId,
      transactionId,
      keyPin,
      pickupOtp: keyPin,
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
      customerAddress: customerAddress.trim(),
      customerCity: customerCity.trim(),
      drivingLicense: drivingLicense.trim().toUpperCase(),
      emergencyContact,
      status: "Confirmed",
      paymentStatus: balanceDue > 0 ? "Advance Paid" : "Paid",
      paymentMethod: "Razorpay",
      bookingSource: "Web Checkout Gateway",
      totalDays: rentalDays,
      totalHours: rentalDuration.totalHours,
      duration: rentalDuration.durationLabel,
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
      advancePaymentPercent: 10,
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

      const finalBookingId = data.data?.bookingId || (data.data?.id ? `MC-2026-${data.data.id}` : bookingId);
      const finalPin = data.data?.pickupOtp || data.data?.keyPin || keyPin;

      setConfirmedBookingData({
        ...bookingPayload,
        bookingId: finalBookingId,
        keyPin: finalPin,
        pickupOtp: finalPin,
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
    // 0. Mandatory Authentication Check
    if (!user) {
      openAuthModal("login");
      setSubmissionError("Authentication required: Please sign in or create an account to proceed with your booking.");
      return;
    }

    // 1. Strict Form Validations
    const errors: { name?: string; phone?: string; email?: string; address?: string; dl?: string } = {};

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

    if (!customerAddress || customerAddress.trim().length < 5) {
      errors.address = "Full Street Address is required (minimum 5 characters).";
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
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 pb-28 lg:pb-16 selection:bg-[#c88d18] selection:text-slate-950 overflow-x-hidden w-full max-w-full">
      {/* Checkout Top Bar - Clean White Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (currentStep === "payment") setCurrentStep("details");
                else if (currentStep === "confirmed") {
                  if (onNavigate) onNavigate("/");
                  else window.location.href = "/";
                }
                else if (onNavigate) onNavigate(`/car/${car?.id || car?.name}`);
                else window.history.back();
              }}
              className="text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-xl px-2.5 py-1.5 h-auto flex items-center gap-1 text-xs font-semibold border border-slate-200 transition-all"
            >
              <ChevronLeft className="h-4 w-4 text-[#b57d14]" /> Back
            </Button>

            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate("/");
                }
              }}
              className="brand-mark flex items-center gap-2 text-lg sm:text-xl font-black text-slate-900 tracking-wide"
            >
              <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#c88d18] to-[#96640c] text-xs sm:text-sm text-slate-950 font-black shadow-sm">
                M
              </span>
              <span>
                MOAR <span className="text-[#b57d14]">CARS</span>
              </span>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-5 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Lock className="h-3.5 w-3.5 text-emerald-600" /> 256-Bit SSL Checkout
            </div>
            <a href="tel:+918500012345" className="flex items-center gap-1.5 text-slate-700 hover:text-slate-950 font-medium transition-colors">
              <Phone className="h-3.5 w-3.5 text-[#b57d14]" />
              <span className="hidden sm:inline font-mono">+91 85000 12345</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 space-y-5 sm:space-y-6 min-w-0 w-full">
        {/* Stepper Progress Bar */}
        {currentStep !== "confirmed" && (
          <div className="flex items-center justify-center gap-2 sm:gap-6 text-[11px] sm:text-xs font-bold pt-1 overflow-x-auto">
            <div className={`flex items-center gap-2 shrink-0 ${currentStep === "details" ? "text-[#b57d14]" : "text-emerald-700"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black shadow-2xs ${
                  currentStep === "details" ? "bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 ring-2 ring-amber-400/30" : "bg-emerald-500 text-white"
                }`}
              >
                1
              </div>
              <span className="tracking-wide">Renter Details</span>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-slate-200 shrink-0" />

            <div className={`flex items-center gap-2 shrink-0 ${currentStep === "payment" ? "text-[#b57d14]" : "text-slate-400"}`}>
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${
                  currentStep === "payment" ? "bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 ring-2 ring-amber-400/30" : "bg-slate-100 text-slate-500 border border-slate-300"
                }`}
              >
                2
              </div>
              <span className="tracking-wide">Payment & Gateway</span>
            </div>

            <div className="h-0.5 w-6 sm:w-16 bg-slate-200 shrink-0" />

            <div className="flex items-center gap-2 shrink-0 text-slate-400">
              <div className="h-7 w-7 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center text-xs font-black">
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
          <div className="rounded-3xl border border-slate-200 bg-white p-10 sm:p-14 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <Car className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Vehicle Selected</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please choose a car from our live fleet to begin the reservation checkout.
            </p>
            <Button
              onClick={() => {
                if (onNavigate) onNavigate("/cars");
                else window.history.back();
              }}
              className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:brightness-105"
            >
              Select a Vehicle
            </Button>
          </div>
        )}

        {/* AUTHENTICATION GATE: User must be signed in to book */}
        {currentStep !== "confirmed" && car && !user && (
          <div className="rounded-3xl border border-amber-300 bg-white text-slate-900 p-6 sm:p-12 shadow-md space-y-6 max-w-2xl mx-auto text-center animate-in fade-in duration-300">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
              <Lock className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight text-slate-900">
                Sign In to Reserve {car.name}
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                To guarantee safe self-drive reservations, Tirumala Ghat road clearances & instant vehicle handover, an authenticated user profile is required.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                {car.image ? (
                  <img src={car.image} alt={car.name} className="h-12 w-16 object-cover rounded-xl bg-slate-200 shrink-0 border border-slate-200" />
                ) : (
                  <div className="h-12 w-16 bg-slate-200 rounded-xl flex items-center justify-center"><Car className="h-6 w-6 text-slate-500" /></div>
                )}
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{car.name}</h4>
                  <p className="text-[11px] text-amber-800 font-semibold">{rentalDays} Days • {startDate} to {endDate}</p>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-700">₹{payableNow.toLocaleString("en-IN")} Adv</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
              <Button
                onClick={() => openAuthModal("login")}
                className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <User className="h-4 w-4 text-amber-700" /> Existing User (Sign In)
              </Button>
              <Button
                onClick={() => openAuthModal("register")}
                className="h-12 rounded-2xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 transition-transform active:scale-95"
              >
                <Sparkles className="h-4 w-4 text-slate-950" /> New User (Create Profile)
              </Button>
            </div>

            <p className="text-[11px] text-slate-500">
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
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 shadow-xs">
                  <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* 1. RENTER & DRIVER IDENTIFICATION */}
              <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm space-y-6 text-slate-900">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <User className="h-5 w-5 text-[#b57d14]" /> Primary Renter Details
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Official driver details required for insurance coverage and vehicle handover
                    </p>
                  </div>
                  {!user && (
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="text-xs font-bold text-[#b57d14] hover:underline self-start sm:self-auto"
                    >
                      Already have an account? Sign In
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Full Legal Name (as per DL) <span className="text-amber-600">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Reddy"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (fieldErrors.name) setFieldErrors((prev) => ({ ...prev, name: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs ${
                        fieldErrors.name
                          ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number - Exactly 10 Digits */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Mobile Number <span className="text-amber-600">*</span>
                      </label>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {customerPhone.length}/10 digits
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-slate-600 select-none border-r border-slate-300 pr-2">
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
                        className={`w-full pl-20 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 font-medium outline-none tracking-wide transition-all shadow-2xs ${
                          fieldErrors.phone
                            ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                        }`}
                      />
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Email Address <span className="text-amber-600">*</span></span>
                    </label>
                    <input
                      type="email"
                      placeholder="rajesh@example.com"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs ${
                        fieldErrors.email
                          ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Driving License */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Driving License Number <span className="text-amber-600">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="AP03 20220019281"
                      value={drivingLicense}
                      onChange={(e) => {
                        setDrivingLicense(e.target.value.toUpperCase());
                        if (fieldErrors.dl) setFieldErrors((prev) => ({ ...prev, dl: undefined }));
                      }}
                      className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm uppercase text-slate-900 placeholder-slate-400 font-medium outline-none tracking-wider transition-all shadow-2xs ${
                        fieldErrors.dl
                          ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-500/20"
                          : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                      }`}
                    />
                    {fieldErrors.dl && (
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.dl}
                      </p>
                    )}
                  </div>

                  {/* Customer Address & City */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                      <span>Full Residential Address <span className="text-amber-600">*</span></span>
                      <span className="text-[10px] text-slate-400">Required for self-drive insurance</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="House / Flat / Street / Landmark"
                        value={customerAddress}
                        onChange={(e) => {
                          setCustomerAddress(e.target.value);
                          if (fieldErrors.address) setFieldErrors((prev) => ({ ...prev, address: undefined }));
                        }}
                        className={`sm:col-span-2 w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs ${
                          fieldErrors.address
                            ? "border-rose-500 bg-rose-50 focus:ring-2 focus:ring-rose-500/20"
                            : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                        }`}
                      />
                      <input
                        type="text"
                        placeholder="City (e.g. Tirupati)"
                        value={customerCity}
                        onChange={(e) => setCustomerCity(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20 text-sm text-slate-900 placeholder-slate-400 font-medium outline-none transition-all shadow-2xs"
                      />
                    </div>
                    {fieldErrors.address && (
                      <p className="text-xs font-medium text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {fieldErrors.address}
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

              {/* 10% Non-Refundable Advance Callout Notice */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300 text-slate-900 text-xs space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                    10%
                  </span>
                  <span>10% Non-Refundable Booking Advance</span>
                </div>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  You are paying <strong className="text-slate-950 font-bold">₹{payableNow.toLocaleString("en-IN")}</strong> online via Razorpay to reserve this car exclusively. The remaining 90% balance of <strong className="text-slate-950 font-bold">₹{balanceDue.toLocaleString("en-IN")}</strong> is paid at vehicle handover or online via your digital pass. The 10% advance is non-refundable upon vehicle allocation.
                </p>
              </div>

              {/* Final Submit / Pay CTA */}
              <div className="space-y-3 pt-1">
                {/* Desktop-only sleek CTA (Mobile uses the sticky bottom bar) */}
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleConfirmAndPay}
                  className="hidden lg:flex w-full h-12 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 text-sm font-bold shadow-md shadow-amber-500/20 hover:brightness-105 items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
                >
                  {isSubmitting ? (
                    "Processing Razorpay Checkout..."
                  ) : (
                    <>
                      <span>Pay ₹{payableNow.toLocaleString("en-IN")} (10% Advance) via Razorpay</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    256-Bit SSL Razorpay Gateway
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Instant Confirmation
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    Zero Hidden Charges
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column (5 cols): Live Summary Card */}
            <div className="lg:col-span-5 sticky top-20">
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
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 px-4 py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 truncate">
                Advance ({advancePaymentPercent}%)
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-emerald-700">
                  ₹{payableNow.toLocaleString("en-IN")}
                </span>
                {balanceDue > 0 && (
                  <span className="text-[10px] text-slate-500 font-medium truncate">
                    (Bal: ₹{balanceDue.toLocaleString("en-IN")})
                  </span>
                )}
              </div>
            </div>

            <Button
              disabled={isSubmitting}
              onClick={handleConfirmAndPay}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 font-bold text-xs shadow-md shadow-amber-500/25 hover:brightness-105 active:scale-95 flex items-center gap-1.5 shrink-0"
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

