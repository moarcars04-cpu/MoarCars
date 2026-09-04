import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Car = sequelize.define("Car", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  brand: {
    type: DataTypes.STRING,
    defaultValue: "Maruti Suzuki",
  },
  model: {
    type: DataTypes.STRING,
    defaultValue: "Swift",
  },
  variant: {
    type: DataTypes.STRING,
    defaultValue: "ZXi+",
  },
  year: {
    type: DataTypes.INTEGER,
    defaultValue: 2024,
  },
  registrationNumber: {
    type: DataTypes.STRING,
    defaultValue: "AP 03 TX 1024",
  },
  vinNumber: {
    type: DataTypes.STRING,
    defaultValue: "MA3EYD21S00192844",
  },
  detail: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pricePerHour: {
    type: DataTypes.INTEGER,
    defaultValue: 199,
  },
  pricePerDay: {
    type: DataTypes.INTEGER,
    defaultValue: 1699,
  },
  pricePerWeek: {
    type: DataTypes.INTEGER,
    defaultValue: 9999,
  },
  pricePerMonth: {
    type: DataTypes.INTEGER,
    defaultValue: 34999,
  },
  securityDeposit: {
    type: DataTypes.INTEGER,
    defaultValue: 3000,
  },
  lateFeePerHour: {
    type: DataTypes.INTEGER,
    defaultValue: 150,
  },
  tag: {
    type: DataTypes.STRING,
    defaultValue: "Everyday",
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: "Hatchback",
  },
  fuelType: {
    type: DataTypes.STRING,
    defaultValue: "Petrol",
  },
  transmission: {
    type: DataTypes.STRING,
    defaultValue: "Manual",
  },
  seats: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  mileage: {
    type: DataTypes.STRING,
    defaultValue: "22 km/l",
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: "Pearl Arctic White",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Available",
  },
  branch: {
    type: DataTypes.STRING,
    defaultValue: "Tirupati Central Hub",
  },
  location: {
    type: DataTypes.STRING,
    defaultValue: "Tirupati",
  },
  gpsEnabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  fastagNumber: {
    type: DataTypes.STRING,
    defaultValue: "FTG-889021-39",
  },
  insuranceExpiry: {
    type: DataTypes.STRING,
    defaultValue: "2027-04-15",
  },
  pollutionExpiry: {
    type: DataTypes.STRING,
    defaultValue: "2026-11-20",
  },
  fitnessExpiry: {
    type: DataTypes.STRING,
    defaultValue: "2028-08-10",
  },
  permitExpiry: {
    type: DataTypes.STRING,
    defaultValue: "2027-12-31",
  },
  rcDocUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  insuranceDocUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image: {
    type: DataTypes.TEXT,
    defaultValue: "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80",
  },
  galleryImages: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  angle360Images: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  totalRevenue: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  maintenanceCost: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastServiceKm: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  nextServiceKm: {
    type: DataTypes.INTEGER,
    defaultValue: 10000,
  },
  oilChangeStatus: {
    type: DataTypes.STRING,
    defaultValue: "Good",
  },
  tyreHealth: {
    type: DataTypes.STRING,
    defaultValue: "Good",
  },
  batteryHealth: {
    type: DataTypes.STRING,
    defaultValue: "Good",
  },
  isArchived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

export { Car };
