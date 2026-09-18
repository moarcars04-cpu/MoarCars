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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Bell className="w-6 h-6 text-[#c88d18]" /> Multi-Channel Notifications & Automated Triggers
          </h2>
          <p className="text-xs text-slate-400 mt-1">
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
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
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
                ? "bg-[#c88d18] text-slate-950 font-black shadow-md"
                : "bg-[#0b1426]/60 text-slate-400 border border-slate-800 hover:text-white"
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
            className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4 hover:border-[#c88d18]/40 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-slate-900 text-[#c88d18] border border-amber-400/30">
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
              <p className="text-xs font-bold text-slate-300">
                Subject: <span className="text-white">{t.subject}</span>
              </p>
            )}

            <p className="text-xs text-slate-300/90 bg-[#070e1c] p-4 rounded-2xl border border-slate-800 leading-relaxed font-mono">
              {t.body}
            </p>

            <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-[10px] text-slate-400">Available Variables: {"{{customer_name}}, {{booking_id}}, {{car_name}}"}</span>
              <button
                onClick={() => setEditingTemplate(t)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-[#c88d18]/20 text-[#c88d18] border border-slate-800 font-bold text-xs"
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
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#c88d18]" /> Edit Notification: {editingTemplate.trigger}
              </h3>
              <button onClick={() => setEditingTemplate(null)} className="text-slate-400 hover:text-white">
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
                  <label className="block text-slate-400 font-bold mb-1">Email Subject Line</label>
                  <input
                    name="subject"
                    defaultValue={editingTemplate.subject || ""}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 font-bold mb-1">Notification Body Template</label>
                <textarea
                  name="body"
                  rows={5}
                  defaultValue={editingTemplate.body}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-3 text-white font-mono"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTemplate(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
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
