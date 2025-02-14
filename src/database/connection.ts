import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;

console.log(connectionString)

if (!connectionString) {
  throw new Error("⚠️ DATABASE_URL não definida no .env");
}

const sql = postgres(connectionString, {
  idle_timeout: 60,
});

export default sql;
