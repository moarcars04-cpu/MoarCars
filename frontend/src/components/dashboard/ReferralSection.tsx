import React, { useState } from "react";
import {
  Gift,
  Share2,
  Copy,
  CheckCircle2,
  Users,
  Coins,
  ArrowRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";
import { UserProfile, ReferralFriend } from "../../types/user";
import { Button } from "@/components/ui/button";

interface ReferralSectionProps {
  user: UserProfile;
  onBrowseFleet: () => void;
}

const DEMO_REFERRALS: ReferralFriend[] = [
  {
    id: 1,
    name: "Suresh Kumar V",
    phone: "+91 98480 •••••",
    joinedDate: "2026-08-15",
    status: "Trip Completed",
    rewardEarned: 500,
  },
  {
    id: 2,
    name: "Pravallika Reddy",
    phone: "+91 85000 •••••",
    joinedDate: "2026-08-28",
    status: "Trip Completed",
    rewardEarned: 500,
  },
  {
    id: 3,
    name: "M. Venkatesh",
    phone: "+91 94400 •••••",
    joinedDate: "2026-09-02",
    status: "First Trip Booked",
    rewardEarned: 500,
  },
  {
    id: 4,
    name: "Anand Sharma",
    phone: "+91 99890 •••••",
    joinedDate: "2026-09-05",
    status: "Signed Up",
    rewardEarned: 0,
  },
];

export const ReferralSection: React.FC<ReferralSectionProps> = ({
  user,
  onBrowseFleet,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralCode = user.referralCode || `MOAR${user.id || 8812}`;
  const referralLink = `https://moarcars.com?ref=${referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚗 Hey! Rent verified self-drive cars in Tirupati with Moar Cars (Ghat-road certified & zero security deposit deductions). Use my code *${referralCode}* to get ₹250 instant discount: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const handleShareTelegram = () => {
    const text = encodeURIComponent(
      `Rent verified self-drive cars in Tirupati with Moar Cars. Use code ${referralCode} for ₹250 discount!`
    );
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${text}`, "_blank");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("Special Discount for Tirupati Self-Drive Car Rental on Moar Cars");
    const body = encodeURIComponent(
      `Hi,\n\nI'm using Moar Cars for self-drive car rentals in Tirupati & Tirumala. Use my referral code ${referralCode} to get ₹250 instant discount on your first booking.\n\nBook here: ${referralLink}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner: Referral Program Hero */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-gold text-[10px] font-black uppercase tracking-wider border border-brand-gold/30">
            <Gift className="h-3.5 w-3.5" /> Referral & Loyalty Program
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Give ₹250, <span className="text-brand-gold">Get ₹500</span> in Cash
          </h2>

          <p className="text-xs text-white/70 leading-relaxed">
            Invite friends, family, and fellow pilgrims to Moar Cars. When they sign up, they instantly receive ₹250 discount, and you earn ₹500 directly in your wallet after their first self-drive trip.
          </p>

          <div className="pt-2 flex flex-wrap gap-2">
            <Button
              onClick={handleShareWhatsApp}
              className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <MessageCircle className="h-4 w-4" /> Share on WhatsApp
            </Button>

            <Button
              onClick={handleShareTelegram}
              className="h-10 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Send className="h-4 w-4" /> Share Telegram
            </Button>

            <Button
              onClick={handleShareEmail}
              variant="outline"
              className="h-10 px-4 rounded-xl border-white/20 text-white font-bold text-xs hover:bg-white/10 flex items-center gap-1.5"
            >
              <Mail className="h-4 w-4" /> Email
            </Button>
          </div>
        </div>

        {/* Code & Link Box */}
        <div className="p-6 rounded-2xl bg-slate-950/90 border border-brand-gold/40 space-y-4 text-center lg:w-80 shrink-0 shadow-2xl">
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50 block">Your Exclusive Code</span>
            <span className="text-2xl font-black font-mono text-brand-gold tracking-widest block mt-1">
              {referralCode}
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCopyCode}
              variant="outline"
              className="flex-1 h-9 rounded-xl border-white/20 text-white text-xs font-bold hover:bg-white/10"
            >
              {copiedCode ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCode ? "Copied" : "Copy Code"}
            </Button>

            <Button
              onClick={handleCopyLink}
              className="flex-1 h-9 rounded-xl bg-brand-gold text-brand-navy text-xs font-black hover:bg-brand-gold-soft"
            >
              {copiedLink ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Share2 className="h-3.5 w-3.5" />}
              {copiedLink ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>
      </div>

      {/* Referral Stats Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1 shadow">
          <span className="text-[10px] uppercase font-bold text-white/50 block">Friends Invited</span>
          <span className="text-2xl sm:text-3xl font-black text-white">{user.referredCount || 4}</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1 shadow">
          <span className="text-[10px] uppercase font-bold text-white/50 block">Total Cash Earned</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">
            ₹{(user.referralEarnings || 1500).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1 shadow">
          <span className="text-[10px] uppercase font-bold text-white/50 block">Pending Rewards</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-400">₹500</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 text-center space-y-1 shadow">
          <span className="text-[10px] uppercase font-bold text-white/50 block">Bonus Wallet Tier</span>
          <span className="text-2xl sm:text-3xl font-black text-brand-gold">VIP Gold</span>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-gold" /> Invited Friends & Referral Network
          </h3>
          <p className="text-xs text-white/60">
            Track registration status, completed trips, and credited bonus rewards.
          </p>
        </div>

        <div className="space-y-3">
          {DEMO_REFERRALS.map((friend) => (
            <div
              key={friend.id}
              className="p-4 rounded-2xl border border-white/5 bg-slate-950/70 hover:border-brand-gold/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-full bg-brand-gold/20 text-brand-gold border border-brand-gold/40 flex items-center justify-center font-bold text-sm shrink-0">
                  {friend.name.charAt(0)}
                </div>

                <div>
                  <h5 className="font-bold text-white text-sm">{friend.name}</h5>
                  <p className="text-[11px] text-white/60">
                    {friend.phone} • Joined {friend.joinedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    friend.status === "Trip Completed"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : friend.status === "First Trip Booked"
                      ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                      : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {friend.status}
                </span>

                <div className="text-right">
                  <span className="text-[10px] text-white/50 block">Earned</span>
                  <span
                    className={`font-black text-sm ${
                      friend.rewardEarned > 0 ? "text-emerald-400" : "text-white/40"
                    }`}
                  >
                    {friend.rewardEarned > 0 ? `+₹${friend.rewardEarned}` : "Pending Trip"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
