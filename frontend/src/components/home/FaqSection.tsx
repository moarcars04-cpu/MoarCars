import React, { useState } from "react";
import { ChevronDown, HelpCircle, Phone, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  id: string;
  category: "kyc" | "ghat" | "deposit" | "fuel" | "all";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "1",
    category: "kyc",
    question: "What documents are required to book a self-drive car with Moar Cars?",
    answer:
      "You only need two documents: (1) An original valid Indian Driving Licence (held for at least 1 year) and (2) An Aadhaar Card / Passport for identity & address verification. You can upload them in 60 seconds through our digital KYC system.",
  },
  {
    id: "2",
    category: "ghat",
    question: "Can I drive Moar Cars up the Tirumala Ghat Road?",
    answer:
      "Yes, absolutely! All Moar Cars fleet vehicles are fully compliant with Tirumala Tirupati Devasthanams (TTD) ghat road regulations. They feature hill-hold assist, certified brakes, and valid emission certificates. Please remember that TTD enforces a minimum travel time (28 mins) for safety on Ghat Road 1 & 2.",
  },
  {
    id: "3",
    category: "deposit",
    question: "How much is the security deposit and when is it refunded?",
    answer:
      "The refundable security deposit ranges from ₹2,000 to ₹5,000 depending on the vehicle category (Hatchback vs SUV/Luxury). Upon safe return and vehicle check-in, the deposit is processed back to your original payment method / UPI within 2 hours guaranteed.",
  },
  {
    id: "4",
    category: "fuel",
    question: "What is your Fuel Policy?",
    answer:
      "We follow a transparent 'Like-to-Like' fuel policy. If you receive the car with 50% fuel, simply return it with 50% fuel. If you return with extra fuel, we credit the difference; if less, we deduct at prevailing market fuel rates without surcharge.",
  },
  {
    id: "5",
    category: "deposit",
    question: "What is the cancellation and refund policy?",
    answer:
      "We offer 100% Free Cancellation up to 6 hours prior to your scheduled pickup time. Cancellations within 6 hours incur a nominal one-hour rental charge, and the remaining amount is refunded immediately.",
  },
  {
    id: "6",
    category: "kyc",
    question: "Can non-resident Indians (NRIs) or international tourists rent cars?",
    answer:
      "Yes! International tourists and NRIs can rent by submitting an International Driving Permit (IDP) along with their valid home country license and passport copy.",
  },
  {
    id: "7",
    category: "fuel",
    question: "Are toll charges, FASTag, and interstate taxes included?",
    answer:
      "All our vehicles are equipped with an active FASTag. Toll charges incurred during your trip are automatically calculated at actual government rates and adjusted transparently at return.",
  },
  {
    id: "8",
    category: "ghat",
    question: "Is roadside assistance available in case of a breakdown or puncture?",
    answer:
      "Yes! 24/7 Roadside Assistance (RSA) and emergency backup vehicle replacement are available across Andhra Pradesh, Tamil Nadu, and Karnataka highway corridors. Just tap the SOS/Support button in the app.",
  },
];

export const FaqSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "kyc" | "ghat" | "deposit" | "fuel">("all");
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = activeCategory === "all" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <section className="py-6 sm:py-8 bg-card border-b border-border">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-teal inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10">
            <HelpCircle className="h-3.5 w-3.5" /> Have Questions?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-navy tracking-tight">
            Frequently Asked <span className="text-brand-teal">Questions</span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Everything you need to know about self-drive rentals, Tirumala ghat trips, security deposits, and insurance coverage.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: "all", label: "All Questions" },
            { id: "kyc", label: "KYC & Documents" },
            { id: "ghat", label: "Tirumala Ghat Road" },
            { id: "deposit", label: "Deposits & Refunds" },
            { id: "fuel", label: "Fuel & FASTag" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-brand-navy text-white shadow-md"
                  : "bg-brand-mist/60 text-muted-foreground hover:text-brand-navy hover:bg-brand-mist border border-border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="max-w-4xl mx-auto space-y-3 w-full">
          {filteredFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded ? "border-brand-teal/40 bg-brand-mist/30 shadow-md" : "border-border bg-card hover:border-brand-teal/20"
                }`}
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-brand-navy">
                    {faq.question}
                  </span>
                  <div
                    className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isExpanded ? "rotate-180 bg-brand-teal text-white" : "bg-brand-mist text-brand-navy"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Card */}
        <div className="p-6 rounded-3xl bg-brand-mist border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-navy">Still have questions or special requirements?</h4>
              <p className="text-xs text-muted-foreground">Our 24/7 Tirupati fleet desk team is always here to assist you.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow transition-colors"
            >
              <MessageSquare className="h-4 w-4" /> WhatsApp Support
            </a>
            <a
              href="tel:+919999999999"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy/90 text-white text-xs font-bold shadow transition-colors"
            >
              <Phone className="h-4 w-4" /> Call 24/7
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
