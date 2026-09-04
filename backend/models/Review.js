import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Review = sequelize.define("Review", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    defaultValue: 5,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.STRING,
    defaultValue: "2026-09-04",
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: "Approved",
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  adminReply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bookingId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
});

export { Review };
