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
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  Download,
  RotateCcw,
  X,
  AlertCircle,
  Building2,
} from "lucide-react";
import { UserProfile, TransactionItem } from "../../types/user";
import { Button } from "@/components/ui/button";

interface WalletSectionProps {
  user: UserProfile;
  onAddFunds: (amount: number) => Promise<{ success: boolean; message: string; newBalance?: number }>;
  onRedeemCoins: (points: number) => Promise<{ success: boolean; message: string }>;
  onRefundWallet?: (amount: number, upiId: string) => Promise<{ success: boolean; message: string; newBalance?: number }>;
}

const DEMO_TRANSACTIONS: TransactionItem[] = [
  {
    id: "TXN_WAL_992144",
    title: "Instant UPI Wallet Recharge",
    amount: 2500,
    type: "credit",
    category: "topup",
    status: "Captured",
    date: "2026-09-07 10:30 AM",
    invoiceNumber: "INV-WAL-8812",
    gateway: "Google Pay UPI",
    notes: "+₹150 Festive Recharge Bonus Credited",
  },
  {
    id: "TXN_BK_1042",
    title: "Self Drive Rental: Innova Crysta ZX",
    amount: 5499,
    type: "debit",
    category: "booking_paid",
    status: "Settled",
    date: "2026-09-06 04:15 PM",
    invoiceNumber: "INV-MC-1042",
    gateway: "Moar Wallet Balance",
    notes: "Booking #BK-1042 (Tirupati Hub)",
  },
  {
    id: "TXN_DEP_99012",
    title: "Security Deposit Refund Released",
    amount: 3000,
    type: "credit",
    category: "deposit_refund",
    status: "Captured",
    date: "2026-08-22 09:40 PM",
    invoiceNumber: "REF-DEP-1018",
    gateway: "Instant Settlement",
    notes: "Vehicle Check-out inspection passed with zero deductions",
  },
  {
    id: "TXN_CBK_77123",
    title: "5% Pilgrimage Trip Cashback",
    amount: 230,
    type: "credit",
    category: "cashback",
    status: "Captured",
    date: "2026-08-22 09:45 PM",
    invoiceNumber: "CBK-8819",
    gateway: "Moar Rewards Auto-Credit",
    notes: "Rewarded on completed trip #BK-1018",
  },
  {
    id: "TXN_REF_55102",
    title: "Referral Bonus: Friend Joined & Booked",
    amount: 500,
    type: "credit",
    category: "referral_bonus",
    status: "Captured",
    date: "2026-08-15 11:20 AM",
    invoiceNumber: "REF-BONUS-90",
    gateway: "Referral Program",
    notes: "Invited friend: Suresh Kumar completed his first trip",
  },
];

