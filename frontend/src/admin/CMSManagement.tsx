import React, { useState } from "react";
import {
  LayoutTemplate,
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  FileText,
  Star,
  HelpCircle,
  BookOpen,
  MapPin,
  Shield,
  Eye,
  Check,
} from "lucide-react";
import {
  CMSBannerItem,
  CMSOfferItem,
  CMSTestimonialItem,
  CMSFaqItem,
  CMSBlogItem,
} from "./types";

interface CMSManagementProps {
  banners: CMSBannerItem[];
  setBanners: React.Dispatch<React.SetStateAction<CMSBannerItem[]>>;
  offers: CMSOfferItem[];
  setOffers: React.Dispatch<React.SetStateAction<CMSOfferItem[]>>;
  testimonials: CMSTestimonialItem[];
  setTestimonials: React.Dispatch<React.SetStateAction<CMSTestimonialItem[]>>;
  faqs: CMSFaqItem[];
  setFaqs: React.Dispatch<React.SetStateAction<CMSFaqItem[]>>;
  blogs: CMSBlogItem[];
  setBlogs: React.Dispatch<React.SetStateAction<CMSBlogItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function CMSManagement({
  banners,
  setBanners,
  offers,
  setOffers,
  testimonials,
  setTestimonials,
  faqs,
  setFaqs,
  blogs,
  setBlogs,
  setNotice,
}: CMSManagementProps) {
  const [activeSection, setActiveSection] = useState<
    "banners" | "offers" | "testimonials" | "faqs" | "blogs" | "policies"
  >("banners");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Policy text state
  const [policies, setPolicies] = useState({
    terms: "Moar Cars Self-Drive Rental Agreement outlines the rights and liabilities for all renters. Vehicles must not be used for contraband transport, speed racing, or unauthorized subleasing. Minimum driving age is 21 years with valid original DL.",
    privacy: "Moar Cars values your privacy. Customer KYC documents (Aadhaar & DL) are stored in encrypted vaults and used strictly for statutory police reporting and vehicle insurance validation. We never sell data to third parties.",
    cancellation: "Cancellations made 24+ hours before pickup are eligible for 100% full refund. Cancellations within 24 hours of pickup incur a nominal 1-day rental charge. Security deposits are always 100% refundable upon cancellation.",
    about: "Moar Cars is Tirupati's premier self-drive and chauffeur rental platform, dedicated to delivering pristine, sanitized SUVs and sedans for pilgrimage travelers, corporate delegates, and weekend road-trippers across Andhra Pradesh.",
  });

  const handleToggleBanner = (id: number) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    setNotice({ type: "info", text: "Banner visibility updated." });
  };

  const handleToggleOffer = (id: number) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
    setNotice({ type: "info", text: "Offer campaign status toggled." });
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <LayoutTemplate className="w-6 h-6 text-[#D4AF37]" /> Content Management System (CMS)
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Manage website banners, hero sliders, offers, testimonials, FAQs, blogs, SEO pages & legal policies
          </p>
        </div>
      </div>

