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
    <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] p-5 sm:p-6 shadow-2xl space-y-5 text-white backdrop-blur-xl">
      {/* 1. Header: Vehicle Card */}
      <div className="flex gap-4 items-start pb-4 border-b border-slate-800/80">
        <div className="relative h-20 w-28 sm:h-24 sm:w-32 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-amber-500/20 shadow-lg group">
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
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-[#d49b29] to-[#c88d18] text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-sm">
              {car?.tag || car?.category || "Self Drive"}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
              <ShieldCheck className="h-3 w-3" /> Ghat Certified
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-black text-white leading-tight truncate">
            {car?.name || "Self-Drive Vehicle"}
          </h3>
          <p className="text-[11px] text-slate-400 truncate">
            {car?.variant || "Tirupati Self-Drive Fleet Edition"}
          </p>

          <div className="flex items-center gap-2.5 text-[10px] sm:text-[11px] text-slate-300 pt-0.5">
            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              <Users className="h-3 w-3 text-[#c88d18]" /> {car?.seats || 5} Seats
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              <Fuel className="h-3 w-3 text-[#c88d18]" /> {car?.fuelType || "Petrol"}
            </span>
            <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
              <Gauge className="h-3 w-3 text-[#c88d18]" /> {car?.transmission || "Automatic"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Trip Timeline (Itinerary) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-[#c88d18]" /> Reserved Itinerary
          </span>
          <span className="text-[#c88d18] font-mono text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24}h)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 p-3 rounded-2xl bg-[#070e1c]/80 border border-slate-800">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Pickup
            </div>
            <p className="text-xs font-black text-white">{startDate}</p>
            <p className="text-[11px] text-slate-400 font-mono">{startTime}</p>
            <p className="text-[10px] text-slate-300 font-medium truncate" title={pickupLocation}>
              📍 {pickupLocation}
            </p>
          </div>

          <div className="space-y-1 min-w-0 border-l border-slate-800/80 pl-2.5">
            <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Return
            </div>
            <p className="text-xs font-black text-white">{endDate}</p>
            <p className="text-[11px] text-slate-400 font-mono">{endTime}</p>
            <p className="text-[10px] text-slate-300 font-medium truncate" title={dropLocation}>
              📍 {dropLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>Booking Mode:</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Self Drive (Unlimited KM)
          </span>
        </div>
      </div>

      {/* 3. Itemized Tariff Breakdown */}
      <div className="space-y-2 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex justify-between text-slate-400">
          <span>Base Tariff ({rentalDays} Days)</span>
          <span className="font-bold text-white">₹{baseFare.toLocaleString("en-IN")}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex justify-between text-slate-400">
            <span>Express Doorstep Delivery</span>
            <span className="font-bold text-white">₹{deliveryFee.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Discounts */}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-emerald-400" /> Promo Code ({couponCode})
            </span>
            <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {walletDeduction > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-1.5">
              <Wallet className="h-3.5 w-3.5 text-emerald-400" /> Wallet Balance
            </span>
            <span>-₹{walletDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {rewardDeduction > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-emerald-400" /> Reward Points
            </span>
            <span>-₹{rewardDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {referralDiscount > 0 && (
          <div className="flex justify-between text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1.5 rounded-xl border border-emerald-500/20">
            <span className="flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-emerald-400" /> Referral Discount
            </span>
            <span>-₹{referralDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-slate-400">
          <span>Taxes & GST ({gstRate}%)</span>
          <span className="font-bold text-white">₹{gstAmount.toLocaleString("en-IN")}</span>
        </div>

        {/* Total Grand Amount */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm sm:text-base font-black text-white">
          <span>Total Rental Fare</span>
          <span className="text-xl sm:text-2xl text-emerald-400 font-black">
            ₹{grandTotal.toLocaleString("en-IN")}
          </span>
        </div>

        {/* 4. Luxury Advance Payment Callout Box */}
        {finalBalanceDue > 0 ? (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/15 via-[#c88d18]/20 to-amber-500/10 border border-amber-400/40 space-y-2 text-xs shadow-lg shadow-amber-500/10">
            <div className="flex items-center justify-between font-black text-white">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#c88d18]" />
                <span>Pay {displayAdvancePercent}% Advance Online Now:</span>
              </span>
              <span className="text-lg sm:text-xl text-[#c88d18] font-black">
                ₹{finalPayableNow.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-300 font-semibold text-[11px] pt-1.5 border-t border-amber-400/20">
              <span>Remaining Balance Payable at Handover:</span>
              <span className="text-white font-bold">₹{finalBalanceDue.toLocaleString("en-IN")}</span>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-between">
            <span>Payment Mode:</span>
            <span>100% Full Payment Online</span>
          </div>
        )}
      </div>

      {/* 5. Verified Reservation Note */}
      <div className="p-3 rounded-2xl bg-[#070e1c]/80 border border-slate-800/90 flex items-center gap-2.5 text-[11px] text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>
          Instant booking confirmed with <strong className="text-white">{displayAdvancePercent}%</strong> online advance. Balance payable at car handover. Zero hidden charges.
        </span>
      </div>
    </div>
  );
};

