import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  pickup: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  carName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "General Search Inquiry",
  },
});

export { Booking };
