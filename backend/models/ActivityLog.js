import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const ActivityLog = sequelize.define("ActivityLog", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  adminName: {
    type: DataTypes.STRING,
    defaultValue: "Executive Super Admin",
  },
  adminUser: {
    type: DataTypes.STRING,
    defaultValue: "Super Admin",
  },
  module: {
    type: DataTypes.STRING,
    defaultValue: "Fleet",
  },
  action: {
    type: DataTypes.STRING,
    defaultValue: "UPDATE",
  },
  actionType: {
    type: DataTypes.STRING,
    defaultValue: "UPDATE",
  },
  details: {
    type: DataTypes.TEXT,
    defaultValue: "System activity recorded",
  },
  description: {
    type: DataTypes.TEXT,
    defaultValue: "System activity recorded",
  },
  target: {
    type: DataTypes.STRING,
    allowNull: true,
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
    defaultValue: () => new Date().toLocaleString(),
  },
}, {
  hooks: {
    beforeValidate: (log) => {
      if (!log.actionType && log.action) log.actionType = log.action;
      if (!log.action && log.actionType) log.action = log.actionType;
      if (!log.description && log.details) log.description = log.details;
      if (!log.details && log.description) log.details = log.description;
      if (!log.adminUser && log.adminName) log.adminUser = log.adminName;
    },
  },
});

export { ActivityLog };
