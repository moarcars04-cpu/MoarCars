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
    sm: "h-8",
    md: "h-10",
    navbar: "h-10 sm:h-11 md:h-12 scale-[1.3] sm:scale-[1.45] origin-left",
    lg: "h-14 sm:h-16",
    xl: "h-18 sm:h-20",
  };

  return (
    <div className={`flex flex-col items-start justify-center ${className}`}>
      <div className="flex items-center gap-2">
        <img
          src={logoImg}
          alt="MOAR CARS - Drive Luxury. Drive MOAR."
          className={`${heights[size]} ${imgClassName} w-auto object-contain select-none transition-transform duration-300 drop-shadow-sm`}
          onError={(e) => {
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
          className={`mt-1 text-[9px] font-bold uppercase tracking-[0.25em] ${
            variant === "light" ? "text-white/70" : "text-slate-500"
          }`}
        >
          DRIVE MORE. EXPLORE MORE.
        </span>
      )}
    </div>
  );
};