      {/* SECTION NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: "banners", label: "Homepage Banners & Sliders" },
          { id: "offers", label: "Deals & Festival Offers" },
          { id: "testimonials", label: "Customer Testimonials" },
          { id: "faqs", label: "Interactive FAQs" },
          { id: "blogs", label: "Travel & Fleet Blogs" },
          { id: "policies", label: "Legal Policies & About Page" },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as any)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all ${
              activeSection === sec.id
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: BANNERS */}
      {activeSection === "banners" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Homepage Hero Banners ({banners.length})</h3>
            <button
              onClick={() => {
                const title = prompt("Enter Banner Title:", "Special Pilgrimage Season Offer");
                if (title) {
                  setBanners([
                    ...banners,
                    {
                      id: Date.now(),
                      title,
                      subtitle: "Flat 20% discount on 3-day bookings",
                      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80",
                      ctaText: "Book Fleet",
                      ctaLink: "/fleet",
                      isActive: true,
                    },
                  ]);
                  setNotice({ type: "success", text: "New banner slide added!" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Banner
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 space-y-3"
              >
                <div className="relative rounded-2xl overflow-hidden h-40 border border-purple-500/30">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex flex-col justify-end">
                    <h4 className="font-black text-white text-base">{b.title}</h4>
                    <p className="text-xs text-purple-200 line-clamp-1">{b.subtitle}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-purple-300 font-mono">CTA: {b.ctaText} ({b.ctaLink})</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleBanner(b.id)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                        b.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {b.isActive ? "Active" : "Disabled"}
                    </button>
                    <button
                      onClick={() => setBanners(banners.filter((item) => item.id !== b.id))}
                      className="p-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: OFFERS */}
      {activeSection === "offers" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Promotional Campaign Cards ({offers.length})</h3>
            <button
              onClick={() => {
                const title = prompt("Enter Offer Campaign Title:", "Weekend Brahmotsavam Pass");
                if (title) {
                  setOffers([
                    ...offers,
                    {
                      id: Date.now(),
                      title,
                      tag: "Weekend Deal",
                      discountText: "Flat ₹600 OFF",
                      description: "Special offer on self-drive cars booked for Friday-Monday.",
                      validTill: "30 Nov 2026",
                      badge: "Limited Time",
                      imageUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80",
                      isActive: true,
                    },
                  ]);
                  setNotice({ type: "success", text: "New offer created!" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Offer Card
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {offers.map((o) => (
              <div key={o.id} className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#D4AF37] text-slate-950">{o.badge}</span>
                    <h4 className="font-bold text-base text-white mt-1">{o.title}</h4>
                    <p className="text-emerald-400 font-bold text-sm">{o.discountText}</p>
                  </div>
                  <button
                    onClick={() => handleToggleOffer(o.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                      o.isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {o.isActive ? "Active" : "Disabled"}
                  </button>
                </div>
                <p className="text-xs text-purple-300">{o.description}</p>
                <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center text-[10px] text-purple-400">
                  <span>Valid Till: {o.validTill}</span>
                  <button
                    onClick={() => setOffers(offers.filter((item) => item.id !== o.id))}
                    className="p-1 rounded-lg text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TESTIMONIALS */}
      {activeSection === "testimonials" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Homepage Customer Testimonials ({testimonials.length})</h3>
            <button
              onClick={() => {
                const name = prompt("Enter Customer Name:", "K. Raghavan");
                if (name) {
                  setTestimonials([
                    ...testimonials,
                    {
                      id: Date.now(),
                      name,
                      role: "Pilgrim Traveler",
                      city: "Chennai",
                      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
                      rating: 5,
                      comment: "Smooth car, great condition, and hassle-free return at Tirupati station.",
                      carRented: "Toyota Innova Crysta",
                      isFeatured: true,
                    },
                  ]);
                  setNotice({ type: "success", text: "Testimonial published!" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add Testimonial
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{t.name}</h4>
                    <p className="text-[10px] text-purple-300">{t.role} &bull; {t.city}</p>
                  </div>
                </div>
                <p className="text-xs text-purple-200/90 italic">"{t.comment}"</p>
                <div className="flex justify-between items-center text-[10px] text-purple-400 pt-2 border-t border-purple-500/20">
                  <span className="text-[#D4AF37] font-bold">Rented: {t.carRented}</span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-3 h-3 fill-[#D4AF37]" /> {t.rating}.0
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FAQS */}
      {activeSection === "faqs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">Frequently Asked Questions ({faqs.length})</h3>
            <button
              onClick={() => {
                const q = prompt("Enter Question:", "Can I drive to Tirumala hilltop?");
                const a = prompt("Enter Answer:", "Yes, our self-drive cars have valid permits for Tirumala ghat roads.");
                if (q && a) {
                  setFaqs([...faqs, { id: Date.now(), category: "Bookings", question: q, answer: a }]);
                  setNotice({ type: "success", text: "FAQ added!" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Add FAQ
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((f) => (
              <div key={f.id} className="p-4 rounded-2xl bg-[#2A1336]/60 border border-purple-500/20 space-y-1">
                <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-wider">{f.category}</span>
                <h4 className="font-bold text-white text-xs">{f.question}</h4>
                <p className="text-purple-300 text-xs mt-1">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: BLOGS */}
      {activeSection === "blogs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-white">SEO Travel & Pilgrimage Blogs ({blogs.length})</h3>
            <button
              onClick={() => {
                const title = prompt("Enter Blog Title:", "Scenic Road Trip Routes Around Tirupati");
                if (title) {
                  setBlogs([
                    ...blogs,
                    {
                      id: Date.now(),
                      title,
                      slug: "scenic-road-trips-tirupati",
                      category: "Travel Guide",
                      author: "Moar Travel Desk",
                      date: "Sep 4, 2026",
                      readTime: "3 min read",
                      summary: "Top ghat roads and scenic pitstops around Chittoor district.",
                      imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80",
                      isPublished: true,
                    },
                  ]);
                  setNotice({ type: "success", text: "Blog article published!" });
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Create Blog Post
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((b) => (
              <div key={b.id} className="p-5 rounded-3xl bg-[#2A1336]/60 border border-purple-500/20 space-y-3">
                <div className="h-32 rounded-2xl overflow-hidden border border-purple-500/20">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase">{b.category}</span>
                  <h4 className="font-bold text-white text-sm mt-0.5">{b.title}</h4>
                  <p className="text-xs text-purple-300 mt-1 line-clamp-2">{b.summary}</p>
                </div>
                <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center text-[10px] text-purple-400">
                  <span>By {b.author} &bull; {b.date}</span>
                  <span className="text-emerald-400 font-bold">{b.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: LEGAL POLICIES */}
      {activeSection === "policies" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" /> Legal Terms, Privacy Policy & Brand Story
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-purple-300 font-bold mb-1">About Moar Cars Brand Story</label>
                <textarea
                  rows={3}
                  value={policies.about}
                  onChange={(e) => setPolicies({ ...policies, about: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={policies.terms}
                  onChange={(e) => setPolicies({ ...policies, terms: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Privacy Policy</label>
                <textarea
                  rows={3}
                  value={policies.privacy}
                  onChange={(e) => setPolicies({ ...policies, privacy: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Cancellation & Refund Policy</label>
                <textarea
                  rows={3}
                  value={policies.cancellation}
                  onChange={(e) => setPolicies({ ...policies, cancellation: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-3 text-white"
                ></textarea>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setNotice({ type: "success", text: "Legal policies & website copy updated!" })}
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
                >
                  Save Policy Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
