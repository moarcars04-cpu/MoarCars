import React from "react";
import { Search, FileCheck, KeyRound, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HowItWorksSectionProps {
  onStartBooking?: () => void;
}

const STEPS = [
  {
    step: "01",
    icon: Search,
    title: "Choose Your Vehicle",
    description: "Browse sanitized hatchbacks, luxury sedans, or 4x4 Ghat SUVs. Pick your pickup hub (Airport, Railway Station, or Doorstep).",
    highlight: "Unlimited Kilometres Option",
  },
  {
    step: "02",
    icon: FileCheck,
    title: "60-Sec Digital KYC",
    description: "Upload your Driving Licence & Aadhaar once. Instant AI-assisted approval with zero physical paperwork or hassle.",
    highlight: "100% Paperless & Secure",
  },
  {
    step: "03",
    icon: KeyRound,
    title: "Instant Handover / Unlock",
    description: "Our fleet executive delivers the sanitized car right to your spot with a transparent digital condition report.",
    highlight: "Airport & Station Handover",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Drive & Rapid Deposit Refund",
    description: "Enjoy peaceful travel to Tirumala and beyond. Upon return, your refundable security deposit is credited within 2 hours.",
    highlight: "Guaranteed 2-Hour Refund",
  },
];

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartBooking }) => {
  return (
    <section className="py-24 bg-card border-b border-border relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10">
            <Sparkles className="h-3.5 w-3.5" /> Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            How Self-Drive Rental <span className="text-brand-teal">Works with Moar Cars</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            From booking your favorite car to hitting the open road in Tirupati, experience the smoothest and most transparent rental workflow.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="group relative rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                {/* Step indicator header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-brand-teal/20 group-hover:text-brand-teal transition-colors">
                    {s.step}
                  </span>
                  <div className="h-12 w-12 rounded-2xl bg-brand-mist flex items-center justify-center text-brand-navy group-hover:bg-brand-teal group-hover:text-white transition-all shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2 flex-1">
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-teal transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {s.description}
                  </p>
                </div>

                {/* Footer Highlight */}
                <div className="mt-6 pt-4 border-t border-border flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{s.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Bottom Banner */}
        <div className="p-8 rounded-3xl bg-brand-navy text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Zero Hidden Charges
            </span>
            <h3 className="text-2xl font-bold tracking-tight">Ready to Drive in Tirupati & Andhra Pradesh?</h3>
            <p className="text-xs text-white/70">
              Instant booking with transparent fuel policies, comprehensive insurance, and 24/7 highway support.
            </p>
          </div>

          <Button
            size="lg"
            onClick={onStartBooking}
            className="rounded-2xl bg-brand-gold hover:bg-brand-gold/90 text-brand-navy font-bold px-8 py-6 shadow-lg hover:shadow-brand-gold/20 flex items-center gap-2 shrink-0 transition-transform active:scale-95"
          >
            Find Available Cars <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};
