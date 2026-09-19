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
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
              Official Gateway
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-mono font-bold">
              🧪 Razorpay Test Mode
            </span>
          </div>
          <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2 mt-1.5">
            <Lock className="h-4 w-4 text-emerald-500" /> Razorpay Secure Payment Gateway
          </h3>
          <p className="text-xs text-muted-foreground">
            256-Bit SSL Encrypted • All Major Indian Payment Channels Supported
          </p>
        </div>

        <div className="text-left sm:text-right bg-brand-mist/60 px-4 py-2.5 rounded-2xl border border-border shrink-0">
          <span className="text-[10px] uppercase font-bold text-muted-foreground block">
            Online Advance to Pay ({advancePaymentPercent}%)
          </span>
          <span className="text-lg font-black text-emerald-600">
            ₹{payableNow.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Primary Gateway Highlight Box */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0b1426] to-[#08101e] text-white space-y-4 shadow-lg border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#c88d18]/20 border border-[#c88d18]/40 flex items-center justify-center text-[#c88d18]">
              <Zap className="h-5 w-5" />
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

          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> Ready for Instant Authorization
          </div>
        </div>

        {/* Supported Sub-Channels Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <QrCode className="h-4 w-4" /> UPI & QR
            </div>
            <p className="text-[10px] text-slate-400">GPay, PhonePe, Paytm, BHIM</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <CreditCard className="h-4 w-4" /> Cards
            </div>
            <p className="text-[10px] text-slate-400">Visa, MasterCard, RuPay</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <Building2 className="h-4 w-4" /> NetBanking
            </div>
            <p className="text-[10px] text-slate-400">50+ Major Indian Banks</p>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#c88d18] font-bold">
              <Wallet className="h-4 w-4" /> Wallets
            </div>
            <p className="text-[10px] text-slate-400">Amazon Pay, Mobikwik & more</p>
          </div>
        </div>
      </div>

      {/* Payment Split & Transparency Alert */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
          <span className="font-bold block text-emerald-800 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Instant Online Advance:
          </span>
          <p className="text-[11px] text-emerald-700">
            ₹{payableNow.toLocaleString("en-IN")} is charged now to reserve and guarantee the vehicle for your trip.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
          <span className="font-bold block text-amber-800 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-600" /> Remaining Balance at Handover:
          </span>
          <p className="text-[11px] text-amber-700">
            ₹{balanceDue.toLocaleString("en-IN")} payable directly at vehicle inspection & key handover.
          </p>
        </div>
      </div>

      {/* Security Assurance */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] text-muted-foreground border-t border-border">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>PCI-DSS Level 1 Compliant Gateway</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium">
          <span>Key ID: <code className="font-mono text-brand-navy font-bold">rzp_test_Swed...RMs0</code></span>
        </div>
      </div>
    </div>
  );
};
