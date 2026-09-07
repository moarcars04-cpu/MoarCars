import React, { useState } from "react";
import {
  Settings,
  MapPin,
  CreditCard,
  Bell,
  Globe,
  Moon,
  Trash2,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  Lock,
  LogOut,
  AlertTriangle,
  Edit2,
  Check,
  Save,
  QrCode,
  Building,
  Home,
  Hotel,
} from "lucide-react";
import {
  UserProfile,
  SavedAddress,
  SavedPaymentMethod,
  NotificationPreferences,
} from "../../types/user";
import { Button } from "@/components/ui/button";

interface SettingsSectionProps {
  user: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
  onLogout: () => void;
  onNavigateToTab?: (tab: string) => void;
}

const DEFAULT_ADDRESSES: SavedAddress[] = [
  {
    id: "addr_1",
    label: "Home",
    addressLine: "Flat 402, Sri Venkateswara Nilayam, Bhavani Nagar",
    city: "Tirupati",
    state: "Andhra Pradesh",
    pincode: "517501",
    landmark: "Near Alipiri Link Road",
    isDefault: true,
  },
  {
    id: "addr_2",
    label: "Hotel / Temple",
    addressLine: "Srinivasam Pilgrimage Guest House, Station Road",
    city: "Tirupati",
    state: "Andhra Pradesh",
    pincode: "517501",
    landmark: "Opposite RTC Central Bus Stand",
    isDefault: false,
  },
];

