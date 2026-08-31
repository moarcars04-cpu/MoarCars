import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./db.js";
import { Car } from "./models/Car.js";
import { Booking } from "./models/Booking.js";
import { Admin } from "./models/Admin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend development server
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// GET /api/cars - Get all fleet vehicles from database
app.get("/api/cars", async (req, res) => {
  try {
    const cars = await Car.findAll();
    res.json({
      success: true,
      data: cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error reading fleet database.",
    });
  }
});

// POST /api/bookings - Create a new booking in database
app.post("/api/bookings", async (req, res) => {
  try {
    const { pickup, startDate, endDate, carName } = req.body;

    if (!pickup || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all booking details (pickup, start date, and end date).",
      });
    }

    const newBooking = await Booking.create({
      pickup,
      startDate,
      endDate,
      carName: carName || "General Search Inquiry",
    });

    console.log("New database booking created:", newBooking.toJSON());

    res.status(201).json({
      success: true,
      message: "Booking reservation saved successfully!",
      data: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error saving booking details.",
    });
  }
});

// POST /api/admin/login - Authenticate admin credentials
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required." });
    }
    const admin = await Admin.findOne({ where: { username, password } });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid username or password." });
    }
    res.json({ success: true, message: "Login successful", username: admin.username });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// GET /api/admin/bookings - Fetch all user bookings
app.get("/api/admin/bookings", async (req, res) => {
  try {
    const bookings = await Booking.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// POST /api/admin/cars - Add a new vehicle to the fleet
app.post("/api/admin/cars", async (req, res) => {
  try {
    const { name, detail, price, tag, imagePosition } = req.body;
    if (!name || !detail || !price) {
      return res.status(400).json({ success: false, message: "Name, detail, and price are required." });
    }
    const newCar = await Car.create({ name, detail, price, tag, imagePosition });
    res.status(201).json({ success: true, message: "Car added successfully!", data: newCar });
  } catch (error) {
    console.error("Add car error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// DELETE /api/admin/cars/:id - Remove a vehicle from the fleet
app.delete("/api/admin/cars/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Car.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Car not found." });
    }
    res.json({ success: true, message: "Car deleted successfully!" });
  } catch (error) {
    console.error("Delete car error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Sync database tables and start listening
sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("Database tables synced successfully.");

    // Seed default vehicles if database is empty
    const carCount = await Car.count();
    if (carCount === 0) {
      console.log("Database: Seeding default vehicles...");
      await Car.bulkCreate([
        {
          name: "City Hatchbacks",
          detail: "Smart, efficient and easy to park",
          price: "₹1,699",
          tag: "Everyday",
          imagePosition: "left",
        },
        {
          name: "Executive Sedans",
          detail: "A smoother way to go further",
          price: "₹2,199",
          tag: "Comfort",
          imagePosition: "center",
        },
        {
          name: "Adventure SUVs",
          detail: "More room for the road ahead",
          price: "₹2,499",
          tag: "Popular",
          imagePosition: "right",
        },
      ]);
      console.log("Database: Seeding complete.");
    }

    // Seed default admin if database is empty
    const adminCount = await Admin.count();
    if (adminCount === 0) {
      console.log("Database: Seeding default admin credentials...");
      await Admin.create({
        username: "admin",
        password: "adminpassword",
      });
      console.log("Database: Seeding default admin complete.");
    }

    app.listen(PORT, () => {
      console.log(`Express server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
    // Fallback: start server anyway so app doesn't crash on bad DB configuration
    app.listen(PORT, () => {
      console.log(`Express server running (DB offline) on http://localhost:${PORT}`);
    });
  });
