import React, { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  MapPin,
  Clock,
  Phone,
  Mail,
  Car,
  Users,
  DollarSign,
  Edit,
  Trash2,
  X,
  Navigation,
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
  const [viewingFleetBranch, setViewingFleetBranch] = useState<BranchItem | null>(null);

  const filteredBranches = (branches || []).filter(
    (b) =>
      b &&
      ((b.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.city || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.state || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.managerName || "").toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveBranch = async (formData: Partial<BranchItem>) => {
    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editingBranch.id ? { ...b, ...formData } : b))
      );
      setNotice({ type: "success", text: `Station Hub "${formData.name || editingBranch.name}" updated!` });
      await adminApi.updateBranch(editingBranch.id, formData);
    } else {
      const payload: Partial<BranchItem> = {
        name: formData.name || "New Station Hub",
        city: formData.city || "Tirupati",
        state: formData.state || "Andhra Pradesh",
        address: formData.address || "Main Highway Road, Tirupati",
        phone: formData.phone || "+91 85000 12345",
        operatingHours: formData.operatingHours || "24 Hours (7 Days)",
        managerName: formData.managerName || "Station Incharge",
        managerPhone: formData.managerPhone || "+91 98765 00000",
        managerEmail: formData.managerEmail || "",
        totalCars: formData.totalCars || 0,
        availableCars: formData.totalCars || 0,
        staffCount: formData.staffCount || 2,
        monthlyRevenue: formData.monthlyRevenue || 0,
        mapCoordinates: formData.mapCoordinates || "13.6288° N, 79.4192° E",
      };
      const created = await adminApi.createBranch(payload);
      const newB: BranchItem = {
        id: created?.id || Math.floor(10 + Math.random() * 90),
        name: payload.name!,
        city: payload.city!,
        state: payload.state!,
        address: payload.address!,
        phone: payload.phone!,
        operatingHours: payload.operatingHours!,
        managerName: payload.managerName!,
        managerPhone: payload.managerPhone!,
        managerEmail: payload.managerEmail,
        totalCars: payload.totalCars || 0,
        availableCars: payload.totalCars || 0,
        staffCount: payload.staffCount || 2,
        monthlyRevenue: payload.monthlyRevenue || 0,
        mapCoordinates: payload.mapCoordinates || "13.6288° N, 79.4192° E",
      };
      setBranches([newB, ...(branches || [])]);
      setNotice({ type: "success", text: `Station Hub "${newB.name}" established in database!` });
    }
    setIsAddEditModalOpen(false);
    setEditingBranch(null);
  };

  const handleDeleteBranch = async (id: number) => {
    if (confirm("Are you sure you want to deactivate this station hub?")) {
      setBranches((prev) => prev.filter((b) => b.id !== id));
      setNotice({ type: "info", text: `Station Hub #${id} marked inactive.` });
      await adminApi.deleteBranch(id);
    }
  };


  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Building2 className="w-6 h-6 text-[#c88d18]" /> Station Hubs & Airport Branches
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage multi-city dispatch points, airport kiosks, railway desks & local fleet hubs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search station, city, manager..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#070e1c] border border-slate-800 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#c88d18]"
            />
          </div>

          <button
            onClick={() => {
              setEditingBranch(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#c88d18] to-[#d49b29] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Station Hub
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Active Station Hubs</span>
          <h4 className="text-2xl font-black text-white mt-1">{(branches || []).length} Locations</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">100% Operational</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Stationed Fleet Vehicles</span>
          <h4 className="text-2xl font-black text-[#c88d18] mt-1">
            {(branches || []).reduce((acc, b) => acc + (Number(b?.totalCars) || 0), 0)} Cars
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">Across All Branches</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Total Station Staff</span>
          <h4 className="text-2xl font-black text-slate-300 mt-1">
            {(branches || []).reduce((acc, b) => acc + (Number(b?.staffCount) || 0), 0)} Agents
          </h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">24/7 Handover Ready</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-xl">
          <span className="text-xs text-slate-400 font-bold block">Monthly Network Revenue</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            ₹{(branches || []).reduce((acc, b) => acc + (Number(b?.monthlyRevenue) || 0), 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">September 2026</p>
        </div>
      </div>

      {/* BRANCH CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBranches.map((br) => (
          <div
            key={br.id}
            className="p-6 rounded-3xl bg-[#0b1426]/60 backdrop-blur-2xl border border-slate-800 shadow-2xl space-y-4 hover:border-[#c88d18]/50 transition-all"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono text-[#c88d18] uppercase font-bold">HUB #{br.id}</span>
                <h4 className="font-black text-base text-white mt-0.5">{br.name}</h4>
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#c88d18]" /> {br.city}, {br.state}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active
              </span>
            </div>

            <p className="text-xs text-slate-300/80 bg-[#070e1c] p-3 rounded-2xl border border-slate-800">
              {br.address}
            </p>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Station Manager</span>
                <p className="font-bold text-white">{br.managerName}</p>
                <p className="text-[10px] text-slate-400">{br.managerPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-bold">Operating Hours</span>
                <p className="font-bold text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {br.operatingHours}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-400 text-[10px] block">Stationed Fleet</span>
                <button
                  onClick={() => setViewingFleetBranch(br)}
                  className="font-bold text-white hover:text-[#c88d18] underline"
                >
                  {Number(br.totalCars || 0)} Cars &bull; {Number(br.staffCount || 0)} Staff
                </button>
              </div>
              <div className="text-right">
                <span className="text-slate-400 text-[10px] block">Monthly Gross</span>
                <p className="font-black text-[#c88d18]">₹{Number(br.monthlyRevenue || 0).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingBranch(br);
                  setIsAddEditModalOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-[#c88d18]/20 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Hub
              </button>
              <button
                onClick={() => handleDeleteBranch(br.id)}
                className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ====================================================================
          MODAL 1: ADD / EDIT BRANCH
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#c88d18]" /> {editingBranch ? `Edit Station Hub: ${editingBranch.name}` : "Create New Station Hub"}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-slate-400 hover:text-white">
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
                  phone: t.phone?.value || "+91 85000 12345",
                  operatingHours: t.operatingHours.value,
                  managerName: t.managerName.value,
                  managerPhone: t.managerPhone.value,
                  managerEmail: t.managerEmail?.value || "",
                  totalCars: parseInt(t.totalCars.value) || 5,
                  staffCount: parseInt(t.staffCount.value) || 3,
                  monthlyRevenue: parseInt(t.monthlyRevenue.value) || 150000,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-slate-400 font-bold mb-1">Hub Name *</label>
                <input
                  name="name"
                  defaultValue={editingBranch?.name || ""}
                  required
                  placeholder="e.g. Tirupati Central Hub (Station)"
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">City *</label>
                  <input
                    name="city"
                    defaultValue={editingBranch?.city || "Tirupati"}
                    required
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">State *</label>
                  <input
                    name="state"
                    defaultValue={editingBranch?.state || "Andhra Pradesh"}
                    required
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Full Station Address *</label>
                <input
                  name="address"
                  defaultValue={editingBranch?.address || ""}
                  required
                  placeholder="Opposite Main Bus Stand, Railway Station Road..."
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Station Desk Phone</label>
                  <input
                    name="phone"
                    defaultValue={editingBranch?.phone || "+91 85000 12345"}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Station Manager Name</label>
                  <input
                    name="managerName"
                    defaultValue={editingBranch?.managerName || "M. Ramesh Reddy"}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Manager Phone</label>
                  <input
                    name="managerPhone"
                    defaultValue={editingBranch?.managerPhone || "+91 94400 11223"}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Operating Hours</label>
                  <input
                    name="operatingHours"
                    defaultValue={editingBranch?.operatingHours || "24 Hours (7 Days)"}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Stationed Cars</label>
                  <input
                    name="totalCars"
                    type="number"
                    defaultValue={editingBranch?.totalCars || 6}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Staff Count</label>
                  <input
                    name="staffCount"
                    type="number"
                    defaultValue={editingBranch?.staffCount || 4}
                    className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Monthly Gross Revenue (₹)</label>
                <input
                  name="monthlyRevenue"
                  type="number"
                  defaultValue={editingBranch?.monthlyRevenue || 250000}
                  className="w-full bg-[#070e1c] border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
                >
                  {editingBranch ? "Save Hub Changes" : "Create Station Hub"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ====================================================================
          MODAL 2: VIEW BRANCH FLEET BREAKDOWN
          ==================================================================== */}
      {viewingFleetBranch && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#0b1426] border border-slate-800 rounded-3xl w-full max-w-xl p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h3 className="text-base font-black flex items-center gap-2">
                <Car className="w-5 h-5 text-[#c88d18]" /> Station Fleet: {viewingFleetBranch.name}
              </h3>
              <button onClick={() => setViewingFleetBranch(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {fleet
                .filter((c) => c.branch === viewingFleetBranch.name)
                .map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl bg-[#070e1c] border border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="w-12 h-10 object-cover rounded-xl border border-slate-800" />
                      <div>
                        <p className="font-bold text-white">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{c.registrationNumber}</p>
                        <p className="text-[9px] text-[#c88d18]">{c.category} &bull; {c.fuelType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400">{c.price}/day</p>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        c.status === "Available" ? "bg-emerald-500/20 text-emerald-300" : "bg-blue-500/20 text-blue-300"
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setViewingFleetBranch(null)}
                className="px-5 py-2 rounded-xl bg-[#c88d18] text-slate-950 font-black text-xs"
              >
                Close Fleet
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
