import React, { useState } from "react";
import {
  Bell,
  Mail,
  Smartphone,
  Send,
  CheckCircle2,
  Edit,
  Sparkles,
  X,
  MessageSquare,
  Clock,
  Car,
  DollarSign,
  FileCheck,
} from "lucide-react";
import { NotificationTemplateItem } from "./types";

interface NotificationsCenterProps {
  templates: NotificationTemplateItem[];
  setTemplates: React.Dispatch<React.SetStateAction<NotificationTemplateItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function NotificationsCenter({
  templates,
  setTemplates,
  setNotice,
}: NotificationsCenterProps) {
  const [activeChannel, setActiveChannel] = useState<string>("all");
  const [editingTemplate, setEditingTemplate] = useState<NotificationTemplateItem | null>(null);

  const filtered = activeChannel === "all" ? templates : templates.filter((t) => t.channel === activeChannel);

  const handleToggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    );
    setNotice({ type: "info", text: "Notification trigger status toggled." });
  };

  const handleSaveTemplate = (body: string, subject?: string) => {
    if (!editingTemplate) return;
    setTemplates((prev) =>
      prev.map((t) => (t.id === editingTemplate.id ? { ...t, body, subject } : t))
    );
    setNotice({ type: "success", text: "Notification template updated!" });
    setEditingTemplate(null);
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Bell className="w-6 h-6 text-[#D4AF37]" /> Multi-Channel Notifications & Automated Triggers
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Automated lifecycle notifications for WhatsApp, SMS, Email & Mobile Push reminders
          </p>
        </div>

        <button
          onClick={() => {
            const testPhone = prompt("Enter mobile phone to send test WhatsApp dispatch ping:", "+91 98765 11223");
            if (testPhone) {
              setNotice({ type: "success", text: `Test WhatsApp notification sent to ${testPhone} via Meta API!` });
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
        >
          <Send className="w-3.5 h-3.5" /> Send Test Notification
        </button>
      </div>

      {/* CHANNEL TABS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {["all", "WhatsApp", "SMS", "Email", "Push"].map((ch) => (
          <button
            key={ch}
            onClick={() => setActiveChannel(ch)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all capitalize ${
              activeChannel === ch
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {ch === "all" ? "All Channels" : ch}
          </button>
        ))}
      </div>

      {/* TEMPLATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4 hover:border-[#D4AF37]/40 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-950 text-[#D4AF37] border border-amber-400/30">
                  {t.channel} Gateway
                </span>
                <h4 className="font-bold text-base text-white mt-1">{t.trigger}</h4>
              </div>
              <button
                onClick={() => handleToggleTemplate(t.id)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                  t.isActive
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border-red-500/30"
                }`}
              >
                {t.isActive ? "Active" : "Disabled"}
              </button>
            </div>

            {t.subject && (
              <p className="text-xs font-bold text-purple-200">
                Subject: <span className="text-white">{t.subject}</span>
              </p>
            )}

            <p className="text-xs text-purple-200/90 bg-[#14081E] p-4 rounded-2xl border border-purple-500/20 leading-relaxed font-mono">
              {t.body}
            </p>

            <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center text-xs">
              <span className="text-[10px] text-purple-400">Available Variables: {"{{customer_name}}, {{booking_id}}, {{car_name}}"}</span>
              <button
                onClick={() => setEditingTemplate(t)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-950/80 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30 font-bold text-xs"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#D4AF37]" /> Edit Notification: {editingTemplate.trigger}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as any;
                handleSaveTemplate(form.body.value, form.subject?.value);
              }}
              className="space-y-3 text-xs"
            >
              {editingTemplate.channel === "Email" && (
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Email Subject Line</label>
                  <input
                    name="subject"
                    defaultValue={editingTemplate.subject || ""}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-purple-300 font-bold mb-1">Notification Body Template</label>
                <textarea
                  name="body"
                  rows={5}
                  defaultValue={editingTemplate.body}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-white font-mono"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
