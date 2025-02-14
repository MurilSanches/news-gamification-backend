import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sql from "./database/connection"; // Conexão com o banco
import webhookRoutes from "./routes/webhook.routes";
import userRoutes from "./routes/user.routes";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const testDatabaseConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log("Conexão com o banco bem-sucedida!");
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
    process.exit(1); 
  }
};

(async () => {
  await testDatabaseConnection();
  app.use("/webhook", webhookRoutes);
  app.use("/user", userRoutes)

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
})();
