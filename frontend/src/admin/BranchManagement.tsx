import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Edit,
  Trash2,
  X,
  Navigation,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { BranchItem, CarItem } from "./types";
import { adminApi } from "./adminApi";

interface BranchManagementProps {
  branches: BranchItem[];
  setBranches: React.Dispatch<React.SetStateAction<BranchItem[]>>;
  fleet: CarItem[];
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function BranchManagement({
  branches,
  setBranches,
  fleet,
  setNotice,
}: BranchManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchItem | null>(null);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsValue, setGpsValue] = useState("");

  const filteredBranches = (branches || []).filter(
    (b) =>
      b &&
      ((b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.state || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.address || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetectingGps(false);
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        setGpsValue(`${lat}° N, ${lng}° E`);
      },
      () => {
        setIsDetectingGps(false);
        setGpsValue("13.6288° N, 79.4192° E");
      },
      { timeout: 8000 }
    );
  };

  const handleSaveBranch = async (formData: Partial<BranchItem>) => {
    if (editingBranch) {
      const updated = { ...editingBranch, ...formData };
      setBranches((prev) =>
        prev.map((b) => (b.id === editingBranch.id ? updated : b))
      );
      setNotice({ type: "success", text: `Location "${formData.name || editingBranch.name}" updated!` });
      await adminApi.updateBranch(editingBranch.id, formData);
    } else {
      const payload: Partial<BranchItem> = {
        name: formData.name || "New Location",
        city: formData.city || "Tirupati",
        state: formData.state || "Andhra Pradesh",
        address: formData.address || "Tirupati Main Area",
        mapCoordinates: formData.mapCoordinates || "13.6288° N, 79.4192° E",
        status: formData.status || "Active",
        isActive: true,
      };
      const created = await adminApi.createBranch(payload);
      const newB: BranchItem = {
        id: created?.id || Math.floor(10 + Math.random() * 90),
        name: payload.name!,
        city: payload.city!,
        state: payload.state!,
        address: payload.address!,
        mapCoordinates: payload.mapCoordinates || "13.6288° N, 79.4192° E",
        status: "Active",
        isActive: true,
      };
      setBranches([newB, ...(branches || [])]);
      setNotice({ type: "success", text: `Pickup Location "${newB.name}" saved in database!` });
    }
    setIsAddEditModalOpen(false);
    setEditingBranch(null);
    setGpsValue("");
  };

