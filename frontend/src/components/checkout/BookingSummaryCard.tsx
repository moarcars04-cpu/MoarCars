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
  gstAmount: number;
  securityDeposit: number;
  grandTotal: number;
  paymentMode?: string;
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
  gstAmount,
  securityDeposit,
  grandTotal,
  paymentMode,
}) => {
  const isSplit = paymentMode === "split";
  const advanceAmount = isSplit ? Math.round(grandTotal * 0.2) : grandTotal;
  const balanceAmount = isSplit ? grandTotal - advanceAmount : 0;

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
      {/* Card Header: Vehicle Snapshot */}
      <div className="flex gap-4 items-start border-b border-border pb-5">
        <div className="relative h-20 w-28 rounded-2xl overflow-hidden bg-brand-navy shrink-0 border border-border">
          <img
            src={car.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80"}
            alt={car.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-brand-gold text-brand-navy text-[9px] font-black uppercase tracking-wider">
              {car.tag || car.category || "Premium"}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
              <ShieldCheck className="h-3 w-3" /> Ghat Certified
            </span>
          </div>
          <h3 className="text-base font-black text-brand-navy leading-tight">{car.name}</h3>
          <p className="text-xs text-muted-foreground">{car.variant || "Self-Drive Fleet Edition"}</p>

          <div className="flex items-center gap-3 text-[11px] text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-brand-teal" /> {car.seats || 5} Seats
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-3 w-3 text-brand-teal" /> {car.fuelType || "Petrol"}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-3 w-3 text-brand-teal" /> {car.transmission || "Automatic"}
            </span>
          </div>
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-brand-navy">
          <span>Trip Timeline</span>
          <span className="text-brand-teal">
            {rentalDays} {rentalDays === 1 ? "Day" : "Days"} ({rentalDays * 24} Hours)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-brand-mist/50 border border-border">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Calendar className="h-3 w-3 text-brand-teal" /> Pickup
            </span>
            <p className="text-xs font-bold text-brand-navy">{startDate}</p>
            <p className="text-[11px] text-muted-foreground">{startTime}</p>
            <p className="text-[10px] text-brand-teal font-medium truncate" title={pickupLocation}>
              📍 {pickupLocation}
            </p>
          </div>

          <div className="space-y-1 sm:border-l sm:border-border sm:pl-3">
            <span className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
              <Clock className="h-3 w-3 text-brand-teal" /> Return
            </span>
            <p className="text-xs font-bold text-brand-navy">{endDate}</p>
            <p className="text-[11px] text-muted-foreground">{endTime}</p>
            <p className="text-[10px] text-brand-teal font-medium truncate" title={dropLocation}>
              📍 {dropLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>Booking Mode:</span>
          <span className="font-bold text-brand-navy">
            {withDriver ? "Chauffeur Driven (Temple VIP)" : "Self Drive (Unlimited KM)"}
          </span>
        </div>
      </div>

      {/* Itemized Price Breakdown */}
      <div className="space-y-2.5 pt-3 border-t border-border text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Base Tariff ({rentalDays} Days)</span>
          <span className="font-semibold text-brand-navy">₹{baseFare.toLocaleString("en-IN")}</span>
        </div>

        {deliveryFee > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Express Doorstep Delivery</span>
            <span className="font-semibold text-brand-navy">₹{deliveryFee}</span>
          </div>
        )}

        {driverFee > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>VIP Chauffeur Service ({rentalDays} Days)</span>
            <span className="font-semibold text-brand-navy">₹{driverFee.toLocaleString("en-IN")}</span>
          </div>
        )}

        {extrasTotal > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>
              Trip Add-ons ({selectedExtras.join(", ") || "Selected Extras"})
            </span>
            <span className="font-semibold text-brand-navy">₹{extrasTotal.toLocaleString("en-IN")}</span>
          </div>
        )}

        {/* Discounts */}
        {couponDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-500/10 p-1.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> Coupon ({couponCode})
            </span>
            <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        {walletDeduction > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-500/10 p-1.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Wallet className="h-3.5 w-3.5" /> Moar Wallet Balance
            </span>
            <span>-₹{walletDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {rewardDeduction > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-500/10 p-1.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Coins className="h-3.5 w-3.5" /> Reward Points Redeemed
            </span>
            <span>-₹{rewardDeduction.toLocaleString("en-IN")}</span>
          </div>
        )}

        {referralDiscount > 0 && (
          <div className="flex justify-between text-emerald-600 font-bold bg-emerald-500/10 p-1.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Gift className="h-3.5 w-3.5" /> Referral Discount
            </span>
            <span>-₹{referralDiscount.toLocaleString("en-IN")}</span>
          </div>
        )}

        <div className="flex justify-between text-muted-foreground">
          <span>Taxes & GST (18%)</span>
          <span className="font-semibold text-brand-navy">₹{gstAmount.toLocaleString("en-IN")}</span>
        </div>

        <div className="flex justify-between text-brand-teal font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" /> Refundable Security Deposit
          </span>
          <span>₹{securityDeposit.toLocaleString("en-IN")}</span>
        </div>

        {/* Grand Total */}
        <div className="pt-3 border-t border-border flex items-center justify-between text-base font-black text-brand-navy">
          <span>Total Booking Amount</span>
          <span className="text-xl text-brand-teal">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>

        {/* Split Payment Highlights (if selected) */}
        {isSplit && (
          <div className="p-3 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 space-y-1 text-xs">
            <div className="flex justify-between font-bold text-brand-teal">
              <span>Pay 20% Advance Now:</span>
              <span>₹{advanceAmount.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-muted-foreground text-[11px]">
              <span>Pay 80% Balance at Car Pickup:</span>
              <span>₹{balanceAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2-Hour Refund Guarantee Note */}
      <div className="p-3 rounded-2xl bg-brand-mist/60 border border-border flex items-center gap-2.5 text-xs text-muted-foreground">
        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
        <span>
          Security deposit is 100% refunded to your original payment method / UPI within 2 hours after return.
        </span>
      </div>
    </div>
  );
};
