import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { sequelize } from "./db.js";
import { Car } from "./models/Car.js";
import { Booking } from "./models/Booking.js";

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
app.use(express.static(path.join(__dirname, "../frontend/dist/client")));

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

// Serve index.html for all other routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/client/index.html"));
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
