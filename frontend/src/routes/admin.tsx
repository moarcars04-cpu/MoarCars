import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Lock, User, Plus, Trash2, Calendar, MapPin, Car, DollarSign, LogOut, Shield } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminComponent,
});

function AdminComponent() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dashboard states
  const [bookings, setBookings] = useState([]);
  const [fleet, setFleet] = useState([]);
  const [notice, setNotice] = useState("");

  // Add Car Form states
  const [newCarName, setNewCarName] = useState("");
  const [newCarDetail, setNewCarDetail] = useState("");
  const [newCarPrice, setNewCarPrice] = useState("");
  const [newCarTag, setNewCarTag] = useState("Everyday");
  const [newCarImagePosition, setNewCarImagePosition] = useState("center");

  // Check session storage on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem("adminSession");
    if (adminSession === "true") {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch Bookings
      const bookingsRes = await fetch("/api/admin/bookings");
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success) {
        setBookings(bookingsData.data);
      }

      // Fetch Cars
      const carsRes = await fetch("/api/cars");
      const carsData = await carsRes.json();
      if (carsData.success) {
        setFleet(carsData.data);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("adminSession", "true");
        fetchDashboardData();
      } else {
        setError(data.message || "Invalid credentials.");
      }
    } catch (err) {
      setError("Server connection failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("adminSession");
    setUsername("");
    setPassword("");
  };

  const handleAddCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarName || !newCarDetail || !newCarPrice) {
      setNotice("Please fill out all required fields.");
      return;
    }

    try {
      const res = await fetch("/api/admin/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCarName,
          detail: newCarDetail,
          price: newCarPrice,
          tag: newCarTag,
          imagePosition: newCarImagePosition,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setNotice("Car successfully added to the database!");
        setNewCarName("");
        setNewCarDetail("");
        setNewCarPrice("");
        fetchDashboardData();
      } else {
        setNotice(data.message || "Failed to add car.");
      }
    } catch (err) {
      setNotice("Error connecting to backend database.");
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (!confirm("Are you sure you want to delete this car from the fleet?")) return;

    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        setNotice("Car deleted successfully.");
        fetchDashboardData();
      } else {
        setNotice(data.message || "Failed to delete car.");
      }
    } catch (err) {
      setNotice("Error connecting to backend database.");
    }
  };

  // Compute stats
  const totalBookings = bookings.length;
  const activeFleetCount = fleet.length;
  const totalRevenue = bookings.reduce((sum, b) => {
    // Basic calculation parsing price tags or matching a standard rate
    return sum + 2000; // Average rate ₹2,000 per booking
  }, 0);

  // If not authenticated, render Login Page
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-brand-navy flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden select-none">
        {/* Subtle decorative background gradient spots */}
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-brand-teal/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-brand-orange/10 rounded-full blur-[120px]" />

        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-3 bg-brand-teal/20 rounded-2xl mb-4 text-brand-teal">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">Moar Cars Admin</h1>
            <p className="text-sm text-gray-400 mt-2">Enter credentials to access the control panel</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="admin"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-brand-navy/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-brand-navy/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-teal hover:bg-brand-teal/90 text-brand-navy font-bold py-3.5 rounded-xl transition-all shadow-lg hover:shadow-brand-teal/20"
            >
              {loading ? "Logging in..." : "Access Control Panel"}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => navigate({ to: "/" })}
              className="text-xs text-gray-500 hover:text-white transition-all underline"
            >
              Return to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render Admin Dashboard
  return (
    <div className="min-h-screen bg-brand-navy text-white font-sans antialiased">
      {/* Sticky Top Header */}
      <header className="sticky top-0 bg-brand-navy/90 backdrop-blur-md border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-teal/20 rounded-xl text-brand-teal">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">Moar Cars</h1>
              <p className="text-[10px] text-gray-400 tracking-widest uppercase">Admin Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate({ to: "/" })}
              className="text-sm text-gray-400 hover:text-white transition-all"
            >
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-gray-300 hover:text-red-400 px-4 py-2 rounded-xl text-sm transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Notices */}
        {notice && (
          <div className="bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-sm rounded-xl p-4 flex justify-between items-center">
            <span>{notice}</span>
            <button onClick={() => setNotice("")} className="text-xs hover:underline text-gray-400">
              Dismiss
            </button>
          </div>
        )}

        {/* Dashboard Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
            <div className="p-4 bg-brand-teal/20 rounded-2xl text-brand-teal">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Bookings</p>
              <h3 className="text-3xl font-extrabold mt-1">{totalBookings}</h3>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
            <div className="p-4 bg-brand-orange/20 rounded-2xl text-brand-orange">
              <Car className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Fleet</p>
              <h3 className="text-3xl font-extrabold mt-1">{activeFleetCount}</h3>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
            <div className="p-4 bg-brand-teal/20 rounded-2xl text-brand-teal">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Estimated Revenue</p>
              <h3 className="text-3xl font-extrabold mt-1">₹{totalRevenue.toLocaleString()}</h3>
            </div>
          </div>
        </section>

        {/* Dashboard Content split: Bookings and Car Management */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Bookings Tracker (2/3 width) */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-wide">Recent Booking Reservations</h2>
              <span className="text-xs text-gray-400">{bookings.length} reservations</span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Car Selected</th>
                      <th className="px-6 py-4">Pickup Location</th>
                      <th className="px-6 py-4">Start Date</th>
                      <th className="px-6 py-4">End Date</th>
                      <th className="px-6 py-4">Submitted At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No booking inquiries submitted yet.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking: any) => (
                        <tr key={booking.id} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4 font-semibold text-white">{booking.carName}</td>
                          <td className="px-6 py-4 text-gray-300 flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-brand-teal" />
                            {booking.pickup}
                          </td>
                          <td className="px-6 py-4 text-gray-300">{booking.startDate}</td>
                          <td className="px-6 py-4 text-gray-300">{booking.endDate}</td>
                          <td className="px-6 py-4 text-gray-400 text-xs">
                            {new Date(booking.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Car Fleet Manager (1/3 width) */}
          <section className="space-y-8">
            {/* Add Car Panel */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold tracking-wide">Add Fleet Vehicle</h2>
              <form onSubmit={handleAddCar} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Car Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Luxury Sedan"
                    value={newCarName}
                    onChange={(e) => setNewCarName(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Detail Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Elegant styling and maximum comfort"
                    value={newCarDetail}
                    onChange={(e) => setNewCarDetail(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Price (per day)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹2,299"
                      value={newCarPrice}
                      onChange={(e) => setNewCarPrice(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-teal transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Tag Category</label>
                    <select
                      value={newCarTag}
                      onChange={(e) => setNewCarTag(e.target.value)}
                      className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-teal transition-all text-sm"
                    >
                      <option value="Everyday">Everyday</option>
                      <option value="Comfort">Comfort</option>
                      <option value="Popular">Popular</option>
                      <option value="Premium">Premium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase">Image Alignment</label>
                  <select
                    value={newCarImagePosition}
                    onChange={(e) => setNewCarImagePosition(e.target.value)}
                    className="w-full bg-brand-navy border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-brand-teal transition-all text-sm"
                  >
                    <option value="left">Left Aligned</option>
                    <option value="center">Centered</option>
                    <option value="right">Right Aligned</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-brand-teal hover:bg-brand-teal/90 text-brand-navy font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-brand-teal/10"
                >
                  <Plus className="w-5 h-5" />
                  Add to Active Fleet
                </button>
              </form>
            </div>

            {/* Current Fleet Table/Controls */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold tracking-wide">Manage Active Fleet</h2>
              <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-2 space-y-3">
                {fleet.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">No vehicles in active fleet.</p>
                ) : (
                  fleet.map((car: any) => (
                    <div key={car.id} className="flex items-center justify-between pt-3 first:pt-0">
                      <div>
                        <h4 className="text-sm font-semibold text-white">{car.name}</h4>
                        <p className="text-xs text-brand-teal">{car.price} / day</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCar(car.id)}
                        className="p-2 bg-white/5 hover:bg-red-500/15 border border-white/5 hover:border-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition-all"
                        title="Delete vehicle"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