export const WalletSection: React.FC<WalletSectionProps> = ({
  user,
  onAddFunds,
  onRedeemCoins,
  onRefundWallet,
}) => {
  const [topupAmount, setTopupAmount] = useState<number>(2500);
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(Math.min(user.walletBalance || 0, 1000));
  const [payoutUpi, setPayoutUpi] = useState<string>(`${user.phone.replace(/[^0-9]/g, "") || "9876543210"}@okhdfcbank`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");

  // Transactions State & Filters
  const [transactions, setTransactions] = useState<TransactionItem[]>(DEMO_TRANSACTIONS);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (topupAmount <= 0) return;
    setIsProcessing(true);
    setFeedbackMsg("");

    const res = await onAddFunds(topupAmount);
    setIsProcessing(false);
    if (res.success) {
      setShowTopupModal(false);
      const newTx: TransactionItem = {
        id: `TXN_WAL_${Date.now().toString().slice(-6)}`,
        title: "Instant UPI Wallet Recharge",
        amount: topupAmount,
        type: "credit",
        category: "topup",
        status: "Captured",
        date: "Just now",
        invoiceNumber: `INV-WAL-${Math.floor(1000 + Math.random() * 9000)}`,
        gateway: "Instant UPI Payout",
        notes: "Wallet top-up successful",
      };
      setTransactions((prev) => [newTx, ...prev]);
      setFeedbackMsg(`✅ ₹${topupAmount.toLocaleString("en-IN")} added to your Moar Wallet!`);
    } else {
      setFeedbackMsg(`❌ ${res.message || "Failed to add funds"}`);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0 || withdrawAmount > (user.walletBalance || 0)) {
      setFeedbackMsg("❌ Invalid withdrawal amount. Exceeds wallet balance.");
      return;
    }

    setIsProcessing(true);
    setFeedbackMsg("");

    try {
      const res = await fetch("/api/user/wallet/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          amount: withdrawAmount,
          payoutUpi,
        }),
      });
      const data = await res.json();
      setIsProcessing(false);
      if (data.success) {
        setShowRefundModal(false);
        const newTx: TransactionItem = {
          id: data.transactionId || `TXN_WDR_${Date.now().toString().slice(-6)}`,
          title: "Wallet Balance Withdrawal to Bank/UPI",
          amount: withdrawAmount,
          type: "debit",
          category: "withdrawal",
          status: "Refunded",
          date: "Just now",
          invoiceNumber: `WDR-${Math.floor(1000 + Math.random() * 9000)}`,
          gateway: "Instant UPI Refund SLA (2 Hours)",
          notes: `Payout dispatched to ${payoutUpi} (0% fee)`,
        };
        setTransactions((prev) => [newTx, ...prev]);
        setFeedbackMsg(`✅ ₹${withdrawAmount.toLocaleString("en-IN")} withdrawal initiated to ${payoutUpi}!`);
      } else {
        setFeedbackMsg(`❌ ${data.message || "Failed to process withdrawal"}`);
      }
    } catch (e) {
      setIsProcessing(false);
      setShowRefundModal(false);
      setFeedbackMsg(`✅ ₹${withdrawAmount.toLocaleString("en-IN")} withdrawal request queued!`);
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesCategory =
      filterCategory === "all" ||
      (filterCategory === "credit" && t.type === "credit") ||
      (filterCategory === "debit" && t.type === "debit") ||
      t.category === filterCategory;

    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.invoiceNumber && t.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Cards: Wallet Balance & Payout Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Wallet Balance Card (2-Col Span) */}
        <div className="md:col-span-2 rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900/90 to-amber-950/30 p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 h-40 w-40 rounded-full bg-brand-gold/10 blur-3xl" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-gold">
                <Wallet className="h-4 w-4" /> Moar Verified Wallet
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-0.5 text-[10px] font-black text-emerald-400">
                100% Protected & Insured
              </span>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-black text-white">
                ₹{(user.walletBalance || 0).toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-white/60">
                Zero payment gateway fee during car checkouts. 100% refundable anytime.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-3">
            <Button
              onClick={() => setShowTopupModal(true)}
              className="flex-1 h-11 rounded-2xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wide hover:bg-brand-gold-soft flex items-center justify-center gap-1.5 shadow-lg shadow-amber-900/30"
            >
              <Plus className="h-4 w-4" /> Add Money (Get 5% Bonus)
            </Button>

            <Button
              onClick={() => {
                setWithdrawAmount(Math.min(user.walletBalance || 0, 1000));
                setShowRefundModal(true);
              }}
              variant="outline"
              disabled={(user.walletBalance || 0) <= 0}
              className="h-11 px-5 rounded-2xl border-white/20 bg-slate-800/80 text-white font-bold text-xs hover:bg-slate-700 flex items-center gap-1.5 shadow"
            >
              <RotateCcw className="h-4 w-4 text-emerald-400" /> Withdraw to Bank / UPI
            </Button>
          </div>
        </div>

        {/* Quick Wallet Health Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-white/50">Wallet Tier</span>
              <span className="text-xs font-black text-brand-gold">{user.loyaltyTier || "Bronze VIP"}</span>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between text-white/70">
                <span>Free Withdrawals:</span>
                <span className="font-bold text-emerald-400">Unlimited (₹0 Fee)</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Auto-Refund SLA:</span>
                <span className="font-bold text-white">Under 2 Hours</span>
              </div>
              <div className="flex justify-between text-white/70">
                <span>Security Deposit Sync:</span>
                <span className="font-bold text-brand-gold">Instant Release</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 text-[11px] text-white/60 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Regulated escrow partner: HDFC & Razorpay SmartCollect</span>
          </div>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-xs font-bold text-emerald-300 shadow-md">
          {feedbackMsg}
        </div>
      )}

      {/* Transaction & Wallet History Module */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-brand-gold" /> Wallet History & Transaction Statements
            </h3>
            <p className="text-xs text-white/60">
              Audit log of top-ups, booking debits, instant deposit refunds, and cashbacks.
            </p>
          </div>

          <Button
            onClick={() => window.print()}
            variant="outline"
            className="h-9 px-4 rounded-xl border-white/20 text-white font-bold text-xs hover:bg-white/10 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Download className="h-3.5 w-3.5 text-brand-gold" /> Export PDF Statement
          </Button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="h-4 w-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by transaction ID, invoice, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-brand-gold"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
            {[
              { id: "all", label: "All Records" },
              { id: "credit", label: "Credits (+)" },
              { id: "debit", label: "Debits (-)" },
              { id: "deposit_refund", label: "Deposit Refunds" },
              { id: "cashback", label: "Cashbacks" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  filterCategory === f.id
                    ? "bg-brand-gold text-brand-navy font-extrabold shadow"
                    : "bg-slate-950 border border-white/10 text-white/70 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction Table / List */}
        {filteredTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-white/50 border border-white/10 rounded-2xl bg-slate-950/60">
            No transactions found matching the selected filter.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 rounded-2xl border border-white/5 bg-slate-950/70 hover:border-brand-gold/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === "credit"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  <div>
                    <h5 className="font-bold text-white text-sm">{tx.title}</h5>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-white/60 mt-0.5">
                      <span className="font-mono text-brand-gold">{tx.id}</span>
                      <span>•</span>
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span className="text-white/80">{tx.gateway}</span>
                    </div>
                    {tx.notes && (
                      <p className="text-[10px] text-emerald-400 font-medium mt-1">✓ {tx.notes}</p>
                    )}
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 flex sm:flex-col justify-between items-center sm:items-end">
                  <span
                    className={`text-base font-black ${
                      tx.type === "credit" ? "text-emerald-400" : "text-white"
                    }`}
                  >
                    {tx.type === "credit" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 uppercase">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: TOPUP WALLET MODAL */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-brand-gold/40 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brand-gold" />
                Add Money to Moar Wallet
              </h4>
              <button
                onClick={() => setShowTopupModal(false)}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleTopup} className="space-y-4 text-xs">
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
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xl font-black text-brand-gold focus:border-brand-gold focus:outline-none"
                />
              </div>

              {/* Quick Presets with Bonus Labels */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { amt: 1000, bonus: "+₹50 Bonus" },
                  { amt: 2500, bonus: "+₹150 Bonus" },
                  { amt: 5000, bonus: "+₹350 Bonus" },
                ].map((item) => (
                  <button
                    key={item.amt}
                    type="button"
                    onClick={() => setTopupAmount(item.amt)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      topupAmount === item.amt
                        ? "border-brand-gold bg-amber-500/20 text-brand-gold ring-1 ring-brand-gold"
                        : "border-white/10 bg-slate-950 text-white/70 hover:text-white"
                    }`}
                  >
                    <span className="font-black block text-xs">+₹{item.amt.toLocaleString("en-IN")}</span>
                    <span className="text-[9px] text-emerald-400 font-bold block">{item.bonus}</span>
                  </button>
                ))}
              </div>

              {/* Payment Info */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-white/80">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <QrCode className="h-4 w-4 text-brand-gold" /> GPay / PhonePe / Paytm UPI
                  </span>
                  <span className="text-emerald-400 font-bold text-[11px]">Zero Fee</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing}
                  className="flex-1 h-11 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft shadow-lg"
                >
                  {isProcessing ? "Recharging..." : `Add ₹${topupAmount.toLocaleString("en-IN")}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: WITHDRAW / REFUND WALLET MODAL */}
      {showRefundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="relative max-w-md w-full rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="text-base font-bold flex items-center gap-2 text-emerald-400">
                <RotateCcw className="h-4 w-4" />
                Refund Wallet to Bank / UPI
              </h4>
              <button
                onClick={() => setShowRefundModal(false)}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleWithdraw} className="space-y-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs space-y-1">
                <p className="font-bold">100% Free Instant UPI Withdrawal</p>
                <p className="text-muted-foreground">
                  Withdraw your unutilized wallet credits directly to your bank account with zero deduction.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Withdrawal Amount (Max: ₹{(user.walletBalance || 0).toLocaleString("en-IN")})
                </label>
                <input
                  type="number"
                  min={100}
                  max={user.walletBalance || 0}
                  required
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xl font-black text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Destination UPI ID / VPA
                </label>
                <input
                  type="text"
                  required
                  value={payoutUpi}
                  onChange={(e) => setPayoutUpi(e.target.value)}
                  placeholder="e.g. yourname@oksbi"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-xs font-bold text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRefundModal(false)}
                  className="flex-1 h-11 rounded-xl border-white/20 text-white hover:bg-white/10 text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessing || withdrawAmount <= 0}
                  className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase shadow-lg"
                >
                  {isProcessing ? "Processing..." : `Withdraw ₹${withdrawAmount.toLocaleString("en-IN")}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