const DEFAULT_PAYMENTS: SavedPaymentMethod[] = [
  {
    id: "pay_1",
    type: "upi",
    upiVpa: "vishnu@okaxis",
    bankName: "Axis Bank UPI",
    isDefault: true,
  },
  {
    id: "pay_2",
    type: "card",
    cardBrand: "Visa",
    cardLast4: "4242",
    holderName: "S. Vishnu Vardhan",
    cardExpiry: "08/29",
    isDefault: false,
  },
];

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  user,
  onProfileUpdated,
  onLogout,
  onNavigateToTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "addresses" | "payments" | "notifications" | "appearance" | "security"
  >("addresses");

  // Address State
  const [addresses, setAddresses] = useState<SavedAddress[]>(
    user.savedAddresses && user.savedAddresses.length > 0
      ? user.savedAddresses
      : DEFAULT_ADDRESSES
  );
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrLabel, setAddrLabel] = useState<"Home" | "Office" | "Hotel / Temple" | "Other">("Home");
  const [addrLine, setAddrLine] = useState("");
  const [addrCity, setAddrCity] = useState("Tirupati");
  const [addrState, setAddrState] = useState("Andhra Pradesh");
  const [addrPincode, setAddrPincode] = useState("517501");
  const [addrLandmark, setAddrLandmark] = useState("");
  const [addrDefault, setAddrDefault] = useState(false);

  // Payments State
  const [payments, setPayments] = useState<SavedPaymentMethod[]>(
    user.savedPaymentMethods && user.savedPaymentMethods.length > 0
      ? user.savedPaymentMethods
      : DEFAULT_PAYMENTS
  );
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payType, setPayType] = useState<"upi" | "card">("upi");
  const [newUpi, setNewUpi] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardExpiry, setNewCardExpiry] = useState("");

  // Notification Preferences State
  const [notifPrefs, setNotifPrefs] = useState<NotificationPreferences>(
    user.notificationPreferences || {
      pushEnabled: true,
      smsEnabled: true,
      emailEnabled: true,
      whatsappEnabled: true,
      bookingAlerts: true,
      pickupReminders: true,
      returnReminders: true,
      promotionalOffers: true,
    }
  );
  const [prefsSaved, setPrefsSaved] = useState(false);

  // Appearance & Language State
  const [selectedLanguage, setSelectedLanguage] = useState(user.preferredLanguage || "English");
  const [selectedTheme, setSelectedTheme] = useState<"dark" | "navy" | "contrast">(
    user.themePreference || "dark"
  );
  const [appearanceSaved, setAppearanceSaved] = useState(false);

  // Deletion Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("Moving to another city");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Save Address Handler
  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    const newAddrItem: SavedAddress = {
      id: editingAddressId || "addr_" + Date.now(),
      label: addrLabel,
      addressLine: addrLine.trim(),
      city: addrCity.trim(),
      state: addrState.trim(),
      pincode: addrPincode.trim(),
      landmark: addrLandmark.trim(),
      isDefault: addrDefault,
    };

    let updatedList: SavedAddress[];
    if (editingAddressId) {
      updatedList = addresses.map((a) => (a.id === editingAddressId ? newAddrItem : a));
    } else {
      updatedList = [...addresses, newAddrItem];
    }

    if (addrDefault) {
      updatedList = updatedList.map((a) => ({
        ...a,
        isDefault: a.id === newAddrItem.id,
      }));
    }

    setAddresses(updatedList);
    setIsAddressModalOpen(false);
    setEditingAddressId(null);
    setAddrLine("");
    setAddrLandmark("");

    try {
      await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          ...newAddrItem,
        }),
      });
      onProfileUpdated({ ...user, savedAddresses: updatedList });
    } catch {}
  };

  const handleDeleteAddress = async (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    try {
      await fetch(`/api/user/addresses/${id}?userId=${user.id}&userEmail=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });
      onProfileUpdated({ ...user, savedAddresses: updated });
    } catch {}
  };

  const handleSetDefaultAddress = async (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, email: user.email, savedAddresses: updated }),
      });
      onProfileUpdated({ ...user, savedAddresses: updated });
    } catch {}
  };

  // Payment Handlers
  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const newMethod: SavedPaymentMethod = {
      id: "pay_" + Date.now(),
      type: payType,
      upiVpa: payType === "upi" ? newUpi.trim() : undefined,
      bankName: payType === "upi" ? "UPI VPA" : undefined,
      cardBrand: "Visa",
      cardLast4: payType === "card" ? newCardNumber.slice(-4) : undefined,
      cardExpiry: payType === "card" ? newCardExpiry : undefined,
      holderName: payType === "card" ? newCardHolder : undefined,
      isDefault: payments.length === 0,
    };

    const updated = [...payments, newMethod];
    setPayments(updated);
    setIsPayModalOpen(false);
    setNewUpi("");
    setNewCardNumber("");
    setNewCardHolder("");

    try {
      await fetch("/api/user/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          ...newMethod,
        }),
      });
      onProfileUpdated({ ...user, savedPaymentMethods: updated });
    } catch {}
  };

  const handleDeletePayment = async (id: string) => {
    const updated = payments.filter((p) => p.id !== id);
    setPayments(updated);
    try {
      await fetch(`/api/user/payment-methods/${id}?userId=${user.id}&userEmail=${encodeURIComponent(user.email)}`, {
        method: "DELETE",
      });
      onProfileUpdated({ ...user, savedPaymentMethods: updated });
    } catch {}
  };

  // Notification Preferences Save
  const handleSavePreferences = async () => {
    setPrefsSaved(false);
    try {
      await fetch("/api/user/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          preferences: notifPrefs,
        }),
      });
      onProfileUpdated({ ...user, notificationPreferences: notifPrefs });
      setPrefsSaved(true);
      setTimeout(() => setPrefsSaved(false), 3000);
    } catch {}
  };

  // Save Language & Theme
  const handleSaveAppearance = async () => {
    setAppearanceSaved(false);
    try {
      await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          preferredLanguage: selectedLanguage,
          themePreference: selectedTheme,
        }),
      });
      onProfileUpdated({
        ...user,
        preferredLanguage: selectedLanguage,
        themePreference: selectedTheme,
      });
      setAppearanceSaved(true);
      setTimeout(() => setAppearanceSaved(false), 3000);
    } catch {}
  };

  // Account Deletion
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/user/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userEmail: user.email,
          reason: deleteReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsDeleteModalOpen(false);
        onLogout();
      } else {
        setDeleteError(data.message || "Failed to deactivate account.");
      }
    } catch (err: any) {
      setDeleteError(err?.message || "Network error.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Settings Navigation Header */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-brand-gold" /> Account Settings & Preferences
          </h2>
          <p className="text-xs text-white/60 mt-0.5">
            Manage your delivery address book, tokenized payment cards, notification channels, and security.
          </p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10">
        {[
          { id: "addresses", label: `Saved Addresses (${addresses.length})`, icon: MapPin },
          { id: "payments", label: `Payment Methods (${payments.length})`, icon: CreditCard },
          { id: "notifications", label: "Notification Channels", icon: Bell },
          { id: "appearance", label: "Language & Theme", icon: Globe },
          { id: "security", label: "Security & Account", icon: Lock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-brand-gold text-brand-navy font-black shadow-lg shadow-amber-900/20"
                  : "bg-slate-900/60 border border-white/10 text-white/70 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: SAVED ADDRESSES */}
      {activeSubTab === "addresses" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Address Book</h3>
              <p className="text-xs text-white/60">
                Addresses for doorstep car delivery & airport handover in Tirupati, Renigunta, and Chandragiri.
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingAddressId(null);
                setAddrLine("");
                setAddrLandmark("");
                setAddrDefault(false);
                setIsAddressModalOpen(true);
              }}
              className="h-10 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Address
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className={`rounded-2xl border p-5 transition-all shadow-lg space-y-3 relative ${
                  addr.isDefault
                    ? "border-amber-500/50 bg-slate-900/90 ring-1 ring-amber-500/30"
                    : "border-white/10 bg-slate-950/60 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-gold/10 text-brand-gold">
                      {addr.label === "Home" ? (
                        <Home className="h-4 w-4" />
                      ) : addr.label === "Office" ? (
                        <Building className="h-4 w-4" />
                      ) : (
                        <Hotel className="h-4 w-4" />
                      )}
                    </span>
                    <span className="text-xs font-black text-white uppercase tracking-wider">
                      {addr.label}
                    </span>
                  </div>

                  {addr.isDefault && (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                      Default Delivery
                    </span>
                  )}
                </div>

                <div className="text-xs space-y-1 text-white/80">
                  <p className="font-semibold text-white leading-relaxed">{addr.addressLine}</p>
                  <p className="text-white/60">
                    {addr.city}, {addr.state} - <span className="font-mono text-white">{addr.pincode}</span>
                  </p>
                  {addr.landmark && (
                    <p className="text-[11px] text-brand-gold font-medium">Landmark: {addr.landmark}</p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-[11px] font-bold text-brand-gold hover:underline"
                    >
                      Set as default
                    </button>
                  ) : (
                    <span className="text-[10px] text-white/40">Primary Address</span>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setEditingAddressId(addr.id);
                        setAddrLabel(addr.label);
                        setAddrLine(addr.addressLine);
                        setAddrCity(addr.city);
                        setAddrState(addr.state);
                        setAddrPincode(addr.pincode);
                        setAddrLandmark(addr.landmark || "");
                        setAddrDefault(!!addr.isDefault);
                        setIsAddressModalOpen(true);
                      }}
                      className="text-white/60 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Edit2 className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PAYMENT METHODS */}
      {activeSubTab === "payments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Saved Payment Methods</h3>
              <p className="text-xs text-white/60">
                RBI compliant tokenized cards & verified UPI VPAs for 1-click express booking and instant security deposit refunds.
              </p>
            </div>
            <Button
              onClick={() => setIsPayModalOpen(true)}
              className="h-10 px-4 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Add Payment Method
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {payments.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 shadow-lg space-y-3 relative hover:border-brand-gold/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-brand-gold">
                      {p.type === "upi" ? <QrCode className="h-5 w-5" /> : <CreditCard className="h-5 w-5" />}
                    </span>
                    <div>
                      <p className="text-xs font-black text-white">
                        {p.type === "upi" ? "UPI VPA ID" : `${p.cardBrand} Card`}
                      </p>
                      <p className="text-[10px] text-white/50">{p.type === "upi" ? p.bankName : "Tokenized Card"}</p>
                    </div>
                  </div>

                  {p.isDefault && (
                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold">
                      Primary Refund VPA
                    </span>
                  )}
                </div>

                <div className="rounded-xl bg-slate-900/80 p-3 text-xs font-mono text-white flex items-center justify-between">
                  <span>{p.type === "upi" ? p.upiVpa : `•••• •••• •••• ${p.cardLast4}`}</span>
                  {p.cardExpiry && <span className="text-[10px] text-white/60">EXP {p.cardExpiry}</span>}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> 256-Bit Encrypted
                  </span>
                  <button
                    onClick={() => handleDeletePayment(p.id)}
                    className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: NOTIFICATIONS */}
      {activeSubTab === "notifications" && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Multi-Channel Notification Matrix</h3>
              <p className="text-xs text-white/60">
                Choose how and where you want to receive booking updates, telematics alerts, and festival cashback coupons.
              </p>
            </div>
            <Button
              onClick={handleSavePreferences}
              className="h-10 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Preferences
            </Button>
          </div>

          {prefsSaved && (
            <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-3.5 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Notification channels updated successfully!
            </div>
          )}

          {/* Granular Matrix */}
          <div className="space-y-4 divide-y divide-white/5">
            {/* 1. Channels */}
            <div className="pt-2 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold">
                1. Delivery Channels
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: "whatsappEnabled", label: "WhatsApp Alerts", desc: "Instant trip OTPs & handover updates" },
                  { key: "smsEnabled", label: "SMS Notifications", desc: "Critical security & dispatch alerts" },
                  { key: "emailEnabled", label: "Email Invoices", desc: "GST tax invoices & rental agreements" },
                  { key: "pushEnabled", label: "Browser Push", desc: "Live vehicle telematics & reminders" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-brand-gold/40 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(notifPrefs as any)[item.key]}
                      onChange={(e) =>
                        setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded bg-slate-800 border-white/20 text-brand-gold focus:ring-brand-gold mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. Notification Topics */}
            <div className="pt-4 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold">
                2. Notification Topics
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    key: "bookingAlerts",
                    label: "Booking Confirmations & Modifications",
                    desc: "Receive immediate confirmation receipts and status transitions.",
                  },
                  {
                    key: "pickupReminders",
                    label: "Pickup & Keyless Handover Reminders",
                    desc: "Reminders 2 hours before pickup with vehicle checklist.",
                  },
                  {
                    key: "returnReminders",
                    label: "Return Inspection & Deposit Settlement",
                    desc: "Audit reports and instant UPI refund reference notices.",
                  },
                  {
                    key: "promotionalOffers",
                    label: "Festival Deals & Cashback Coins",
                    desc: "Brahmotsavam, Sankranti offers and 2X coin multipliers.",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-white/10 hover:border-brand-gold/40 transition-all cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={(notifPrefs as any)[item.key]}
                      onChange={(e) =>
                        setNotifPrefs({ ...notifPrefs, [item.key]: e.target.checked })
                      }
                      className="h-4 w-4 rounded bg-slate-800 border-white/20 text-brand-gold focus:ring-brand-gold mt-0.5"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-white/50 mt-0.5">{item.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: LANGUAGE & THEME */}
      {activeSubTab === "appearance" && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <h3 className="text-base font-bold text-white">Language & Regional Preferences</h3>
              <p className="text-xs text-white/60">
                Choose your preferred language for WhatsApp updates, invoice receipts, and portal display.
              </p>
            </div>
            <Button
              onClick={handleSaveAppearance}
              className="h-10 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft flex items-center gap-1.5"
            >
              <Save className="h-4 w-4" /> Save Language
            </Button>
          </div>

          {appearanceSaved && (
            <div className="rounded-2xl bg-emerald-500/20 border border-emerald-500/30 p-3.5 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> Language and display settings saved!
            </div>
          )}

          {/* Language Selection */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold">
              Preferred Language
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {[
                { code: "English", native: "English", tag: "Primary" },
                { code: "Telugu", native: "తెలుగు", tag: "Regional Hub" },
                { code: "Hindi", native: "हिन्दी", tag: "National" },
                { code: "Tamil", native: "தமிழ்", tag: "Corridor" },
                { code: "Kannada", native: "ಕನ್ನಡ", tag: "Corridor" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedLanguage === lang.code
                      ? "border-brand-gold bg-amber-500/10 ring-1 ring-brand-gold"
                      : "border-white/10 bg-slate-950/60 hover:bg-slate-900"
                  }`}
                >
                  <p className="text-sm font-black text-white">{lang.native}</p>
                  <p className="text-[10px] text-white/50">{lang.code}</p>
                  <span className="inline-block mt-2 rounded-full bg-slate-800 px-2 py-0.5 text-[9px] font-bold text-brand-gold">
                    {lang.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Luxury Dark Themes */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <h4 className="text-xs font-black uppercase tracking-wider text-brand-gold">
              Theme Mode
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: "dark", label: "Dark Luxury Gold", desc: "Signature Moar Cars gold & obsidian" },
                { id: "navy", label: "Midnight Navy", desc: "Executive deep navy & slate contrast" },
                { id: "contrast", label: "High Contrast Dark", desc: "Maximum readability in bright sunlight" },
              ].map((th) => (
                <button
                  key={th.id}
                  onClick={() => setSelectedTheme(th.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedTheme === th.id
                      ? "border-brand-gold bg-amber-500/10 ring-1 ring-brand-gold"
                      : "border-white/10 bg-slate-950/60 hover:bg-slate-900"
                  }`}
                >
                  <p className="text-xs font-bold text-white">{th.label}</p>
                  <p className="text-[10px] text-white/50 mt-1">{th.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: SECURITY & ACCOUNT */}
      {activeSubTab === "security" && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-white/10">
            <h3 className="text-base font-bold text-white">Security & Account Management</h3>
            <p className="text-xs text-white/60">
              Manage password credentials, active sessions, and data privacy options.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Card 1: Password & Authentication */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-brand-gold">
                <Lock className="h-5 w-5" />
                <h4 className="text-sm font-bold text-white">Password & OTP Access</h4>
              </div>
              <p className="text-xs text-white/60">
                You can log in using either your mobile OTP or strong account password.
              </p>
              <div className="pt-2">
                <Button
                  onClick={() => {
                    if (onNavigateToTab) onNavigateToTab("profile");
                  }}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border-white/10 text-xs font-bold text-white hover:bg-slate-800"
                >
                  Update Profile & Password
                </Button>
              </div>
            </div>

            {/* Card 2: Active Session */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Smartphone className="h-5 w-5" />
                <h4 className="text-sm font-bold text-white">Active Session</h4>
              </div>
              <p className="text-xs text-white/60">
                Logged in as <span className="text-white font-bold">{user.email || user.phone}</span>.
              </p>
              <div className="pt-2">
                <Button
                  onClick={onLogout}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-500/10 flex items-center gap-1.5"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out Session
                </Button>
              </div>
            </div>
          </div>

          {/* Danger Zone: Delete Account */}
          <div className="pt-6 border-t border-rose-500/20 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-rose-400">
              Danger Zone
            </h4>
            <div className="rounded-2xl border border-rose-500/30 bg-rose-950/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Deactivate Account</p>
                <p className="text-xs text-white/60 max-w-xl">
                  Temporarily or permanently close your account. Active upcoming bookings must be completed or cancelled before deactivation.
                </p>
              </div>
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                className="h-9 px-4 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase hover:bg-rose-700 shrink-0"
              >
                Close Account
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">
                {editingAddressId ? "Edit Saved Address" : "Add Delivery Address"}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-white/80">Address Label</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Home", "Office", "Hotel / Temple"] as const).map((lbl) => (
                    <button
                      type="button"
                      key={lbl}
                      onClick={() => setAddrLabel(lbl)}
                      className={`h-9 rounded-xl border text-xs font-bold transition-all ${
                        addrLabel === lbl
                          ? "border-brand-gold bg-amber-500/20 text-brand-gold"
                          : "border-white/10 bg-slate-950 text-white/70"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">Full Address Line</label>
                <textarea
                  value={addrLine}
                  onChange={(e) => setAddrLine(e.target.value)}
                  placeholder="Flat/Door No, Street Name, Colony / Area..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-white/80">City</label>
                  <input
                    type="text"
                    value={addrCity}
                    onChange={(e) => setAddrCity(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-white/80">Pincode</label>
                  <input
                    type="text"
                    value={addrPincode}
                    onChange={(e) => setAddrPincode(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-white/80">Nearby Landmark</label>
                <input
                  type="text"
                  value={addrLandmark}
                  onChange={(e) => setAddrLandmark(e.target.value)}
                  placeholder="e.g., Near Alipiri Toll Gate or Central Railway Station"
                  className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                />
              </div>

              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addrDefault}
                  onChange={(e) => setAddrDefault(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-800 border-white/20 text-brand-gold"
                />
                <span className="text-white/80 font-semibold">Make this my primary delivery address</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border-white/10 text-white text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
                >
                  Save Address
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Method Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0f172a] p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Add Payment Method</h3>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPayType("upi")}
                className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  payType === "upi"
                    ? "border-brand-gold bg-amber-500/20 text-brand-gold font-black"
                    : "border-white/10 bg-slate-950 text-white/70"
                }`}
              >
                <QrCode className="h-4 w-4" /> UPI ID (VPA)
              </button>
              <button
                type="button"
                onClick={() => setPayType("card")}
                className={`h-9 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 ${
                  payType === "card"
                    ? "border-brand-gold bg-amber-500/20 text-brand-gold font-black"
                    : "border-white/10 bg-slate-950 text-white/70"
                }`}
              >
                <CreditCard className="h-4 w-4" /> Card (Tokenized)
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              {payType === "upi" ? (
                <div className="space-y-1">
                  <label className="font-bold text-white/80">UPI VPA Handle</label>
                  <input
                    type="text"
                    value={newUpi}
                    onChange={(e) => setNewUpi(e.target.value)}
                    placeholder="e.g., yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                    required
                  />
                  <p className="text-[10px] text-white/40">
                    Used for instant security deposit return after trip handover.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="font-bold text-white/80">Card Number</label>
                    <input
                      type="text"
                      value={newCardNumber}
                      onChange={(e) => setNewCardNumber(e.target.value)}
                      placeholder="16-digit card number"
                      maxLength={16}
                      className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="font-bold text-white/80">Cardholder Name</label>
                      <input
                        type="text"
                        value={newCardHolder}
                        onChange={(e) => setNewCardHolder(e.target.value)}
                        placeholder="Name on card"
                        className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-white/80">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-brand-gold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  variant="outline"
                  className="h-9 px-4 rounded-xl border-white/10 text-white text-xs font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-brand-gold text-brand-navy font-bold text-xs uppercase hover:bg-brand-gold-soft"
                >
                  Save Method
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-rose-500/30 bg-[#0f172a] p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-base font-black text-white">Deactivate Moar Cars Account?</h3>
            </div>

            <p className="text-xs text-white/70 leading-relaxed">
              Deactivating your account will disable active booking privileges, delete session tokens, and lock your wallet balance.
            </p>

            <div className="space-y-1 text-xs">
              <label className="font-bold text-white/80">Reason for closing account</label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Moving to another city">Moving to another city</option>
                <option value="Not renting cars often">Not renting cars often</option>
                <option value="Privacy concern">Privacy concern</option>
                <option value="Switching to another provider">Switching to another provider</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {deleteError && (
              <p className="rounded-xl bg-rose-500/20 border border-rose-500/30 p-2.5 text-[11px] font-bold text-rose-400">
                {deleteError}
              </p>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                variant="outline"
                className="h-9 px-4 rounded-xl border-white/10 text-white text-xs font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="h-9 px-5 rounded-xl bg-rose-600 text-white font-bold text-xs uppercase hover:bg-rose-700 disabled:opacity-40"
              >
                {isDeleting ? "Deactivating..." : "Confirm Deactivation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
