import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileText,
  KeyRound,
  Copy,
  Check,
  Compass,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GstInvoiceModal } from "../dashboard/trips/GstInvoiceModal";

interface BookingConfirmationScreenProps {
  bookingData: any;
  onGoToDashboard: () => void;
  onGoHome: () => void;
}

// Clean date formatting helper
function formatDateTimeDisplay(dateStr?: string, timeStr?: string) {
  if (!dateStr) return { date: "Scheduled Date", time: timeStr || "09:00 AM" };
  const rawDateOnly = dateStr.includes(" ") ? dateStr.split(" ")[0] : dateStr;
  let cleanTime = timeStr || (dateStr.includes(" ") ? dateStr.split(" ").slice(1).join(" ") : "09:00 AM");

  if (cleanTime && cleanTime.includes(":") && !cleanTime.toLowerCase().includes("am") && !cleanTime.toLowerCase().includes("pm")) {
    const [hStr, mStr] = cleanTime.split(":");
    const h = parseInt(hStr, 10);
    const m = mStr || "00";
    if (!isNaN(h)) {
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      cleanTime = `${String(h12).padStart(2, "0")}:${m} ${ampm}`;
    }
  }

  try {
    const [y, m, d] = rawDateOnly.split("-").map(Number);
    if (y && m && d) {
      const dateObj = new Date(y, m - 1, d);
      const formattedDate = dateObj.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      return { date: formattedDate, time: cleanTime };
    }
  } catch {}

  return { date: rawDateOnly, time: cleanTime };
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  bookingData,
  onGoToDashboard,
  onGoHome,
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSentNotice, setEmailSentNotice] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const rawBookingId = bookingData.bookingId || `MC-2026-${bookingData.id || Math.floor(10000 + Math.random() * 90000)}`;
  const bookingId = String(rawBookingId).replace(/^#+/, "");
  const transactionId = bookingData.transactionId || `pay_live_${Date.now().toString().slice(-8)}`;
  const keyPin = bookingData.keyPin || Math.floor(1000 + (Math.abs(bookingId.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 9000));

  const pickupInfo = formatDateTimeDisplay(bookingData.startDate, bookingData.startTime);
  const returnInfo = formatDateTimeDisplay(bookingData.endDate, bookingData.endTime);

  const grandTotal = Number(bookingData.grandTotal || bookingData.amount || 0);
  const initialPaid = Number(bookingData.paidAmount !== undefined ? bookingData.paidAmount : (bookingData.advancePaid || grandTotal));
  const initialBalance = Number(bookingData.balanceDue !== undefined ? bookingData.balanceDue : Math.max(0, grandTotal - initialPaid));
  const rentalDays = Number(bookingData.totalDays || bookingData.rentalDays || 2);

  // Online Balance Settlement States
  const [currentPaid, setCurrentPaid] = useState<number>(initialPaid);
  const [currentBalance, setCurrentBalance] = useState<number>(initialBalance);
  const [isPayingBalance, setIsPayingBalance] = useState<boolean>(false);
  const [balancePaidSuccess, setBalancePaidSuccess] = useState<boolean>(false);

  // Helper: Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayBalanceOnline = async () => {
    if (isPayingBalance || currentBalance <= 0) return;
    setIsPayingBalance(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Failed to connect to Razorpay payment gateway. Please check your internet connection.");
        setIsPayingBalance(false);
        return;
      }

      const amountInPaise = Math.max(100, Math.round(currentBalance * 100));
      const cleanPhone = (bookingData.customerPhone || "").replace(/\D/g, "");

      const options = {
        key: "rzp_test_SwedUUn1KgRMs0",
        amount: amountInPaise,
        currency: "INR",
        name: "MOAR CARS",
        description: `Pay Remaining Balance: Booking #${bookingId}`,
        image: "https://moarcars.com/assets/moarcars-logo-DK578w77.png",
        prefill: {
          name: bookingData.customerName || "Valued Customer",
          email: bookingData.customerEmail || "",
          contact: cleanPhone,
        },
        notes: {
          bookingId,
          carName: bookingData.carName || "Vehicle",
          type: "balance_settlement",
        },
        theme: {
          color: "#0b1426",
        },
        modal: {
          ondismiss: function () {
            setIsPayingBalance(false);
          },
        },
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id || `rzp_bal_${Date.now()}`;
          try {
            await fetch("/api/bookings/pay-balance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId,
                transactionId: paymentId,
                amountPaid: currentBalance,
                paymentMethod: "Razorpay",
              }),
            });
            setCurrentPaid((prev) => prev + currentBalance);
            setCurrentBalance(0);
            setBalancePaidSuccess(true);
            setEmailSentNotice(true);
          } catch (e) {
            console.error("Balance settle api error:", e);
          }
          setIsPayingBalance(false);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setIsPayingBalance(false);
        alert(`Payment failed: ${response.error?.description || "Transaction declined by gateway"}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsPayingBalance(false);
      alert(err?.message || "Failed to initialize Razorpay checkout.");
    }
  };

  const handleCopyBookingId = () => {
    navigator.clipboard.writeText(bookingId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const carName = bookingData.car?.name || bookingData.carName || "Self-Drive Car";
    const text = encodeURIComponent(
      `🚗 *MOAR CARS TIRUPATI - DIGITAL TRIP PASS*\n\n` +
      `• *Booking ID:* #${bookingId}\n` +
      `• *Vehicle:* ${carName}\n` +
      `• *Pickup:* ${bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub"} (${pickupInfo.date} • ${pickupInfo.time})\n` +
      `• *Return:* ${bookingData.dropLocation || bookingData.dropAddress || bookingData.pickupLocation || "Tirupati Central Hub"} (${returnInfo.date} • ${returnInfo.time})\n` +
      `• *Key Pickup PIN:* ${keyPin}\n` +
      `• *Advance Paid Online:* ₹${paidAmount.toLocaleString("en-IN")}\n` +
      `• *Balance at Handover:* ₹${balanceDue.toLocaleString("en-IN")}\n\n` +
      `24/7 Helpline: +91 85000 12345 • www.moarcars.com`
    );
    window.open(`https://wa.me/918500012345?text=${text}`, "_blank");
  };

  const handleSendEmail = async () => {
    if (emailSending) return;
    setEmailSending(true);
    try {
      await fetch("/api/bookings/resend-voucher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          customerEmail: bookingData.customerEmail || bookingData.email,
          email: bookingData.customerEmail || bookingData.email,
          ...bookingData,
        }),
      });
      setEmailSentNotice(true);
    } catch {}
    setEmailSending(false);
    setTimeout(() => setEmailSentNotice(false), 5000);
  };

  const defaultCarImage =
    bookingData.car?.image ||
    bookingData.car?.galleryImages?.[0] ||
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-7 animate-in fade-in duration-300 pb-16 pt-2">
      {/* 1. Header Confirmation Banner (Clean Left-Aligned Executive Design) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Reservation Confirmed &amp; Secured
            </span>
            <span className="text-[11px] font-bold text-slate-400">• Official Digital Pass</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            You're All Set to Drive,{" "}
            <span className="bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] bg-clip-text text-transparent">
              {bookingData.customerName?.split(" ")[0] || "Guest"}
            </span>
            !
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Your self-drive booking is confirmed in our dispatch system. Your vehicle is sanitized and ready for handover.
          </p>

          {/* Reference Badges Strip - Left Aligned */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleCopyBookingId}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-[#b57d14] transition-all active:scale-95 cursor-pointer shadow-2xs"
              title="Click to copy Booking ID"
            >
              <span>Ref: #{bookingId}</span>
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
            </button>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 truncate max-w-[200px] sm:max-w-none shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">Txn: {transactionId}</span>
            </span>

            {bookingData.customerEmail && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium shadow-2xs">
                <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Invoice sent to email</span>
              </span>
            )}
          </div>
        </div>

        {/* Right Side Status / Quick Action Badge */}
        <div className="hidden md:flex flex-col items-end gap-2 shrink-0 border-l border-slate-100 pl-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border-2 border-emerald-500/80 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Dispatch Ready
          </span>
        </div>
      </div>

      {/* 2. Luxury Digital Boarding Pass */}
      <div className="w-full rounded-3xl border-2 border-amber-400/60 bg-white shadow-xl overflow-hidden">
        {/* Pass Top Ribbon */}
        <div className="px-5 sm:px-8 py-3 bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] flex items-center justify-between gap-3 text-slate-950 font-black">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-xs font-black text-amber-400 shadow-sm">
              M
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
              Official Digital Trip Pass
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-300 text-[10px] sm:text-xs font-bold border border-emerald-400/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Dispatch Ready
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-4 sm:p-7 space-y-5">
          {/* Section A: Vehicle Snapshot & Key PIN Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
            {/* Left: Vehicle Image & Specs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="relative w-full sm:w-44 h-44 sm:h-32 rounded-2xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 shadow-sm group">
                <img
                  src={defaultCarImage}
                  alt={bookingData.car?.name || "Vehicle"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur text-[10px] font-bold text-amber-400 border border-white/10">
                  {bookingData.car?.category || "Self Drive"}
                </span>
              </div>

              <div className="space-y-1.5 min-w-0 w-full">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight break-words">
                  {bookingData.car?.name || bookingData.carName || "Self-Drive Vehicle"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {bookingData.car?.variant || "Tirupati Self-Drive Edition"} • {bookingData.car?.fuelType || "Petrol"} • {bookingData.car?.transmission || "Manual"}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1 text-[10px] sm:text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 font-medium shadow-2xs">
                    👥 {bookingData.car?.seats || 5} Seater
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                    ⛰️ Ghat Road Certified
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                    ⚡ Unlimited KMs
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Golden Key Handover PIN (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-amber-100/70 to-amber-50 border-2 border-amber-300 text-center flex flex-col justify-center items-center space-y-2.5 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-center gap-1.5 text-amber-900 text-xs font-black uppercase tracking-wider">
                <KeyRound className="h-4 w-4 text-amber-700" />
                <span>Station Handover PIN</span>
              </div>
              <div className="px-6 py-2 rounded-2xl bg-white border-2 border-amber-400 text-amber-700 font-mono text-3xl sm:text-4xl font-black tracking-widest shadow-md">
                {keyPin}
              </div>
              <p className="text-[11px] text-slate-600 leading-tight max-w-xs font-medium">
                Present this PIN with your Original DL at the station hub for immediate key collection.
              </p>
            </div>
          </div>

          {/* Section B: Airline-Style Route & Itinerary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Pickup Point */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Pickup Station</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {pickupInfo.time}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-900 break-words flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub (Station)"}</span>
                </p>
                <div className="text-xs font-semibold text-slate-600 pl-5">
                  <span>📅 {pickupInfo.date}</span>
                </div>
              </div>

              {/* Return Point */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Return Station</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {returnInfo.time}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-slate-900 break-words flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{bookingData.dropLocation || bookingData.dropAddress || bookingData.pickupLocation || "Tirupati Central Hub (Station)"}</span>
                </p>
                <div className="text-xs font-semibold text-slate-600 pl-5">
                  <span>📅 {returnInfo.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 text-amber-800 font-bold">
                <Clock className="h-3.5 w-3.5 text-amber-600" /> Trip Duration: {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24} Hours) • Unlimited KM
              </span>
              <span className="text-slate-600 font-medium">
                Station Helpline: <a href="tel:+918500012345" className="text-slate-900 font-mono hover:text-[#b57d14] font-bold">+91 85000 12345</a>
              </span>
            </div>
          </div>

          {/* Section C: Payment & Escrow Chips */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <span className="text-slate-500 text-[11px] block font-medium">Total Trip Fare (incl. 18% GST)</span>
                <p className="text-xl font-black text-slate-900">₹{grandTotal.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-slate-400 block font-medium">All-inclusive rate</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <span className="text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Advance Paid Online
                </span>
                <p className="text-xl font-black text-emerald-700">₹{currentPaid.toLocaleString("en-IN")}</p>
                <span className="text-[10px] text-emerald-600 block font-medium">Secured via Razorpay</span>
              </div>
              <div className={`p-3.5 rounded-2xl border space-y-1 ${currentBalance > 0 ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-200"}`}>
                <span className={`font-bold text-[11px] block ${currentBalance > 0 ? "text-amber-900" : "text-emerald-900"}`}>
                  {currentBalance > 0 ? "Balance at Handover" : "Remaining Balance"}
                </span>
                <p className={`text-xl font-black ${currentBalance > 0 ? "text-amber-800" : "text-emerald-700"}`}>
                  ₹{currentBalance.toLocaleString("en-IN")}
                </p>
                <span className={`text-[10px] block font-medium ${currentBalance > 0 ? "text-amber-700" : "text-emerald-600"}`}>
                  {currentBalance > 0 ? "UPI / Card at Station Hub" : "Fully Settled"}
                </span>
              </div>
            </div>

            {/* Direct Razorpay Settlement Card if Balance Due */}
            {currentBalance > 0 ? (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/70 to-amber-100/50 border border-amber-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5 text-left w-full sm:w-auto">
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    Pay Remaining Balance Online
                  </span>
                  <p className="text-xs text-slate-700">
                    Settle <strong className="text-slate-900 font-bold">₹{currentBalance.toLocaleString("en-IN")}</strong> instantly via Razorpay UPI or Cards to skip station payment.
                  </p>
                </div>
                <Button
                  onClick={handlePayBalanceOnline}
                  disabled={isPayingBalance}
                  className="w-full sm:w-auto h-11 px-5 rounded-xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] hover:opacity-95 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4 text-slate-950" />
                  {isPayingBalance ? "Connecting Razorpay..." : `Pay ₹${currentBalance.toLocaleString("en-IN")} via Razorpay`}
                </Button>
              </div>
            ) : balancePaidSuccess ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs text-emerald-800 font-bold animate-in fade-in">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Remaining Balance Paid Successfully! Full payment verified and updated voucher emailed.
                </span>
                <span className="text-[10px] text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                  100% Cleared
                </span>
              </div>
            ) : null}
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="h-4 w-4" /> Zero Security Deposit Policy Guaranteed
            </span>
            <span className="text-slate-500 text-[11px]">
              No credit card pre-auth locks or hidden charges
            </span>
          </div>

          {/* Section D: Direct Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Button
              onClick={handleWhatsAppShare}
              className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <MessageSquare className="h-4 w-4 text-white" /> Save Pass on WhatsApp
            </Button>

            <Button
              onClick={() => setShowInvoiceModal(true)}
              className="h-12 rounded-2xl bg-white hover:bg-slate-50 text-slate-900 border-2 border-amber-500/70 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <FileText className="h-4 w-4 text-amber-600" /> View GST Tax Invoice
            </Button>

            <Button
              onClick={handleSendEmail}
              disabled={emailSending}
              className="h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Mail className="h-4 w-4 text-amber-600" />
              {emailSending
                ? "Sending..."
                : emailSentNotice
                ? "Voucher Dispatched!"
                : "Resend to Email"}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. What Happens Next: 3 Simple Steps */}
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 space-y-4 text-slate-900 shadow-sm">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c88d18]" /> What Happens Next • 3 Easy Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-slate-900">Reach Station Hub</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Arrive at the pickup hub at your scheduled time ({pickupInfo.time}).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-slate-900">Present Driving License</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Show your original Driving License and Key PIN ({keyPin}) to the hub executive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-slate-900">Collect Key & Drive</h4>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Do a quick 60-second walkaround checklist and drive away with 100% peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Navigation CTAs */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
        <Button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-95 transition-all"
        >
          View in My Bookings Dashboard <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={onGoHome}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl border-slate-300 bg-white text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-bold text-xs transition-colors shadow-2xs"
        >
          Return to Fleet Home
        </Button>
      </div>

      {/* 5. GST Tax Invoice Modal */}
      <GstInvoiceModal
        booking={bookingData}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default BookingConfirmationScreen;
