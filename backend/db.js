import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env from backend folder or root folder
dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config();

let sequelize;

const dbName = process.env.DB_NAME || "u307020728_moardb";
const dbUser = process.env.DB_USER || "u307020728_moardb";
const dbPass = process.env.DB_PASSWORD || "Moardb@123";
let dbHost = process.env.DB_HOST || "127.0.0.1";
if (dbHost === "localhost") {
  dbHost = "127.0.0.1";
}
const dbPort = parseInt(process.env.DB_PORT, 10) || 3306;

const isExplicitSqlite = process.env.DB_DIALECT === "sqlite";

if (!isExplicitSqlite && dbName && dbUser) {
  console.log(`Database Setup: Configuring Sequelize with MySQL at ${dbHost}:${dbPort}...`);
  sequelize = new Sequelize(dbName, dbUser, dbPass, {
    host: dbHost,
    port: dbPort,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 10000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  console.log("Database Setup: Using high-performance local SQLite database (moar_database.sqlite)...");
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "moar_database.sqlite"),
    logging: false,
  });
}

export { sequelize };



