import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminUser: {
    type: DataTypes.STRING,
    defaultValue: "Super Admin",
  },
  actionType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    defaultValue: "122.179.88.14",
  },
  timestamp: {
    type: DataTypes.STRING,
    defaultValue: "Just now",
  },
});

export { ActivityLog };
