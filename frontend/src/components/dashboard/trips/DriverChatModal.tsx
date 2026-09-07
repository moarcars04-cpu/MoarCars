import React, { useState } from "react";
import { X, Send, User, Phone, CheckCheck, Sparkles, Car } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DriverChatModalProps {
  driverName?: string;
  driverPhone?: string;
  carName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface MessageItem {
  id: number;
  sender: "user" | "driver";
  text: string;
  time: string;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({
  driverName = "Srinivasulu Reddy",
  driverPhone = "+91 85000 12345",
  carName,
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      sender: "driver",
      text: `Namaste! I am your Moar Cars Fleet Executive for ${carName}. The vehicle is sanitized and inspected.`,
      time: "Just now",
    },
  ]);
  const [inputText, setInputText] = useState("");

  if (!isOpen) return null;

  const quickChips = [
    "I have arrived at Airport Terminal 1",
    "I am outside Station Platform 1 exit",
    "Where is the car stationed?",
    "Please pre-cool the AC before handover",
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: MessageItem = {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText("");

    // Simulated driver response
    setTimeout(() => {
      const driverReplies = [
        "Received sir! I am waiting near the VIP canopy with your car keys and digital checklist.",
        "Acknowledged! Your car AC is running on climate mode. See you in 3 minutes.",
        "Got it! I am holding a Moar Cars welcome board right outside the gate.",
      ];
      const randomReply = driverReplies[Math.floor(Math.random() * driverReplies.length)];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "driver",
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg h-[540px] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden text-brand-ink">
        {/* Chat Header */}
        <div className="p-4 bg-brand-navy text-white flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-brand-teal/20 border border-brand-teal text-brand-gold flex items-center justify-center font-black">
              {driverName.charAt(0)}
            </div>
            <div>
              <h4 className="text-sm font-bold flex items-center gap-1.5">
                {driverName}
                <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              </h4>
              <p className="text-[11px] text-white/70">Moar Fleet Executive • {carName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${driverPhone}`}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              title="Call Executive"
            >
              <Phone className="h-4 w-4" />
            </a>
            <button
              onClick={onClose}
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-brand-mist/20 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`p-3 rounded-2xl max-w-[80%] leading-relaxed shadow-sm ${
                  m.sender === "user"
                    ? "bg-brand-navy text-white rounded-br-none"
                    : "bg-card border border-border text-brand-navy rounded-bl-none"
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-muted-foreground mt-0.5 px-1 flex items-center gap-1">
                {m.time}
                {m.sender === "user" && <CheckCheck className="h-3 w-3 text-brand-teal" />}
              </span>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 py-2 border-t border-border bg-card flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(chip)}
              className="px-2.5 py-1 rounded-full bg-brand-mist text-[10px] font-bold text-brand-navy hover:bg-brand-teal hover:text-white whitespace-nowrap transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-border bg-card flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Type a message to the driver..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 p-2.5 rounded-xl bg-brand-mist/60 border border-border text-xs font-semibold text-brand-navy outline-none focus:ring-1 focus:ring-brand-teal"
          />
          <Button
            type="submit"
            size="sm"
            className="h-9 px-4 rounded-xl bg-brand-teal hover:bg-brand-teal/90 text-white font-bold"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
