import React, { useState } from "react";
import {
  Headphones,
  Search,
  MessageSquare,
  AlertTriangle,
  Send,
  User,
  Clock,
  CheckCircle2,
  X,
  Phone,
  ShieldAlert,
} from "lucide-react";
import { SupportTicketItem } from "./types";
import { adminApi } from "./adminApi";

interface SupportDeskProps {
  tickets: SupportTicketItem[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicketItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function SupportDesk({
  tickets,
  setTickets,
  setNotice,
}: SupportDeskProps) {
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [activeChatTicket, setActiveChatTicket] = useState<SupportTicketItem | null>(null);
  const [chatInput, setChatInput] = useState("");

  const filtered = filterPriority === "all" ? tickets : tickets.filter((t) => t.priority === filterPriority);

  const handleSendMessage = () => {
    if (!activeChatTicket || !chatInput.trim()) return;
    const newMsg = { sender: "Agent" as const, text: chatInput, time: "Just now" };
    const updatedMessages = [...activeChatTicket.messages, newMsg];
    
    setTickets((prev) =>
      prev.map((t) =>
        t.id === activeChatTicket.id
          ? { ...t, messages: updatedMessages, status: "In Progress" }
          : t
      )
    );
    setActiveChatTicket({
      ...activeChatTicket,
      messages: updatedMessages,
      status: "In Progress",
    });
    setChatInput("");
    setNotice({ type: "success", text: "Support message sent to customer!" });
    adminApi.updateSupportTicket(activeChatTicket.id, {
      messages: updatedMessages,
      status: "In Progress",
    });
  };

  const handleUpdateStatus = (id: string, status: any) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    setNotice({ type: "success", text: `Ticket #${id} status updated to "${status}".` });
    adminApi.updateSupportTicket(id, { status });
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Headphones className="w-6 h-6 text-[#D4AF37]" /> Customer Helpdesk, Live Chat & Escalations
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Resolve customer queries, roadside assistance tickets, payment refunds, and emergency dispatches
          </p>
        </div>

        <div className="flex gap-2 text-xs">
          {["all", "Critical", "High", "Medium", "Low"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
                filterPriority === p
                  ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                  : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
              }`}
            >
              {p === "all" ? "All Priorities" : `${p} Priority`}
            </button>
          ))}
        </div>
      </div>

      {/* TICKETS TABLE */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
            <tr>
              <th className="px-5 py-4">Ticket ID & Subject</th>
              <th className="px-5 py-4">Customer Contact</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Assigned Agent</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-purple-900/20 transition-colors">
                <td className="px-5 py-4">
                  <span className="font-mono text-[#D4AF37] font-bold block">{t.id}</span>
                  <p className="font-bold text-white text-xs mt-0.5">{t.subject}</p>
                  <p className="text-[10px] text-purple-400">{t.createdAt}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-white">{t.customerName}</p>
                  <p className="text-[10px] text-purple-300">{t.customerPhone}</p>
                  {t.bookingId && <p className="text-[9px] text-[#D4AF37] font-mono">Booking #{t.bookingId}</p>}
                </td>

                <td className="px-5 py-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 border border-purple-500/30 text-purple-200">
                    {t.category}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                      t.priority === "Critical"
                        ? "bg-red-500/20 text-red-300 border-red-500/40 animate-pulse"
                        : t.priority === "High"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-purple-500/20 text-purple-200 border-purple-500/30"
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>

                <td className="px-5 py-4 font-bold text-white">
                  {t.assignedAgent}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={t.status}
                    onChange={(e) => handleUpdateStatus(t.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                      t.status === "Open"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : t.status === "In Progress"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    <option value="Open" className="bg-[#14081E] text-white">Open</option>
                    <option value="In Progress" className="bg-[#14081E] text-white">In Progress</option>
                    <option value="Resolved" className="bg-[#14081E] text-white">Resolved</option>
                    <option value="Closed" className="bg-[#14081E] text-white">Closed</option>
                  </select>
                </td>

                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => setActiveChatTicket(t)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30 font-bold ml-auto"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> Live Chat
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* LIVE CHAT DRAWER MODAL */}
      {activeChatTicket && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4 flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <div>
                <h3 className="text-base font-black flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#D4AF37]" /> Chat: {activeChatTicket.customerName}
                </h3>
                <p className="text-xs text-purple-300">{activeChatTicket.subject} &bull; {activeChatTicket.customerPhone}</p>
              </div>
              <button onClick={() => setActiveChatTicket(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MESSAGES THREAD */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#14081E] border border-purple-500/20 min-h-[220px]">
              {activeChatTicket.messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${m.sender === "Agent" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                      m.sender === "Agent"
                        ? "bg-[#D4AF37] text-slate-950 font-semibold rounded-br-none"
                        : "bg-[#2A1336] text-purple-100 border border-purple-500/30 rounded-bl-none"
                    }`}
                  >
                    <p>{m.text}</p>
                    <span className={`text-[9px] block mt-1 ${m.sender === "Agent" ? "text-slate-800" : "text-purple-400"}`}>
                      {m.sender} &bull; {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* INPUT */}
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your official support response..."
                className="flex-1 bg-[#14081E] border border-purple-500/30 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
