import React from "react";
import logoImg from "@/assets/moarcars-logo.png";

interface MoarLogoProps {
  variant?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl" | "navbar";
  showTagline?: boolean;
  className?: string;
  imgClassName?: string;
}

export const MoarLogo: React.FC<MoarLogoProps> = ({
  variant = "dark",
  size = "navbar",
  showTagline = false,
  className = "",
  imgClassName = "",
}) => {
  const heights = {
    sm: "h-9",
    md: "h-12 sm:h-14",
    navbar: "h-14 sm:h-16 md:h-18 lg:h-20",
    lg: "h-16 sm:h-20 md:h-22",
    xl: "h-20 sm:h-24 md:h-28",
  };

  return (
    <div className={`flex flex-col items-start justify-center ${className}`}>
      <div className="flex items-center gap-2.5">
        <img
          src={logoImg}
          alt="MOAR CARS - Drive Luxury. Drive MOAR."
          className={`${heights[size]} ${imgClassName} w-auto object-contain select-none transition-all duration-300 drop-shadow-sm`}
          onError={(e) => {
            // Graceful fallback to typography if image fails
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {/* High quality typography fallback in case image is loading */}
        <div className="hidden flex-col items-start leading-none fallback-logo-text">
          <span
            className={`font-black tracking-wider text-2xl ${
              variant === "light" ? "text-white" : "text-slate-900"
            }`}
          >
            MOAR <span className="text-[#c88d18]">CARS</span>
          </span>
          <span
            className={`text-[9px] font-bold uppercase tracking-[0.25em] ${
              variant === "light" ? "text-white/60" : "text-slate-500"
            }`}
          >
            Drive More. Explore More.
          </span>
        </div>
      </div>
      {showTagline && (
        <span
          className={`mt-1.5 text-[10px] font-bold uppercase tracking-[0.25em] ${
            variant === "light" ? "text-white/70" : "text-slate-500"
          }`}
        >
          DRIVE MORE. EXPLORE MORE.
        </span>
      )}
    </div>
  );
};
