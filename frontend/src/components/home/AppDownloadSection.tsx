import React from "react";
import { Smartphone, QrCode, ShieldCheck, Key, Zap, Bell, Download, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AppDownloadSection: React.FC = () => {
  return (
    <section className="py-24 bg-brand-navy text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-teal/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-gold/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Copy & App Features */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-gold inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/5 border border-brand-gold/30">
                <Smartphone className="h-3.5 w-3.5 text-brand-gold" /> Moar Cars Mobile Experience
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Unlock, Drive & Manage in the <span className="text-brand-gold">Palm of Your Hand</span>
              </h2>
              <p className="text-sm sm:text-base text-white/70 max-w-xl leading-relaxed">
                Download the official Moar Cars iOS & Android app. Unlock your car digitally, track real-time telemetry, extend trips on the fly, and receive instant security deposit refunds.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Key,
                  title: "Keyless Mobile Unlock",
                  desc: "Unlock doors and start ignition directly from your phone.",
                },
                {
                  icon: Zap,
                  title: "Live GPS & Fuel Telematics",
                  desc: "Monitor battery, fuel level, and speed limit alerts.",
                },
                {
                  icon: ShieldCheck,
                  title: "60-Second Instant KYC",
                  desc: "AI face match and instant licence validation.",
                },
                {
                  icon: Bell,
                  title: "Automated Toll & Trip Insights",
                  desc: "Live FASTag itemized receipts and zero hidden fees.",
                },
              ].map((feat, i) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-brand-teal/50 transition-all space-y-1.5"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-brand-teal/20 text-brand-teal flex items-center justify-center shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{feat.title}</h4>
                    </div>
                    <p className="text-xs text-white/60 pl-9">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Store Download Buttons & QR */}
            <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* App store buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="#download-ios"
                  className="px-5 py-3 rounded-2xl bg-white text-brand-navy hover:bg-white/90 transition-all flex items-center gap-3 shadow-lg"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.79 1.43-.58.68-1.08 1.76-.95 2.8 1.08.08 2.12-.59 2.73-1.36z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground leading-none">Download on</p>
                    <p className="text-xs font-black text-brand-navy leading-tight">App Store</p>
                  </div>
                </a>

                <a
                  href="#download-android"
                  className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center gap-3 shadow-lg text-white"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186c-.194-.2-.31-.497-.31-.836V2.65c0-.339.116-.636.31-.836zM15.207 13.414l2.586 2.586-12.7 7.332 10.114-9.918zm0-2.828L5.093.668l12.7 7.332-2.586 2.586zm1.414 1.414l3.772 2.178c.806.465.806 1.224 0 1.689l-3.772 2.178-2.172-2.172 2.172-1.873z" />
                  </svg>
                  <div className="text-left">
                    <p className="text-[9px] uppercase font-bold text-white/60 leading-none">Get it on</p>
                    <p className="text-xs font-black text-white leading-tight">Google Play</p>
                  </div>
                </a>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="p-2 rounded-xl bg-white text-brand-navy">
                  <QrCode className="h-10 w-10" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">Scan to Download</p>
                  <p className="text-[10px] text-white/60">iOS & Android</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Phone Mockup Visual */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-72 sm:w-80 rounded-[40px] border-4 border-white/20 bg-card p-3 shadow-2xl overflow-hidden text-foreground">
              {/* Phone Speaker Notch */}
              <div className="mx-auto h-4 w-28 bg-brand-navy rounded-full mb-3" />

              {/* In-App Screen Content */}
              <div className="space-y-4 rounded-3xl bg-brand-navy p-4 text-white border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-brand-gold uppercase tracking-wider font-bold">Active Booking</p>
                    <h4 className="text-sm font-bold">Toyota Innova Crysta</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Connected
                  </span>
                </div>

                <div className="relative h-32 rounded-2xl overflow-hidden bg-card/10">
                  <img
                    src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=500&q=80"
                    alt="In-App Vehicle"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Digital Key Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-brand-teal text-white text-center cursor-pointer shadow">
                    <Key className="h-4 w-4 mx-auto mb-0.5" />
                    <span className="text-[10px] font-bold block">Unlock Doors</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-center cursor-pointer border border-white/10">
                    <Zap className="h-4 w-4 mx-auto mb-0.5 text-brand-gold" />
                    <span className="text-[10px] font-bold block">AC Pre-Cool</span>
                  </div>
                </div>

                {/* Telematics Info */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/70">
                  <span>Fuel: 78%</span>
                  <span>Range: 420 km</span>
                  <span>GPS: Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
