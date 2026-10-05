import React, { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { UserProfile } from "../../types/user";
import { Button } from "@/components/ui/button";

interface ProfileSectionProps {
  user: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onUpdateProfile: (fields: Partial<UserProfile>) => Promise<{ success: boolean; message: string; data?: UserProfile }>;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  user,
  onProfileUpdated,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [dlNumber, setDlNumber] = useState(user.dlNumber || "");
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg("");

    const res = await onUpdateProfile({
      name,
      email,
      phone,
      dlNumber,
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
      setStatusMsg("Your profile details have been saved successfully.");
      onProfileUpdated(res.data);
    } else {
      setIsSuccess(false);
      setStatusMsg(res.message || "Failed to update profile. Please try again.");
    }
  };

  const initialLetter = name ? name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card Header (Clean Form Style without Camera / Gold VIP) */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 border-amber-300 bg-amber-50 text-[#b57d14] flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xs shrink-0">
              {initialLetter}
            </div>

            <div className="space-y-1 text-center sm:text-left flex-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {name || "Customer Profile"}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                {email || "Registered Moar Cars Member"} {phone ? `• ${phone}` : ""}
              </p>
              <p className="text-xs text-slate-400">
                Keep your details updated for swift vehicle handover at Tirupati stations.
              </p>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
        {statusMsg && (
          <div
            className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-semibold transition-all ${
              isSuccess
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{statusMsg}</span>
          </div>
        )}

        {/* SECTION 1: PERSONAL DETAILS */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#b57d14] border border-amber-200/60">
              <User className="h-4 w-4" />
            </span>
            Personal Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Preferred Language
              </label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              >
                <option value="English">English</option>
                <option value="Telugu">తెలుగు (Telugu)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
                <option value="Tamil">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: CONTACT & DRIVING LICENSE */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#b57d14] border border-amber-200/60">
              <Phone className="h-4 w-4" />
            </span>
            Contact &amp; Driving License
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Primary Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Driving License (DL) Number
              </label>
              <input
                type="text"
                placeholder="e.g. AP03 20220019281"
                value={dlNumber}
                onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold uppercase text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Emergency Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Family member / Friend"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                placeholder="+91 98765 11223"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: RESIDENTIAL ADDRESS */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 space-y-5 shadow-sm">
          <h4 className="text-base font-black text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <span className="p-1.5 rounded-lg bg-amber-50 text-[#b57d14] border border-amber-200/60">
              <MapPin className="h-4 w-4" />
            </span>
            Residential Address
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Street Address / House No / Landmark
              </label>
              <input
                type="text"
                placeholder="Flat 402, Sri Balaji Towers, Korlagunta Road"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City / Town
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                State
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pincode
              </label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                placeholder="517501"
                className="w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-sm font-semibold text-slate-900 focus:bg-white focus:border-[#b57d14] focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving}
            className="h-11 px-8 rounded-xl bg-gradient-to-r from-[#d49b29] via-[#c88d18] to-[#b57d14] text-slate-950 font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-md flex items-center gap-2 cursor-pointer"
          >
            {isSaving ? "Saving Details..." : "Save Profile Details"}
            <Save className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
