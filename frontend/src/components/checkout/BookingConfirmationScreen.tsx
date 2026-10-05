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
  const paidAmount = Number(bookingData.paidAmount !== undefined ? bookingData.paidAmount : (bookingData.advancePaid || grandTotal));
  const balanceDue = Number(bookingData.balanceDue !== undefined ? bookingData.balanceDue : Math.max(0, grandTotal - paidAmount));
  const rentalDays = Number(bookingData.totalDays || bookingData.rentalDays || 2);

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
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16 pt-2 sm:pt-4">
      {/* 1. Header Confirmation Badge & Hero */}
      <div className="text-center space-y-3 sm:space-y-4">
        {/* Glowing Success Ring */}
        <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-500/20 via-emerald-400/10 to-transparent border-2 border-emerald-400/60 text-emerald-400 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.35)] animate-in zoom-in duration-500">
          <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <span className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Reservation Confirmed & Secured
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            You're All Set to Drive,{" "}
            <span className="bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] bg-clip-text text-transparent">
              {bookingData.customerName?.split(" ")[0] || "Guest"}
            </span>
            !
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Your self-drive booking is confirmed in our dispatch system. Your vehicle is sanitized and ready for handover.
          </p>
        </div>

        {/* Reference Badges Strip */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          <button
            onClick={handleCopyBookingId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-mono font-bold text-[#c88d18] transition-all active:scale-95 shadow-sm"
            title="Click to copy Booking ID"
          >
            <span>Ref: #{bookingId}</span>
            {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
          </button>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-xs font-mono text-slate-300 shadow-sm truncate max-w-[220px] sm:max-w-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">Txn: {transactionId}</span>
          </span>

          {bookingData.customerEmail && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-300 font-medium shadow-sm">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Voucher sent to email</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Luxury Digital Boarding Pass */}
      <div className="w-full rounded-3xl border border-[#c88d18]/40 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden backdrop-blur-xl">
        {/* Pass Top Ribbon */}
        <div className="px-5 sm:px-8 py-3.5 bg-gradient-to-r from-[#070e1c] via-[#0e1c31] to-[#070e1c] border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#c88d18] to-[#96640c] text-xs font-black text-slate-950 shadow-md">
              M
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-white">
              Official Digital Trip Pass
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] sm:text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Dispatch Ready
          </span>
        </div>

        {/* Pass Body */}
        <div className="p-4 sm:p-7 space-y-6">
          {/* Section A: Vehicle Snapshot & Key PIN Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            {/* Left: Vehicle Image & Specs (7 cols) */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left p-4 rounded-2xl bg-[#070e1c]/60 border border-slate-800/80">
              <div className="relative w-full sm:w-44 h-44 sm:h-32 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-700/80 shadow-lg group">
                <img
                  src={defaultCarImage}
                  alt={bookingData.car?.name || "Vehicle"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
                  }}
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur text-[10px] font-bold text-[#c88d18] border border-white/10">
                  {bookingData.car?.category || "Self Drive"}
                </span>
              </div>

              <div className="space-y-1.5 min-w-0 w-full">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight break-words">
                  {bookingData.car?.name || bookingData.carName || "Self-Drive Vehicle"}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {bookingData.car?.variant || "Tirupati Self-Drive Edition"} • {bookingData.car?.fuelType || "Petrol"} • {bookingData.car?.transmission || "Manual"}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1 text-[10px] sm:text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 font-medium">
                    👥 {bookingData.car?.seats || 5} Seater
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    ⛰️ Ghat Road Certified
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#c88d18]/10 text-[#c88d18] border border-[#c88d18]/20 font-bold">
                    ⚡ Unlimited KMs
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Golden Key Handover PIN (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-gradient-to-br from-[#c88d18]/15 via-[#0b1426] to-[#070e1c] border border-[#c88d18]/50 text-center flex flex-col justify-center items-center space-y-2.5 shadow-xl relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#c88d18]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-center gap-1.5 text-[#c88d18] text-xs font-black uppercase tracking-wider">
                <KeyRound className="h-4 w-4" />
                <span>Station Handover PIN</span>
              </div>
              <div className="px-6 py-2.5 rounded-2xl bg-black/60 border border-[#c88d18]/60 text-[#c88d18] font-mono text-3xl sm:text-4xl font-black tracking-widest shadow-[0_0_20px_rgba(200,141,24,0.25)]">
                {keyPin}
              </div>
              <p className="text-[11px] text-slate-300 leading-tight max-w-xs">
                Present this PIN with your Original DL at the station hub for immediate key collection.
              </p>
            </div>
          </div>

          {/* Section B: Airline-Style Route & Itinerary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#070e1c]/80 border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pickup Point */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Pickup Station</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    {pickupInfo.time}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-white break-words flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub (Station)"}</span>
                </p>
                <div className="text-xs font-medium text-slate-300 pl-5">
                  <span>📅 {pickupInfo.date}</span>
                </div>
              </div>

              {/* Return Point */}
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#c88d18] uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c88d18]" />
                    <span>Return Station</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#c88d18] bg-[#c88d18]/10 px-2 py-0.5 rounded-md border border-[#c88d18]/20">
                    {returnInfo.time}
                  </span>
                </div>
                <p className="text-sm sm:text-base font-black text-white break-words flex items-start gap-1.5">
                  <MapPin className="h-4 w-4 text-[#c88d18] shrink-0 mt-0.5" />
                  <span>{bookingData.dropLocation || bookingData.dropAddress || bookingData.pickupLocation || "Tirupati Central Hub (Station)"}</span>
                </p>
                <div className="text-xs font-medium text-slate-300 pl-5">
                  <span>📅 {returnInfo.date}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-[#c88d18] font-bold">
                <Clock className="h-3.5 w-3.5" /> Trip Duration: {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24} Hours) • Unlimited KM
              </span>
              <span className="text-slate-400">
                Station Helpline: <a href="tel:+918500012345" className="text-white font-mono hover:text-[#c88d18] font-bold">+91 85000 12345</a>
              </span>
            </div>
          </div>

          {/* Section C: Payment & Escrow Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-[#070e1c]/90 border border-slate-800 space-y-1">
              <span className="text-slate-400 text-[11px] block font-medium">Total Trip Fare (incl. 18% GST)</span>
              <p className="text-xl font-black text-white">₹{grandTotal.toLocaleString("en-IN")}</p>
              <span className="text-[10px] text-slate-400 block">All-inclusive rate</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 space-y-1">
              <span className="text-emerald-400 font-bold text-[11px] flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Advance Paid Online
              </span>
              <p className="text-xl font-black text-emerald-400">₹{paidAmount.toLocaleString("en-IN")}</p>
              <span className="text-[10px] text-emerald-300/80 block">Secured via Razorpay</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
              <span className="text-amber-400 font-bold text-[11px] block">Balance at Handover</span>
              <p className="text-xl font-black text-[#c88d18]">₹{balanceDue.toLocaleString("en-IN")}</p>
              <span className="text-[10px] text-amber-200/80 block">UPI / Card at Station Hub</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="h-4 w-4" /> Zero Security Deposit Policy Guaranteed
            </span>
            <span className="text-slate-400 text-[11px]">
              No credit card pre-auth locks or hidden deposits
            </span>
          </div>

          {/* Section D: Direct Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <Button
              onClick={handleWhatsAppShare}
              className="h-12 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <MessageSquare className="h-4 w-4 text-slate-950" /> Save Pass on WhatsApp
            </Button>

            <Button
              onClick={() => setShowInvoiceModal(true)}
              className="h-12 rounded-2xl bg-gradient-to-r from-[#0e1c31] to-[#0b1426] hover:from-[#13233c] hover:to-[#0e1c31] text-white border border-[#c88d18]/60 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <FileText className="h-4 w-4 text-[#c88d18]" /> View GST Tax Invoice
            </Button>

            <Button
              onClick={handleSendEmail}
              disabled={emailSending}
              className="h-12 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Mail className="h-4 w-4 text-[#c88d18]" />
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
      <div className="w-full rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] p-6 sm:p-8 space-y-4 text-white shadow-xl">
        <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c88d18]" /> What Happens Next • 3 Easy Steps
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-[#070e1c]/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[#c88d18]/20 text-[#c88d18] font-black flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-white">Reach Station Hub</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Arrive at the pickup hub at your scheduled time ({pickupInfo.time}).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070e1c]/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[#c88d18]/20 text-[#c88d18] font-black flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-white">Present Driving License</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Show your original Driving License and Key PIN ({keyPin}) to the hub executive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070e1c]/80 border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-[#c88d18]/20 text-[#c88d18] font-black flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-white">Collect Key & Drive</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Do a quick 60-second walkaround checklist and drive away with 100% peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Bottom Navigation CTAs */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-[#c88d18]/25 hover:brightness-105 active:scale-95 transition-all"
        >
          View in My Bookings Dashboard <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          onClick={onGoHome}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl border-slate-700 bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs transition-colors"
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
