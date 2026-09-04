import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Branch = sequelize.define("Branch", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: "Tirupati",
  },
  state: {
    type: DataTypes.STRING,
    defaultValue: "Andhra Pradesh",
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    defaultValue: "+91 877 223344",
  },
  managerName: {
    type: DataTypes.STRING,
    defaultValue: "Nagaraju V",
  },
  managerPhone: {
    type: DataTypes.STRING,
    defaultValue: "+91 98765 11122",
  },
  operatingHours: {
    type: DataTypes.STRING,
    defaultValue: "24 Hours (7 Days)",
  },
  totalCars: {
    type: DataTypes.INTEGER,
    defaultValue: 8,
  },
  staffCount: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  monthlyRevenue: {
    type: DataTypes.INTEGER,
    defaultValue: 285000,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

export { Branch };
