import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("⚠️ DATABASE_URL não definida no .env");
}

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false, 
  },
  timeout: 30 * 1000,
  idle_timeout: 60,
});

export default sql;
