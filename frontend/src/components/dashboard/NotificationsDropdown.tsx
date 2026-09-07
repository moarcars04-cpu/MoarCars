import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  Car,
  Gift,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Check,
  X,
  Clock,
  MessageSquare,
  ShieldCheck,
} from "lucide-react";
import { NotificationItem } from "../../types/user";
import { Button } from "@/components/ui/button";

interface NotificationsDropdownProps {
  notifications?: NotificationItem[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onNavigateTab: (tabId: string) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    title: "Welcome to Moar Cars!",
    message: "Your self-drive membership is active. 100 Moar Coins credited to your wallet.",
    type: "system",
    channel: "push",
    isRead: false,
    link: "wallet",
    timestamp: "10 mins ago",
  },
  {
    id: "notif_2",
    title: "Brahmotsavam Festive Offer Live 🪔",
    message: "Get Flat ₹500 OFF + 2X Loyalty Coins on SUV bookings with coupon TIRUMALA500.",
    type: "offer",
    channel: "whatsapp",
    isRead: false,
    link: "rewards",
    timestamp: "1 hour ago",
  },
  {
    id: "notif_3",
    title: "KYC Express Verification Ready",
    message: "Upload your Driving License & Aadhaar to enjoy zero-wait instant vehicle pickup at Station Hub.",
    type: "pickup",
    channel: "sms",
    isRead: true,
    link: "kyc",
    timestamp: "Yesterday",
  },
];

export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  notifications = DEFAULT_NOTIFICATIONS,
  onMarkRead,
  onMarkAllRead,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread" | "offers">("all");

  const displayList = notifications && notifications.length > 0 ? notifications : DEFAULT_NOTIFICATIONS;
  const unreadCount = displayList.filter((n) => !n.isRead).length;

  const filteredItems = displayList.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "offers") return n.type === "offer";
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
      case "pickup":
      case "return":
        return <Car className="h-4 w-4 text-brand-gold" />;
      case "offer":
        return <Gift className="h-4 w-4 text-emerald-400" />;
      case "support":
        return <MessageSquare className="h-4 w-4 text-sky-400" />;
      default:
        return <Sparkles className="h-4 w-4 text-amber-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-white/80 hover:bg-slate-700 hover:text-brand-gold transition-all"
        title="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-lg animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="fixed inset-x-4 top-16 z-50 md:absolute md:inset-auto md:right-0 md:top-12 w-auto md:w-96 rounded-3xl border border-white/10 bg-[#0f172a] shadow-2xl p-4 text-left animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white">Notifications</h4>
              {unreadCount > 0 && (
                <span className="rounded-full bg-brand-gold/20 px-2 py-0.5 text-[10px] font-bold text-brand-gold">
                  {unreadCount} New
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && onMarkAllRead && (
                <button
                  onClick={onMarkAllRead}
                  className="text-[11px] font-bold text-brand-gold hover:underline flex items-center gap-1"
                >
                  <Check className="h-3 w-3" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white md:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 py-2.5 border-b border-white/5">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: `Unread (${unreadCount})` },
              { id: "offers", label: "Deals & Offers" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all ${
                  filter === f.id
                    ? "bg-brand-gold text-brand-navy font-black"
                    : "bg-slate-800/80 text-white/60 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 py-1 scrollbar-thin">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center text-xs text-white/50">
                <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-400 mb-2 opacity-60" />
                No {filter !== "all" ? filter : ""} notifications right now.
              </div>
            ) : (
              filteredItems.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.isRead && onMarkRead) onMarkRead(notif.id);
                    if (notif.link) {
                      onNavigateTab(notif.link);
                      setIsOpen(false);
                    }
                  }}
                  className={`group relative flex items-start gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                    notif.isRead
                      ? "hover:bg-slate-800/40 opacity-75"
                      : "bg-brand-gold/5 hover:bg-brand-gold/10 border-l-2 border-brand-gold"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-800 border border-white/10 mt-0.5">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">{notif.title}</p>
                      <span className="text-[10px] text-white/40 shrink-0 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    {notif.link && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-brand-gold group-hover:underline pt-0.5">
                        View Details <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>

                  {!notif.isRead && (
                    <span className="h-2 w-2 rounded-full bg-brand-gold shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Multi-Channel Alerts Active
            </span>
            <button
              onClick={() => {
                onNavigateTab("settings");
                setIsOpen(false);
              }}
              className="font-bold text-brand-gold hover:underline"
            >
              Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
