import React, { useState } from "react";
import {
  Wallet,
  Sparkles,
  Gift,
  Plus,
  ArrowRight,
  Copy,
  CheckCircle2,
  Share2,
  TrendingUp,
  CreditCard,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { UserProfile } from "../../types/user";
import { Button } from "@/components/ui/button";

interface WalletSectionProps {
  user: UserProfile;
  onAddFunds: (amount: number) => Promise<{ success: boolean; message: string; newBalance?: number }>;
  onRedeemCoins: (points: number) => Promise<{ success: boolean; message: string }>;
}

export const WalletSection: React.FC<WalletSectionProps> = ({
  user,
  onAddFunds,
  onRedeemCoins,
}) => {
  const [topupAmount, setTopupAmount] = useState<number>(2000);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  const referralShareUrl = `https://moarcars.com?ref=${user.referralCode || "MOAR" + user.id}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(user.referralCode || "MOAR8899");
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topupAmount <= 0) return;
    setIsProcessing(true);
    setFeedbackMsg("");

    const res = await onAddFunds(topupAmount);
    setIsProcessing(false);
    if (res.success) {
      setShowTopupModal(false);
      setFeedbackMsg(`✅ ₹${topupAmount.toLocaleString("en-IN")} added to your Moar Wallet!`);
    } else {
      setFeedbackMsg(`❌ ${res.message || "Failed to add funds"}`);
    }
  };

  const handleRedeem = async (points: number) => {
    if (user.rewardPoints < points) {
      setFeedbackMsg("❌ You don't have enough Moar Coins for this redemption.");
      return;
    }
    setIsProcessing(true);
    setFeedbackMsg("");
    const res = await onRedeemCoins(points);
    setIsProcessing(false);
    if (res.success) {
      setFeedbackMsg(`✅ Successfully redeemed ${points} Moar Coins for ₹${points} Wallet Credit!`);
    } else {
      setFeedbackMsg(`❌ ${res.message || "Failed to redeem coins."}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Cards: Wallet Balance & Reward Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Wallet Balance Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-brand-gold/10 blur-2xl" />
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                <Wallet className="h-4 w-4" /> Moar Wallet Balance
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                Active & Ready
              </span>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">
                ₹{(user.walletBalance || 0).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Use balance directly at checkout for zero-fee instant rental booking.
              </p>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button
              onClick={() => setShowTopupModal(true)}
              className="flex-1 h-10 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wide hover:bg-brand-gold-soft flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30"
            >
              <Plus className="h-4 w-4" /> Add Money via UPI
            </Button>
          </div>
        </div>

        {/* Reward Coins Card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-sky-950/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-32 w-32 rounded-full bg-sky-500/10 blur-2xl" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Sparkles className="h-4 w-4" /> Moar Loyalty Coins
              </span>
              <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-brand-gold">
                1 Coin = ₹1
              </span>
            </div>

            <div>
              <p className="text-3xl sm:text-4xl font-black text-brand-gold">
                {(user.rewardPoints || 100).toLocaleString("en-IN")} <span className="text-sm font-semibold text-white/60">Coins</span>
              </p>
              <p className="mt-1 text-xs text-white/60">
                Earned from verified trips, timely returns, and successful friend referrals.
              </p>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <Button
              disabled={isProcessing || (user.rewardPoints || 0) < 50}
              onClick={() => handleRedeem(Math.min(user.rewardPoints || 0, 250))}
              variant="outline"
              className="flex-1 h-10 rounded-xl border-amber-500/30 bg-amber-500/10 text-brand-gold font-bold text-xs hover:bg-amber-500/20 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-4 w-4" /> Convert Coins to Wallet
            </Button>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white">
          {feedbackMsg}
        </div>
      )}

      {/* Referral Program Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">Invite Friends & Earn ₹500 per Referral</h4>
              <p className="text-xs text-white/60 max-w-xl mt-0.5">
                Share your unique code. When your friend signs up and books their first self-drive trip, they get 250 bonus coins and you receive ₹500 in your wallet.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-slate-950 border border-amber-500/40 px-4 py-2 text-center">
              <p className="text-[9px] uppercase font-bold text-white/40">Your Code</p>
              <p className="text-base font-black font-mono text-brand-gold">{user.referralCode || "MOAR8899"}</p>
            </div>

            <Button
              onClick={handleCopyReferral}
              className="h-11 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs hover:bg-brand-gold-soft flex items-center gap-1.5"
            >
              {copiedCode ? <CheckCircle2 className="h-4 w-4 text-emerald-800" /> : <Copy className="h-4 w-4" />}
              {copiedCode ? "Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
            <p className="text-[10px] text-white/50 uppercase font-bold">Friends Joined</p>
            <p className="text-lg font-black text-white mt-0.5">{user.referredCount || 0}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10">
            <p className="text-[10px] text-white/50 uppercase font-bold">Total Referral Cash</p>
            <p className="text-lg font-black text-emerald-400 mt-0.5">₹{(user.referralEarnings || 0).toLocaleString("en-IN")}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 col-span-2 sm:col-span-1">
            <p className="text-[10px] text-white/50 uppercase font-bold">Reward Tier</p>
            <p className="text-lg font-black text-brand-gold mt-0.5">{user.loyaltyTier || "Bronze VIP"}</p>
          </div>
        </div>
      </div>

      {/* Topup Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-md w-full rounded-2xl bg-slate-900 border border-amber-500/30 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brand-gold" />
                Add Money to Moar Wallet
              </h4>
              <button
                onClick={() => setShowTopupModal(false)}
                className="rounded-full p-1 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Enter Top-Up Amount (₹)
                </label>
                <input
                  type="number"
                  min={100}
                  step={100}
                  required
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-lg font-black text-brand-gold focus:border-brand-gold focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-3 gap-2">
                {[1000, 2500, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      topupAmount === amt
                        ? "border-brand-gold bg-amber-500/20 text-brand-gold"
                        : "border-white/10 bg-slate-950 text-white/70 hover:text-white"
                    }`}
                  >
                    + ₹{amt.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-white/10 text-xs space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Instant UPI Payment</p>
                <div className="flex items-center justify-between text-white/80">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <QrCode className="h-4 w-4 text-brand-gold" /> Google Pay / PhonePe / Paytm UPI
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">Zero Fee</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 h-11 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30"
                >
                  {isProcessing ? "Adding Funds..." : `Add ₹${topupAmount.toLocaleString("en-IN")}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
