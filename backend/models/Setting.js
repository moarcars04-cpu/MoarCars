import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const Setting = sequelize.define("Setting", {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export { Setting };
