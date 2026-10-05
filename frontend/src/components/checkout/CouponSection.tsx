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
      const match = availableCoupons.find(
        (c) => c.code.trim().toUpperCase() === targetCode
      );

      if (match) {
        const percent = Number(match.value) || 10;
        const discount = Math.round((subtotal * percent) / 100);
        onApplyCoupon({
          code: match.code,
          percent,
          discount,
        });
        setCouponInput("");
      } else {
        // Fallback to server validation if not in preloaded list
        const res = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: targetCode, subtotal }),
        });
        const data = await res.json();
        if (data.success && data.data) {
          const percent = Number(data.data.percent || data.data.value) || 10;
          const discount = Math.round((subtotal * percent) / 100);
          onApplyCoupon({
            code: targetCode,
            percent,
            discount,
          });
          setCouponInput("");
        } else {
          setCouponError(data.message || "Invalid or expired coupon code.");
        }
      }
    } catch {
      setCouponError("Unable to validate coupon. Please try again.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4 text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Tag className="h-4 w-4 text-[#b57d14]" /> Apply Promo Coupon
        </h3>
        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
          <Sparkles className="h-3 w-3 text-emerald-600" /> Official Discounts
        </span>
      </div>

      {/* Coupon Application Interface */}
      {!appliedCoupon ? (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ENTER COUPON CODE (E.G. MOAR10)"
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
                className={`w-full px-4 py-3 rounded-2xl bg-slate-50 border text-xs font-mono font-bold uppercase tracking-wider text-slate-900 placeholder-slate-400 outline-none transition-all ${
                  couponError
                    ? "border-rose-500 bg-rose-50 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-300 focus:border-[#b57d14] focus:bg-white focus:ring-2 focus:ring-[#b57d14]/20"
                }`}
              />
            </div>
            <Button
              type="button"
              onClick={() => handleApplyCouponCode()}
              className="h-11 px-7 rounded-2xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-slate-950 font-black text-xs tracking-wider uppercase transition-transform active:scale-95 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              Apply Code
            </Button>
          </div>

          {couponError && (
            <p className="text-[11px] font-bold text-rose-600 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {couponError}
            </p>
          )}

          {/* Admin Created Active Coupons */}
          {availableCoupons.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 block tracking-wider">
                Available Special Offers (Click to Apply):
              </span>
              <div className="flex flex-wrap gap-2">
                {availableCoupons.map((c) => (
                  <button
                    key={c.id || c.code}
                    type="button"
                    onClick={() => handleApplyCouponCode(c.code)}
                    className="group px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <Percent className="h-3 w-3 text-[#b57d14]" />
                    <span className="text-[11px] font-black font-mono text-slate-900 group-hover:text-amber-800">
                      {c.code}
                    </span>
                    <span className="text-[10px] text-slate-500 group-hover:text-slate-700 font-semibold">
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
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black font-mono bg-white px-2 py-0.5 rounded-md text-emerald-800 uppercase border border-emerald-200">
                  {appliedCoupon.code}
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  {appliedCoupon.percent}% Discount Applied
                </span>
              </div>
              <p className="text-[11px] font-bold text-emerald-700 mt-0.5">
                You saved ₹{appliedCoupon.discount.toLocaleString("en-IN")} on this booking!
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default CouponSection;
