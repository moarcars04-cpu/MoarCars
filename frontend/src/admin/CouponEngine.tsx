import React, { useState, useMemo } from "react";
import {
  Tag,
  Plus,
  Search,
  Percent,
  Calendar,
  Zap,
  Edit,
  Trash2,
  X,
  Sparkles,
  Gift,
  Briefcase,
  Plane,
} from "lucide-react";
import { CouponItem } from "./types";
import { adminApi } from "./adminApi";

interface CouponEngineProps {
  coupons: CouponItem[];
  setCoupons: React.Dispatch<React.SetStateAction<CouponItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function CouponEngine({
  coupons,
  setCoupons,
  setNotice,
}: CouponEngineProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponItem | null>(null);

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch =
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchType = filterType === "all" || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [coupons, searchQuery, filterType]);

  const handleSaveCoupon = (formData: Partial<CouponItem>) => {
    if (editingCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === editingCoupon.id ? { ...c, ...formData } : c))
      );
      setNotice({ type: "success", text: `Coupon "${formData.code || editingCoupon.code}" updated!` });
      adminApi.updateCoupon(editingCoupon.id, formData);
    } else {
      const newCp: CouponItem = {
        id: Math.floor(500 + Math.random() * 500),
        code: (formData.code || "PROMO").toUpperCase(),
        type: (formData.type as any) || "Flat Discount",
        discountValue: formData.discountValue || 500,
        isPercent: formData.isPercent || false,
        minBookingValue: formData.minBookingValue || 2500,
        maxDiscount: formData.maxDiscount,
        usageLimit: formData.usageLimit || 500,
        usedCount: 0,
        expiryDate: formData.expiryDate || "2027-12-31",
        isActive: true,
      };
      setCoupons([newCp, ...coupons]);
      setNotice({ type: "success", text: `Coupon "${newCp.code}" activated successfully!` });
      adminApi.createCoupon(newCp);
    }
    setIsAddEditModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDeleteCoupon = (id: number) => {
    if (confirm("Are you sure you want to delete this promotional coupon?")) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      setNotice({ type: "info", text: `Coupon #${id} deleted.` });
    }
  };

  const handleToggleStatus = (id: number) => {
    const current = coupons.find((c) => c.id === id);
    const newActive = !current?.isActive;
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: newActive } : c))
    );
    setNotice({ type: "info", text: `Coupon status toggled.` });
    adminApi.updateCoupon(id, { isActive: newActive });
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Tag className="w-6 h-6 text-[#D4AF37]" /> Promotional Coupons & Surge Engine
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Configure discount promo codes, 7 offer types, percentage & flat discounts, referral perks, and usage limits
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search coupon code, type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => {
              setEditingCoupon(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Active Promo Codes</span>
          <h4 className="text-2xl font-black text-white mt-1">{coupons.filter((c) => c.isActive).length} Live</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Auto-Redeem Active</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Redemptions</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">
            {coupons.reduce((acc, c) => acc + c.usedCount, 0)} Used
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Across All Bookings</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Customer Savings</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">₹1,84,500</h4>
          <p className="text-[10px] text-purple-300 mt-0.5 font-bold">Promotional Value Delivered</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Highest Converting Code</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">MOARFIRST</h4>
          <p className="text-[10px] text-[#D4AF37] mt-0.5 font-bold">412 Successful Bookings</p>
        </div>
      </div>

      {/* FILTER PILLS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          "all",
          "Flat Discount",
          "Percentage Discount",
          "Free Delivery",
          "Weekend Offer",
          "Festival Offer",
          "Referral Coupon",
          "Corporate Coupon",
        ].map((tp) => (
          <button
            key={tp}
            onClick={() => setFilterType(tp)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
              filterType === tp
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {tp === "all" ? "All 7 Offer Types" : tp}
          </button>
        ))}
      </div>

      {/* COUPON CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCoupons.map((cp) => (
          <div
            key={cp.id}
            className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4 hover:border-[#D4AF37]/50 transition-all"
          >
            <div className="flex justify-between items-start">
              <span className="px-3.5 py-1.5 rounded-xl bg-[#14081E] border border-amber-400/40 font-mono font-black text-sm text-[#D4AF37] tracking-wider shadow-inner">
                {cp.code}
              </span>
              <button
                onClick={() => handleToggleStatus(cp.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                  cp.isActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                {cp.isActive ? "Active" : "Disabled"}
              </button>
            </div>

            <div className="text-xs space-y-1">
              <p className="text-purple-400 uppercase text-[10px] font-bold tracking-wider">{cp.type}</p>
              <h3 className="text-2xl font-black text-white">
                {cp.isPercent ? `${cp.discountValue}% OFF` : `₹${cp.discountValue} FLAT OFF`}
              </h3>
              <p className="text-purple-300 text-[11px]">
                Min Booking: <strong className="text-white">₹{cp.minBookingValue.toLocaleString()}</strong>
                {cp.maxDiscount && ` (Cap ₹${cp.maxDiscount})`}
              </p>
            </div>

            {/* Usage Progress Bar */}
            <div>
              <div className="flex justify-between text-[10px] text-purple-300 font-bold mb-1">
                <span>Usage Progress</span>
                <span>{cp.usedCount} of {cp.usageLimit}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#14081E] overflow-hidden border border-purple-500/20">
                <div
                  className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] rounded-full transition-all"
                  style={{ width: `${Math.min(100, (cp.usedCount / cp.usageLimit) * 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-3 border-t border-purple-500/20 flex justify-between items-center text-[10px] text-purple-400">
              <span>Expires: <strong className="text-purple-200">{cp.expiryDate}</strong></span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    setEditingCoupon(cp);
                    setIsAddEditModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                  title="Edit Coupon"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteCoupon(cp.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          MODAL: CREATE / EDIT PROMOTIONAL COUPON
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Tag className="w-5 h-5 text-[#D4AF37]" /> {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create Promotional Coupon"}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = e.target as any;
                handleSaveCoupon({
                  code: t.code.value.toUpperCase(),
                  type: t.type.value,
                  discountValue: parseInt(t.discountValue.value) || 500,
                  isPercent: t.isPercent.value === "true",
                  minBookingValue: parseInt(t.minBookingValue.value) || 2000,
                  maxDiscount: t.maxDiscount?.value ? parseInt(t.maxDiscount.value) : undefined,
                  usageLimit: parseInt(t.usageLimit.value) || 500,
                  expiryDate: t.expiryDate.value || "2027-12-31",
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-purple-300 font-bold mb-1">Coupon Promo Code *</label>
                <input
                  name="code"
                  defaultValue={editingCoupon?.code || ""}
                  required
                  placeholder="FESTIVAL30"
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-[#D4AF37] font-black font-mono text-sm uppercase tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Offer Category</label>
                  <select
                    name="type"
                    defaultValue={editingCoupon?.type || "Flat Discount"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  >
                    <option value="Flat Discount">Flat Discount</option>
                    <option value="Percentage Discount">Percentage Discount</option>
                    <option value="Free Delivery">Free Delivery</option>
                    <option value="Weekend Offer">Weekend Offer</option>
                    <option value="Festival Offer">Festival Offer</option>
                    <option value="Referral Coupon">Referral Coupon</option>
                    <option value="Corporate Coupon">Corporate Coupon</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Discount Mode</label>
                  <select
                    name="isPercent"
                    defaultValue={editingCoupon?.isPercent ? "true" : "false"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  >
                    <option value="false">Flat Rupees (₹)</option>
                    <option value="true">Percentage (%)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Discount Value *</label>
                  <input
                    name="discountValue"
                    type="number"
                    defaultValue={editingCoupon?.discountValue || 500}
                    required
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-emerald-400 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Min Booking Value (₹)</label>
                  <input
                    name="minBookingValue"
                    type="number"
                    defaultValue={editingCoupon?.minBookingValue || 2500}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Total Usage Limit</label>
                  <input
                    name="usageLimit"
                    type="number"
                    defaultValue={editingCoupon?.usageLimit || 500}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Expiry Date</label>
                  <input
                    name="expiryDate"
                    type="date"
                    defaultValue={editingCoupon?.expiryDate || "2027-12-31"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
                >
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
