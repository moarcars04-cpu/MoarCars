import React, { useState } from "react";
import {
  CalendarDays,
  MapPin,
  Car,
  Clock,
  CheckCircle2,
  FileText,
  Phone,
  ArrowRight,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { BookingItem } from "../../types/user";
import { Button } from "@/components/ui/button";

interface BookingsSectionProps {
  upcomingBookings: BookingItem[];
  recentBookings: BookingItem[];
  onBrowseFleet: () => void;
}

export const BookingsSection: React.FC<BookingsSectionProps> = ({
  upcomingBookings,
  recentBookings,
  onBrowseFleet,
}) => {
  const [tab, setTab] = useState<"upcoming" | "recent">("upcoming");
  const [selectedInvoice, setSelectedInvoice] = useState<BookingItem | null>(null);

  const displayList = tab === "upcoming" ? upcomingBookings : recentBookings;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 border border-white/10 p-1">
          <button
            type="button"
            onClick={() => setTab("upcoming")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              tab === "upcoming"
                ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Upcoming & Active ({upcomingBookings.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setTab("recent")}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              tab === "recent"
                ? "bg-brand-gold text-brand-navy shadow-md font-extrabold"
                : "text-white/70 hover:text-white"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Completed Trips ({recentBookings.length})</span>
          </button>
        </div>

        <Button
          onClick={onBrowseFleet}
          className="h-9 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs hover:bg-brand-gold-soft flex items-center gap-1.5"
        >
          <Car className="h-3.5 w-3.5" /> Book Another Car
        </Button>
      </div>

      {/* Bookings List */}
      {displayList.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-12 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 border border-white/10 text-brand-gold">
            <Car className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-white">
            {tab === "upcoming" ? "No Upcoming Trips" : "No Past Trips Yet"}
          </h4>
          <p className="text-xs text-white/60 max-w-sm mx-auto">
            {tab === "upcoming"
              ? "You don't have any active reservations. Browse our premium fleet and plan your pilgrimage or road trip!"
              : "Completed self-drive trips and rental invoices will appear here."}
          </p>
          <Button
            onClick={onBrowseFleet}
            className="h-10 px-6 rounded-xl bg-brand-gold text-brand-navy font-extrabold text-xs uppercase tracking-wide hover:bg-brand-gold-soft"
          >
            Explore Available Cars <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {displayList.map((booking) => (
            <div
              key={booking.id}
              className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 hover:border-brand-gold/40 transition-all shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-brand-gold">
                  <Car className="h-7 w-7" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-brand-gold">
                      #BK-{booking.id}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        booking.status === "Confirmed"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : booking.status === "Active"
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : booking.status === "Completed"
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-white/70">
                      {booking.bookingType || "Self Drive"}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{booking.carName}</h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-white/60 pt-1">
                    <span className="flex items-center gap-1 text-white/80">
                      <MapPin className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      {booking.pickup}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-brand-gold shrink-0" />
                      {booking.startDate} &rarr; {booking.endDate} ({booking.duration || "2 Days"})
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3 border-t lg:border-t-0 border-white/10 pt-3 lg:pt-0">
                <div className="text-left lg:text-right pr-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">Total Paid</p>
                  <p className="text-lg font-black text-brand-gold">
                    ₹{booking.amount?.toLocaleString("en-IN") || "3,499"}
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center lg:justify-end gap-0.5">
                    <ShieldCheck className="h-3 w-3" /> Dep: ₹{booking.securityDeposit || 3000} (Refundable)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setSelectedInvoice(booking)}
                    variant="outline"
                    className="h-9 rounded-xl border-white/20 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5" /> Invoice
                  </Button>

                  <a
                    href="tel:+918500012345"
                    className="flex h-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 text-xs font-bold text-brand-gold hover:bg-amber-500/20"
                  >
                    <Phone className="h-3.5 w-3.5 mr-1" /> Help Desk
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-lg w-full rounded-2xl bg-slate-900 border border-amber-500/30 p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold text-brand-navy font-black text-xs">M</span>
                <div>
                  <h4 className="text-sm font-bold">MOAR CARS INVOICE RECEIPT</h4>
                  <p className="text-[10px] font-mono text-brand-gold">INV-BK-{selectedInvoice.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-full p-1 text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/60 border border-white/10">
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Vehicle</p>
                  <p className="font-bold text-white">{selectedInvoice.carName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Pickup Hub</p>
                  <p className="font-bold text-white">{selectedInvoice.pickup}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Trip Duration</p>
                  <p className="font-bold text-white">{selectedInvoice.startDate} to {selectedInvoice.endDate}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase font-bold">Customer</p>
                  <p className="font-bold text-white">{selectedInvoice.customerName}</p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex justify-between text-white/70">
                  <span>Rental Charge</span>
                  <span>₹{((selectedInvoice.amount || 3499) - (selectedInvoice.taxAmount || 360)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>GST (18% Pilgrimage Tourism)</span>
                  <span>₹{selectedInvoice.taxAmount || 360}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Security Deposit (Refundable)</span>
                  <span>₹{selectedInvoice.securityDeposit || 3000}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-brand-gold pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span>₹{(selectedInvoice.amount || 3499).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => window.print()}
                className="flex-1 h-10 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
              >
                Print / Save PDF
              </Button>
              <Button
                onClick={() => setSelectedInvoice(null)}
                variant="outline"
                className="h-10 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
