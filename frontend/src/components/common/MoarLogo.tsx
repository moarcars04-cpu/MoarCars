import React from "react";
import logoImg from "@/assets/moarcars-logo.png";

interface MoarLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
}

export const MoarLogo: React.FC<MoarLogoProps> = ({
  variant = "dark",
  size = "md",
  showTagline = false,
  className = "",
}) => {
  const heights = {
    sm: "h-8",
    md: "h-10 sm:h-11",
    lg: "h-12 sm:h-14",
    xl: "h-16 sm:h-20",
  };

  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-2.5">
        <img
          src={logoImg}
          alt="MOAR CARS"
          className={`${heights[size]} w-auto object-contain select-none`}
          onError={(e) => {
            // Graceful fallback to SVG if image fails
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {/* High quality typography fallback in case image is loading */}
        <div className="hidden flex-col items-start leading-none fallback-logo-text">
          <span
            className={`font-black tracking-wider text-xl ${
              variant === "light" ? "text-white" : "text-slate-900"
            }`}
          >
            MOAR <span className="text-[#c88d18]">CARS</span>
          </span>
          <span
            className={`text-[8px] font-bold uppercase tracking-[0.25em] ${
              variant === "light" ? "text-white/60" : "text-slate-500"
            }`}
          >
            Drive More. Explore More.
          </span>
        </div>
      </div>
      {showTagline && (
        <span
          className={`mt-1.5 text-[9px] font-bold uppercase tracking-[0.25em] ${
            variant === "light" ? "text-white/60" : "text-slate-500"
          }`}
        >
          DRIVE MORE. EXPLORE MORE.
        </span>
      )}
    </div>
  );
};
