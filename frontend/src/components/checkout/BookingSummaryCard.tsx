import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Fuel,
  Gauge,
  Users,
  Car,
  Sparkles,
  Tag,
  Wallet,
  Gift,
  Coins,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface BookingSummaryCardProps {
  car: any;
  pickupLocation: string;
  dropLocation: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  rentalDays: number;
  withDriver: boolean;
  deliveryMode: "hub" | "doorstep";
  baseFare: number;
  deliveryFee: number;
  driverFee: number;
  extrasTotal: number;
  selectedExtras: string[];
  couponDiscount: number;
  couponCode?: string;
  walletDeduction: number;
  rewardDeduction: number;
  referralDiscount: number;
  gstRate?: number;
  gstAmount: number;
  securityDeposit: number;
  grandTotal: number;
  paymentMode?: string;
  advancePaymentPercent?: number;
  payableNow?: number;
  balanceDue?: number;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  car,
  pickupLocation,
  dropLocation,
  startDate,
  startTime,
  endDate,
  endTime,
  rentalDays,
  withDriver,
  deliveryMode,
  baseFare,
  deliveryFee,
  driverFee,
  extrasTotal,
  selectedExtras,
  couponDiscount,
  couponCode,
  walletDeduction,
  rewardDeduction,
  referralDiscount,
  gstRate = 18,
  gstAmount,
  securityDeposit,
  grandTotal,
  paymentMode,
  advancePaymentPercent = 10,
  payableNow,
  balanceDue,
}) => {
  const isSplit = paymentMode === "split" || (balanceDue !== undefined && balanceDue > 0);
  const finalPayableNow = payableNow !== undefined ? payableNow : (isSplit ? Math.round(grandTotal * 0.1) : grandTotal);
  const finalBalanceDue = balanceDue !== undefined ? balanceDue : Math.max(0, grandTotal - finalPayableNow);
  const displayAdvancePercent = advancePaymentPercent || 10;

  const defaultCarImage =
    car?.image ||
    car?.galleryImages?.[0] ||
    "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5 text-slate-900 w-full min-w-0 max-w-full overflow-hidden">
      {/* 1. Header: Vehicle Card (Mobile stacked banner, Tablet/Desktop side-by-side) */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start pb-4 border-b border-slate-200 min-w-0 w-full">
        {/* Car Image Preview */}
        <div className="relative w-full sm:w-32 h-44 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-2xs group">
          <img
            src={defaultCarImage}
            alt={car?.name || "Vehicle"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
          {/* Mobile Overlay Badges on Image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-wrap items-center gap-1.5 sm:hidden">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
              {car?.tag || car?.category || "Self Drive"}
            </span>
            <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-950/85 backdrop-blur-md border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3 text-emerald-400" /> Ghat Certified
            </span>
          </div>
        </div>

        {/* Vehicle Metadata & Specs */}
        <div className="flex-1 min-w-0 w-full space-y-1.5">
          {/* Desktop/Tablet Badges */}
          <div className="hidden sm:flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
              {car?.tag || car?.category || "Self Drive"}
            </span>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200">
              <ShieldCheck className="h-3 w-3 text-emerald-600" /> Ghat Certified
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-tight break-words">
            {car?.name || "Self-Drive Vehicle"}
          </h3>
          <p className="text-[11px] text-slate-500 truncate">
            {car?.variant || "Tirupati Self-Drive Fleet Edition"}
          </p>

          {/* Specs Pills (Cleanly wraps on any screen width) */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 pt-0.5">
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap">
              <Users className="h-3 w-3 text-[#b57d14]" /> {car?.seats || 5} Seats
            </span>
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap">
              <Fuel className="h-3 w-3 text-[#b57d14]" /> {car?.fuelType || "Petrol"}
            </span>
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 whitespace-nowrap">
              <Gauge className="h-3 w-3 text-[#b57d14]" /> {car?.transmission || "Automatic"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Trip Timeline (Itinerary) */}
      <div className="space-y-2.5 min-w-0 w-full">
        <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs font-bold text-slate-700">
          <span className="flex items-center gap-1.5 text-slate-900">
            <Calendar className="h-3.5 w-3.5 text-[#b57d14]" /> Reserved Itinerary
          </span>
          <span className="text-[#b57d14] font-mono text-[11px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 whitespace-nowrap font-bold">
            {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24}h)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 min-w-0">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pickup
            </div>
            <p className="text-xs font-black text-slate-900">{startDate}</p>
            <p className="text-[11px] text-slate-600 font-mono">{startTime}</p>
            <p className="text-[10px] text-slate-600 font-medium truncate" title={pickupLocation}>
              📍 {pickupLocation}
            </p>
          </div>

          <div className="space-y-1 min-w-0 sm:border-l sm:border-slate-200 sm:pl-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Return
            </div>
            <p className="text-xs font-black text-slate-900">{endDate}</p>
            <p className="text-[11px] text-slate-600 font-mono">{endTime}</p>
            <p className="text-[10px] text-slate-600 font-medium truncate" title={dropLocation}>
              📍 {dropLocation}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-600 px-1">
          <span>Booking Mode:</span>
          <span className="font-bold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Self Drive (Unlimited KM)
          </span>
        </div>
      </div>

      {/* 3. Itemized Tariff Breakdown */}
      <div className="space-y-2 pt-3 border-t border-slate-200 text-xs min-w-0 w-full">
        <div className="flex justify-between text-slate-600">
          <span>Base Tariff ({rentalDays} Days)</span>
          <span className="font-bold text-slate-900">₹{baseFare.toLocaleString("en-IN")}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Express Doorstep Delivery</span>
            <span className="font-bold text-slate-900">₹{deliveryFee.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Discounts */}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <span className="flex items-center gap-1.5 truncate">
              <Tag className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Promo ({couponCode})
            </span>
            <span className="shrink-0">-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {walletDeduction > 0 && (
          <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Wallet Balance
            </span>
            <span className="shrink-0">-₹{walletDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {rewardDeduction > 0 && (
          <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <span className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Reward Points
            </span>
            <span className="shrink-0">-₹{rewardDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {referralDiscount > 0 && (
          <div className="flex justify-between text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200">
            <span className="flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-emerald-600 shrink-0" /> Referral Discount
            </span>
            <span className="shrink-0">-₹{referralDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-600">
          <span>Taxes & GST ({gstRate}%)</span>
          <span className="font-bold text-slate-900">₹{gstAmount.toLocaleString("en-IN")}</span>
        </div>

        {/* Total Grand Amount */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
          <span>Total Rental Fare</span>
          <span className="text-xl sm:text-2xl text-emerald-700 font-black">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* 4. Luxury Advance Payment Callout Box */}
        {finalBalanceDue > 0 ? (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/70 border-2 border-amber-300 space-y-2 text-xs shadow-xs min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-1 font-black text-slate-900">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#b57d14] shrink-0" />
                <span className="text-[11px] sm:text-xs">Pay {displayAdvancePercent}% Advance Online:</span>
              </span>
              <span className="text-base sm:text-xl text-amber-800 font-black">
                ₹{finalPayableNow.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-slate-700 font-semibold text-[10px] sm:text-[11px] pt-1.5 border-t border-amber-300/80">
              <span>Balance at Handover:</span>
              <span className="text-slate-900 font-bold">₹{finalBalanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <span>Payment Mode:</span>
            <span>100% Full Payment Online</span>
          </div>
        )}
      </div>

      {/* 5. Verified Reservation Note */}
      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-[10px] sm:text-[11px] text-slate-600 min-w-0">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          Instant booking confirmed with <strong className="text-slate-900">{displayAdvancePercent}%</strong> advance. Balance payable at vehicle handover.
        </span>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
