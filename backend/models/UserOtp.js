import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const UserOtp = sequelize.define("UserOtp", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  identifier: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    defaultValue: "SMS",
  },
  expiresAt: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  attempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export { UserOtp };
