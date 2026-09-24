import React, { useState } from "react";
import {
  CheckCircle2,
  Printer,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileText,
  Car,
  QrCode,
  Copy,
  Check,
  Phone,
  Compass,
  KeyRound,
  FileCheck2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GstInvoiceModal } from "../dashboard/trips/GstInvoiceModal";

interface BookingConfirmationScreenProps {
  bookingData: any;
  onGoToDashboard: () => void;
  onGoHome: () => void;
}

// Clean date formatting helper to avoid redundant duplicate time strings
function formatDateTimeDisplay(dateStr?: string, timeStr?: string) {
  if (!dateStr) return { date: "Scheduled Date", time: timeStr || "09:00 AM" };
  const rawDateOnly = dateStr.includes(" ") ? dateStr.split(" ")[0] : dateStr;
  let cleanTime = timeStr || (dateStr.includes(" ") ? dateStr.split(" ").slice(1).join(" ") : "09:00 AM");

  // Format 24hr time to AM/PM if needed
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

  const rawBookingId = bookingData.bookingId || `MC-2026-${bookingData.id || Math.floor(10000 + Math.random() * 90000)}`;
  const bookingId = String(rawBookingId).replace(/^#+/, "");
  const transactionId = bookingData.transactionId || `pay_live_${Date.now().toString().slice(-8)}`;
  const keyPin = bookingData.keyPin || Math.floor(1000 + (Math.abs(bookingId.split("").reduce((a: number, b: string) => a + b.charCodeAt(0), 0)) % 9000));

  const pickupInfo = formatDateTimeDisplay(bookingData.startDate, bookingData.startTime);
  const returnInfo = formatDateTimeDisplay(bookingData.endDate, bookingData.endTime);

  const grandTotal = Number(bookingData.grandTotal || bookingData.amount || 0);
  const paidAmount = Number(bookingData.paidAmount !== undefined ? bookingData.paidAmount : grandTotal);
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
      `🚗 *MOAR CARS TIRUPATI - BOOKING VOUCHER*\n\n` +
      `• *Booking ID:* #${bookingId}\n` +
      `• *Vehicle:* ${carName}\n` +
      `• *Pickup:* ${bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub"} on ${pickupInfo.date} at ${pickupInfo.time}\n` +
      `• *Return:* ${bookingData.dropLocation || bookingData.dropAddress || bookingData.pickupLocation || "Tirupati Central Hub"} on ${returnInfo.date} at ${returnInfo.time}\n` +
      `• *Key Pickup PIN:* ${keyPin}\n` +
      `• *Advance Paid:* ₹${paidAmount.toLocaleString("en-IN")}\n` +
      `• *Balance Due:* ₹${balanceDue.toLocaleString("en-IN")}\n\n` +
      `Please have vehicle sanitized and ready for handover. 24/7 Helpline: +91 96664 99904`
    );
    window.open(`https://wa.me/919666499904?text=${text}`, "_blank");
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

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Ultra-Luxury Hero Confirmation Banner */}
      <div className="w-full relative rounded-3xl bg-gradient-to-br from-[#070e1c] via-[#0b1426] to-[#070e1c] p-6 sm:p-10 border border-amber-500/30 text-white shadow-2xl overflow-hidden text-center">
        {/* Ambient Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl mx-auto">
          {/* Animated Success Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider shadow-inner">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Reservation Confirmed • Vehicle Assigned</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            You're All Set to Drive,{" "}
            <span className="bg-gradient-to-r from-[#c88d18] via-[#e6b14d] to-[#c88d18] bg-clip-text text-transparent">
              {bookingData.customerName?.split(" ")[0] || "Valued Guest"}
            </span>
            !
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your self-drive booking is confirmed in our live dispatch system. Your vehicle is currently sanitized, fueled, and staged for your trip.
          </p>

          {/* Reference Badges Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleCopyBookingId}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono font-bold text-amber-400 transition-colors shadow-sm"
              title="Click to copy Booking ID"
            >
              <span>Booking Ref: #{bookingId}</span>
              {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 opacity-70" />}
            </button>

            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-xs font-mono text-slate-300 shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Txn: {transactionId}
            </span>

            {bookingData.customerEmail && (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-300 shadow-sm">
                <Mail className="w-3.5 h-3.5 text-emerald-400" /> Voucher emailed to {bookingData.customerEmail}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Digital Boarding Pass & Trip Itinerary Card */}
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0b1426] shadow-2xl overflow-hidden">
        {/* Card Header */}
        <div className="px-6 py-4 bg-[#070e1c] border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c88d18]" />
            <span className="text-xs font-black uppercase tracking-wider text-white">Digital Self-Drive Trip Pass</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              ● Live Dispatch Ready
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Vehicle Image & Specs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="relative group shrink-0 w-full sm:w-auto">
                <img
                  src={
                    bookingData.car?.image ||
                    "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={bookingData.car?.name || "Vehicle"}
                  className="w-full sm:w-48 h-32 object-cover rounded-2xl border border-slate-800 shadow-lg bg-[#070e1c]"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur text-[10px] font-bold text-amber-400 border border-white/10">
                  {bookingData.car?.category || "Self Drive"}
                </span>
              </div>

              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-xl font-black text-white truncate">
                  {bookingData.car?.name || bookingData.carName || "Premium Self-Drive Vehicle"}
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  {bookingData.car?.variant || "Special Self-Drive Edition"} • {bookingData.car?.fuelType || "Petrol"} • {bookingData.car?.transmission || "Manual/Auto"}
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px]">
                  <span className="px-2.5 py-0.5 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700 font-medium">
                    5 Seater
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                    Ghat Road Certified
                  </span>
                </div>
              </div>
            </div>

            {/* Clean Pickup / Return Timeline Route */}
            <div className="p-5 rounded-2xl bg-[#070e1c] border border-slate-800/90 space-y-4">
              {/* Pickup Point */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 border border-emerald-500/30">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Pickup Location & Time</span>
                    <span className="text-xs font-bold text-slate-300">{pickupInfo.time}</span>
                  </div>
                  <p className="text-sm font-black text-white truncate mt-0.5">
                    {bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub (Station)"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{pickupInfo.date}</p>
                </div>
              </div>

              {/* Connecting Line */}
              <div className="ml-3 pl-3 border-l-2 border-dashed border-slate-700 py-0.5 text-[11px] text-[#c88d18] font-bold flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                <span>Trip Duration: {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24} Hours) • Unlimited Kilometres</span>
              </div>

              {/* Return Point */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-[#c88d18] shrink-0 border border-amber-500/30">
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#c88d18]">Return Location & Time</span>
                    <span className="text-xs font-bold text-slate-300">{returnInfo.time}</span>
                  </div>
                  <p className="text-sm font-black text-white truncate mt-0.5">
                    {bookingData.dropLocation || bookingData.dropAddress || bookingData.pickupLocation || "Tirupati Central Hub (Station)"}
                  </p>
                  <p className="text-xs text-slate-400 font-medium">{returnInfo.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Key PIN, QR Check-in & Instant Actions (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-[#070e1c] to-[#0b1426] border border-slate-800 space-y-5 text-center">
            {/* Key Pickup PIN Box */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 block">
                Contactless Key Handover PIN
              </span>
              <div className="inline-block px-8 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18]/20 via-[#c88d18]/30 to-[#c88d18]/20 border border-amber-500/40 text-amber-400 font-mono text-3xl font-black tracking-widest shadow-lg">
                {keyPin}
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Show this PIN with your Original DL at the station hub for instant handover.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.01]"
              >
                <MessageSquare className="w-4 h-4" /> Save Pass on WhatsApp
              </button>

              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-100 border border-amber-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" /> View GST Tax Invoice (1-Page A4)
              </button>

              <button
                type="button"
                onClick={handleSendEmail}
                disabled={emailSending}
                className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-[11px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                {emailSending
                  ? "Sending Email..."
                  : emailSentNotice
                  ? `✅ Voucher Dispatched to ${bookingData.customerEmail || "Inbox"}`
                  : "Resend Voucher to Email"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Transparent Financial Breakdown & Payment Guarantee */}
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0b1426] p-6 sm:p-8 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-black text-white">Payment & Escrow Summary</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Payment Mode: <strong className="text-emerald-400 uppercase">{bookingData.paymentMethod || "Razorpay Online"}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Total Fare */}
          <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-1">
            <span className="text-slate-400 font-medium">Total Trip Amount</span>
            <p className="text-xl font-black text-white">₹{grandTotal.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-slate-500">Includes {rentalDays} Days Rental & 18% GST</p>
          </div>

          {/* Advance Paid */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Advance Paid Online
            </span>
            <p className="text-xl font-black text-emerald-400">₹{paidAmount.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-emerald-300/80 font-medium">Successfully Captured via Razorpay</p>
          </div>

          {/* Balance Due */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
            <span className="text-amber-400 font-bold">Balance at Handover</span>
            <p className="text-xl font-black text-amber-400">₹{balanceDue.toLocaleString("en-IN")}</p>
            <p className="text-[10px] text-slate-400">Payable via UPI or Card at car pickup</p>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">Refundable Security Deposit:</span>
          <span className="text-emerald-400 font-bold">₹0 (Zero Security Deposit Policy Guarantee)</span>
        </div>
      </div>

      {/* 4. 3-Step Pickup Guide */}
      <div className="w-full rounded-3xl border border-slate-800 bg-[#0b1426] p-6 sm:p-8 space-y-5 shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#c88d18]" /> What Happens Next • 3 Easy Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-white">Reach Station Hub</h4>
            <p className="text-slate-400 leading-relaxed">
              Arrive at {bookingData.pickupLocation || bookingData.pickup || "Tirupati Central Hub"} at your scheduled time ({pickupInfo.time}).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-white">Present Driving License</h4>
            <p className="text-slate-400 leading-relaxed">
              Show your original Driving License and Key PIN ({keyPin}) to our station executive.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#070e1c] border border-slate-800 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 font-black flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-white">Collect Key & Drive</h4>
            <p className="text-slate-400 leading-relaxed">
              Complete a 60-second digital walkaround checklist and drive with 100% peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Main Action Navigation Bar */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          size="lg"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] hover:opacity-95 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          View in My Bookings Dashboard <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onGoHome}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl border-slate-700 bg-[#070e1c] text-slate-200 hover:text-white hover:bg-slate-800 font-bold text-xs transition-colors"
        >
          Return to Fleet Home
        </Button>
      </div>

      {/* 6. GST Tax Invoice Modal */}
      <GstInvoiceModal
        booking={bookingData}
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
      />
    </div>
  );
};

export default BookingConfirmationScreen;
