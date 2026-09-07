import React, { useState, useEffect } from "react";
import {
  QrCode,
  CreditCard,
  Building2,
  Wallet,
  Coins,
  Split,
  Banknote,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type PaymentMethodType =
  | "upi"
  | "card"
  | "netbanking"
  | "razorpay"
  | "split"
  | "cash"
  | "emi";

interface PaymentMethodsSectionProps {
  grandTotal: number;
  selectedMethod: PaymentMethodType;
  onSelectMethod: (method: PaymentMethodType) => void;
  onPaymentDetailsChange?: (details: any) => void;
}

export const PaymentMethodsSection: React.FC<PaymentMethodsSectionProps> = ({
  grandTotal,
  selectedMethod,
  onSelectMethod,
  onPaymentDetailsChange,
}) => {
  // UPI State
  const [upiVpa, setUpiVpa] = useState("");
  const [upiQrTimer, setUpiQrTimer] = useState(300); // 5 minutes

  // Card State
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // EMI State
  const [selectedEmiMonths, setSelectedEmiMonths] = useState(3);

  // QR Timer Countdown
  useEffect(() => {
    if (selectedMethod !== "upi") return;
    const timer = setInterval(() => {
      setUpiQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedMethod]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Card Number Formatter
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Detect Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, "");
    if (clean.startsWith("4")) return "Visa";
    if (clean.startsWith("5")) return "MasterCard";
    if (clean.startsWith("6")) return "RuPay";
    if (clean.startsWith("3")) return "Amex";
    return "Debit/Credit";
  };

  const advanceAmount = Math.round(grandTotal * 0.2);
  const emiMonthlyAmount = Math.round((grandTotal * 1.05) / selectedEmiMonths);

  const paymentMethodsList = [
    {
      id: "upi" as PaymentMethodType,
      title: "UPI / QR Code",
      subtitle: "GPay, PhonePe, Paytm, BHIM",
      badge: "Fastest (0% Fee)",
      icon: QrCode,
    },
    {
      id: "card" as PaymentMethodType,
      title: "Credit / Debit Cards",
      subtitle: "Visa, MasterCard, RuPay, Amex",
      badge: "Instant",
      icon: CreditCard,
    },
    {
      id: "netbanking" as PaymentMethodType,
      title: "Net Banking",
      subtitle: "All Indian Major Banks",
      badge: "Secure",
      icon: Building2,
    },
    {
      id: "razorpay" as PaymentMethodType,
      title: "Razorpay Checkout",
      subtitle: "All-in-one Gateway",
      badge: "Popular",
      icon: Zap,
    },
    {
      id: "split" as PaymentMethodType,
      title: "Split 20/80 Payment",
      subtitle: `Pay ₹${advanceAmount.toLocaleString("en-IN")} now, rest on pickup`,
      badge: "Flexible",
      icon: Split,
    },
    {
      id: "cash" as PaymentMethodType,
      title: "Pay at Vehicle Pickup",
      subtitle: "Cash or Card at Handover Hub",
      badge: "No Advance",
      icon: Banknote,
    },
    {
      id: "emi" as PaymentMethodType,
      title: "Low-Cost Card EMI",
      subtitle: `From ₹${emiMonthlyAmount.toLocaleString("en-IN")}/mo`,
      badge: "3-12 Months",
      icon: Clock,
    },
  ];

  const banks = [
    { id: "HDFC", name: "HDFC Bank", logo: "🏛️" },
    { id: "SBI", name: "State Bank of India", logo: "🏛️" },
    { id: "ICICI", name: "ICICI Bank", logo: "🏛️" },
    { id: "AXIS", name: "Axis Bank", logo: "🏛️" },
    { id: "KOTAK", name: "Kotak Mahindra", logo: "🏛️" },
    { id: "UNION", name: "Union / Andhra Bank", logo: "🏛️" },
  ];

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div>
          <h3 className="text-base font-extrabold text-brand-navy flex items-center gap-2">
            <Lock className="h-4 w-4 text-emerald-500" /> Select Payment Method
          </h3>
          <p className="text-xs text-muted-foreground">100% Encrypted & Bank-Grade Verified Gateway</p>
        </div>
        <span className="text-xs font-black text-brand-teal">
          Payable: ₹{(selectedMethod === "split" ? advanceAmount : grandTotal).toLocaleString("en-IN")}
        </span>
      </div>

      {/* Payment Mode Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {paymentMethodsList.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedMethod === method.id;
          return (
            <div
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start gap-3 relative ${
                isSelected
                  ? "border-brand-teal bg-brand-teal/5 ring-2 ring-brand-teal shadow-md"
                  : "border-border bg-card hover:border-brand-teal/40 hover:bg-brand-mist/30"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isSelected ? "bg-brand-teal text-white" : "bg-brand-mist text-brand-navy"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-brand-navy">{method.title}</h4>
                  <span
                    className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                      isSelected ? "bg-brand-teal text-white" : "bg-brand-mist text-muted-foreground"
                    }`}
                  >
                    {method.badge}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-tight">{method.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Method Configuration Panel */}
      <div className="p-5 rounded-2xl bg-brand-mist/40 border border-border space-y-4">
        {/* 1. UPI CONFIGURATION */}
        {selectedMethod === "upi" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Simulated Dynamic QR Box */}
            <div className="md:col-span-5 text-center space-y-2 bg-card p-4 rounded-2xl border border-border shadow-sm">
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wider block">
                Scan & Pay via any UPI App
              </span>

              {/* QR Canvas */}
              <div className="h-40 w-40 mx-auto rounded-xl bg-white p-2 border border-border shadow-inner flex flex-col items-center justify-center relative">
                <QrCode className="h-32 w-32 text-brand-navy" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="px-1.5 py-0.5 rounded bg-brand-gold text-brand-navy text-[8px] font-black uppercase">
                    Moar Cars
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-brand-gold" />
                <span>QR expires in: </span>
                <span className="font-mono font-bold text-brand-navy">{formatTimer(upiQrTimer)}</span>
              </div>
            </div>

            {/* UPI ID / Direct Apps */}
            <div className="md:col-span-7 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-brand-navy">Or Enter UPI ID / VPA</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. yourname@oksbi / phone@paytm"
                    value={upiVpa}
                    onChange={(e) => setUpiVpa(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
                  />
                  <Button
                    size="sm"
                    className="rounded-xl bg-brand-navy text-white text-xs font-bold px-4"
                  >
                    Verify
                  </Button>
                </div>
              </div>

              {/* Supported UPI Apps */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">1-Click Launch</span>
                <div className="grid grid-cols-4 gap-2">
                  {["GPay", "PhonePe", "Paytm", "BHIM"].map((app) => (
                    <button
                      key={app}
                      type="button"
                      className="p-2 rounded-xl bg-card border border-border text-xs font-bold text-brand-navy hover:border-brand-teal hover:shadow transition-all text-center"
                    >
                      {app}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. CARD CONFIGURATION */}
        {selectedMethod === "card" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Visual 3D Credit Card */}
            <div className="md:col-span-5 h-44 rounded-2xl bg-gradient-to-tr from-brand-navy via-slate-900 to-teal-950 p-5 text-white flex flex-col justify-between shadow-xl border border-white/10 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-gold">
                  Moar Self-Drive Card Pass
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/20 uppercase">
                  {getCardBrand(cardNumber)}
                </span>
              </div>

              <div className="font-mono text-base tracking-widest font-bold">
                {cardNumber || "•••• •••• •••• ••••"}
              </div>

              <div className="flex justify-between items-end text-[10px] text-white/80">
                <div>
                  <p className="uppercase text-[8px] text-white/50">Card Holder</p>
                  <p className="font-bold text-xs uppercase">{cardName || "Renter Name"}</p>
                </div>
                <div>
                  <p className="uppercase text-[8px] text-white/50">Expires</p>
                  <p className="font-bold text-xs">{cardExpiry || "MM/YY"}</p>
                </div>
              </div>
            </div>

            {/* Card Inputs */}
            <div className="md:col-span-7 space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-navy">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  className="w-full p-2.5 rounded-xl bg-card border border-border text-xs font-mono font-bold text-brand-navy outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-brand-navy">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Name as printed on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-card border border-border text-xs font-bold text-brand-navy outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-navy">Valid Thru</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full p-2.5 rounded-xl bg-card border border-border text-xs font-mono font-bold text-brand-navy outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-brand-navy">CVV / CVC</label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                    className="w-full p-2.5 rounded-xl bg-card border border-border text-xs font-mono font-bold text-brand-navy outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. NET BANKING */}
        {selectedMethod === "netbanking" && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-navy block">Select Your Bank</span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {banks.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBank(b.id)}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all ${
                    selectedBank === b.id
                      ? "border-brand-teal bg-card ring-2 ring-brand-teal text-brand-teal shadow"
                      : "border-border bg-card text-brand-navy hover:border-brand-teal/40"
                  }`}
                >
                  <span>{b.logo}</span>
                  <span>{b.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. SPLIT PAYMENT */}
        {selectedMethod === "split" && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-brand-teal/10 border border-brand-teal/30 space-y-2">
              <h4 className="text-sm font-bold text-brand-teal flex items-center gap-1.5">
                <Split className="h-4 w-4" /> 20% Online Advance + 80% Balance at Handover
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Lock your desired car immediately with a 20% refundable token deposit (₹{advanceAmount.toLocaleString("en-IN")}). The remaining balance of ₹{(grandTotal - advanceAmount).toLocaleString("en-IN")} can be paid via UPI/Card during vehicle delivery.
              </p>
            </div>
          </div>
        )}

        {/* 5. CASH AT PICKUP */}
        {selectedMethod === "cash" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
              <Banknote className="h-4 w-4 text-amber-700" /> Pay Directly at Handover Desk
            </h4>
            <p className="text-xs text-amber-800 leading-relaxed">
              No online payment required now. Our airport/station fleet executive will collect ₹{grandTotal.toLocaleString("en-IN")} via cash or POS card machine during car key handover. Please keep original Driving License ready for verification.
            </p>
          </div>
        )}

        {/* 6. EMI & PAY LATER */}
        {selectedMethod === "emi" && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-brand-navy block">Select EMI Tenure</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[3, 6, 9, 12].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedEmiMonths(m)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedEmiMonths === m
                      ? "border-brand-teal bg-card ring-2 ring-brand-teal text-brand-teal font-bold shadow"
                      : "border-border bg-card text-brand-navy"
                  }`}
                >
                  <span className="text-xs font-bold block">{m} Months</span>
                  <span className="text-[11px] text-muted-foreground block">
                    ₹{Math.round((grandTotal * 1.05) / m).toLocaleString("en-IN")}/mo
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 7. RAZORPAY GATEWAY */}
        {selectedMethod === "razorpay" && (
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between text-xs text-blue-900">
            <div>
              <h4 className="font-bold">Instant Razorpay Smart Gateway</h4>
              <p className="text-[11px] text-blue-700">Supports Cred, PayLater, International Cards & NetBanking</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-xs">
              Verified Razorpay Checkout
            </span>
          </div>
        )}
      </div>

      {/* Security Assurance Footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border">
        <span className="flex items-center gap-1 text-emerald-600 font-bold">
          <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit SSL Bank Grade Encryption
        </span>
        <span>Zero Hidden Fees Guarantee</span>
      </div>
    </div>
  );
};
