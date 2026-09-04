import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config();

let sequelize;

// In production on Hostinger or if DB_DIALECT is explicitly mysql, use MySQL.
// Otherwise use SQLite (database.sqlite) for immediate zero-config persistence.
const useMysql =
  process.env.DB_DIALECT === "mysql" ||
  (process.env.NODE_ENV === "production" && process.env.DB_HOST && process.env.DB_NAME);

if (useMysql) {
  console.log("Database Setup: Configuring Sequelize with MySQL (Hostinger/Production)...");
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST || "localhost",
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
  console.log("Database Setup: Using high-performance local SQLite database (moar_database.sqlite)...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "moar_database.sqlite"),
    logging: false,
  });
}


export { sequelize };

