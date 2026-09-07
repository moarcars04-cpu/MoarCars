import React, { useState } from "react";
import { X, Rotate3d, ChevronLeft, ChevronRight, Eye, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Viewer360ModalProps {
  carName: string;
  images: string[];
  onClose: () => void;
  onBookNow: () => void;
}

export const Viewer360Modal: React.FC<Viewer360ModalProps> = ({
  carName,
  images,
  onClose,
  onBookNow,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);

  const displayImages = images.length > 0 ? images : [
    "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    if (Math.abs(diff) > 30) {
      if (diff > 0) handlePrev();
      else handleNext();
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-amber-500/30 p-6 text-white space-y-4 shadow-2xl overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-brand-gold">
              <Rotate3d className="h-5 w-5 animate-spin" style={{ animationDuration: "8s" }} />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">{carName} · 360° Studio View</h3>
              <p className="text-[10px] text-white/50">Drag left or right with mouse to rotate exterior angle</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* 360 Image Canvas */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="relative h-72 sm:h-96 rounded-2xl bg-black border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        >
          <img
            src={displayImages[currentIndex]}
            alt={`${carName} angle ${currentIndex + 1}`}
            className="h-full w-full object-cover pointer-events-none"
          />

          <div className="absolute top-4 left-4 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-brand-gold border border-white/10 flex items-center gap-1.5">
            <Rotate3d className="h-3.5 w-3.5" /> 360° Interactive Angle
          </div>

          {/* Left / Right Nav Arrows */}
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black border border-white/20"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black border border-white/20"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs text-white/60">
            Tirupati Fleet Inspection · 100% Sanitized & Zero-Dep Assured
          </p>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="h-10 rounded-xl border-white/20 text-white hover:bg-white/10 text-xs"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                onClose();
                onBookNow();
              }}
              className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft"
            >
              Book This Car Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
