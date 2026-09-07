import React, { useState } from "react";
import {
  Headphones,
  Phone,
  MessageSquare,
  Bot,
  AlertTriangle,
  ShieldCheck,
  Send,
  Plus,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  ExternalLink,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  Wrench,
  Sparkles,
  Paperclip,
  Check,
} from "lucide-react";
import { UserProfile, UserSupportTicket, BookingItem } from "../../types/user";
import { Button } from "@/components/ui/button";
import { LiveChatModal } from "./LiveChatModal";

interface SupportSectionProps {
  user: UserProfile;
  bookings?: BookingItem[];
  userTickets?: UserSupportTicket[];
}

const DEFAULT_TICKETS: UserSupportTicket[] = [
  {
    id: "TKT-882190",
    bookingId: 1001,
    category: "Payment / Refund",
    priority: "Medium",
    status: "Resolved",
    assignedAgent: "Nagaraju V (Accounts)",
    subject: "Security Deposit Settlement for Innova Crysta",
    messages: [
      {
        sender: "Customer",
        text: "Hi, I returned the vehicle yesterday at Tirupati Station Hub. When can I expect the ₹3,000 security deposit refund?",
        time: "2026-09-06 14:30",
      },
      {
        sender: "Agent",
        text: "Namaste! We checked the return audit report. The car was returned in pristine condition with a full tank. ₹3,000 has been credited back to your UPI (REF_UPI_2026_9941).",
        time: "2026-09-06 15:10",
      },
    ],
    createdAt: "2026-09-06 14:30",
    lastUpdated: "2026-09-06 15:10",
  },
  {
    id: "TKT-910442",
    category: "General Enquiry",
    priority: "Low",
    status: "In Progress",
    assignedAgent: "Support Desk",
    subject: "Fastag Toll deduction for Srikalahasti trip",
    messages: [
      {
        sender: "Customer",
        text: "Could you provide the toll pass breakdown for our trip to Srikalahasti and Kanipakam?",
        time: "2026-09-07 10:15",
      },
      {
        sender: "AI Assistant",
        text: "We have fetched your FASTag logs. Two toll plazas (Renigunta Toll ₹75 and Kanipakam Toll ₹60) were recorded.",
        time: "2026-09-07 10:16",
      },
    ],
    createdAt: "2026-09-07 10:15",
    lastUpdated: "2026-09-07 10:16",
  },
];

