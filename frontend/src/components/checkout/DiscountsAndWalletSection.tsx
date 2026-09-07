import React, { useState } from "react";
import {
  Wallet,
  Coins,
  Gift,
  Tag,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscountsAndWalletSectionProps {
  userWalletBalance: number;
  userRewardPoints: number;
  subtotal: number;
  useWallet: boolean;
  onToggleWallet: (val: boolean) => void;
  useRewards: boolean;
  onToggleRewards: (val: boolean) => void;
  appliedCoupon: { code: string; percent: number; discount: number } | null;
  onApplyCoupon: (code: string) => void;
  onRemoveCoupon: () => void;
  referralDiscount: number;
  onApplyReferral: (code: string) => boolean;
  onRemoveReferral: () => void;
}

export const DiscountsAndWalletSection: React.FC<DiscountsAndWalletSectionProps> = ({
  userWalletBalance,
  userRewardPoints,
  subtotal,
  useWallet,
  onToggleWallet,
  useRewards,
  onToggleRewards,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  referralDiscount,
  onApplyReferral,
  onRemoveReferral,
}) => {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [referralInput, setReferralInput] = useState("");
  const [referralError, setReferralError] = useState("");
  const [referralSuccess, setReferralSuccess] = useState(false);

  // Quick Promo Chips
  const popularCoupons = [
    { code: "PILGRIM10", desc: "10% Flat OFF (Darshan Special)" },
    { code: "WEEKEND20", desc: "20% OFF (3+ Days Getaway)" },
    { code: "CORP2026", desc: "15% OFF (VIP & Corporate)" },
  ];

  const handleCouponSubmit = () => {
    setCouponError("");
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setCouponError("Please enter a valid coupon code.");
      return;
    }
    if (code === "PILGRIM10" || code === "WEEKEND20" || code === "CORP2026") {
      onApplyCoupon(code);
      setCouponInput("");
    } else {
      setCouponError("Invalid promo code. Check spelling or select below.");
    }
  };

  const handleReferralSubmit = () => {
    setReferralError("");
    const code = referralInput.trim().toUpperCase();
    if (!code) {
      setReferralError("Enter a friend's referral code.");
      return;
    }
    const success = onApplyReferral(code);
    if (success) {
      setReferralSuccess(true);
      setReferralInput("");
    } else {
      setReferralError("Invalid referral code. Try 'MOARFRIEND' or 'TIRUPATI2026'.");
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-gold" /> Offers, Wallet & Loyalty Perks
        </h3>
        <span className="text-xs text-brand-teal font-bold">Stackable Discounts</span>
      </div>

      <div className="space-y-4">
        {/* 1. Moar In-App Wallet */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
            useWallet ? "bg-brand-teal/5 border-brand-teal ring-1 ring-brand-teal" : "bg-card border-border"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Use Moar Wallet Balance</h4>
              <p className="text-xs text-muted-foreground">
                Available: <span className="font-bold text-brand-navy">₹{userWalletBalance.toLocaleString("en-IN")}</span>
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useWallet}
              disabled={userWalletBalance <= 0}
              onChange={(e) => onToggleWallet(e.target.checked)}
              className="h-4 w-4 rounded text-brand-teal focus:ring-0 accent-brand-teal"
            />
            <span className="text-xs font-bold text-brand-navy">
              {useWallet ? "Applied" : "Apply"}
            </span>
          </label>
        </div>

        {/* 2. Reward Points / Moar Coins */}
        <div
          className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
            useRewards ? "bg-brand-gold/10 border-brand-gold ring-1 ring-brand-gold" : "bg-card border-border"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-gold/20 text-brand-navy flex items-center justify-center shrink-0">
              <Coins className="h-5 w-5 text-brand-gold" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-brand-navy">Redeem Moar Club Points</h4>
              <p className="text-xs text-muted-foreground">
                Available: <span className="font-bold text-brand-navy">{userRewardPoints} Points</span> (₹{Math.round(userRewardPoints * 0.2)} Value)
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useRewards}
              disabled={userRewardPoints < 100}
              onChange={(e) => onToggleRewards(e.target.checked)}
              className="h-4 w-4 rounded text-brand-teal focus:ring-0 accent-brand-teal"
            />
            <span className="text-xs font-bold text-brand-navy">
              {useRewards ? "Redeemed" : "Redeem"}
            </span>
          </label>
        </div>

        {/* 3. Coupon Promo Engine */}
        <div className="p-4 rounded-2xl bg-brand-mist/40 border border-border space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
            <Tag className="h-4 w-4 text-brand-teal" />
            <span>Apply Coupon Code</span>
          </div>

          {!appliedCoupon ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Coupon (e.g. PILGRIM10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-card border border-border text-xs uppercase font-bold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                />
                <Button
                  size="sm"
                  onClick={handleCouponSubmit}
                  className="rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white font-bold text-xs px-4"
                >
                  Apply
                </Button>
              </div>

              {couponError && <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>}

              {/* Quick Chip Suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {popularCoupons.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      onApplyCoupon(c.code);
                      setCouponError("");
                    }}
                    className="px-2.5 py-1 rounded-lg bg-card border border-border/80 text-[10px] font-bold text-brand-teal hover:border-brand-teal transition-colors"
                  >
                    🏷️ {c.code} ({c.desc})
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {appliedCoupon.code} Applied ({appliedCoupon.percent}% OFF: -₹{appliedCoupon.discount.toLocaleString("en-IN")})
                </span>
              </div>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        {/* 4. Referral Code */}
        <div className="p-4 rounded-2xl bg-brand-mist/40 border border-border space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-navy">
            <Gift className="h-4 w-4 text-brand-gold" />
            <span>Have a Referral Code?</span>
          </div>

          {referralDiscount === 0 ? (
            <div className="space-y-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Referral Code"
                  value={referralInput}
                  onChange={(e) => setReferralInput(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl bg-card border border-border text-xs uppercase font-bold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReferralSubmit}
                  className="rounded-xl border-brand-teal text-brand-teal font-bold text-xs px-4 hover:bg-brand-teal hover:text-white"
                >
                  Verify
                </Button>
              </div>
              {referralError && <p className="text-[11px] text-rose-500 font-medium">{referralError}</p>}
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-700">
              <div className="flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Referral Bonus Applied (-₹{referralDiscount.toLocaleString("en-IN")})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  onRemoveReferral();
                  setReferralSuccess(false);
                }}
                className="text-[11px] font-bold text-rose-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
