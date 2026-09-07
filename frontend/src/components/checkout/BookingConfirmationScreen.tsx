import React, { useState } from "react";
import {
  CheckCircle2,
  Download,
  Printer,
  MessageSquare,
  Mail,
  Smartphone,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileText,
  Car,
  QrCode,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BookingConfirmationScreenProps {
  bookingData: any;
  onGoToDashboard: () => void;
  onGoHome: () => void;
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  bookingData,
  onGoToDashboard,
  onGoHome,
}) => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [emailNotice, setEmailNotice] = useState(false);
  const [smsNotice, setSmsNotice] = useState(false);

  const bookingId = bookingData.bookingId || `MC-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const invoiceId = `INV-${bookingId}`;
  const transactionId = bookingData.transactionId || `TXN-MOAR-${Date.now().toString().slice(-6)}`;

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello Moar Cars! My Booking ID is #${bookingId} for ${bookingData.car?.name || "Vehicle"} on ${bookingData.startDate} at ${bookingData.pickupLocation}. Please confirm vehicle dispatch.`
    );
    window.open(`https://wa.me/918500012345?text=${text}`, "_blank");
  };

  const handleResendEmail = () => {
    setEmailNotice(true);
    setTimeout(() => setEmailNotice(false), 3000);
  };

  const handleResendSMS = () => {
    setSmsNotice(true);
    setTimeout(() => setSmsNotice(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 1. Celebratory Success Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-brand-navy text-white text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-xl">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <span className="px-3.5 py-1 rounded-full bg-brand-gold text-brand-navy text-xs font-black uppercase tracking-widest shadow">
            Booking Confirmed & Vehicle Secured
          </span>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            You're Ready to Drive, {bookingData.customerName?.split(" ")[0] || "Valued Guest"}!
          </h2>

          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed">
            Your self-drive reservation has been recorded in the database. Our Tirupati fleet team has assigned and sanitized your vehicle.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-mono font-bold text-brand-gold">
              Booking ID: #{bookingId}
            </span>
            <span className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur border border-white/20 text-xs font-mono font-bold text-white/90">
              Txn Ref: {transactionId}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Booking Details & Itinerary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vehicle & Trip Summary */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-md space-y-5">
          <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2 border-b border-border pb-3">
            <Car className="h-4 w-4 text-brand-teal" /> Reserved Vehicle & Handover
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={bookingData.car?.image || "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80"}
              alt={bookingData.car?.name}
              className="h-20 w-28 rounded-2xl object-cover border border-border bg-brand-navy shrink-0"
            />
            <div>
              <h4 className="text-base font-black text-brand-navy">{bookingData.car?.name}</h4>
              <p className="text-xs text-muted-foreground">{bookingData.car?.variant || "Self-Drive Edition"}</p>
              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                ✓ 32-Point Quality Inspected
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-navy block">Pickup Location</span>
                <span className="text-muted-foreground">{bookingData.pickupLocation}</span>
                <span className="text-[11px] text-brand-teal block font-semibold">
                  {bookingData.startDate} at {bookingData.startTime || "09:00 AM"}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-brand-navy block">Return Location</span>
                <span className="text-muted-foreground">{bookingData.dropLocation || bookingData.pickupLocation}</span>
                <span className="text-[11px] text-brand-gold block font-semibold">
                  {bookingData.endDate} at {bookingData.endTime || "09:00 PM"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Notification Channels */}
        <div className="p-6 rounded-3xl border border-border bg-card shadow-md space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-brand-navy flex items-center gap-2 border-b border-border pb-3">
              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Payment & Refund Guarantee
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Payment Method:</span>
                <span className="font-bold text-brand-navy uppercase">{bookingData.paymentMethod || "UPI / Online"}</span>
              </div>

              <div className="flex justify-between text-muted-foreground">
                <span>Total Paid Amount:</span>
                <span className="font-bold text-brand-navy">₹{bookingData.grandTotal?.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-emerald-600 font-bold bg-emerald-500/10 p-2 rounded-xl">
                <span>Refundable Deposit:</span>
                <span>₹{bookingData.securityDeposit?.toLocaleString("en-IN")} (2-Hr Return)</span>
              </div>
            </div>

            {/* Notification Channels */}
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-bold text-brand-navy block">Instant Alerts Sent To:</span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow transition-colors"
                  title="Open WhatsApp Confirmation"
                >
                  <MessageSquare className="h-3.5 w-3.5" /> WhatsApp
                </button>

                <button
                  type="button"
                  onClick={handleResendEmail}
                  className="p-2 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> {emailNotice ? "Sent!" : "Email PDF"}
                </button>

                <button
                  type="button"
                  onClick={handleResendSMS}
                  className="p-2 rounded-xl bg-card border border-border hover:border-brand-teal text-brand-navy text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-colors"
                >
                  <Smartphone className="h-3.5 w-3.5 text-brand-teal" /> {smsNotice ? "Sent!" : "SMS"}
                </button>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowInvoiceModal(true)}
            className="w-full rounded-2xl border-brand-teal text-brand-teal font-bold text-xs hover:bg-brand-teal hover:text-white flex items-center justify-center gap-1.5 mt-2"
          >
            <FileText className="h-4 w-4" /> View & Print GST Tax Invoice
          </Button>
        </div>
      </div>

      {/* 3. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          size="lg"
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl bg-brand-navy hover:bg-brand-navy/90 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
        >
          Go to My Bookings Dashboard <ArrowRight className="h-4 w-4" />
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={onGoHome}
          className="w-full sm:w-auto px-8 h-12 rounded-2xl border-border text-brand-navy font-bold text-xs hover:bg-brand-mist/60"
        >
          Return to Fleet Home
        </Button>
      </div>

      {/* 4. GST Tax Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white p-8 shadow-2xl overflow-y-auto space-y-6 text-slate-900 border border-border">
            {/* Invoice Header */}
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">MOAR CARS PRIVATE LIMITED</h3>
                <p className="text-xs text-slate-500 mt-0.5">Station Road, Tirupati, Andhra Pradesh 517501</p>
                <p className="text-xs text-slate-500">GSTIN: 37AAACM0412R1Z8 | CIN: U50100AP2026PTC08912</p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold px-3 py-1 rounded bg-teal-100 text-teal-800 uppercase">
                  Tax Invoice
                </span>
                <p className="text-xs font-mono font-bold mt-2">Invoice: {invoiceId}</p>
                <p className="text-[11px] text-slate-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Billed to */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-500 uppercase">Billed To (Customer):</span>
                <p className="font-bold text-slate-900">{bookingData.customerName || "Customer Name"}</p>
                <p className="text-slate-600">{bookingData.customerPhone || "Phone Number"}</p>
                <p className="text-slate-600">{bookingData.customerEmail || "Email Address"}</p>
              </div>
              <div className="space-y-1 text-right">
                <span className="font-bold text-slate-500 uppercase">Trip Reference:</span>
                <p className="font-bold text-teal-700">{bookingData.car?.name}</p>
                <p className="text-slate-600">{bookingData.startDate} to {bookingData.endDate}</p>
                <p className="text-slate-600">Pickup: {bookingData.pickupLocation}</p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-100 border-b text-slate-700 font-bold">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">HSN/SAC</th>
                    <th className="p-3 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-600">
                  <tr>
                    <td className="p-3">Self-Drive Car Rental Service ({bookingData.car?.name})</td>
                    <td className="p-3 text-center font-mono">996601</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{bookingData.baseFare?.toLocaleString("en-IN") || "2,499"}
                    </td>
                  </tr>
                  {bookingData.deliveryFee > 0 && (
                    <tr>
                      <td className="p-3">Express Doorstep Delivery Service</td>
                      <td className="p-3 text-center font-mono">996601</td>
                      <td className="p-3 text-right font-bold text-slate-900">₹{bookingData.deliveryFee}</td>
                    </tr>
                  )}
                  {bookingData.discountAmount > 0 && (
                    <tr className="text-emerald-700 font-semibold bg-emerald-50">
                      <td className="p-3">Promo & Referral Discount Applied</td>
                      <td className="p-3 text-center">-</td>
                      <td className="p-3 text-right">-₹{bookingData.discountAmount?.toLocaleString("en-IN")}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="p-3">CGST (9%) + SGST (9%)</td>
                    <td className="p-3 text-center font-mono">18%</td>
                    <td className="p-3 text-right font-bold text-slate-900">
                      ₹{bookingData.gstAmount?.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr className="bg-teal-50 font-bold text-teal-900">
                    <td className="p-3">Refundable Security Deposit (Exempt from GST)</td>
                    <td className="p-3 text-center">-</td>
                    <td className="p-3 text-right">₹{bookingData.securityDeposit?.toLocaleString("en-IN")}</td>
                  </tr>
                </tbody>
                <tfoot className="border-t bg-slate-900 text-white font-bold">
                  <tr>
                    <td colSpan={2} className="p-3 text-right uppercase">
                      Total Invoice Amount (INR):
                    </td>
                    <td className="p-3 text-right text-base text-amber-400">
                      ₹{bookingData.grandTotal?.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Footer & Print action */}
            <div className="flex items-center justify-between pt-3 border-t">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <QrCode className="h-8 w-8 text-slate-900" />
                <span>Digitally Generated Invoice • No Physical Signature Required</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handlePrintInvoice}
                  className="rounded-xl border-slate-300 text-xs font-bold flex items-center gap-1"
                >
                  <Printer className="h-3.5 w-3.5" /> Print Invoice
                </Button>
                <Button
                  onClick={() => setShowInvoiceModal(false)}
                  className="rounded-xl bg-slate-900 text-white text-xs font-bold px-5"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
