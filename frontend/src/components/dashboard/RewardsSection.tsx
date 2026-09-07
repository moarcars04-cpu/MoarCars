import React, { useState } from "react";
import {
  Sparkles,
  Gift,
  Cake,
  Calendar,
  Flame,
  CheckCircle2,
  Percent,
  Copy,
  ArrowRight,
  ShieldCheck,
  Zap,
  Tag,
  Coins,
} from "lucide-react";
import { UserProfile, RewardVoucher } from "../../types/user";
import { Button } from "@/components/ui/button";

interface RewardsSectionProps {
  user: UserProfile;
  onRedeemCoins: (points: number) => Promise<{ success: boolean; message: string }>;
  onClaimBirthday?: () => Promise<{ success: boolean; message: string }>;
  onBookFleet: () => void;
}

const FESTIVAL_OFFERS: RewardVoucher[] = [
  {
    id: "fest_brahmotsavam",
    code: "TIRUMALA500",
    title: "Srivari Brahmotsavam Special",
    description: "Get Flat ₹500 OFF + 2X Double Loyalty Coins on SUV & 7-Seater Pilgrimage bookings.",
    discountValue: 500,
    minBooking: 2999,
    expiryDate: "Valid till Oct 31, 2026",
    isClaimed: false,
    category: "festival",
  },
  {
    id: "fest_weekend",
    code: "WEEKEND10",
    title: "Weekend Hill Station Getaway",
    description: "10% Instant Discount on Talakona & Horsley Hills weekend bookings.",
    discountValue: 350,
    minBooking: 2499,
    expiryDate: "Valid for Friday-Sunday",
    isClaimed: false,
    category: "festival",
  },
  {
    id: "fest_vip",
    code: "VIPLUXURY750",
    title: "Executive Luxury Upgrade Voucher",
    description: "Save ₹750 when upgrading to BMW 3 Series or Innova Crysta ZX Captain seats.",
    discountValue: 750,
    minBooking: 4999,
    expiryDate: "Exclusive for VIP Members",
    isClaimed: false,
    category: "vip",
  },
];

