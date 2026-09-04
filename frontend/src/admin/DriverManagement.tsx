import React, { useState, useMemo } from "react";
import {
  Award,
  Plus,
  Search,
  Star,
  Building2,
  Navigation,
  Edit,
  Trash2,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { DriverItem } from "./types";
import { adminApi } from "./adminApi";

interface DriverManagementProps {
  drivers: DriverItem[];
  setDrivers: React.Dispatch<React.SetStateAction<DriverItem[]>>;
  setNotice: (n: { type: "success" | "error" | "info"; text: string } | null) => void;
}

export default function DriverManagement({
  drivers,
  setDrivers,
  setNotice,
}: DriverManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterBranch, setFilterBranch] = useState<string>("all");

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<DriverItem | null>(null);
  const [viewingDriver, setViewingDriver] = useState<DriverItem | null>(null);

  // Filtered drivers
  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.phone.includes(searchQuery) ||
        d.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.branch.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = filterStatus === "all" || d.status === filterStatus;
      const matchBranch = filterBranch === "all" || d.branch === filterBranch;

      return matchSearch && matchStatus && matchBranch;
    });
  }, [drivers, searchQuery, filterStatus, filterBranch]);

  const handleSaveDriver = (formData: Partial<DriverItem>) => {
    if (editingDriver) {
      setDrivers((prev) =>
        prev.map((d) => (d.id === editingDriver.id ? { ...d, ...formData } : d))
      );
      setNotice({ type: "success", text: `Chauffeur "${formData.name || editingDriver.name}" updated successfully!` });
      adminApi.updateDriver(editingDriver.id, formData);
    } else {
      const newD: DriverItem = {
        id: Math.floor(300 + Math.random() * 700),
        name: formData.name || "New Driver",
        phone: formData.phone || "+91 98765 00000",
        email: formData.email || "driver@moarcars.in",
        avatar: formData.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
        licenseNumber: formData.licenseNumber || "AP03 20200019283",
        licenseExpiry: formData.licenseExpiry || "2030-01-01",
        bgVerification: (formData.bgVerification as any) || "Passed",
        branch: formData.branch || "Tirupati Central Hub",
        status: (formData.status as any) || "Available",
        liveLocation: formData.liveLocation || "Tirupati Central Station Desk",
        todayTrips: 0,
        totalTrips: 0,
        earnings: 0,
        rating: 5.0,
        ratingCount: 1,
        hillDrivingCertified: true,
      };
      setDrivers([newD, ...drivers]);
      setNotice({ type: "success", text: `Chauffeur "${newD.name}" added to roster!` });
      adminApi.createDriver(newD);
    }
    setIsAddEditModalOpen(false);
    setEditingDriver(null);
  };

  const handleDeleteDriver = (id: number) => {
    if (confirm("Are you sure you want to remove this driver from the roster?")) {
      setDrivers((prev) => prev.filter((d) => d.id !== id));
      setNotice({ type: "info", text: `Driver #${id} removed.` });
      adminApi.deleteDriver(id);
    }
  };

  const handlePingLocation = (driver: DriverItem) => {
    const locations = [
      "Alipiri Checkpost Gate 1",
      "Renigunta Airport Terminal 1 Exit",
      "Tirupati Railway Station Desk",
      "Chandragiri Heritage Fort Road",
      "Horsley Hills Highway NH 71",
      "Tirumala Ring Road Cottage Area",
    ];
    const newLoc = locations[Math.floor(Math.random() * locations.length)];
    setDrivers((prev) =>
      prev.map((d) => (d.id === driver.id ? { ...d, liveLocation: newLoc } : d))
    );
    setNotice({ type: "success", text: `GPS Ping: ${driver.name} is currently at "${newLoc}"` });
    adminApi.updateDriver(driver.id, { liveLocation: newLoc });
  };

  const handleToggleStatus = (id: number, status: any) => {
    setDrivers((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    setNotice({ type: "success", text: `Driver #${id} status changed to "${status}".` });
    adminApi.updateDriver(id, { status });
  };

  return (
    <main className="flex-1 p-8 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-purple-500/20">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2 text-white">
            <Award className="w-6 h-6 text-[#D4AF37]" /> Chauffeur & Driver Operations
          </h2>
          <p className="text-xs text-purple-300 mt-1">
            Manage professional chauffeurs, police verification, live GPS tracking, hill ratings & branch allocations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-purple-400" />
            <input
              type="text"
              placeholder="Search driver, phone, license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14081E] border border-purple-500/30 rounded-2xl py-2 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <button
            onClick={() => {
              setEditingDriver(null);
              setIsAddEditModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95"
          >
            <Plus className="w-4 h-4" /> Add Chauffeur
          </button>
        </div>
      </div>

      {/* TOP METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Total Chauffeurs</span>
          <h4 className="text-2xl font-black text-white mt-1">{drivers.length} Roster</h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">100% Police Verified</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Available for Dispatch</span>
          <h4 className="text-2xl font-black text-emerald-400 mt-1">
            {drivers.filter((d) => d.status === "Available").length} Ready
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Instant Station Assignment</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Today's Completed Trips</span>
          <h4 className="text-2xl font-black text-[#D4AF37] mt-1">
            {drivers.reduce((acc, d) => acc + d.todayTrips, 0)} Trips
          </h4>
          <p className="text-[10px] text-purple-300 mt-0.5">Pilgrimage & Airport Routes</p>
        </div>

        <div className="p-5 rounded-3xl bg-[#2A1336]/60 backdrop-blur-2xl border border-purple-500/20 shadow-xl">
          <span className="text-xs text-purple-300 font-bold block">Gross Chauffeur Payouts</span>
          <h4 className="text-2xl font-black text-purple-200 mt-1">
            ₹{drivers.reduce((acc, d) => acc + d.earnings, 0).toLocaleString()}
          </h4>
          <p className="text-[10px] text-emerald-400 mt-0.5 font-bold">Weekly Direct Bank Settlement</p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap gap-2">
          {["all", "Available", "On Trip", "Off Duty", "On Leave"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl font-bold transition-all capitalize ${
                filterStatus === st
                  ? "bg-[#D4AF37] text-slate-950 font-black shadow-md"
                  : "bg-[#2A1336]/60 text-purple-300 border border-purple-500/20 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <select
          value={filterBranch}
          onChange={(e) => setFilterBranch(e.target.value)}
          className="px-4 py-2 rounded-xl bg-[#14081E] border border-purple-500/30 text-[#D4AF37] font-bold focus:outline-none"
        >
          <option value="all">All Station Hubs</option>
          <option value="Tirupati Central Hub">Tirupati Central Hub</option>
          <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
          <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
        </select>
      </div>

      {/* DRIVERS TABLE */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#2A1336]/60 backdrop-blur-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#190924] text-purple-300 uppercase tracking-wider font-bold border-b border-purple-500/20">
            <tr>
              <th className="px-5 py-4">Chauffeur Details</th>
              <th className="px-5 py-4">Verification & License</th>
              <th className="px-5 py-4">Assigned Branch & Live GPS</th>
              <th className="px-5 py-4">Trips & Earnings</th>
              <th className="px-5 py-4">Rating & Review</th>
              <th className="px-5 py-4">Availability</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-purple-500/10">
            {filteredDrivers.map((d) => (
              <tr key={d.id} className="hover:bg-purple-900/20 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={d.avatar}
                      alt={d.name}
                      className="w-10 h-10 rounded-full object-cover border border-purple-500/30"
                    />
                    <div>
                      <p className="font-bold text-white flex items-center gap-1">
                        {d.name}
                        {d.hillDrivingCertified && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-[#D4AF37] text-[8px] font-black border border-amber-400/30">
                            HILL CERTIFIED
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-purple-300">{d.phone}</p>
                      <p className="text-[10px] text-purple-400/80">{d.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border ${
                      d.bgVerification === "Passed"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    Police Check: {d.bgVerification}
                  </span>
                  <p className="text-[10px] text-purple-300 mt-1 font-mono">DL: {d.licenseNumber}</p>
                  <p className="text-[9px] text-purple-400 font-mono">Exp: {d.licenseExpiry}</p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-white flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-[#D4AF37]" /> {d.branch}
                  </p>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                    <Navigation className="w-2.5 h-2.5 animate-pulse" /> {d.liveLocation}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <p className="font-bold text-white">{d.totalTrips} Trips ({d.todayTrips} Today)</p>
                  <p className="text-[10px] text-emerald-400 font-bold">Earned: ₹{d.earnings.toLocaleString()}</p>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 font-bold text-[#D4AF37]">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" /> {d.rating}
                    <span className="text-[10px] text-purple-400">({d.ratingCount})</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <select
                    value={d.status}
                    onChange={(e) => handleToggleStatus(d.id, e.target.value)}
                    className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                      d.status === "Available"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                        : d.status === "On Trip"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/40"
                    }`}
                  >
                    <option value="Available" className="bg-[#14081E] text-white">Available</option>
                    <option value="On Trip" className="bg-[#14081E] text-white">On Trip</option>
                    <option value="Off Duty" className="bg-[#14081E] text-white">Off Duty</option>
                    <option value="On Leave" className="bg-[#14081E] text-white">On Leave</option>
                  </select>
                </td>

                <td className="px-5 py-4 text-right space-x-1.5">
                  <button
                    onClick={() => handlePingLocation(d)}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-[#D4AF37] border border-purple-500/30"
                    title="Ping Live GPS Location"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingDriver(d);
                      setIsAddEditModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-[#432650] text-purple-200 border border-purple-500/30"
                    title="Edit Driver Profile"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteDriver(d.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Delete Driver"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================================
          MODAL: ADD / EDIT CHAUFFEUR
          ==================================================================== */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-[#2E1439] border border-purple-500/30 rounded-3xl w-full max-w-lg p-6 shadow-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-purple-500/20">
              <h3 className="text-base font-black flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" /> {editingDriver ? `Edit Chauffeur: ${editingDriver.name}` : "Add New Professional Chauffeur"}
              </h3>
              <button onClick={() => setIsAddEditModalOpen(false)} className="text-purple-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const t = e.target as any;
                handleSaveDriver({
                  name: t.name.value,
                  phone: t.phone.value,
                  email: t.email.value,
                  licenseNumber: t.licenseNumber.value,
                  licenseExpiry: t.licenseExpiry.value,
                  branch: t.branch.value,
                  status: t.status.value,
                  bgVerification: t.bgVerification.value,
                  liveLocation: t.liveLocation.value,
                  avatar: t.avatar.value,
                });
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-purple-300 font-bold mb-1">Chauffeur Full Name *</label>
                <input
                  name="name"
                  defaultValue={editingDriver?.name || ""}
                  required
                  placeholder="Suresh Kumar"
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Mobile Phone *</label>
                  <input
                    name="phone"
                    defaultValue={editingDriver?.phone || ""}
                    required
                    placeholder="+91 98765 00001"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Email</label>
                  <input
                    name="email"
                    defaultValue={editingDriver?.email || ""}
                    placeholder="suresh@moarcars.in"
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Commercial License No *</label>
                  <input
                    name="licenseNumber"
                    defaultValue={editingDriver?.licenseNumber || "AP03 20180099182"}
                    required
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">License Expiry Date</label>
                  <input
                    name="licenseExpiry"
                    type="date"
                    defaultValue={editingDriver?.licenseExpiry || "2030-01-01"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Assigned Station Branch</label>
                  <select
                    name="branch"
                    defaultValue={editingDriver?.branch || "Tirupati Central Hub"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  >
                    <option value="Tirupati Central Hub">Tirupati Central Hub</option>
                    <option value="Renigunta Airport Hub">Renigunta Airport Hub</option>
                    <option value="Chandragiri Heritage Point">Chandragiri Heritage Point</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Police Background Verification</label>
                  <select
                    name="bgVerification"
                    defaultValue={editingDriver?.bgVerification || "Passed"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  >
                    <option value="Passed">Passed (Police Verified)</option>
                    <option value="Pending">Pending Audit</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Initial Status</label>
                  <select
                    name="status"
                    defaultValue={editingDriver?.status || "Available"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Off Duty">Off Duty</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 font-bold mb-1">Live Location / Desk</label>
                  <input
                    name="liveLocation"
                    defaultValue={editingDriver?.liveLocation || "Tirupati Central Hub"}
                    className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-300 font-bold mb-1">Avatar Image URL</label>
                <input
                  name="avatar"
                  defaultValue={editingDriver?.avatar || "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80"}
                  className="w-full bg-[#14081E] border border-purple-500/30 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-purple-500/20">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-purple-950 text-purple-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#D4AF37] text-slate-950 font-black text-xs"
                >
                  {editingDriver ? "Save Changes" : "Create Chauffeur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