export const SupportSection: React.FC<SupportSectionProps> = ({
  user,
  bookings = [],
  userTickets = DEFAULT_TICKETS,
}) => {
  const [tickets, setTickets] = useState<UserSupportTicket[]>(
    userTickets.length > 0 ? userTickets : DEFAULT_TICKETS
  );
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<UserSupportTicket | null>(null);
  const [ticketFilter, setTicketFilter] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");

  // New Ticket Form State
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState<
    "Booking Issue" | "Car Breakdown" | "Payment / Refund" | "KYC Verification" | "General Enquiry"
  >("General Enquiry");
  const [newPriority, setNewPriority] = useState<"Critical" | "High" | "Medium" | "Low">("Medium");
  const [newBookingId, setNewBookingId] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [newAttachment, setNewAttachment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reply State
  const [replyText, setReplyText] = useState("");

  // Callback form
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState(user.phone || "");

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/user/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          customerName: user.name,
          customerPhone: user.phone,
          customerEmail: user.email,
          subject: newSubject,
          category: newCategory,
          priority: newPriority,
          bookingId: newBookingId ? Number(newBookingId) : undefined,
          message: newMessage,
          attachmentUrl: newAttachment || undefined,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setTickets([data.data, ...tickets]);
      } else {
        const fallbackTicket: UserSupportTicket = {
          id: "TKT-" + Math.floor(100000 + Math.random() * 900000),
          category: newCategory,
          priority: newPriority,
          status: "Open",
          subject: newSubject,
          bookingId: newBookingId ? Number(newBookingId) : undefined,
          assignedAgent: "Support Desk",
          messages: [
            {
              sender: "Customer",
              text: newMessage,
              time: new Date().toLocaleString(),
              attachmentUrl: newAttachment || undefined,
            },
            {
              sender: "AI Assistant",
              text: `Namaste ${user.name}! We have received your support ticket. Our Tirupati operations team will review and reply within 15 minutes.`,
              time: new Date().toLocaleString(),
            },
          ],
          createdAt: new Date().toLocaleString(),
          lastUpdated: new Date().toLocaleString(),
        };
        setTickets([fallbackTicket, ...tickets]);
      }

      setIsCreateModalOpen(false);
      setNewSubject("");
      setNewMessage("");
      setNewAttachment("");
    } catch {
      // Fallback
      setIsCreateModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyText.trim()) return;

    const newMsg = {
      sender: "Customer" as const,
      text: replyText.trim(),
      time: new Date().toLocaleString(),
    };

    const updated = {
      ...selectedTicket,
      status: "In Progress" as const,
      messages: [...selectedTicket.messages, newMsg],
      lastUpdated: new Date().toLocaleString(),
    };

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updated : t)));
    setSelectedTicket(updated);
    setReplyText("");

    try {
      await fetch(`/api/user/tickets/${selectedTicket.id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "Customer",
          message: replyText.trim(),
        }),
      });
    } catch {}
  };

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === "All") return true;
    return t.status === ticketFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-gold/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <p className="text-[11px] font-bold uppercase tracking-widest text-brand-gold">
                24/7 Customer Care & RSA Hub
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              How can we assist you today?
            </h2>
            <p className="text-xs sm:text-sm text-white/60 max-w-xl">
              Instant assistance for Tirumala self-drive rules, vehicle queries, security deposit settlements, and emergency roadside help.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => setIsChatOpen(true)}
              className="h-11 px-5 rounded-2xl bg-brand-gold text-brand-navy font-black text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-2 shadow-lg shadow-amber-900/20"
            >
              <Bot className="h-4 w-4" />
              Launch Live AI Chat
            </Button>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="outline"
              className="h-11 px-5 rounded-2xl border-white/20 bg-slate-800 text-xs font-bold text-white hover:bg-slate-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Raise Support Ticket
            </Button>
          </div>
        </div>
      </div>

      {/* 4 Direct Support Channels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Channel 1: WhatsApp Support */}
        <a
          href="https://wa.me/919876543210?text=Namaste%20Moar%20Cars%2C%20I%20need%20assistance%20regarding%20my%20self-drive%20rental."
          target="_blank"
          rel="noreferrer"
          className="group rounded-3xl border border-white/10 bg-slate-900/80 p-5 hover:border-emerald-500/50 hover:bg-emerald-950/10 transition-all shadow-lg space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-colors">
              <MessageCircle className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Avg 2 Min Reply
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
              WhatsApp Support
            </h3>
            <p className="text-xs text-white/60 mt-1">
              Chat directly with our Tirupati ground fleet manager on WhatsApp.
            </p>
          </div>
          <p className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 pt-1">
            Open WhatsApp <ExternalLink className="h-3 w-3" />
          </p>
        </a>

        {/* Channel 2: Phone Hotline */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 hover:border-brand-gold/50 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-brand-gold">
              <Phone className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-brand-gold">
              Toll-Free 24/7
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Call Helpline</h3>
            <p className="text-xs text-white/60 mt-1 font-mono">
              +91 98765 43210 / 1800-425-MOAR
            </p>
          </div>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-gold hover:underline pt-1"
          >
            Dial Call Now <ChevronRight className="h-3 w-3" />
          </a>
        </div>

        {/* Channel 3: Roadside Assistance */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 hover:border-rose-500/50 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <Wrench className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
              Corridor RSA
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Roadside Assistance (RSA)</h3>
            <p className="text-xs text-white/60 mt-1">
              Flat tyre, battery jumpstart, towing, and emergency replacement.
            </p>
          </div>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:underline pt-1"
          >
            Emergency Dispatch <ChevronRight className="h-3 w-3" />
          </a>
        </div>

        {/* Channel 4: Emergency SOS */}
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5 hover:border-amber-500/50 transition-all shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-400">
              SOS Hotlines
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Emergency Services</h3>
            <p className="text-xs text-white/60 mt-1">
              Tirumala Ghat (1800-425-4141), Police 100, Highway 1033.
            </p>
          </div>
          <a
            href="tel:18004254141"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-red-400 hover:underline pt-1"
          >
            Call Ghat SOS <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Quick Callback Request Box */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 text-brand-gold">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Request an Instant Callback</h4>
            <p className="text-xs text-white/60">
              Prefer speaking with a Tirupati fleet representative? We will call you within 5 minutes.
            </p>
          </div>
        </div>

        {callbackRequested ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" /> Callback requested for {callbackPhone}!
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCallbackRequested(true);
            }}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="tel"
              value={callbackPhone}
              onChange={(e) => setCallbackPhone(e.target.value)}
              placeholder="Your 10-digit mobile"
              className="h-10 px-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold w-full md:w-48"
              required
            />
            <Button
              type="submit"
              className="h-10 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft shrink-0"
            >
              Request Call
            </Button>
          </form>
        )}
      </div>

      {/* Support Tickets Section */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-black text-white">My Support Tickets</h3>
            <p className="text-xs text-white/60">
              Track resolution progress, attach receipts, or reply to customer support agents.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["All", "Open", "In Progress", "Resolved"].map((f) => (
              <button
                key={f}
                onClick={() => setTicketFilter(f as any)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                  ticketFilter === f
                    ? "bg-brand-gold text-brand-navy font-black"
                    : "bg-slate-800 text-white/60 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        {filteredTickets.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <HelpCircle className="h-10 w-10 mx-auto text-white/30" />
            <p className="text-xs text-white/60">No support tickets found under {ticketFilter}.</p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="h-9 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs hover:bg-brand-gold-soft"
            >
              Raise a Ticket
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className="group cursor-pointer rounded-2xl border border-white/10 bg-slate-950/60 p-5 hover:border-brand-gold/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-brand-gold">{ticket.id}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        ticket.status === "Resolved"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : ticket.status === "In Progress"
                          ? "bg-sky-500/20 text-sky-400 border border-sky-500/30"
                          : "bg-amber-500/20 text-brand-gold border border-amber-500/30"
                      }`}
                    >
                      {ticket.status}
                    </span>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-white/60 font-semibold">
                      {ticket.category}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-brand-gold transition-colors">
                    {ticket.subject}
                  </h4>
                  <p className="text-xs text-white/60 line-clamp-1">
                    {ticket.messages[ticket.messages.length - 1]?.text || "No message history"}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs text-white/50 shrink-0">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {ticket.lastUpdated || ticket.createdAt}
                  </span>
                  <span className="text-brand-gold font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    View Thread <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-white/10 bg-[#0f172a] text-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 bg-slate-900 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-brand-gold">{selectedTicket.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      selectedTicket.status === "Resolved"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-sky-500/20 text-sky-400"
                    }`}
                  >
                    {selectedTicket.status}
                  </span>
                  <span className="text-xs text-white/60">{selectedTicket.category}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedTicket.subject}</h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="h-8 w-8 rounded-full bg-slate-800 text-white/70 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin">
              {selectedTicket.messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "Customer" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      msg.sender === "Customer"
                        ? "bg-brand-gold text-brand-navy font-semibold rounded-br-none"
                        : "bg-slate-950 border border-white/10 text-white rounded-bl-none"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-75 font-bold">
                      <span>{msg.sender === "Customer" ? "You" : msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.attachmentUrl && (
                      <div className="pt-2 border-t border-black/10 text-[10px] flex items-center gap-1 font-bold">
                        <Paperclip className="h-3 w-3" /> Attached:{" "}
                        <a
                          href={msg.attachmentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          View Document / Photo
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Input Bar */}
            <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply to the support executive..."
                className="flex-1 h-10 px-4 rounded-xl bg-slate-950 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-gold"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply();
                }}
              />
              <Button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className="h-10 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft shrink-0 disabled:opacity-40"
              >
                <Send className="h-4 w-4 mr-1" /> Send
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Raise Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-gold" />
                <h3 className="text-base font-black text-white">Raise a Support Ticket</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="General Enquiry">General Enquiry</option>
                    <option value="Booking Issue">Booking Issue</option>
                    <option value="Car Breakdown">Car Breakdown / RSA</option>
                    <option value="Payment / Refund">Payment / Deposit Refund</option>
                    <option value="KYC Verification">KYC Verification</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical (Emergency)</option>
                  </select>
                </div>
              </div>

              {/* Related Booking Selector */}
              {bookings.length > 0 && (
                <div className="space-y-1.5">
                  <label className="font-bold text-white/80">Related Trip (Optional)</label>
                  <select
                    value={newBookingId}
                    onChange={(e) => setNewBookingId(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                  >
                    <option value="">No specific trip</option>
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        Trip #{b.id} - {b.carName} ({b.startDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g., Question about Ghat Road permit or Deposit refund"
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>

              {/* Detailed Message */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">Message Details</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Please describe your query or issue in detail..."
                  rows={4}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold resize-none"
                  required
                />
              </div>

              {/* Attachment Link */}
              <div className="space-y-1.5">
                <label className="font-bold text-white/80">Attachment URL (Optional)</label>
                <input
                  type="url"
                  value={newAttachment}
                  onChange={(e) => setNewAttachment(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full h-10 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  variant="outline"
                  className="h-10 px-4 rounded-xl border-white/10 text-xs font-bold text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft disabled:opacity-40"
                >
                  {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live AI Chat Widget Modal */}
      <LiveChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        customerName={user.name}
      />
    </div>
  );
};
