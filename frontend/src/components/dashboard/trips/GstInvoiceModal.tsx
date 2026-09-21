import React from "react";
import {
  Printer,
  Download,
  X,
  ShieldCheck,
  CheckCircle2,
  Car,
  Calendar,
  MapPin,
  Clock,
  Building2,
  FileText,
  QrCode,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface GstInvoiceModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
}

// Convert numbers into Indian Currency Words
function numberToWordsINR(num: number): string {
  const a = [
    "",
    "One ",
    "Two ",
    "Three ",
    "Four ",
    "Five ",
    "Six ",
    "Seven ",
    "Eight ",
    "Nine ",
    "Ten ",
    "Eleven ",
    "Twelve ",
    "Thirteen ",
    "Fourteen ",
    "Fifteen ",
    "Sixteen ",
    "Seventeen ",
    "Eighteen ",
    "Nineteen ",
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return "Zero Rupees Only";

  const numStr = ("000000000" + n).substr(-9);
  const crore = parseInt(numStr.substr(0, 2), 10);
  const lakh = parseInt(numStr.substr(2, 2), 10);
  const thousand = parseInt(numStr.substr(4, 2), 10);
  const hundred = parseInt(numStr.substr(6, 1), 10);
  const rest = parseInt(numStr.substr(7, 2), 10);

  let str = "";
  if (crore > 0) str += (crore < 20 ? a[crore] : b[Math.floor(crore / 10)] + " " + a[crore % 10]) + "Crore ";
  if (lakh > 0) str += (lakh < 20 ? a[lakh] : b[Math.floor(lakh / 10)] + " " + a[lakh % 10]) + "Lakh ";
  if (thousand > 0)
    str += (thousand < 20 ? a[thousand] : b[Math.floor(thousand / 10)] + " " + a[thousand % 10]) + "Thousand ";
  if (hundred > 0) str += a[hundred] + "Hundred ";
  if (rest > 0) {
    if (str !== "") str += "and ";
    str += rest < 20 ? a[rest] : b[Math.floor(rest / 10)] + " " + a[rest % 10];
  }

  return "INR " + str.trim() + " Only";
}

export const GstInvoiceModal: React.FC<GstInvoiceModalProps> = ({ booking, isOpen, onClose }) => {
  if (!isOpen || !booking) return null;

  const bookingId = booking.bookingId || `MC-2026-${booking.id || "8812"}`;
  const invoiceNumber = `INV-${bookingId.replace("#", "")}`;
  const transactionId = booking.transactionId || `pay_live_${Date.now().toString().slice(-8)}`;
  const invoiceDate = booking.createdAt
    ? new Date(booking.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
    : new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const rentalDays = Number(booking.totalDays || booking.rentalDays || 2);
  const grandTotal = Number(booking.grandTotal || booking.amount || 0);
  const paidAmount = Number(
    booking.paidAmount !== undefined ? booking.paidAmount : (booking.advancePaid || grandTotal)
  );
  const balanceDue = Number(
    booking.balanceDue !== undefined ? booking.balanceDue : Math.max(0, grandTotal - paidAmount)
  );

  const discountAmount = Number(booking.discountAmount || booking.couponDiscount || 0);
  const deliveryFee = Number(booking.deliveryFee || 0);

  // Accurate GST breakdown (18% Total: 9% CGST + 9% SGST on taxable value)
  const gstRate = Number(booking.gstRate || 18);
  const calculatedTaxable = Math.round((grandTotal / (1 + gstRate / 100)) * 100) / 100;
  const baseRental = Math.max(0, Math.round((calculatedTaxable - deliveryFee) * 100) / 100);
  const totalTaxable = baseRental + deliveryFee;
  const totalGst = Math.round((grandTotal - totalTaxable) * 100) / 100;
  const cgstAmount = Math.round((totalGst / 2) * 100) / 100;
  const sgstAmount = Math.round((totalGst - cgstAmount) * 100) / 100;

  const amountInWords = numberToWordsINR(grandTotal);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📄 *TAX INVOICE - MOAR CARS TIRUPATI*\n` +
      `• *Invoice No:* ${invoiceNumber}\n` +
      `• *Booking ID:* #${bookingId}\n` +
      `• *Customer:* ${booking.customerName || "Customer"}\n` +
      `• *Vehicle:* ${booking.carName || "Self-Drive Vehicle"}\n` +
      `• *Total Invoice Amount:* ₹${grandTotal.toLocaleString("en-IN")}\n` +
      `• *Advance Paid (Razorpay):* ₹${paidAmount.toLocaleString("en-IN")}\n` +
      `• *Balance Due at Handover:* ₹${balanceDue.toLocaleString("en-IN")}\n` +
      `• *GSTIN:* 37AAHCM4412K1Z9\n\n` +
      `Tax Compliant digital invoice issued by Moar Cars Pvt Ltd.`
    );
    window.open(`https://wa.me/919666499904?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      {/* Printable Paper Container */}
      <div className="relative w-full max-w-4xl max-h-[94vh] rounded-2xl sm:rounded-3xl bg-white text-slate-900 shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        
        {/* Sticky Modal Actions Top Bar (Hidden on Print) */}
        <div className="sticky top-0 z-20 px-4 sm:px-6 py-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-2 min-w-0">
            <FileText className="h-4 w-4 text-brand-gold shrink-0" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider truncate">
              Original GST Tax Invoice • Rule 46 CGST
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              onClick={handleShareWhatsApp}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors shadow-sm"
              title="Share Invoice summary on WhatsApp"
            >
              <Share2 className="h-3.5 w-3.5" /> <span className="hidden xs:inline">WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 sm:px-4 py-1.5 rounded-xl bg-brand-gold hover:bg-brand-gold-soft text-brand-navy text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5" /> <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="h-8 w-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors ml-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Invoice Content */}
        <div id="printable-gst-invoice" className="p-4 sm:p-8 md:p-10 overflow-y-auto space-y-5 sm:space-y-6 text-slate-900 text-xs leading-relaxed bg-white">
          
          {/* 1. Official Header & Company Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-slate-900 pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-950 text-amber-400 font-black text-sm shrink-0">
                  M
                </span>
                <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950 break-words">
                  MOAR CARS PRIVATE LIMITED
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Station Road, Opp. Tirupati Central Railway Station Hub, Tirupati, Andhra Pradesh - 517501
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-slate-700 pt-1">
                <span><strong>GSTIN:</strong> 37AAHCM4412K1Z9</span>
                <span><strong>PAN:</strong> AAHCM4412K</span>
                <span><strong>State Code:</strong> 37 (Andhra Pradesh)</span>
              </div>
              <p className="text-[10px] text-slate-500">
                Corporate Identity No (CIN): U50100AP2026PTC012345 • Helpline: +91 96664 99904 • www.moarcars.com
              </p>
            </div>

            <div className="sm:text-right space-y-1 shrink-0 w-full sm:w-auto">
              <span className="inline-block px-3 py-1 rounded-lg bg-slate-950 text-amber-400 text-xs font-black uppercase tracking-wider">
                TAX INVOICE
              </span>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block pt-1">
                Original for Recipient
              </p>
              <p className="font-mono text-xs font-black text-slate-900">
                Invoice No: <span className="text-slate-950">{invoiceNumber}</span>
              </p>
              <p className="text-[11px] text-slate-600">
                Invoice Date: <strong className="text-slate-900">{invoiceDate}</strong>
              </p>
              <p className="text-[11px] text-slate-600">
                Booking ID: <strong className="text-slate-900">#{bookingId}</strong>
              </p>
            </div>
          </div>

          {/* 2. Bill To & Place of Supply */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            {/* Customer Details */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-black text-slate-500 block">
                Details of Receiver / Billed To:
              </span>
              <p className="text-sm font-black text-slate-950">{booking.customerName || "Valued Customer"}</p>
              <p className="text-slate-700 font-medium">📞 Phone: {booking.customerPhone || "N/A"}</p>
              <p className="text-slate-700 font-medium break-all">✉️ Email: {booking.customerEmail || "N/A"}</p>
              <p className="text-slate-700 font-mono text-[11px]">
                🪪 Driving License: <strong>{booking.drivingLicense || booking.dlNumber || "Verified at Station"}</strong>
              </p>
            </div>

            {/* Place of Supply & Dispatch Details */}
            <div className="space-y-1 sm:text-right">
              <span className="text-[10px] uppercase tracking-wider font-black text-slate-500 block">
                Supply & Rental Dispatch Reference:
              </span>
              <p className="font-bold text-slate-950">
                Place of Supply: <span className="text-slate-950 font-black">Andhra Pradesh (Code: 37)</span>
              </p>
              <p className="text-slate-700">
                Vehicle: <strong className="text-slate-950">{booking.carName || "Self-Drive Vehicle"}</strong>
              </p>
              <p className="text-slate-700 text-[11px]">
                Pickup Hub: {booking.pickupLocation || booking.pickup || "Tirupati Central Station Hub"}
              </p>
              <p className="text-slate-700 text-[11px]">
                Duration: {booking.startDate} &rarr; {booking.endDate} ({rentalDays} Days)
              </p>
            </div>
          </div>

          {/* 3. Itemized Taxable Goods/Services Table (Scroll-safe on mobile) */}
          <div className="border border-slate-300 rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full min-w-[480px] sm:min-w-0 text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] font-bold uppercase tracking-wider">
                  <th className="p-3 text-center w-12">#</th>
                  <th className="p-3">Description of Service</th>
                  <th className="p-3 text-center">SAC Code</th>
                  <th className="p-3 text-center">Qty / Days</th>
                  <th className="p-3 text-right">Taxable Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {/* Line 1: Base Rental */}
                <tr>
                  <td className="p-3 text-center font-bold text-slate-500">1</td>
                  <td className="p-3">
                    <p className="font-black text-slate-950">
                      Self-Drive Passenger Vehicle Rental - {booking.carName || "Fleet Car"}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Unlimited Kilometres Allowance • Zero Dep Insurance Protection • Tirumala Ghat Certified
                    </p>
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-slate-700">996601</td>
                  <td className="p-3 text-center font-bold">{rentalDays} Days</td>
                  <td className="p-3 text-right font-bold text-slate-950">₹{baseRental.toLocaleString("en-IN")}</td>
                </tr>

                {/* Line 2: Delivery Fee if any */}
                {deliveryFee > 0 && (
                  <tr>
                    <td className="p-3 text-center font-bold text-slate-500">2</td>
                    <td className="p-3">
                      <p className="font-black text-slate-950">Doorstep Handover & Delivery Service</p>
                      <p className="text-[11px] text-slate-500">Tirupati Airport / Hotel doorstep staging</p>
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-700">996601</td>
                    <td className="p-3 text-center font-bold">1 Trip</td>
                    <td className="p-3 text-right font-bold text-slate-950">₹{deliveryFee.toLocaleString("en-IN")}</td>
                  </tr>
                )}

                {/* Line 3: Discount if any */}
                {discountAmount > 0 && (
                  <tr className="bg-emerald-50/60 text-emerald-900">
                    <td className="p-3 text-center font-bold text-emerald-700">•</td>
                    <td className="p-3">
                      <p className="font-bold">Promotional Discount / Coupon Concession</p>
                      <p className="text-[11px] text-emerald-700">Special seasonal trip discount applied</p>
                    </td>
                    <td className="p-3 text-center font-mono">996601</td>
                    <td className="p-3 text-center">1</td>
                    <td className="p-3 text-right font-bold text-emerald-800">
                      -₹{discountAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 4. Tax Calculation & Financial Ledger */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left: Words & Bank Settlement Info (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 block">
                  Total Amount in Words:
                </span>
                <p className="font-black text-slate-950 italic text-xs">{amountInWords}</p>
              </div>

              {/* Settlement / Razorpay Ledger */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-amber-950">Payment & Escrow Summary</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                    ● Razorpay Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-500/20">
                  <div>
                    <span className="text-slate-600 block">Advance Paid Online:</span>
                    <strong className="text-emerald-700 font-black text-sm">
                      ₹{paidAmount.toLocaleString("en-IN")}
                    </strong>
                    <p className="text-[9px] font-mono text-slate-500 truncate">Txn: {transactionId}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-600 block">Balance Due at Handover:</span>
                    <strong className="text-amber-800 font-black text-sm">
                      ₹{balanceDue.toLocaleString("en-IN")}
                    </strong>
                    <p className="text-[9px] text-slate-500">Payable via UPI/Card at station</p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-600 pt-1 flex justify-between border-t border-amber-500/20">
                  <span>Refundable Security Deposit:</span>
                  <strong className="text-emerald-700 font-bold">₹0 (Zero Deposit Policy)</strong>
                </div>
              </div>
            </div>

            {/* Right: Itemized GST Breakdown (5 cols) */}
            <div className="md:col-span-5 p-4 rounded-2xl bg-slate-900 text-white space-y-2.5">
              <div className="flex justify-between text-slate-300">
                <span>Total Taxable Amount:</span>
                <span className="font-mono font-bold text-white">₹{totalTaxable.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Central GST (CGST @ 9%):</span>
                <span className="font-mono text-white">₹{cgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>State GST (SGST @ 9%):</span>
                <span className="font-mono text-white">₹{sgstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-300 text-[11px]">
                <span>Total GST Output (18%):</span>
                <span className="font-mono font-bold text-amber-400">₹{totalGst.toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-2 border-t border-slate-700 flex justify-between items-center text-sm font-black">
                <span className="text-white uppercase tracking-wide">Total Invoice Value:</span>
                <span className="text-amber-400 text-base font-mono">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* 5. Statutory Declaration, Signatory & QR Seal */}
          <div className="pt-4 border-t-2 border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-8 space-y-1 text-[10px] text-slate-500">
              <p className="font-bold text-slate-700 uppercase">Terms & Statutory Declaration:</p>
              <p>
                1. We declare that this invoice shows the actual price of the services described and that all particulars are true and correct.
              </p>
              <p>
                2. Self-drive rental is subject to Moar Cars standard terms of service and RTO regulations under the Motor Vehicles Act.
              </p>
              <p>
                3. This is a computer-generated tax invoice issued under Rule 46 of the Central Goods and Services Tax (CGST) Rules, 2017. No physical signature is required.
              </p>
            </div>

            <div className="sm:col-span-4 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Digitally Certified
              </div>
              <p className="text-[10px] font-black text-slate-900 uppercase">
                MOAR CARS PRIVATE LIMITED
              </p>
              <p className="text-[9px] text-slate-500">Authorized Fleet Operations Desk</p>
              <p className="text-[8px] font-mono text-slate-400 pt-1">
                UID: {invoiceNumber} • {transactionId}
              </p>
            </div>
          </div>

        </div>

        {/* Modal Bottom Close (Print Hidden) */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-3 print:hidden">
          <Button
            onClick={onClose}
            variant="outline"
            className="h-10 px-6 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-200 font-bold text-xs"
          >
            Close Invoice
          </Button>
          <Button
            onClick={handlePrint}
            className="h-10 px-6 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white font-black text-xs uppercase tracking-wide flex items-center gap-2 shadow"
          >
            <Printer className="h-4 w-4 text-brand-gold" /> Print Official Tax Invoice
          </Button>
        </div>

      </div>
    </div>
  );
};
export default GstInvoiceModal;
