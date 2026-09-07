import React, { useState } from "react";
import {
  ShieldCheck,
  Upload,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Camera,
  RefreshCw,
  Eye,
  X,
  Sparkles,
  Info,
} from "lucide-react";
import { UserProfile } from "../../types/user";
import { Button } from "@/components/ui/button";

interface KycSectionProps {
  user: UserProfile;
  onKycUpdated: (updatedUser: UserProfile) => void;
  onUploadKyc: (docs: any) => Promise<{ success: boolean; message: string; data?: UserProfile }>;
}

export const KycSection: React.FC<KycSectionProps> = ({ user, onKycUpdated, onUploadKyc }) => {
  const [dlNumber, setDlNumber] = useState(user.dlNumber || "");
  const [dlExpiry, setDlExpiry] = useState(user.dlExpiry || "2032-12-31");
  const [dlFrontDocUrl, setDlFrontDocUrl] = useState(user.dlFrontDocUrl || "");
  const [dlBackDocUrl, setDlBackDocUrl] = useState(user.dlBackDocUrl || "");

  const [aadhaarNumber, setAadhaarNumber] = useState(user.aadhaarNumber || "");
  const [aadhaarFrontDocUrl, setAadhaarFrontDocUrl] = useState(user.aadhaarFrontDocUrl || "");
  const [aadhaarBackDocUrl, setAadhaarBackDocUrl] = useState(user.aadhaarBackDocUrl || "");

  const [passportNumber, setPassportNumber] = useState(user.passportNumber || "");
  const [passportDocUrl, setPassportDocUrl] = useState(user.passportDocUrl || "");

  const [selfieDocUrl, setSelfieDocUrl] = useState(user.selfieDocUrl || "");

  const [isEditing, setIsEditing] = useState(user.kycStatus === "Pending" || user.kycStatus === "Rejected");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [previewModalUrl, setPreviewModalUrl] = useState<string | null>(null);

  // File upload simulation (reads as base64 data URL for live preview & persistence)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setter(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg("");

    if (!dlNumber || !dlFrontDocUrl) {
      setStatusMsg("❌ Driving License Number and Front Image are mandatory.");
      return;
    }

    if (!aadhaarNumber || !aadhaarFrontDocUrl) {
      setStatusMsg("❌ Aadhaar Card Number and Front Image are mandatory.");
      return;
    }

    setIsSubmitting(true);
    const res = await onUploadKyc({
      dlNumber,
      dlExpiry,
      dlFrontDocUrl,
      dlBackDocUrl: dlBackDocUrl || dlFrontDocUrl,
      aadhaarNumber,
      aadhaarFrontDocUrl,
      aadhaarBackDocUrl: aadhaarBackDocUrl || aadhaarFrontDocUrl,
      passportNumber,
      passportDocUrl,
      selfieDocUrl: selfieDocUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80",
    });

    setIsSubmitting(false);
    if (res.success && res.data) {
      onKycUpdated(res.data);
      setIsEditing(false);
      setStatusMsg("✅ KYC documents submitted successfully! Approval usually completes within 15-30 minutes.");
    } else {
      setStatusMsg(`❌ ${res.message || "Failed to submit KYC"}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* KYC Status Header Card */}
      <div className="rounded-2xl border border-white/10 bg-slate-900/90 p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                user.kycStatus === "Verified"
                  ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                  : user.kycStatus === "Under Review"
                  ? "bg-amber-500/15 border border-amber-500/30 text-brand-gold"
                  : user.kycStatus === "Rejected"
                  ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                  : "bg-slate-800 border border-white/10 text-white/60"
              }`}
            >
              {user.kycStatus === "Verified" && <ShieldCheck className="h-7 w-7" />}
              {user.kycStatus === "Under Review" && <Clock className="h-7 w-7 animate-pulse" />}
              {user.kycStatus === "Rejected" && <AlertCircle className="h-7 w-7" />}
              {user.kycStatus === "Pending" && <FileText className="h-7 w-7" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">KYC & Identity Verification</h3>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider ${
                    user.kycStatus === "Verified"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : user.kycStatus === "Under Review"
                      ? "bg-amber-500/20 text-brand-gold border border-amber-500/30"
                      : user.kycStatus === "Rejected"
                      ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                      : "bg-slate-700 text-white/70"
                  }`}
                >
                  {user.kycStatus === "Verified"
                    ? "Verified & Approved"
                    : user.kycStatus === "Under Review"
                    ? "Under Review (15 Mins)"
                    : user.kycStatus === "Rejected"
                    ? "Action Needed (Rejected)"
                    : "Not Submitted"}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/60 max-w-xl">
                {user.kycStatus === "Verified" &&
                  "Your government ID and Driving License are approved. You have full self-drive rental clearance with express key handover."}
                {user.kycStatus === "Under Review" &&
                  "Our verification team is reviewing your uploaded documents. Verification usually finishes within 15-30 minutes."}
                {user.kycStatus === "Rejected" &&
                  "Your verification could not be approved due to the issue listed below. Please re-upload clear photos."}
                {user.kycStatus === "Pending" &&
                  "Upload your Driving License and Aadhaar to unlock self-drive car bookings across Andhra Pradesh."}
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="border-amber-500/30 bg-amber-500/10 text-brand-gold hover:bg-amber-500/20 font-bold text-xs shrink-0 flex items-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Re-upload Documents
            </Button>
          )}
        </div>

        {/* Rejection Alert Banner if Rejected */}
        {user.kycStatus === "Rejected" && (
          <div className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
            <div className="flex items-center gap-2 font-bold text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Reason for Rejection:</span>
            </div>
            <p className="mt-1 text-xs text-rose-200/90 pl-6">
              {user.kycRejectionReason || "Driving license photo was blurry or expired. Please upload a clear high-resolution picture."}
            </p>
          </div>
        )}
      </div>

      {statusMsg && (
        <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
          <Info className="h-4 w-4 text-brand-gold shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* KYC Form */}
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: DRIVING LICENSE */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-navy text-xs font-black">1</span>
              <h4 className="text-base font-bold text-white">Driving License (Mandatory)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Driving License Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AP03 2020 0012345"
                  value={dlNumber}
                  onChange={(e) => setDlNumber(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  License Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={dlExpiry}
                  onChange={(e) => setDlExpiry(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white focus:border-brand-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* DL Front */}
              <div className="rounded-xl border border-dashed border-white/20 p-4 text-center hover:border-brand-gold transition-colors bg-slate-950/50">
                <p className="text-xs font-bold text-white mb-2">License Front Side *</p>
                {dlFrontDocUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-black">
                    <img src={dlFrontDocUrl} alt="DL Front" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(dlFrontDocUrl)}
                      className="absolute right-2 top-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-28 text-white/50 hover:text-brand-gold">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-semibold">Click to upload DL Front</span>
                    <span className="text-[10px] text-white/30">JPG, PNG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlFrontDocUrl)} className="hidden" />
                  </label>
                )}
                {dlFrontDocUrl && (
                  <label className="cursor-pointer mt-2 inline-block text-[11px] font-bold text-brand-gold hover:underline">
                    Change Photo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlFrontDocUrl)} className="hidden" />
                  </label>
                )}
              </div>

              {/* DL Back */}
              <div className="rounded-xl border border-dashed border-white/20 p-4 text-center hover:border-brand-gold transition-colors bg-slate-950/50">
                <p className="text-xs font-bold text-white mb-2">License Back Side</p>
                {dlBackDocUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-black">
                    <img src={dlBackDocUrl} alt="DL Back" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(dlBackDocUrl)}
                      className="absolute right-2 top-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-28 text-white/50 hover:text-brand-gold">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-semibold">Click to upload DL Back</span>
                    <span className="text-[10px] text-white/30">JPG, PNG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlBackDocUrl)} className="hidden" />
                  </label>
                )}
                {dlBackDocUrl && (
                  <label className="cursor-pointer mt-2 inline-block text-[11px] font-bold text-brand-gold hover:underline">
                    Change Photo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlBackDocUrl)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 2: AADHAAR CARD */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-navy text-xs font-black">2</span>
              <h4 className="text-base font-bold text-white">Aadhaar Card (Mandatory)</h4>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                12-Digit Aadhaar Number *
              </label>
              <input
                type="text"
                required
                maxLength={14}
                placeholder="XXXX-XXXX-XXXX"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Aadhaar Front */}
              <div className="rounded-xl border border-dashed border-white/20 p-4 text-center hover:border-brand-gold transition-colors bg-slate-950/50">
                <p className="text-xs font-bold text-white mb-2">Aadhaar Front Side *</p>
                {aadhaarFrontDocUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-black">
                    <img src={aadhaarFrontDocUrl} alt="Aadhaar Front" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(aadhaarFrontDocUrl)}
                      className="absolute right-2 top-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-28 text-white/50 hover:text-brand-gold">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-semibold">Click to upload Aadhaar Front</span>
                    <span className="text-[10px] text-white/30">JPG, PNG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarFrontDocUrl)} className="hidden" />
                  </label>
                )}
                {aadhaarFrontDocUrl && (
                  <label className="cursor-pointer mt-2 inline-block text-[11px] font-bold text-brand-gold hover:underline">
                    Change Photo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarFrontDocUrl)} className="hidden" />
                  </label>
                )}
              </div>

              {/* Aadhaar Back */}
              <div className="rounded-xl border border-dashed border-white/20 p-4 text-center hover:border-brand-gold transition-colors bg-slate-950/50">
                <p className="text-xs font-bold text-white mb-2">Aadhaar Back Side</p>
                {aadhaarBackDocUrl ? (
                  <div className="relative rounded-lg overflow-hidden border border-white/10 h-32 bg-black">
                    <img src={aadhaarBackDocUrl} alt="Aadhaar Back" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPreviewModalUrl(aadhaarBackDocUrl)}
                      className="absolute right-2 top-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer flex flex-col items-center justify-center h-28 text-white/50 hover:text-brand-gold">
                    <Upload className="h-6 w-6 mb-1" />
                    <span className="text-xs font-semibold">Click to upload Aadhaar Back</span>
                    <span className="text-[10px] text-white/30">JPG, PNG up to 10MB</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarBackDocUrl)} className="hidden" />
                  </label>
                )}
                {aadhaarBackDocUrl && (
                  <label className="cursor-pointer mt-2 inline-block text-[11px] font-bold text-brand-gold hover:underline">
                    Change Photo
                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarBackDocUrl)} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* SECTION 3: LIVE SELFIE VERIFICATION */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold text-brand-navy text-xs font-black">3</span>
              <h4 className="text-base font-bold text-white">Live Selfie Verification</h4>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-950/50 border border-white/10">
              <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-brand-gold bg-black shrink-0 relative">
                {selfieDocUrl ? (
                  <img src={selfieDocUrl} alt="Selfie Verification" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white/40">
                    <Camera className="h-8 w-8 mb-1" />
                    <span className="text-[10px]">No Selfie</span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <p className="text-xs font-bold text-white">Take or Upload a Clear Headshot</p>
                <p className="text-[11px] text-white/60">
                  Ensure good lighting without sunglasses or caps. This is matched with your Driving License photo for quick approval.
                </p>
                <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-brand-gold hover:bg-slate-700 transition-colors">
                  <Camera className="h-4 w-4" />
                  <span>{selfieDocUrl ? "Take New Selfie" : "Upload Live Selfie"}</span>
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSelfieDocUrl)} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* SECTION 4: PASSPORT (OPTIONAL FOR NRI / INTERNATIONAL) */}
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white/70 text-xs font-black">4</span>
                <h4 className="text-base font-bold text-white">Passport (Optional for NRI / International)</h4>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold bg-amber-500/10 px-2 py-0.5 rounded">Optional</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Passport Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. Z1234567"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white placeholder:text-white/30 focus:border-brand-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-white/70 mb-1">
                  Passport Photo Page
                </label>
                <label className="cursor-pointer flex items-center justify-center h-10 rounded-xl border border-dashed border-white/20 bg-slate-900 px-4 text-xs font-semibold text-white/70 hover:border-brand-gold hover:text-brand-gold transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  <span>{passportDocUrl ? "Passport Uploaded (Change)" : "Upload Passport Copy"}</span>
                  <input type="file" accept="image/*,application/pdf" onChange={(e) => handleFileUpload(e, setPassportDocUrl)} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            {user.kycStatus === "Verified" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                className="h-11 rounded-xl border-white/20 text-white hover:bg-white/10"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-11 px-8 rounded-xl bg-brand-gold text-brand-navy font-black text-xs uppercase tracking-wide hover:bg-brand-gold-soft shadow-lg shadow-amber-900/30 flex items-center gap-2"
            >
              {isSubmitting ? "Submitting Documents..." : "Submit Documents for Verification"}
              <ShieldCheck className="h-4 w-4" />
            </Button>
          </div>
        </form>
      ) : (
        /* Read-Only Verified View */
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 space-y-6">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            Verified Identity Records
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Driving License</p>
              <p className="text-sm font-bold text-white">{user.dlNumber || "AP03 2024 001928"}</p>
              <p className="text-white/60">Valid Until: {user.dlExpiry || "2034-08-15"}</p>
              {user.dlFrontDocUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(user.dlFrontDocUrl!)}
                  className="mt-2 text-[11px] font-bold text-brand-gold hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> View DL Front Document
                </button>
              )}
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gold">Aadhaar Card</p>
              <p className="text-sm font-bold text-white">{user.aadhaarNumber || "XXXX-XXXX-8821"}</p>
              <p className="text-white/60">UIDAI Verified · Address Proof Approved</p>
              {user.aadhaarFrontDocUrl && (
                <button
                  type="button"
                  onClick={() => setPreviewModalUrl(user.aadhaarFrontDocUrl!)}
                  className="mt-2 text-[11px] font-bold text-brand-gold hover:underline flex items-center gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> View Aadhaar Document
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-2xl border border-white/20 p-4 overflow-hidden">
            <button
              onClick={() => setPreviewModalUrl(null)}
              className="absolute right-3 top-3 p-1.5 rounded-full bg-white/20 text-white hover:bg-white/40"
            >
              <X className="h-4 w-4" />
            </button>
            <h4 className="text-sm font-bold text-white mb-3">Document Preview</h4>
            <div className="rounded-xl overflow-hidden border border-white/10 max-h-[70vh]">
              <img src={previewModalUrl} alt="KYC Document Preview" className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
