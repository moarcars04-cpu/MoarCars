import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import dealBannerImg from "@/assets/moar-weekend-deal.jpg";

interface WeekendDealBannerProps {
  onGrabDeal?: () => void;
}

export const WeekendDealBanner: React.FC<WeekendDealBannerProps> = ({ onGrabDeal }) => {
  const handleClick = () => {
    if (onGrabDeal) {
      onGrabDeal();
    } else {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-5 sm:py-6 bg-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#070b14] via-[#0d1527] to-[#0a101f] text-white shadow-2xl border border-slate-800">
          {/* Background Image with overlay */}
          <img
            src={dealBannerImg}
            alt="Weekend Luxury Deals"
            className="absolute inset-0 h-full w-full object-cover object-center opacity-70 mix-blend-luminosity hover:opacity-80 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/80 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 px-5 py-8 sm:px-12 sm:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
            {/* Top-Right Gold Circular Discount Badge */}
            <div className="absolute top-5 right-5 sm:static sm:flex sm:flex-col sm:items-end sm:self-center">
              <div className="h-16 w-16 sm:h-24 sm:w-24 md:h-28 md:w-28 rounded-full bg-gradient-to-br from-[#fcd34d] via-[#d49b29] to-[#92600e] p-[2px] sm:p-[3px] shadow-2xl shadow-amber-500/30 flex items-center justify-center transform hover:rotate-6 transition-transform">
                <div className="h-full w-full rounded-full bg-[#0d1527] flex flex-col items-center justify-center text-center p-1 sm:p-2 leading-none border border-amber-300/40">
                  <span className="text-[7px] sm:text-[9px] font-black uppercase text-amber-300 tracking-wider">
                    UP TO
                  </span>
                  <span className="text-sm sm:text-2xl font-black text-white mt-0.5">
                    30%
                  </span>
                  <span className="text-[8px] sm:text-[10px] font-black uppercase text-amber-400 tracking-widest mt-0.5">
                    OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Left Texts & CTA */}
            <div className="max-w-xl space-y-3 sm:space-y-4 pr-16 sm:pr-0">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-[#d49b29] flex items-center gap-1.5">
                LIMITED TIME OFFER
              </span>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Weekend Luxury Deals
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-300 font-medium">
                Premium Cars. Unforgettable Weekends.
              </p>

              <div className="pt-2">
                <Button
                  onClick={handleClick}
                  className="h-11 sm:h-12 w-full sm:w-auto px-7 rounded-xl bg-gradient-to-r from-[#d49b29] to-[#c88d18] hover:from-[#c88d18] hover:to-[#b57d14] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#c88d18]/25 flex items-center justify-center gap-2 transition-transform hover:scale-[1.02]"
                >
                  <span>Grab the Deal</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
