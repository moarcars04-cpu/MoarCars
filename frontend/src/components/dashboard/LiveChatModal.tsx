import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Sparkles,
  Phone,
  ShieldCheck,
  Headphones,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "../../types/user";

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerName?: string;
}

const FAQ_KNOWLEDGE_BASE: { keywords: string[]; reply: string; suggestions?: string[] }[] = [
  {
    keywords: ["ghat", "tirumala", "timing", "hills", "climb"],
    reply: "🚗 **Tirumala Ghat Road Guidelines**:\n- **Ghat Road 1 (Down)** & **Ghat Road 2 (Up)** are open from **3:00 AM to 12:00 Midnight**.\n- Speed limit is **40 km/h** on ghats.\n- Minimum travel time between Alipiri Toll and GNC Toll is strictly **28 minutes** to ensure safe downhill driving.\n- All Moar Cars are hill-driving certified.",
    suggestions: ["Security deposit refund", "Fuel policy", "Fastag toll charges"],
  },
  {
    keywords: ["deposit", "refund", "security", "3000", "money back"],
    reply: "💰 **Security Deposit Refund Policy**:\n- Security deposit (₹3,000 for Hatchback/Sedan, ₹4,000 for SUV) is released immediately after vehicle return inspection.\n- Processed automatically via UPI directly to your bank account within **2 to 24 business hours**.",
    suggestions: ["Tirumala ghat timings", "How to extend booking", "Connect to human agent"],
  },
  {
    keywords: ["fuel", "petrol", "diesel", "tank"],
    reply: "⛽ **Fuel Policy (Full-to-Full)**:\n- We provide a 100% full tank upon vehicle dispatch.\n- Kindly return the car with a full tank. If there is a shortfall, standard fuel charges apply without hidden penalties.",
    suggestions: ["Fastag toll charges", "Roadside assistance", "Deposit refund"],
  },
  {
    keywords: ["fastag", "toll", "highway"],
    reply: "💳 **FASTag & Tolls**:\n- Every Moar Cars vehicle is fitted with an active ICICI/Kotak FASTag RFID sticker.\n- Toll deductions during your trip will be reconciled at check-out or deducted from deposit.",
    suggestions: ["Tirumala ghat timings", "Security deposit refund", "Connect to human agent"],
  },
  {
    keywords: ["agent", "human", "call", "executive", "representative", "support"],
    reply: "👨‍💼 **Connecting you with Moar Cars Tirupati Support**:\nOur senior dispatch executive **Nagaraju V (+91 98765 43210)** is notified. You can also tap 'Call Now' below for an instant phone line.",
    suggestions: ["Call +91 98765 43210", "WhatsApp Support", "Raise a ticket"],
  },
];

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose, customerName = "Member" }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_1",
      sender: "bot",
      text: `Namaste ${customerName}! 🙏 Welcome to Moar Cars 24/7 AI Concierge. How can I assist with your Tirupati self-drive trip today?`,
      timestamp: "Just now",
      suggestedActions: [
        "Tirumala Ghat timings",
        "Security deposit refund",
        "Fuel & FASTag policy",
        "Connect to live agent",
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: "usr_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");
    setIsTyping(true);

    // AI Bot Response logic
    setTimeout(() => {
      const lower = query.toLowerCase();
      let matched = FAQ_KNOWLEDGE_BASE.find((faq) =>
        faq.keywords.some((k) => lower.includes(k))
      );

      let botReply = matched
        ? matched.reply
        : `Thank you for your message! Our Tirupati Operations Support Desk has logged your query: "${query}". An executive will review your booking or you can request an instant callback.`;

      let suggestions = matched?.suggestions || [
        "Tirumala Ghat timings",
        "Security deposit refund",
        "Connect to human agent",
      ];

      const botMsg: ChatMessage = {
        id: "bot_" + Date.now(),
        sender: "bot",
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedActions: suggestions,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg h-[92vh] sm:h-[650px] flex flex-col rounded-t-3xl sm:rounded-3xl border border-white/10 bg-[#0b1120] text-white shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-gold text-brand-navy shadow-lg font-black">
                <Bot className="h-6 w-6" />
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">Moar AI Concierge</h3>
                <span className="rounded-full bg-amber-500/10 text-brand-gold border border-amber-500/30 px-1.5 py-0.2 text-[9px] font-bold uppercase">
                  Live
                </span>
              </div>
              <p className="text-[10px] text-white/50 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-400" /> Tirupati Hub Operations Desk (24/7)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+919876543210"
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-emerald-400 hover:bg-emerald-500/20"
              title="Call Helpline"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-800 text-white/70 hover:bg-slate-700 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin bg-radial from-slate-900/40 to-slate-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.sender !== "user" && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-brand-gold border border-brand-gold/30">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-brand-gold text-brand-navy font-semibold rounded-br-none shadow-md shadow-amber-900/20"
                      : "bg-slate-900/90 border border-white/10 text-white/90 rounded-bl-none shadow-lg whitespace-pre-line"
                  }`}
                >
                  {msg.text}
                </div>
              </div>

              <span className="text-[9px] text-white/40 mt-1 px-1 flex items-center gap-1">
                {msg.timestamp}
                {msg.sender === "user" && <CheckCheck className="h-3 w-3 text-brand-gold" />}
              </span>

              {/* Quick Action Suggestion Chips */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 pl-9">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(action)}
                      className="rounded-full bg-slate-800/90 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-brand-gold hover:bg-brand-gold hover:text-brand-navy transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-white/50 pl-9">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-brand-gold animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-brand-gold animate-bounce delay-100" />
                <div className="h-2 w-2 rounded-full bg-brand-gold animate-bounce delay-200" />
              </div>
              <span>Moar Assistant is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-white/10 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about Ghat rules, deposit, fuel, or booking..."
              className="flex-1 h-10 px-4 rounded-xl bg-slate-950 border border-white/15 text-xs text-white placeholder-white/40 focus:outline-none focus:border-brand-gold"
            />
            <Button
              type="submit"
              disabled={!inputText.trim()}
              className="h-10 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs hover:bg-brand-gold-soft disabled:opacity-40 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
