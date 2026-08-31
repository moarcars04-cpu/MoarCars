import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

// Mock database for vehicles
const fleet = [
  {
    id: "hatchback",
    name: "City Hatchbacks",
    detail: "Smart, efficient and easy to park",
    price: "₹1,699",
    tag: "Everyday",
    imagePosition: "left",
  },
  {
    id: "sedan",
    name: "Executive Sedans",
    detail: "A smoother way to go further",
    price: "₹2,199",
    tag: "Comfort",
    imagePosition: "center",
  },
  {
    id: "suv",
    name: "Adventure SUVs",
    detail: "More room for the road ahead",
    price: "₹2,499",
    tag: "Popular",
    imagePosition: "right",
  },
];

// In-memory array to store bookings
const bookings = [];

// GET /api/cars - Get all fleet vehicles
app.get("/api/cars", (req, res) => {
  res.json({
    success: true,
    data: fleet,
  });
});

// POST /api/bookings - Create a new booking
app.post("/api/bookings", (req, res) => {
  const { pickup, startDate, endDate, carName } = req.body;

  if (!pickup || !startDate || !endDate) {
    return res.status(400).json({
      success: false,
      message: "Please fill all booking details (pickup, start date, and end date).",
    });
  }

  const newBooking = {
    id: `booking_${Date.now()}`,
    pickup,
    startDate,
    endDate,
    carName: carName || "General Search Inquiry",
    createdAt: new Date(),
  };

  bookings.push(newBooking);
  console.log("New booking received:", newBooking);

  res.status(201).json({
    success: true,
    message: "Booking reservation received successfully!",
    data: newBooking,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
});
