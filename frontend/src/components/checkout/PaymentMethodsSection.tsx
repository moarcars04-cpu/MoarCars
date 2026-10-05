import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Zap,
  Lock,
  CreditCard,
  QrCode,
  Building2,
  Wallet,
  Sparkles,
} from "lucide-react";

export type PaymentMethodType = "razorpay" | "upi" | "card" | "netbanking";

interface PaymentMethodsSectionProps {
  grandTotal: number;
  payableNow: number;
  balanceDue: number;
  advancePaymentPercent?: number;
  selectedMethod?: PaymentMethodType;
  onSelectMethod?: (method: PaymentMethodType) => void;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  grandTotal,
  payableNow,
  balanceDue,
  advancePaymentPercent = 10,
}) => {
  return (
    <div className="rounded-3xl border border-slate-800/90 bg-gradient-to-b from-[#0e1c31] via-[#0b1526] to-[#070e1c] p-5 sm:p-6 shadow-2xl space-y-5 text-white backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
              Official Gateway
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-mono font-bold">
              ⚡ Razorpay Secure Checkout
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2 mt-2">
            <Lock className="h-4 w-4 text-emerald-400" /> Razorpay Secure Payment Gateway
          </h3>
          <p className="text-xs text-slate-400">
            256-Bit SSL Encrypted • All Major Indian Payment Channels Supported
          </p>
        </div>

        <div className="text-left sm:text-right bg-[#070e1c] px-4 py-2.5 rounded-2xl border border-slate-800 shrink-0 shadow-inner">
          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
            Online Advance to Pay ({advancePaymentPercent}%)
          </span>
          <span className="text-xl font-black text-emerald-400">
            ₹{payableNow.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Primary Gateway Highlight Box */}
      <div className="p-5 rounded-2xl bg-[#070e1c]/90 text-white space-y-4 shadow-inner border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-[#c88d18] to-[#d49b29] text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20 shrink-0">
              <Zap className="h-5 w-5 fill-slate-950" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Instant Online Checkout via Razorpay
              </h4>
              <p className="text-[11px] text-slate-400">
                GPay, PhonePe, Paytm, All Debit/Credit Cards & Net Banking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/15 px-3 py-1 rounded-xl border border-emerald-500/30 shrink-0">
            <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Instant Authorization
          </div>
        </div>

        {/* Supported Sub-Channels Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <QrCode className="h-4 w-4" /> UPI & QR
            </div>
            <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <CreditCard className="h-4 w-4" /> Cards
            </div>
            <p className="text-[10px] text-slate-400">Visa, MasterCard, RuPay</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <Building2 className="h-4 w-4" /> NetBanking
            </div>
            <p className="text-[10px] text-slate-400">50+ Major Indian Banks</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 hover:border-amber-400/40 transition-colors">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <Wallet className="h-4 w-4" /> Wallets
            </div>
            <p className="text-[10px] text-slate-400">Amazon Pay, Mobikwik & more</p>
          </div>
        </div>
      </div>

      {/* Payment Split & Transparency Alert */}
      {balanceDue > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="text-slate-300 font-medium">
              Pay <strong className="text-emerald-400">₹{payableNow.toLocaleString("en-IN")}</strong> online advance
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Remaining ₹{balanceDue.toLocaleString("en-IN")} at handover
          </span>
        </div>
      )}

      {/* Security Assurance */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[10px] sm:text-[11px] text-slate-400 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
          <span>PCI-DSS 256-Bit SSL Encrypted Gateway</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-slate-400">
          <span>Razorpay Refund Protection Active</span>
        </div>
      </div>
    </div>
  );
};