  const handleDeleteBranch = async (id: number) => {
    if (confirm("Are you sure you want to remove this pickup/drop location?")) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "info", text: `Location #${id} removed.` });
      await adminApi.deleteBranch(id);
    }
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Building2 className="w-6 h-6 text-[#c88d18]" /> Pickup & Drop Locations
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage all customer pickup and delivery locations across Tirupati, airports, stations & pilgrim hubs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search location, city, address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#c88d18]"
            />
          </div>

          <button
            onClick={() => {
              setEditingBranch(null);
              setGpsValue("");
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add New Location
          </button>
        </div>
      </div>

      {/* TOP SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Available Pickup Points</span>
          <h4 className="text-2xl font-black text-white mt-1">{(branches || []).length} Locations</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Live in Customer Booking Dropdown
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Coverage Cities</span>
          <h4 className="text-2xl font-black text-[#c88d18] mt-1">
            {Array.from(new Set((branches || []).map((b) => b.city).filter(Boolean))).length || 1} Cities
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Tirupati & Surrounding Pilgrimage Hubs</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Operating State</span>
          <h4 className="text-2xl font-black text-slate-200 mt-1">Andhra Pradesh</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Self-Drive Ready</p>
        </div>
      </div>

      {/* LOCATION CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBranches.map((br) => (
          <div
            key={br.id}
            className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4 hover:border-[#c88d18]/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-[#c88d18] uppercase font-bold">LOC #{br.id}</span>
                  <h4 className="font-black text-base text-white mt-0.5">{br.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-[#c88d18]" /> {br.city}, {br.state || "Andhra Pradesh"}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Active
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-[#070e1c] p-3.5 rounded-2xl border border-slate-800/80">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Address:</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {br.address || "Main Station / Airport Road, Tirupati"}
                  </p>
                </div>

                {br.mapCoordinates && (
                  <div className="flex items-center gap-1.5 text-[11px] text-[#c88d18] font-mono px-2 py-1 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <Navigation className="w-3 h-3 shrink-0" />
                    <span>GPS: {br.mapCoordinates}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setEditingBranch(br);
                  setGpsValue(br.mapCoordinates || "");
                  setIsAddEditModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-200 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Edit className="w-3.5 h-3.5 text-[#c88d18]" /> Edit Location
              </button>
              <button
                onClick={() => handleDeleteBranch(br.id)}
                className="px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs border border-red-500/20"
                title="Delete Location"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          MODAL: ADD / EDIT LOCATION (CLEAN: Name, City, State, Address, GPS)
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#c88d18]" /> {editingBranch ? `Edit Location: ${editingBranch.name}` : "Add Pickup & Drop Location"}
              </h3>
              <button
                onClick={() => {
                  setIsAddEditModalOpen(false);
                  setEditingBranch(null);
                  setGpsValue("");
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = e.target as any;
                handleSaveBranch({
                  name: t.name.value,
                  city: t.city.value,
                  state: t.state.value,
                  address: t.address.value,
                  mapCoordinates: t.mapCoordinates?.value || gpsValue || "13.6288° N, 79.4192° E",
                  status: "Active",
                });
              }}
              className="space-y-4 text-xs"
            >
              {/* 1. Hub / Location Name */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">
                  Location / Hub Name *
                </label>
                <input
                  name="name"
                  defaultValue={editingBranch?.name || ""}
                  required
                  placeholder="e.g. Tirupati Central Hub (Station)"
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-white font-bold focus:outline-none focus:border-[#c88d18]"
                />
              </div>

              {/* 2. City & State */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">City *</label>
                  <input
                    name="city"
                    defaultValue={editingBranch?.city || "Tirupati"}
                    required
                    placeholder="e.g. Tirupati"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-[#c88d18]"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1.5">State *</label>
                  <input
                    name="state"
                    defaultValue={editingBranch?.state || "Andhra Pradesh"}
                    required
                    placeholder="e.g. Andhra Pradesh"
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-[#c88d18]"
                  />
                </div>
              </div>

              {/* 3. Full Address */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">Full Address *</label>
                <textarea
                  name="address"
                  defaultValue={editingBranch?.address || ""}
                  required
                  rows={3}
                  placeholder="e.g. Platform 1 Exit, Near Railway Station & Central Bus Stand, Tirupati - 517501"
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-white focus:outline-none focus:border-[#c88d18] resize-none"
                />
              </div>

              {/* 4. Current Location / GPS Coordinates */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-bold">
                    GPS Coordinates / Google Pin (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectGps}
                    className="text-[10px] text-[#c88d18] hover:underline flex items-center gap-1 font-bold"
                  >
                    <Navigation className={`w-3 h-3 ${isDetectingGps ? "animate-spin" : ""}`} />
                    <span>{isDetectingGps ? "Detecting..." : "Detect Current GPS"}</span>
                  </button>
                </div>
                <input
                  name="mapCoordinates"
                  value={gpsValue || editingBranch?.mapCoordinates || ""}
                  onChange={(e) => setGpsValue(e.target.value)}
                  placeholder="e.g. 13.6288° N, 79.4192° E or Google Maps URL"
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl p-3 text-white font-mono text-xs focus:outline-none focus:border-[#c88d18]"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddEditModalOpen(false);
                    setEditingBranch(null);
                    setGpsValue("");
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-slate-400 hover:text-white text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
                >
                  {editingBranch ? "Save Location Changes" : "Save New Location"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

