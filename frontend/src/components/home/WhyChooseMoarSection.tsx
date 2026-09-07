import React from "react";
import { CheckCircle2, ShieldCheck, CreditCard, Clock, Truck, Shield } from "lucide-react";

export const WhyChooseMoarSection: React.FC = () => {
  const advantages = [
    {
      title: "Verified Cars",
      description: "All vehicles inspected and verified",
      icon: ShieldCheck,
    },
    {
      title: "Zero Hidden Charges",
      description: "Transparent pricing you can trust",
      icon: CreditCard,
    },
    {
      title: "Insurance Included",
      description: "Drive with complete peace of mind",
      icon: Shield,
    },
    {
      title: "Fast Delivery",
      description: "Get your car, at your convenience",
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-slate-50/60 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#c88d18] block">
              THE MOAR ADVANTAGE
            </span>
            <h2 className="mt-1 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Why Choose MOAR?
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            More than a rental. It&apos;s a better way to experience the world.
          </p>
        </div>

        {/* 4 Advantage Badges in a Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advantages.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
              >
                {/* Golden Outlined Circular Icon */}
                <div className="h-14 w-14 rounded-full border-2 border-[#d49b29] bg-amber-50/40 flex items-center justify-center text-[#c88d18] shrink-0 shadow-sm">
                  <Icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
