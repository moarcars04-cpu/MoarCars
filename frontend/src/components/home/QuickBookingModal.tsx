import React, { useState } from "react";
import {
  X,
  CalendarDays,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Tag,
  CreditCard,
  QrCode,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../context/AuthContext";
import { getTodayDateStr, getFutureDateStr } from "@/lib/dateUtils";

interface QuickBookingModalProps {
  car: any;
  pickup?: string;
  startDate?: string;
  endDate?: string;
  searchParams?: any;
  onClose: () => void;
  onBookingSuccess?: (bookingId: number) => void;
  onNavigate?: (path: string, state?: any) => void;
}

export const QuickBookingModal: React.FC<QuickBookingModalProps> = ({
  car,
  pickup,
  startDate,
  endDate,
  searchParams,
  onClose,
  onBookingSuccess,
  onNavigate,
}) => {
  const { user, openAuthModal } = useAuth();

  const finalPickup = pickup || searchParams?.pickup || "Tirupati Central Hub (Station)";
  const finalStartDate = startDate || searchParams?.startDate || getTodayDateStr();
  const finalEndDate = endDate || searchParams?.endDate || getFutureDateStr(2);

  const [customerName, setCustomerName] = useState(user?.name || "");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "");
  const [couponCode, setCouponCode] = useState("PILGRIM10");
  const [appliedDiscount, setAppliedDiscount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [isBooking, setIsBooking] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const basePricePerDay = car?.pricePerDay || 1999;
  const days = 2; // Default 2-day calculation
  const rentalAmount = basePricePerDay * days;
  const gstAmount = Math.round((rentalAmount - appliedDiscount) * 0.18);
  const securityDeposit = car?.securityDeposit || 3000;
  const totalPayable = rentalAmount - appliedDiscount + gstAmount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PILGRIM10" || couponCode.toUpperCase() === "MOAR500") {
      setAppliedDiscount(500);
      setErrorMsg("");
    } else {
      setErrorMsg("Invalid coupon code. Try 'PILGRIM10' or 'MOAR500'");
    }
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !customerEmail) {
      setErrorMsg("Please fill in your contact details.");
      return;
    }

    setIsBooking(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup: finalPickup,
          startDate: finalStartDate,
          endDate: finalEndDate,
          carName: car.name,
          bookingType: "Self Drive",
          status: "Confirmed",
          customerName,
          customerPhone,
          customerEmail,
          amount: totalPayable,
          securityDeposit,
          couponCode: appliedDiscount > 0 ? couponCode : null,
          discountAmount: appliedDiscount,
          taxAmount: gstAmount,
          paymentMethod,
          paymentStatus: "Paid",
          bookingSource: "Web Portal",
        }),
      });

      const data = await res.json();
      setIsBooking(false);

      if (data.success) {
        if (onBookingSuccess) {
          onBookingSuccess(data.data?.id || 1001);
        } else if (onNavigate) {
          onClose();
          onNavigate("/dashboard");
        } else {
          onClose();
        }
      } else {
        setErrorMsg(data.message || "Failed to submit booking.");
      }
    } catch (err: any) {
      setIsBooking(false);
      setErrorMsg("Network error. Please try again.");
    }
  };

  const handleProceedToAuth = (tab: "login" | "register") => {
    const payload = {
      car,
      pickup: finalPickup,
      startDate: finalStartDate,
      endDate: finalEndDate,
      rentalDays: days,
      amount: totalPayable,
    };
    sessionStorage.setItem("moar_pending_checkout", JSON.stringify(payload));
    onClose();
    openAuthModal(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-amber-500/30 p-6 text-white space-y-5 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-brand-gold font-bold text-xs">
              M
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Instant Rental Checkout</h3>
              <p className="text-[10px] text-brand-gold font-semibold">{car?.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* AUTH GATE: If user is not logged in, prompt sign in or sign up */}
        {!user ? (
          <div className="p-6 text-center space-y-5 bg-slate-950/80 rounded-2xl border border-white/10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c88d18]/20 border border-[#c88d18]/40 text-[#c88d18]">
              <Sparkles className="h-7 w-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-white">
                Sign In to Reserve {car?.name || "Vehicle"}
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                To guarantee secure vehicle handover, Ghat Road insurance clearance & instant booking, please sign in or create your profile.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto pt-2">
              <Button
                onClick={() => handleProceedToAuth("login")}
                className="h-11 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs"
              >
                Existing User (Sign In)
              </Button>
              <Button
                onClick={() => handleProceedToAuth("register")}
                className="h-11 rounded-xl bg-[#c88d18] hover:bg-[#b07b14] text-white font-bold text-xs shadow-lg shadow-[#c88d18]/20"
              >
                New User (Create Profile)
              </Button>
            </div>

            <p className="text-[11px] text-slate-400">
              ⚡ Instant 6-digit email OTP verification • ₹250 welcome bonus credited on registration
            </p>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-semibold text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmBooking} className="space-y-4 overflow-y-auto pr-1">
          {/* Trip Summary Card */}
          <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 space-y-2 text-xs">
            <div className="flex items-center justify-between font-bold text-white">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-gold" /> {finalPickup}
              </span>
              <span className="flex items-center gap-1.5 text-white/70">
                <CalendarDays className="h-4 w-4 text-brand-teal" /> {finalStartDate} to {finalEndDate} (2 Days)
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              Driver & Contact Details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-white/50 mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Ramesh Reddy"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/50 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-white/50 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-xs font-semibold text-white focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Coupon Code Engine */}
          <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3.5 space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-gold">
              Apply Promo Code / Coupon
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="e.g. PILGRIM10"
                className="flex-1 rounded-xl border border-amber-500/30 bg-slate-950 px-3 py-1.5 text-xs font-bold text-brand-gold uppercase focus:border-brand-gold focus:outline-none"
              />
              <Button
                type="button"
                onClick={handleApplyCoupon}
                className="h-8 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
              >
                Apply
              </Button>
            </div>
            {appliedDiscount > 0 && (
              <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> ₹{appliedDiscount} Flat Pilgrimage Discount Applied!
              </p>
            )}
          </div>

          {/* Pricing Breakdown */}
          <div className="rounded-2xl bg-slate-950/80 border border-white/10 p-4 space-y-2 text-xs">
            <div className="flex justify-between text-white/70">
              <span>Rental Charges (2 Days @ ₹{basePricePerDay}/day)</span>
              <span>₹{rentalAmount.toLocaleString("en-IN")}</span>
            </div>
            {appliedDiscount > 0 && (
              <div className="flex justify-between text-emerald-400 font-semibold">
                <span>Promo Discount</span>
                <span>- ₹{appliedDiscount}</span>
              </div>
            )}
            <div className="flex justify-between text-white/70">
              <span>GST (18% Tourism Tax)</span>
              <span>₹{gstAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Security Deposit (Refundable on Key Return)</span>
              <span className="text-emerald-400 font-bold">₹{securityDeposit.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between font-black text-base text-brand-gold pt-2 border-t border-white/10">
              <span>Total Payable Now</span>
              <span>₹{totalPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment Gateway Mode */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              Select Payment Method
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("UPI")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === "UPI"
                    ? "border-brand-gold bg-amber-500/20 text-brand-gold"
                    : "border-white/10 bg-slate-950 text-white/70"
                }`}
              >
                <QrCode className="h-4 w-4" /> Google Pay / PhonePe UPI
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("Card")}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  paymentMethod === "Card"
                    ? "border-brand-gold bg-amber-500/20 text-brand-gold"
                    : "border-white/10 bg-slate-950 text-white/70"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Credit / Debit Card
              </button>
            </div>
          </div>

            <Button
              type="submit"
              disabled={isBooking}
              className="w-full h-12 rounded-2xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wider hover:bg-brand-gold-soft shadow-xl shadow-amber-900/30 flex items-center justify-center gap-2"
            >
              {isBooking ? "Confirming Booking..." : `Pay ₹${totalPayable.toLocaleString("en-IN")} & Confirm Reservation`}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </>
        )}
      </div>
    </div>
  );
};
