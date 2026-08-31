import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

let sequelize;

// Check if MySQL credentials are set (Hostinger shared hosting environment)
const isMysqlConfigured =
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_NAME;

if (isMysqlConfigured) {
  console.log("Database Setup: Configuring Sequelize with MySQL (Hostinger/Server)...");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
} else {
  console.log("Database Setup: MySQL env variables missing. Falling back to local SQLite database...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database.sqlite",
    logging: false,
  });
}

export { sequelize };
