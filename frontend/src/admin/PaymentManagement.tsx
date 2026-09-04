import React, { useState, useMemo } from "react";
import {
  CreditCard,
  Search,
  Download,
  DollarSign,
  ShieldCheck,
  Receipt,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  X,
  Printer,
  Coins,
  ArrowUpRight,
} from "lucide-react";
import { PaymentItem } from "./types";

interface PaymentManagementProps {
  payments: PaymentItem[];
  setPayments: React.Dispatch<React.SetStateAction<PaymentItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function PaymentManagement({
  payments,
  setPayments,
  setNotice,
}: PaymentManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterGateway, setFilterGateway] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<PaymentItem | null>(null);
  const [damageDeduction, setDamageDeduction] = useState<number>(0);
  const [deductionReason, setDeductionReason] = useState<string>("");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bookingId.toString().includes(searchQuery) ||
        p.transactionId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchGateway = filterGateway === "all" || p.gateway === filterGateway;
      const matchStatus = filterStatus === "all" || p.status === filterStatus;

      return matchSearch && matchGateway && matchStatus;
    });
  }, [payments, searchQuery, filterGateway, filterStatus]);

  const handleProcessDepositRefund = (payment: PaymentItem) => {
    const netRefund = Math.max(0, payment.depositAmount - damageDeduction);
    setPayments((prev) =>
      prev.map((p) =>
        p.id === payment.id
          ? {
              ...p,
              status: "Refunded",
              refundStatus: "Processed",
              refundAmount: netRefund,
            }
          : p
      )
    );
    setNotice({
      type: "success",
      text: `Security deposit refund of ₹${netRefund.toLocaleString()} released via instant UPI! (Deductions: ₹${damageDeduction})`,
    });
    setSelectedPaymentForRefund(null);
    setDamageDeduction(0);
    setDeductionReason("");
  };

  const handleExportCsv = () => {
    const headers = "TransactionID,BookingID,Customer,RentalFare,Deposit,GST18,Gateway,Status,Date\n";
    const rows = payments
      .map(
        (p) =>
          `${p.id},${p.bookingId},"${p.customerName}",${p.amount},${p.depositAmount},${p.gstAmount},${p.gateway},${p.status},${p.date}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `moar_payments_ledger_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    setNotice({ type: "success", text: "Payments ledger CSV exported successfully!" });
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <CreditCard className="w-6 h-6 text-[#D4AF37]" /> Payments Ledger & Security Escrow
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Multi-gateway reconciliation (Razorpay, Stripe, UPI, Cash, Wallet), GST 18%, TDS & deposit escrow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search transaction, customer, booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-purple-950 border border-purple-500/30 text-[#D4AF37] font-bold text-xs hover:bg-[#432650]"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Gross Collections</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            ₹{payments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5 font-bold">100% Reconciled</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Active Escrow Deposits Held</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">
            ₹{payments.filter((p) => p.status === "Captured").reduce((acc, p) => acc + p.depositAmount, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Held in Safe Escrow</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">GST Tax Collected (18%)</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">
            ₹{payments.reduce((acc, p) => acc + p.gstAmount, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">CGST (9%) + SGST (9%)</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Deposit Refunds Released</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            ₹{payments.filter((p) => p.status === "Refunded").reduce((acc, p) => acc + p.depositAmount, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5 font-bold">Instant UPI Settlement</p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {["all", "UPI", "Razorpay", "Stripe", "Cash", "Wallet"].map((gw) => (
            <button
              key={gw}
              onClick={() => setFilterGateway(gw)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
                filterGateway === gw
                  ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                  : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
              }`}
            >
              {gw === "all" ? "All Gateways" : gw}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {["all", "Captured", "Pending", "Refunded", "Partial"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold ${
                filterStatus === st
                  ? "bg-purple-950 text-[#D4AF37] border border-amber-400/40"
                  : "bg-[#14081E] text-purple-400 border border-purple-500/20 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* PAYMENTS LEDGER TABLE */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
            <tr>
              <th className="px-5 py-4">Transaction ID</th>
              <th className="px-5 py-4">Booking & Customer</th>
              <th className="px-5 py-4">Rental Fare</th>
              <th className="px-5 py-4">Security Escrow</th>
              <th className="px-5 py-4">GST (18%) & TDS</th>
              <th className="px-5 py-4">Gateway & Txn</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Escrow Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-purple-900/20 transition-colors">
                <td className="px-5 py-4 font-mono font-bold text-[#D4AF37]">{p.id}</td>
                <td className="px-5 py-4">
                  <p className="font-bold text-white">{p.customerName}</p>
                  <p className="text-[10px] text-purple-300 font-mono">Booking #{p.bookingId}</p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-black text-emerald-400 text-sm">₹{p.amount.toLocaleString()}</p>
                  {p.status === "Partial" && (
                    <span className="text-[9px] text-amber-300 font-bold block">Advance Paid: ₹2,000</span>
                  )}
                </td>
                <td className="px-5 py-4 font-bold text-purple-200">
                  ₹{p.depositAmount.toLocaleString()}
                </td>
                <td className="px-5 py-4 text-purple-300">
                  <p>GST: <strong className="text-white">₹{p.gstAmount}</strong></p>
                  <p className="text-[9px] text-purple-400">TDS: ₹{p.tdsAmount}</p>
                </td>
                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 border border-purple-500/30 text-purple-200">
                    {p.gateway}
                  </span>
                  <p className="text-[9px] text-purple-400 font-mono truncate max-w-[120px] mt-0.5">{p.transactionId}</p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                      p.status === "Captured"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : p.status === "Refunded"
                        ? "bg-purple-500/20 text-[#D4AF37] border-amber-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  {p.status === "Captured" && (
                    <button
                      onClick={() => setSelectedPaymentForRefund(p)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-[10px] shadow-md hover:opacity-95"
                    >
                      Release Deposit
                    </button>
                  )}
                  {p.status === "Refunded" && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Deposit Refunded
                    </span>
                  )}
                  {p.status === "Pending" && (
                    <span className="text-[10px] text-amber-300 font-bold">Awaiting Auth</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          MODAL: INSTANT DEPOSIT RELEASE & REFUND ENGINE
          ==================================================================== */}
      {selectedPaymentForRefund && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-md p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" /> Release Security Deposit: Booking #{selectedPaymentForRefund.bookingId}
              </h3>
              <button onClick={() => setSelectedPaymentForRefund(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-[#14081E] border border-purple-500/20 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-purple-300">Customer:</span>
                <span className="font-bold text-white">{selectedPaymentForRefund.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Escrow Deposit Held:</span>
                <span className="font-bold text-white">₹{selectedPaymentForRefund.depositAmount}</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Deduct Penalty / Damage Surcharge (₹)</label>
                <input
                  type="number"
                  value={damageDeduction}
                  onChange={(e) => setDamageDeduction(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-red-400 font-bold"
                />
              </div>

              {damageDeduction > 0 && (
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Deduction Reason</label>
                  <input
                    type="text"
                    value={deductionReason}
                    onChange={(e) => setDeductionReason(e.target.value)}
                    placeholder="e.g. 5 Litres fuel deficit, late return fine..."
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14081E] border border-purple-500/30 flex justify-between items-center text-xs font-bold">
              <span className="text-purple-300">Net Refund Payable to Customer:</span>
              <span className="text-base font-black text-emerald-400">
                ₹{Math.max(0, selectedPaymentForRefund.depositAmount - damageDeduction).toLocaleString()}
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/20">
              <button
                type="button"
                onClick={() => setSelectedPaymentForRefund(null)}
                className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleProcessDepositRefund(selectedPaymentForRefund)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Confirm Instant UPI Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
