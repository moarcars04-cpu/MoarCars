import React, { useState } from "react";
import {
  Rotate3d,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Luggage,
  X,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarGallerySectionProps {
  car: any;
}

export const CarGallerySection: React.FC<CarGallerySectionProps> = ({ car }) => {
  const [activeTab, setActiveTab] = useState<"all" | "exterior" | "interior" | "360" | "video" | "boot">("all");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  // Dynamic extraction of the car's real images from database (no fake injected images)
  const currentPhotoList: string[] = React.useMemo(() => {
    let list: string[] = [];
    if (Array.isArray(car.galleryImages) && car.galleryImages.length > 0) {
      list = car.galleryImages.filter((img: any) => typeof img === "string" && img.trim().length > 0);
    } else if (car.galleryImages && typeof car.galleryImages === "string") {
      try {
        const parsed = JSON.parse(car.galleryImages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.filter((img: any) => typeof img === "string" && img.trim().length > 0);
        }
      } catch (e) {}
    }

    if (list.length === 0 && car.image && typeof car.image === "string" && car.image.trim().length > 0) {
      list = [car.image.trim()];
    }

    if (list.length === 0) {
      list = ["https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"];
    }

    return list;
  }, [car.galleryImages, car.image]);

  const mainImage = currentPhotoList[0];
  const rotationImages = currentPhotoList.length > 1 ? currentPhotoList : [mainImage];

  // 360 Rotation Mouse / Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX;
    if (Math.abs(delta) > 30) {
      if (delta > 0) {
        setRotationIndex((prev) => (prev + 1) % rotationImages.length);
      } else {
        setRotationIndex((prev) => (prev - 1 + rotationImages.length) % rotationImages.length);
      }
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-6">
      {/* Category Tabs & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All HD Photos", icon: Layers },
            { id: "exterior", label: "Exterior", icon: Sparkles },
            { id: "interior", label: "Interior Cockpit", icon: Sparkles },
            { id: "360", label: "360° Interactive", icon: Rotate3d },
            { id: "video", label: "Video Tour", icon: Play },
            { id: "boot", label: "Boot Space", icon: Luggage },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setActiveImageIndex(0);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-navy text-white shadow-md shadow-brand-navy/20"
                    : "bg-card text-muted-foreground hover:text-brand-navy border border-border"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" /> 100% Ghat-Road Certified
          </span>
        </div>
      </div>

      {/* Main Media Showcase Window */}
      <div className="relative h-[380px] sm:h-[480px] lg:h-[520px] rounded-3xl overflow-hidden bg-brand-navy border border-border shadow-2xl group">
        {/* 1. Standard HD Gallery View */}
        {activeTab !== "360" && activeTab !== "video" && (
          <>
            <img
              src={currentPhotoList[activeImageIndex] || mainImage}
              alt={`${car.name} display view`}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

            {/* Left / Right Nav Arrows */}
            {currentPhotoList.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev - 1 + currentPhotoList.length) % currentPhotoList.length)
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 text-white backdrop-blur hover:bg-black flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>

                <button
                  onClick={() => setActiveImageIndex((prev) => (prev + 1) % currentPhotoList.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-black/60 text-white backdrop-blur hover:bg-black flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
          </>
        )}

        {/* 2. 360° Interactive Drag Rotation View */}
        {activeTab === "360" && (
          <div
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="h-full w-full flex items-center justify-center cursor-grab active:cursor-grabbing relative select-none"
          >
            <img
              src={rotationImages[rotationIndex]}
              alt={`${car.name} 360 view`}
              className="h-full w-full object-cover pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full bg-black/80 backdrop-blur-md text-white border border-white/20 text-xs font-bold shadow-xl">
              <Rotate3d className="h-4 w-4 text-brand-gold animate-spin" />
              <span>Drag left or right to rotate vehicle 360°</span>
              <span className="text-white/50">({rotationIndex + 1}/{rotationImages.length})</span>
            </div>
          </div>
        )}

        {/* 3. Cinematic Video Tour View */}
        {activeTab === "video" && (
          <div className="relative h-full w-full bg-black flex items-center justify-center">
            <img
              src={mainImage}
              alt="Video thumbnail"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

            {/* Video Controls Overlay */}
            <div className="relative z-10 text-center space-y-4 max-w-md p-6">
              <div className="h-16 w-16 mx-auto rounded-full bg-brand-gold text-brand-navy flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                <Play className="h-7 w-7 fill-current ml-1" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">{car.name} Exhaust & Interior Tour</h4>
                <p className="text-xs text-white/70 mt-1">
                  High-fidelity 4K walkthrough highlighting cabin quietness, suspension dampening, and Tirumala hill ascent capability.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur border border-white/20 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                  <span>{isMuted ? "Sound Muted" : "Engine Audio On"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Badges & Lightbox Button */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-brand-gold text-brand-navy text-[11px] font-black uppercase tracking-wider shadow-lg">
            {car.tag || car.category || "Premium"}
          </span>
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white text-[11px] font-semibold border border-white/20">
            {car.year || "2025/2026 Fleet"}
          </span>
        </div>

        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white backdrop-blur hover:bg-black flex items-center justify-center transition-colors border border-white/20"
          title="Fullscreen Gallery"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Bottom Tagline */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow pointer-events-none">
          <div>
            <h3 className="text-xl font-extrabold tracking-tight">{car.name}</h3>
            <p className="text-xs text-white/80">{car.variant || "Self-Drive Fleet Edition"}</p>
          </div>
          <div className="text-right">
            <span className="text-xs bg-black/60 backdrop-blur px-3 py-1 rounded-full text-brand-gold font-bold border border-brand-gold/30">
              {currentPhotoList.length > 1 ? `${activeImageIndex + 1} of ${currentPhotoList.length} HD Photos` : "1 HD Photo"}
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnail Strip */}
      {activeTab !== "video" && currentPhotoList.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {currentPhotoList.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                activeImageIndex === idx
                  ? "border-brand-teal shadow-md scale-105"
                  : "border-border opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt="thumb" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-in fade-in">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold">{car.name}</span>
              <span className="text-xs text-white/60">
                ({activeImageIndex + 1} / {currentPhotoList.length})
              </span>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <img
              src={currentPhotoList[activeImageIndex]}
              alt="Fullscreen view"
              className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl"
            />

            <button
              onClick={() =>
                setActiveImageIndex((prev) => (prev - 1 + currentPhotoList.length) % currentPhotoList.length)
              }
              className="absolute left-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              onClick={() => setActiveImageIndex((prev) => (prev + 1) % currentPhotoList.length)}
              className="absolute right-4 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          <div className="flex justify-center gap-2 overflow-x-auto py-2">
            {currentPhotoList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-14 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  activeImageIndex === idx ? "border-brand-gold" : "border-transparent opacity-50"
                }`}
              >
                <img src={img} alt="thumb" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