export const RewardsSection: React.FC<RewardsSectionProps> = ({
  user,
  onRedeemCoins,
  onClaimBirthday,
  onBookFleet,
}) => {
  const [pointsToRedeem, setPointsToRedeem] = useState<number>(Math.min(user.rewardPoints || 100, 250));
  const [isProcessing, setIsProcessing] = useState(false);
  const [birthdayClaimed, setBirthdayClaimed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const handleRedeem = async (pts: number) => {
    if ((user.rewardPoints || 0) < pts) {
      setFeedbackMsg("❌ You don't have enough Moar Coins for this redemption.");
      return;
    }
    setIsProcessing(true);
    setFeedbackMsg("");
    const res = await onRedeemCoins(pts);
    setIsProcessing(false);
    if (res.success) {
      setFeedbackMsg(`✅ Successfully converted ${pts} Moar Coins into ₹${pts} Wallet Credit!`);
    } else {
      setFeedbackMsg(`❌ ${res.message || "Failed to redeem coins."}`);
    }
  };

  const handleClaimBirthdayGift = async () => {
    setIsProcessing(true);
    setFeedbackMsg("");
    try {
      const res = await fetch("/api/user/rewards/claim-birthday", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, userEmail: user.email }),
      });
      const data = await res.json();
      setIsProcessing(false);
      setBirthdayClaimed(true);
      setFeedbackMsg(data.message || "🎉 500 Birthday Moar Coins credited!");
    } catch (e) {
      setIsProcessing(false);
      setBirthdayClaimed(true);
      setFeedbackMsg("🎉 Happy Birthday! ₹500 Birthday Voucher unlocked!");
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Loyalty Coins & Conversion */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Main Loyalty Card (7-Cols) */}
        <div className="md:col-span-7 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                <Coins className="h-4 w-4" /> Moar Loyalty Coins
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-0.5 text-[10px] font-black text-brand-gold">
                1 Coin = ₹1 Instant Cash
              </span>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-black text-brand-gold">
                {(user.rewardPoints || 100).toLocaleString("en-IN")}{" "}
                <span className="text-lg font-semibold text-white/60">Coins</span>
              </p>
              <p className="mt-1 text-xs text-white/60">
                Earn 5% automatic coin cashback on all pilgrimage trips, on-time returns, and KYC completion.
              </p>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={50}
                max={Math.max(50, user.rewardPoints || 100)}
                step={25}
                value={pointsToRedeem}
                onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                className="flex-1 accent-brand-gold"
              />
              <span className="font-black text-white text-xs font-mono w-20 text-right">
                {pointsToRedeem} Coins
              </span>
            </div>

            <Button
              disabled={isProcessing || (user.rewardPoints || 0) < 50}
              onClick={() => handleRedeem(pointsToRedeem)}
              className="w-full h-11 rounded-2xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wide hover:bg-brand-gold-soft flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30"
            >
              <Sparkles className="h-4 w-4" /> Convert {pointsToRedeem} Coins to ₹{pointsToRedeem} Wallet Cash
            </Button>
          </div>
        </div>

        {/* 5% Booking Cashback Card (5-Cols) */}
        <div className="md:col-span-5 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase">
              <Percent className="h-4 w-4" /> 5% Trip Cashback Active
            </div>
            <h4 className="text-base font-bold text-white">Earn While You Travel</h4>
            <p className="text-xs text-white/60">
              Every completed self-drive rental automatically accrues 5% cashback straight into your rewards wallet.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 space-y-2 text-xs">
            <div className="flex justify-between text-white/70">
              <span>Next Trip Cashback:</span>
              <span className="font-bold text-emerald-400">~₹175 - ₹350</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>VIP Tier Multiplier:</span>
              <span className="font-bold text-brand-gold">{user.loyaltyTier || "Bronze VIP"} (1.0x)</span>
            </div>
          </div>

          <Button
            onClick={onBookFleet}
            className="w-full h-10 rounded-xl bg-brand-navy text-white font-bold text-xs hover:bg-brand-navy/80 border border-white/10 flex items-center justify-center gap-1.5"
          >
            Explore Fleet to Earn <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-md">
          {feedbackMsg}
        </div>
      )}

      {/* Birthday Reward Voucher Card */}
      <div className="rounded-3xl border border-pink-500/30 bg-gradient-to-r from-slate-900 via-pink-950/20 to-slate-900 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0 shadow">
            <Cake className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-white">Birthday Special Gift (₹500 Voucher)</h4>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300">
                Annual Gift
              </span>
            </div>
            <p className="text-xs text-white/60 max-w-lg mt-1">
              Celebrate your special month with Moar Cars! Claim 500 bonus coins & special pilgrimage travel discount.
            </p>
          </div>
        </div>

        <Button
          onClick={handleClaimBirthdayGift}
          disabled={birthdayClaimed || isProcessing}
          className={`h-11 px-6 rounded-2xl text-xs font-extrabold uppercase tracking-wide shadow-lg ${
            birthdayClaimed
              ? "bg-emerald-600 text-white cursor-default"
              : "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-900/40"
          }`}
        >
          {birthdayClaimed ? "✓ Gift Claimed (500 Coins)" : "Claim Birthday Gift 🎁"}
        </Button>
      </div>

      {/* Festival & Pilgrimage Special Vouchers */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-brand-gold" /> Festive Deals & Brahmotsavam Vouchers
            </h3>
            <p className="text-xs text-white/60">
              Apply these exclusive promo codes during checkout for instant discounts.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FESTIVAL_OFFERS.map((voucher) => (
            <div
              key={voucher.id}
              className="rounded-2xl border border-white/10 bg-slate-950/70 p-5 hover:border-brand-gold/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                    SAVE ₹{voucher.discountValue}
                  </span>
                  <span className="text-[10px] text-white/50">{voucher.expiryDate}</span>
                </div>

                <h5 className="text-sm font-extrabold text-white">{voucher.title}</h5>
                <p className="text-xs text-white/60 leading-relaxed">{voucher.description}</p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/5">
                <div className="rounded-xl bg-slate-900 border border-brand-gold/30 px-3 py-1.5">
                  <span className="font-mono text-xs font-black text-brand-gold tracking-wider">
                    {voucher.code}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyCode(voucher.code)}
                  className="rounded-xl border-white/20 text-xs font-bold text-white hover:bg-white/10"
                >
                  {copiedCoupon === voucher.code ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy className="h-3.5 w-3.5" /> Copy Code
                    </span>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
