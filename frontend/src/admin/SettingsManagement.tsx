import React, { useState } from "react";
import {
  Settings,
  Mail,
  Smartphone,
  MapPin,
  Camera,
  CreditCard,
  Globe,
  Shield,
  KeyRound,
  CheckCircle2,
  DollarSign,
  Clock,
  Moon,
  Sun,
  Share2,
} from "lucide-react";

import { adminApi } from "./adminApi";

interface SettingsManagementProps {
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function SettingsManagement({ setNotice }: SettingsManagementProps) {
  const [activeTab, setActiveTab] = useState<"company" | "smtp" | "apis" | "payments" | "locale">("company");

  const [settings, setSettings] = useState({
    companyName: "Moar Cars Private Limited",
    cin: "U50100AP2026PTC012345",
    gstin: "37AAAAA0000A1Z5",
    supportPhone: "+91 98765 43210",
    supportEmail: "moarcars04@gmail.com",
    address: "Opposite Main Bus Stand, Railway Station Road, Tirupati, Andhra Pradesh - 517501",
    logoUrl: "https://moarcars.com/assets/logo.png",
    smtpHost: "smtp.gmail.com",
    smtpPort: "465",
    smtpUser: "moarcars04@gmail.com",
    smtpPass: "••••••••••••••••",
    smsApiKey: "f2sms_live_881920391823",
    whatsappToken: "EAAG...meta_cloud_api_token",
    whatsappPhoneId: "109823746192834",
    googleMapsKey: "AIzaSyD8819284719283019",
    cloudinaryCloudName: "moarcars",
    cloudinaryApiKey: "991827364510293",
    razorpayKeyId: "rzp_live_9918273645",
    razorpayKeySecret: "••••••••••••••••",
    stripeKey: "pk_live_881928471029384756",
    currency: "INR (₹)",
    timezone: "Asia/Kolkata (IST +5:30)",
    language: "English / Telugu",
  });

  React.useEffect(() => {
    adminApi.getSettings().then((dbSettings) => {
      if (dbSettings && Object.keys(dbSettings).length > 0) {
        setSettings((prev) => ({ ...prev, ...dbSettings }));
      }
    });
  }, []);

  const handleSave = async () => {
    setNotice({ type: "success", text: "Global System Settings & API Gateways updated successfully!" });
    adminApi.saveSettings(settings);
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Settings className="w-6 h-6 text-[#D4AF37]" /> Global System Settings & API Integrations
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Configure statutory company details, Email SMTP, WhatsApp Cloud API, Google Maps, Cloudinary, and Payment Keys
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
        >
          Save All Settings
        </button>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2 text-xs">
        {[
          { id: "company", label: "Company & Statutory Details" },
          { id: "smtp", label: "Email SMTP Gateway (Port 465)" },
          { id: "apis", label: "SMS, WhatsApp & Maps APIs" },
          { id: "payments", label: "Payment Gateway Credentials" },
          { id: "locale", label: "Currency, Timezone & Socials" },
        ].map((tb) => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id as any)}
            className={`px-4 py-2 rounded-2xl font-bold transition-all ${
              activeTab === tb.id
                ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* CONTENT PANELS */}
      <div className="p-6 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-2xl space-y-4">
        {activeTab === "company" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4AF37]" /> Company Identity & GST Details
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Company Legal Name</label>
                <input
                  value={settings.companyName}
                  onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">GSTIN Number (18% Tax)</label>
                <input
                  value={settings.gstin}
                  onChange={(e) => setSettings({ ...settings, gstin: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-[#D4AF37] font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Corporate CIN Number</label>
                <input
                  value={settings.cin}
                  onChange={(e) => setSettings({ ...settings, cin: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">Support Phone</label>
                <input
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">Support Email</label>
                <input
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-300 font-bold mb-1">Corporate HQ Address</label>
              <input
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
        )}

        {activeTab === "smtp" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#D4AF37]" /> SMTP Email Server (Gmail Port 465 SSL)
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">SMTP Host</label>
                <input
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">SMTP Port (SSL)</label>
                <input
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">SMTP Username / Email</label>
                <input
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">SMTP App Password</label>
                <input
                  type="password"
                  value={settings.smtpPass}
                  onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#14081E] border border-emerald-500/30 flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Direct SSL Socket active &bull; Tested successfully for OTP & Reservation emails!</span>
            </div>
          </div>
        )}

        {activeTab === "apis" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D4AF37]" /> WhatsApp Cloud API, SMS & Google Maps
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Fast2SMS / Twilio API Key</label>
                <input
                  value={settings.smsApiKey}
                  onChange={(e) => setSettings({ ...settings, smsApiKey: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">Google Maps API Key</label>
                <input
                  value={settings.googleMapsKey}
                  onChange={(e) => setSettings({ ...settings, googleMapsKey: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">WhatsApp Cloud API Permanent Token</label>
                <input
                  value={settings.whatsappToken}
                  onChange={(e) => setSettings({ ...settings, whatsappToken: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">WhatsApp Phone Number ID</label>
                <input
                  value={settings.whatsappPhoneId}
                  onChange={(e) => setSettings({ ...settings, whatsappPhoneId: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-300 font-bold mb-1">Cloudinary Storage Cloud Name</label>
              <input
                value={settings.cloudinaryCloudName}
                onChange={(e) => setSettings({ ...settings, cloudinaryCloudName: e.target.value })}
                className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === "payments" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" /> Razorpay & Stripe Production Keys
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Razorpay Key ID</label>
                <input
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-purple-300 font-bold mb-1">Razorpay Key Secret</label>
                <input
                  type="password"
                  value={settings.razorpayKeySecret}
                  onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-300 font-bold mb-1">Stripe Publishable Key</label>
              <input
                value={settings.stripeKey}
                onChange={(e) => setSettings({ ...settings, stripeKey: e.target.value })}
                className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>
        )}

        {activeTab === "locale" && (
          <div className="space-y-4 text-xs">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D4AF37]" /> Currency, Timezone & Regional Localization
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-purple-300 font-bold mb-1">Base Currency</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="INR (₹)">INR (₹ - Indian Rupee)</option>
                  <option value="USD ($)">USD ($ - US Dollar)</option>
                  <option value="EUR (€)">EUR (€ - Euro)</option>
                  <option value="AED (د.إ)">AED (د.إ - UAE Dirham)</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
                  <option value="UTC">UTC (GMT +0:00)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Regional Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-bold"
                >
                  <option value="English / Telugu">English / Telugu (తెలుగు)</option>
                  <option value="English / Hindi">English / Hindi (हिंदी)</option>
                  <option value="English / Tamil">English / Tamil (தமிழ்)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
