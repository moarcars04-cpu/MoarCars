import React, { useState } from "react";
import {
  ShieldCheck,
  FileText,
  Printer,
  Search,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Car,
  Lock,
  RotateCcw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const LegalSection: React.FC = () => {
  const [activePolicy, setActivePolicy] = useState<
    "privacy" | "terms" | "cancellation" | "refund" | "insurance"
  >("terms");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-brand-gold" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                Compliance & Legal Governance
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Legal Policies & Rental Terms
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl">
              Transparent agreements governing your self-drive pilgrimage, security deposits, comprehensive insurance, and privacy rights under Indian law.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="h-10 px-4 rounded-xl border-white/20 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 flex items-center gap-1.5"
            >
              <Printer className="h-4 w-4" /> Print / Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Policy Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: "terms", label: "Terms & Conditions", icon: FileText },
          { id: "cancellation", label: "Cancellation Policy", icon: RotateCcw },
          { id: "refund", label: "Refund Policy (2-24h SLA)", icon: Zap },
          { id: "insurance", label: "Insurance & Coverage", icon: Car },
          { id: "privacy", label: "Privacy Policy (DPDP 2023)", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activePolicy === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePolicy(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-brand-gold text-brand-navy font-black shadow-lg shadow-amber-900/20"
                  : "bg-slate-900/60 border border-white/10 text-white/70 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Document Reader Container */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-10 text-white/80 space-y-8 leading-relaxed">
        {/* 1. TERMS & CONDITIONS */}
        {activePolicy === "terms" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                Moar Cars Self-Drive Master Agreement
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Standard Terms & Conditions of Rental
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Effective Date: September 2026 · Governing Jurisdiction: Tirupati District Court, Andhra Pradesh
              </p>
            </div>

            <section className="space-y-3 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                1. Driver Eligibility & Verification
              </h4>
              <p>
                The hirer/driver must be at least **21 years of age** and hold a valid, unexpired original **Driving License (LMV)** for a minimum of 1 year. For foreign nationals and NRIs, a valid passport, visa, and International Driving Permit (IDP) are mandatory. The customer agrees that no individual other than the verified driver shall operate the vehicle.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                2. Tirumala Ghat Road Guidelines
              </h4>
              <p>
                All vehicles dispatched from Tirupati Hub are certified for hill ascent. In accordance with the Tirumala Tirupati Devasthanams (TTD) and Andhra Pradesh Urban Police transport regulations:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-white/70">
                <li>Ghat Road operating hours are strictly **03:00 AM to 12:00 Midnight**.</li>
                <li>Downhill descent time between GNC Toll and Alipiri Checkpost must not be less than **28 minutes** to prevent brake fade and accidents.</li>
                <li>Overtaking on blind ghat curves is strictly prohibited by law.</li>
              </ul>
            </section>

            <section className="space-y-3 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                3. Speed Governance & Geofencing
              </h4>
              <p>
                As per Central Motor Vehicles Rules (CMVR) and Transport Department regulations, all rental commercial vehicles are fitted with an electronic Speed Limiting Device governed at **80 km/h**. Continuous speed violation alerts will trigger automated warning SMS and a penalty fee of ₹500 per instance.
              </p>
            </section>

            <section className="space-y-3 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                4. Fuel & Toll FASTag Policy
              </h4>
              <p>
                Vehicles are handed over with a **100% Full Tank** and must be returned with a 100% full tank. Electronic FASTag toll deductions will be billed on actuals based on National Highways Authority of India (NHAI) records.
              </p>
            </section>
          </div>
        )}

        {/* 2. CANCELLATION POLICY */}
        {activePolicy === "cancellation" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                Fair Pilgrimage Booking Protection
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Flexible Cancellation & Rescheduling Policy
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Designed to accommodate last-minute darshan schedule changes in Tirumala with zero stress.
              </p>
            </div>

            {/* Timeline Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-2">
                <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                  &gt; 24 Hours Before Pickup
                </span>
                <h4 className="text-base font-bold text-white">100% Full Refund</h4>
                <p className="text-xs text-white/60">
                  Zero cancellation fee. Entire booking fare and deposit are returned instantly to your original payment method.
                </p>
              </div>

              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-5 space-y-2">
                <span className="rounded-full bg-amber-500/20 text-brand-gold border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold">
                  6 - 24 Hours Before Pickup
                </span>
                <h4 className="text-base font-bold text-white">50% Cash or 100% Wallet</h4>
                <p className="text-xs text-white/60">
                  Choose between 50% instant bank payout or 100% Moar Wallet credit valid for lifetime use on any future trip.
                </p>
              </div>

              <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-2">
                <span className="rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold">
                  &lt; 6 Hours / No-Show
                </span>
                <h4 className="text-base font-bold text-white">1st Day Rental Retained</h4>
                <p className="text-xs text-white/60">
                  1st day rental charges apply to cover vehicle staging costs. Security deposit and remaining multi-day fares are 100% refunded.
                </p>
              </div>
            </div>

            <section className="space-y-3 text-xs sm:text-sm pt-4">
              <h4 className="text-sm font-bold text-white">Free Date Rescheduling</h4>
              <p>
                You can reschedule your booking pickup date up to **2 times for FREE** as long as the request is made at least 6 hours before the original scheduled pickup time.
              </p>
            </section>
          </div>
        )}

        {/* 3. REFUND POLICY */}
        {activePolicy === "refund" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                Automated Payout Engine
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Security Deposit & Booking Refund SLA
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Guaranteed 2 to 24 business hours UPI / IMPS payout with 0% processing charges.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Instant UPI Settlement Architecture</h4>
                  <p className="text-xs text-white/60">
                    Once our fleet auditor marks vehicle check-out complete, your refund transaction reference (`REF_UPI_2026_XXXX`) is generated in real time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <p className="font-bold text-brand-gold">UPI VPA Payouts</p>
                  <p className="text-white/60">Credited within **2 - 4 hours** directly to Google Pay, PhonePe, or Paytm UPI handle.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-white/5 space-y-1">
                  <p className="font-bold text-brand-gold">NetBanking / Cards</p>
                  <p className="text-white/60">Processed within **24 - 48 hours** as per standard RBI banking clearing cycles.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. INSURANCE POLICY */}
        {activePolicy === "insurance" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                Comprehensive Protection
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Commercial Insurance & Zero-Deductible Coverage
              </h3>
              <p className="text-xs text-white/50 mt-1">
                Underwritten by leading Indian insurance providers with cashless claims across 500+ service centers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Third-Party Liability</h4>
                <p className="text-xs text-white/60">
                  Unlimited coverage for third-party bodily injury and property damage up to ₹7,50,000 as per Motor Vehicles Act.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <ShieldCheck className="h-6 w-6 text-brand-gold" />
                <h4 className="text-sm font-bold text-white">Personal Accident Cover</h4>
                <p className="text-xs text-white/60">
                  ₹15,00,000 accidental death and permanent disability cover included for the primary verified driver and occupants.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
                <ShieldCheck className="h-6 w-6 text-sky-400" />
                <h4 className="text-sm font-bold text-white">Zero-Dep Protection</h4>
                <p className="text-xs text-white/60">
                  Minor scratches, bumper scuffs, and windshield stone chips are covered 100% with zero customer liability.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5. PRIVACY POLICY */}
        {activePolicy === "privacy" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider">
                Data Protection & DPDP Act 2023 Compliance
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                Customer Privacy & Telematics Governance
              </h3>
              <p className="text-xs text-white/50 mt-1">
                We respect your personal privacy. Your KYC documents and live location data are safeguarded with AES-256 military encryption.
              </p>
            </div>

            <section className="space-y-2 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white">1. KYC Document Security</h4>
              <p>
                Driving License, Aadhaar, and identity uploads are strictly used for verifying driving authorization as required by the Regional Transport Office (RTO). Document images are stored in encrypted vaults and never sold or shared with commercial marketing agencies.
              </p>
            </section>

            <section className="space-y-2 text-xs sm:text-sm">
              <h4 className="text-sm font-bold text-white">2. Vehicle GPS & Telemetry</h4>
              <p>
                All fleet vehicles are equipped with IoT GPS hardware. Telematics data is utilized exclusively for anti-theft security, emergency roadside dispatch (RSA), and speed governor monitoring on public roads.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
