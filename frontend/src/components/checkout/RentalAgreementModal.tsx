import React, { useState } from "react";
import {
  FileText,
  X,
  Download,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Printer,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface RentalAgreementModalProps {
  car: any;
  renterName: string;
  renterPhone: string;
  renterEmail: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  signatureDataUrl?: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export const RentalAgreementModal: React.FC<RentalAgreementModalProps> = ({
  car,
  renterName,
  renterPhone,
  renterEmail,
  startDate,
  endDate,
  pickupLocation,
  signatureDataUrl,
  isOpen,
  onClose,
  onAccept,
}) => {
  const [hasAgreed, setHasAgreed] = useState(false);
  const [emailNotice, setEmailNotice] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleEmailCopy = () => {
    setEmailNotice(true);
    setTimeout(() => setEmailNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-brand-ink">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-brand-navy text-white">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-brand-teal/20 text-brand-teal flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Self-Drive Vehicle Rental Agreement</h3>
              <p className="text-xs text-white/70">Contract Reference: MOAR-AGR-2026-TIR</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Agreement Text Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-muted-foreground leading-relaxed">
          {/* Parties Strip */}
          <div className="p-4 rounded-2xl bg-brand-mist/60 border border-border space-y-2 text-brand-navy font-medium">
            <div className="flex justify-between">
              <span>Rental Provider:</span>
              <span className="font-bold">Moar Cars Private Limited, Tirupati, AP</span>
            </div>
            <div className="flex justify-between">
              <span>Primary Renter:</span>
              <span className="font-bold">{renterName || "Valued Customer"} ({renterPhone || "Phone"})</span>
            </div>
            <div className="flex justify-between">
              <span>Vehicle Allocated:</span>
              <span className="font-bold text-brand-teal">{car.name} ({car.tag || car.category})</span>
            </div>
            <div className="flex justify-between">
              <span>Rental Period:</span>
              <span className="font-bold">{startDate} to {endDate}</span>
            </div>
            <div className="flex justify-between">
              <span>Handover Hub:</span>
              <span className="font-bold">{pickupLocation}</span>
            </div>
          </div>

          {/* Section 1: Use of Vehicle & Ghat Road Safety */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-navy flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-brand-teal" /> 1. Vehicle Usage & Tirumala Ghat Road Undertaking
            </h4>
            <p>
              1.1 The Renter agrees to operate the vehicle strictly within the legal speed limits stipulated by the Andhra Pradesh Motor Vehicles Department and Tirumala Tirupati Devasthanams (TTD).
            </p>
            <p>
              1.2 <strong>TTD Ghat Transit Timing:</strong> The Renter expressly understands that TTD enforces minimum travel durations for the Tirumala Ghat Roads (28 minutes for Up-Ghat and 40 minutes for Down-Ghat). Overspeeding fines issued by automated camera tolls will be directly debited to the Renter.
            </p>
            <p>
              1.3 Zero alcohol tolerance policy applies. Driving under the influence of alcohol, narcotics, or unauthorized third-party driving will void all insurance benefits and incur legal prosecution.
            </p>
          </div>

          {/* Section 2: Fuel & Toll Policy */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-navy">2. Fuel & FASTag Tolls</h4>
            <p>
              2.1 <strong>Like-to-Like Fuel Policy:</strong> The vehicle will be delivered with a documented fuel level. The Renter agrees to return the vehicle with equivalent fuel.
            </p>
            <p>
              2.2 All fleet vehicles are equipped with active FASTag devices. Toll deductions incurred on state & national highways are adjusted at actual government tariff with zero markup.
            </p>
          </div>

          {/* Section 3: Security Deposit & Insurance */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-brand-navy">3. Security Deposit & 2-Hour Refund Guarantee</h4>
            <p>
              3.1 The refundable security deposit (₹3,000 to ₹5,000) will be credited back via UPI / bank transfer within 2 hours of vehicle check-in and digital condition report verification.
            </p>
            <p>
              3.2 The vehicle is protected under Comprehensive Zero-Depreciation Insurance. In case of accidental scratch or dent, maximum renter liability is capped strictly at the insurance deductible limit (₹1,500).
            </p>
          </div>

          {/* Signature Preview */}
          <div className="p-4 rounded-2xl bg-card border border-border flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brand-navy">Electronic Signature of Primary Renter:</p>
              <p className="text-[10px] text-muted-foreground">Digitally timestamped and recorded on file</p>
            </div>
            {signatureDataUrl ? (
              <img
                src={signatureDataUrl}
                alt="Signature Preview"
                className="h-12 max-w-[160px] object-contain border border-border rounded-lg p-1 bg-white"
              />
            ) : (
              <span className="text-xs italic text-muted-foreground">[Signature Captured on Checkout]</span>
            )}
          </div>
        </div>

        {/* Action Controls & Footer */}
        <div className="p-6 border-t border-border bg-brand-mist/30 space-y-4">
          <label className="flex items-start gap-2.5 text-xs text-brand-navy font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.target.checked)}
              className="mt-0.5 rounded text-brand-teal focus:ring-0 accent-brand-teal"
            />
            <span>
              I have read, understood, and accept all clauses in the Moar Cars Self-Drive Rental Agreement and agree to abide by Tirumala ghat safety regulations.
            </span>
          </label>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="text-xs font-bold text-brand-navy rounded-xl flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" /> Print / Save PDF
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleEmailCopy}
                className="text-xs font-bold text-brand-teal rounded-xl flex items-center gap-1.5"
              >
                <Mail className="h-3.5 w-3.5" /> {emailNotice ? "Email Dispatched!" : "Email Me Copy"}
              </Button>
            </div>

            <Button
              disabled={!hasAgreed}
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white text-xs font-bold px-6 shadow-md"
            >
              Confirm & Proceed
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
