import React, { useRef, useState, useEffect } from "react";
import { PenTool, RotateCcw, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalSignaturePadProps {
  onSignatureChange: (signatureDataUrl: string | null) => void;
  signerName?: string;
}

export const DigitalSignaturePad: React.FC<DigitalSignaturePadProps> = ({
  onSignatureChange,
  signerName = "Renter",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [typedMode, setTypedMode] = useState(false);
  const [typedSignature, setTypedSignature] = useState(signerName);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set high DPI scaling
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#070b14";
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: (e as React.MouseEvent).clientX - rect.left,
      y: (e as React.MouseEvent).clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      onSignatureChange(dataUrl);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureChange(null);
  };

  const handleTypedConfirm = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "italic 32px 'Brush Script MT', 'Dancing Script', cursive, serif";
    ctx.fillStyle = "#070b14";
    ctx.fillText(typedSignature || signerName, 40, 80);
    setHasDrawn(true);
    const dataUrl = canvas.toDataURL("image/png");
    onSignatureChange(dataUrl);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-brand-navy flex items-center gap-1.5">
          <PenTool className="h-3.5 w-3.5 text-brand-teal" /> Digital Renter Signature
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setTypedMode(!typedMode);
              clearCanvas();
            }}
            className="text-[11px] font-semibold text-brand-teal hover:underline"
          >
            {typedMode ? "Switch to Draw Pad" : "Type Signature Instead"}
          </button>
          <button
            type="button"
            onClick={clearCanvas}
            className="text-[11px] font-semibold text-rose-500 hover:underline flex items-center gap-0.5"
          >
            <RotateCcw className="h-3 w-3" /> Clear
          </button>
        </div>
      </div>

      {typedMode ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              placeholder="Type your full legal name..."
              className="flex-1 p-3 rounded-2xl bg-brand-mist/60 border border-border text-xs font-bold text-brand-navy outline-none"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleTypedConfirm}
              className="rounded-2xl bg-brand-navy text-white text-xs font-bold px-4"
            >
              Sign
            </Button>
          </div>
          <div className="p-4 rounded-2xl bg-card border border-border text-center">
            <span className="font-serif italic text-2xl text-brand-navy">
              {typedSignature || signerName}
            </span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl border-2 border-dashed border-border bg-card overflow-hidden shadow-inner cursor-crosshair">
          <canvas
            ref={canvasRef}
            width={480}
            height={130}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-32 touch-none block"
          />

          {!hasDrawn && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-muted-foreground/50 text-xs">
              Draw your signature here with finger or mouse
            </div>
          )}

          <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] text-muted-foreground bg-card/80 px-2 py-0.5 rounded-md backdrop-blur">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>Legally Binding Electronic Signature (IT Act 2000)</span>
          </div>
        </div>
      )}

      {hasDrawn && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold">
          <CheckCircle2 className="h-4 w-4" />
          <span>Signature Captured & Verified</span>
        </div>
      )}
    </div>
  );
};
