import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Car,
  MapPin,
  Clock,
  ArrowLeft,
  Search,
  Sparkles,
  FileText,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PayBalancePageProps {
  onNavigate: (path: string, state?: any) => void;
}

export const PayBalancePage: React.FC<PayBalancePageProps> = ({ onNavigate }) => {
  const [bookingIdInput, setBookingIdInput] = useState<string>("");
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lookupError, setLookupError] = useState<string>("");
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [settledTxn, setSettledTxn] = useState<string>("");

  // Extract ID from query params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id") || params.get("bookingId");
    if (id) {
      setBookingIdInput(id);
      fetchBookingDetails(id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBookingDetails = async (idOrPhone: string) => {
    if (!idOrPhone.trim()) return;
    setLoading(true);
    setLookupError("");
    setPaymentSuccess(false);

    try {
      const res = await fetch(`/api/bookings/lookup?id=${encodeURIComponent(idOrPhone.trim())}`);
      const data = await res.json();
      if (data.success && data.data) {
        setBooking(data.data);
      } else {
        setBooking(null);
        setLookupError(data.message || "Booking reference not found. Please verify the ID.");
      }
    } catch (e: any) {
      setBooking(null);
      setLookupError("Failed to connect to dispatch server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingIdInput.trim()) {
      fetchBookingDetails(bookingIdInput);
    }
  };

  // Helper: Dynamically load Razorpay SDK
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayBalance = async () => {
    if (!booking) return;

    const balanceAmount = Number(booking.balanceDue || 0);
    if (balanceAmount <= 0) {
      alert("This booking has already been fully paid.");
      return;
    }

    setIsPaying(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert("Unable to load Razorpay payment gateway. Please check your internet connection.");
        setIsPaying(false);
        return;
      }

      const amountInPaise = Math.max(100, Math.round(balanceAmount * 100));
      const cleanPhone = (booking.customerPhone || "").replace(/\D/g, "");
      const bRef = booking.bookingId || `MC-2026-${booking.id}`;

      const options = {
        key: "rzp_test_SwedUUn1KgRMs0",
        amount: amountInPaise,
        currency: "INR",
        name: "MOAR CARS",
        description: `Remaining Balance Settlement: Booking #${bRef}`,
        image: "https://moarcars.com/assets/moarcars-logo-DK578w77.png",
        prefill: {
          name: booking.customerName || "Valued Customer",
          email: booking.customerEmail || "",
          contact: cleanPhone,
        },
        notes: {
          bookingId: bRef,
          carName: booking.carName || "Vehicle",
          type: "balance_settlement_online",
        },
        theme: {
          color: "#0b1426",
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
        handler: async function (response: any) {
          const paymentId = response.razorpay_payment_id || `rzp_bal_${Date.now()}`;
          try {
            const apiRes = await fetch("/api/bookings/pay-balance", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                bookingId: bRef,
                transactionId: paymentId,
                amountPaid: balanceAmount,
                paymentMethod: "Razorpay",
              }),
            });
            const resData = await apiRes.json();
            if (resData.success) {
              setBooking((prev: any) => ({
                ...prev,
                paidAmount: (Number(prev.paidAmount || 0) + balanceAmount),
                balanceDue: 0,
                paymentStatus: "Paid",
                transactionId: paymentId,
              }));
              setSettledTxn(paymentId);
              setPaymentSuccess(true);
            }
          } catch (err) {
            console.error("Payment API Error:", err);
          }
          setIsPaying(false);
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        setIsPaying(false);
        alert(`Payment declined: ${response.error?.description || "Gateway error"}`);
      });
      rzp.open();
    } catch (err: any) {
      setIsPaying(false);
      alert(err?.message || "Failed to initialize payment.");
    }
  };

  const grandTotal = Number(booking?.grandTotal || booking?.amount || 0);
  const paidAmount = Number(booking?.paidAmount || 0);
  const balanceDue = Number(booking?.balanceDue !== undefined ? booking?.balanceDue : Math.max(0, grandTotal - paidAmount));
  const baseFare = Number(booking?.baseFare || Math.round(grandTotal / 1.18));
  const gstAmount = Number(booking?.gstAmount || (grandTotal - baseFare));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => onNavigate("/")}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-950 font-bold text-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900 tracking-tight">
              MOAR <span className="text-[#b57d14]">CARS</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">
              | Secure Balance Payment
            </span>
          </div>
          <a
            href="tel:+918500012345"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+91 85000 12345</span>
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Search / Lookup Box */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-50 text-[#b57d14]">
                <Search className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-black text-slate-900">
                Lookup Booking &amp; Pay Remaining Balance
              </h2>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400">
              Instant Online Settlement
            </span>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={bookingIdInput}
              onChange={(e) => setBookingIdInput(e.target.value)}
              placeholder="Enter Booking ID (e.g. MC-2026-27 or Phone Number)"
              className="flex-1 h-12 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
            <Button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Searching...
                </>
              ) : (
                "Lookup Booking"
              )}
            </Button>
          </form>

          {lookupError && (
            <div className="mt-3 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{lookupError}</span>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm space-y-3">
            <Loader2 className="w-8 h-8 text-[#b57d14] animate-spin mx-auto" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Fetching verified booking reservation details...
            </p>
          </div>
        )}

        {/* Booking Card & Payment Section */}
        {!loading && booking && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Success Alert if just paid */}
            {paymentSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-500/80 rounded-3xl p-5 text-emerald-950 shadow-md space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <h3 className="text-base font-black text-emerald-900">
                    Remaining Balance Successfully Paid!
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                  Your reservation is now 100% settled. A full tax invoice and updated digital pass have been dispatched to <strong>{booking.customerEmail}</strong> from our official admin security mail.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-xl bg-white border border-emerald-200 font-bold text-emerald-700">
                    Txn: {settledTxn}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-bold">
                    Zero Balance Due
                  </span>
                </div>
              </div>
            )}

            {/* Trip Details Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
              <div className="px-6 py-4 bg-gradient-to-r from-[#0b1426] via-[#172554] to-[#0b1426] text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#d49b29] block">
                    Verified Reservation Pass
                  </span>
                  <h3 className="text-base font-black text-white">
                    Ref: #{booking.bookingId || `MC-2026-${booking.id}`}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${balanceDue > 0 ? "bg-amber-500/20 text-amber-300 border-amber-400/40" : "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"}`}>
                  {balanceDue > 0 ? "Balance Pending" : "Fully Settled"}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Vehicle & Customer Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Reserved Vehicle
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      {booking.carName || "Self-Drive Vehicle"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Customer: <strong className="text-slate-700">{booking.customerName || "Guest"}</strong> ({booking.customerPhone})
                    </p>
                  </div>
                  <div className="text-left sm:text-right space-y-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Rental Period
                    </span>
                    <p className="text-xs font-bold text-slate-800">
                      {booking.startDate || "Scheduled"}
                    </p>
                    <span className="text-[11px] text-slate-500 block">
                      Duration: {booking.totalDays || 1} Days (Unlimited KM)
                    </span>
                  </div>
                </div>

                {/* Station Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" /> Pickup Station
                    </span>
                    <strong className="text-slate-900 block text-sm font-extrabold">
                      {booking.pickupLocation || booking.pickup || "Tirupati Central Station Hub"}
                    </strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-600" /> Security PIN
                    </span>
                    <strong className="text-amber-800 block text-sm font-mono font-black">
                      #{booking.pickupOtp || "8492"} (For Handover Concierge)
                    </strong>
                  </div>
                </div>

                {/* Tax Invoice Breakdown Table */}
                <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
                  <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-amber-600" />
                      Tax Invoice Breakdown (GST 18%)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      GSTIN: 37AAECM9410P1ZF
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="p-3 flex justify-between text-slate-600">
                      <span>Base Rental Tariff ({booking.totalDays || 1} Days)</span>
                      <span className="font-semibold text-slate-900">₹{baseFare.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="p-3 flex justify-between text-slate-500 text-[11px]">
                      <span>Goods &amp; Services Tax (18% GST)</span>
                      <span>₹{gstAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="p-3 flex justify-between font-bold bg-slate-50 text-slate-900">
                      <span>Total Trip Fare (All-Inclusive)</span>
                      <span className="text-sm font-black">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="p-3 flex justify-between text-emerald-700 font-bold bg-emerald-50/60">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Advance Paid Online
                      </span>
                      <span>₹{paidAmount.toLocaleString("en-IN")}</span>
                    </div>
                    <div className={`p-4 flex justify-between items-center ${balanceDue > 0 ? "bg-amber-50 text-amber-950" : "bg-emerald-50 text-emerald-950"}`}>
                      <div>
                        <strong className="text-sm sm:text-base font-black block">
                          {balanceDue > 0 ? "Remaining Balance Payable" : "Remaining Balance"}
                        </strong>
                        <span className="text-[11px] font-medium text-slate-600">
                          {balanceDue > 0 ? "Payable now online via Razorpay or at station" : "Fully Settled - Zero balance"}
                        </span>
                      </div>
                      <span className={`text-xl sm:text-2xl font-black ${balanceDue > 0 ? "text-amber-800" : "text-emerald-700"}`}>
                        ₹{balanceDue.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Razorpay Pay Balance Button */}
                {balanceDue > 0 ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0b1426] via-[#172554] to-[#0b1426] text-white shadow-lg space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      <h4 className="text-sm sm:text-base font-black text-white">
                        Settle Balance Online with Razorpay
                      </h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Complete your final payment of <strong className="text-amber-300">₹{balanceDue.toLocaleString("en-IN")}</strong> using UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking. Once paid, your booking is completely cleared for direct key handover.
                    </p>
                    <Button
                      onClick={handleRazorpayPayBalance}
                      disabled={isPaying}
                      className="w-full h-13 rounded-2xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] hover:opacity-95 text-slate-950 font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <CreditCard className="w-5 h-5 text-slate-950" />
                      {isPaying ? "Connecting to Razorpay..." : `Pay ₹${balanceDue.toLocaleString("en-IN")} Balance Now`}
                    </Button>
                    <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 256-Bit Encrypted Gateway
                      </span>
                      <span>•</span>
                      <span>Instant Invoice Dispatch</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Trip is 100% Paid. No balance payment required at handover!
                    </span>
                    <Button
                      onClick={() => onNavigate("/")}
                      className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                    >
                      Return Home
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
