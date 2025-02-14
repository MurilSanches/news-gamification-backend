import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRES_URL;

if (!connectionString) {
  throw new Error("⚠️ POSTGRES_URL não definida no .env");
}

const sql = postgres(connectionString, {
  ssl: {
    rejectUnauthorized: false, 
  },
  idle_timeout: 60,
});

export default sql;
