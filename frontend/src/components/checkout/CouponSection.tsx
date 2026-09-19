import React, { useState, useEffect } from "react";
import { Tag, CheckCircle2, AlertCircle, Percent, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AdminCoupon {
  id?: number | string;
  code: string;
  type?: "percentage" | "flat" | string;
  value: number | string;
  description?: string;
  status?: string;
  minBookingDays?: number;
}

interface CouponSectionProps {
  subtotal: number;
  appliedCoupon: { code: string; percent: number; discount: number } | null;
  onApplyCoupon: (coupon: { code: string; percent: number; discount: number }) => void;
  onRemoveCoupon: () => void;
}

export const CouponSection: React.FC<CouponSectionProps> = ({
  subtotal,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [availableCoupons, setAvailableCoupons] = useState<AdminCoupon[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Fetch Admin-Created Active Coupons from Database
  useEffect(() => {
    setIsLoadingCoupons(true);
    fetch("/api/coupons")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const activeOnly = res.data.filter(
            (c: AdminCoupon) => !c.status || c.status === "Active" || c.status === "active"
          );
          setAvailableCoupons(activeOnly);
        }
      })
      .catch((err) => console.warn("Could not fetch coupons:", err))
      .finally(() => setIsLoadingCoupons(false));
  }, []);

  const handleApplyCouponCode = async (rawCode?: string) => {
    setCouponError("");
    const targetCode = (rawCode || couponInput).trim().toUpperCase();

    if (!targetCode) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    try {
      // Find matching admin coupon
      let found = availableCoupons.find(
        (c) => c.code.toUpperCase() === targetCode
      );

      if (!found) {
        // Fallback fetch in case newly created by admin
        const res = await fetch("/api/coupons");
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          found = json.data.find(
            (c: any) =>
              c.code.toUpperCase() === targetCode &&
              (!c.status || c.status === "Active" || c.status === "active")
          );
        }
      }

      if (found) {
        const pct = Number(found.value) || 10;
        const discountAmt = Math.round((subtotal * pct) / 100);
        onApplyCoupon({
          code: found.code.toUpperCase(),
          percent: pct,
          discount: discountAmt,
        });
        setCouponInput("");
        setCouponError("");
      } else {
        setCouponError(`"${targetCode}" is not a valid or active admin coupon.`);
      }
    } catch {
      setCouponError("Unable to validate coupon. Please try again.");
    }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#c88d18]" /> Apply Promo Coupon
        </h3>
        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5" /> Official Discounts
        </span>
      </div>

      {/* Coupon Application Interface */}
      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ENTER COUPON CODE"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value.toUpperCase());
                  if (couponError) setCouponError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleApplyCouponCode();
                  }
                }}
                className={`w-full p-3 rounded-2xl bg-brand-mist/60 border text-xs font-bold uppercase tracking-wider text-brand-navy outline-none transition-all ${
                  couponError
                    ? "border-rose-500 bg-rose-50/50 focus:ring-1 focus:ring-rose-500"
                    : "border-border focus:ring-1 focus:ring-brand-teal"
                }`}
              />
            </div>
            <Button
              type="button"
              onClick={() => handleApplyCouponCode()}
              className="px-6 h-11 rounded-2xl bg-[#c88d18] hover:bg-[#b07b14] text-white font-bold text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md"
            >
              Apply
            </Button>
          </div>

          {couponError && (
            <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {couponError}
            </p>
          )}

          {/* Admin Created Active Coupons */}
          {availableCoupons.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                Available Admin Offers:
              </span>
              <div className="flex flex-wrap gap-2">
                {availableCoupons.map((c) => (
                  <button
                    key={c.id || c.code}
                    type="button"
                    onClick={() => handleApplyCouponCode(c.code)}
                    className="group px-3 py-1.5 rounded-xl bg-brand-mist/70 hover:bg-[#c88d18]/10 border border-border hover:border-[#c88d18]/50 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Percent className="h-3 w-3 text-[#c88d18]" />
                    <span className="text-[11px] font-black font-mono text-brand-navy group-hover:text-[#c88d18]">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      ({c.value}% OFF {c.description ? `• ${c.description}` : ""})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Applied Coupon State */
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono bg-emerald-500/20 px-2 py-0.5 rounded-md text-emerald-900 uppercase">
                  {appliedCoupon.code}
                </span>
                <span className="text-xs font-bold text-emerald-700">
                  {appliedCoupon.percent}% Discount Applied
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                You saved ₹{appliedCoupon.discount.toLocaleString("en-IN")} on this booking!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};
