import React, { useState } from "react";
import {
  CheckCircle2,
  Clock,
  Car,
  CreditCard,
  UserCheck,
  Sparkles,
  Key,
  ShieldCheck,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";

export interface TimelineStepItem {
  id: number;
  label: string;
  description: string;
  timestamp?: string;
  icon: any;
}

interface BookingTimelineStepperProps {
  currentStepIndex: number; // 1 to 9
  status: string;
  isRefunded?: boolean;
}

const ALL_STEPS: TimelineStepItem[] = [
  {
    id: 1,
    label: "Booking Confirmed",
    description: "Reservation created and vehicle allocated",
    icon: CheckCircle2,
  },
  {
    id: 2,
    label: "Payment Received",
    description: "Online advance or payment token verified",
    icon: CreditCard,
  },
  {
    id: 3,
    label: "Executive Assigned",
    description: "Fleet supervisor allocated for vehicle handover",
    icon: UserCheck,
  },
  {
    id: 4,
    label: "Car Ready & Sanitized",
    description: "32-point inspection, fluids, and AC sanitation complete",
    icon: Sparkles,
  },
  {
    id: 5,
    label: "Pickup / Dispatch Started",
    description: "Vehicle en-route to selected airport/station/doorstep hub",
    icon: MapPin,
  },
  {
    id: 6,
    label: "Trip Started & Key Unlocked",
    description: "Digital ignition unlocked and start odometer logged",
    icon: Key,
  },
  {
    id: 7,
    label: "Trip Completed",
    description: "Vehicle safely returned to destination hub",
    icon: Car,
  },
  {
    id: 8,
    label: "Return Inspection Done",
    description: "Zero damage check and like-to-like fuel clearance",
    icon: ShieldCheck,
  },
  {
    id: 9,
    label: "Deposit Refund Completed",
    description: "Security deposit credited back to UPI in under 2 hours",
    icon: RotateCcw,
  },
];

export const BookingTimelineStepper: React.FC<BookingTimelineStepperProps> = ({
  currentStepIndex,
  status,
  isRefunded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive step if not numeric
  const activeStep =
    status === "Completed"
      ? isRefunded
        ? 9
        : 8
      : status === "Ongoing"
      ? 6
      : status === "Confirmed"
      ? 3
      : currentStepIndex || 2;

  return (
    <div className="rounded-2xl border border-border bg-brand-mist/30 p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-teal" />
          <span className="text-xs font-bold text-brand-navy">
            Trip Lifecycle Progression ({activeStep} of 9 Complete)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-bold text-brand-teal hover:underline flex items-center gap-1"
        >
          {isExpanded ? "Collapse Timeline" : "View Full 9 Steps"}
          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Progress Bar (Compact View) */}
      <div className="relative h-2 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-teal via-emerald-500 to-brand-gold rounded-full transition-all duration-500"
          style={{ width: `${(activeStep / 9) * 100}%` }}
        />
      </div>

      {/* Compact Quick Summary Strip */}
      {!isExpanded && (
        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Current: {ALL_STEPS[Math.min(activeStep - 1, 8)].label}
          </span>
          <span>
            {activeStep < 9
              ? `Next: ${ALL_STEPS[activeStep]?.label}`
              : "100% Completed & Refund Settled"}
          </span>
        </div>
      )}

      {/* Expanded Full Step-by-Step View */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-border">
          {ALL_STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.id <= activeStep;
            const isCurrent = step.id === activeStep;

            return (
              <div
                key={step.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isCurrent
                    ? "border-brand-teal bg-brand-teal/10 ring-1 ring-brand-teal"
                    : isCompleted
                    ? "border-border bg-card"
                    : "border-border/40 bg-muted/20 opacity-50"
                }`}
              >
                <div
                  className={`h-7 w-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-brand-teal text-white"
                      : isCompleted
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-brand-navy leading-tight">
                      {step.id}. {step.label}
                    </span>
                    {isCompleted && !isCurrent && (
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
