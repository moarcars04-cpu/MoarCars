import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Heart,
  MapPin,
  Languages,
  Save,
  CheckCircle2,
  AlertCircle,
  Camera,
  Sparkles,
} from "lucide-react";
import { UserProfile } from "../../types/user";
import { Button } from "@/components/ui/button";

interface ProfileSectionProps {
  user: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onUpdateProfile: (fields: Partial<UserProfile>) => Promise<{ success: boolean; message: string; data?: UserProfile }>;
}

const predefinedAvatars = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  onProfileUpdated,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [avatar, setAvatar] = useState(user.avatar || predefinedAvatars[0]);
  const [gender, setGender] = useState(user.gender || "Male");
  const [dob, setDob] = useState(user.dob || "1996-05-15");
  const [emergencyContactName, setEmergencyContactName] = useState(user.emergencyContactName || "");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(user.emergencyContactPhone || "");
  const [address, setAddress] = useState(user.address || "");
  const [city, setCity] = useState(user.city || "Tirupati");
  const [state, setState] = useState(user.state || "Andhra Pradesh");
  const [pincode, setPincode] = useState(user.pincode || "517501");
  const [preferredLanguage, setPreferredLanguage] = useState(user.preferredLanguage || "English");

  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg("");

    const res = await onUpdateProfile({
      name,
      email,
      phone,
      avatar,
      gender,
      dob,
      emergencyContactName,
      emergencyContactPhone,
      address,
      city,
      state,
      pincode,
      preferredLanguage,
    });

    setIsSaving(false);
    if (res.success && res.data) {
      setIsSuccess(true);
      setStatusMsg("✅ Your profile information has been saved successfully!");
      onProfileUpdated(res.data);
    } else {
      setIsSuccess(false);
      setStatusMsg(`❌ ${res.message || "Failed to update profile."}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSave} className="space-y-6">
        {/* AVATAR & BASIC BADGE */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-brand-gold bg-black shadow-lg">
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            </div>
            <label className="absolute bottom-0 right-0 p-2 rounded-full bg-brand-gold text-brand-navy cursor-pointer hover:bg-brand-gold-soft shadow transition-transform group-hover:scale-110">
              <Camera className="h-4 w-4" />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-white">{name || "Valued Member"}</h3>
              <span className="rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-brand-gold">
                {user.loyaltyTier || "Bronze VIP"}
              </span>
            </div>
            <p className="text-xs text-white/60">
              Member ID: <span className="font-mono text-white/80">MOAR-MEM-{user.id || "101"}</span> · Referral Code: <span className="font-mono text-brand-gold font-bold">{user.referralCode || "MOAR8899"}</span>
            </p>

            {/* Quick Avatar Picker */}
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-white/40">Presets:</span>
              {predefinedAvatars.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAvatar(url)}
                  className={`h-7 w-7 rounded-full overflow-hidden border-2 transition-all ${
                    avatar === url ? "border-brand-gold scale-110" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt="Preset avatar" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FEEDBACK ALERT */}
        {statusMsg && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              isSuccess
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
            }`}
          >
            {isSuccess ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <User className="h-4 w-4 text-brand-gold" />
            Personal Demographics
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT & EMERGENCY DETAILS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <Phone className="h-4 w-4 text-brand-gold" />
            Contact & Roadside Emergency Person
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Primary Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Emergency Contact Person Name
              </label>
              <input
                type="text"
                placeholder="e.g. Suresh (Brother / Spouse)"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98765 11223"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: RESIDENTIAL ADDRESS */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2 pb-2 border-b border-white/10">
            <MapPin className="h-4 w-4 text-brand-gold" />
            Residential Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Street Address / House No / Landmark
              </label>
              <input
                type="text"
                placeholder="Flat 402, Sri Balaji Towers, Korlagunta Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                Pincode
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wide hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 flex items-center gap-2"
          >
            {isSaving ? "Saving Profile..." : "Save Profile Details"}
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
