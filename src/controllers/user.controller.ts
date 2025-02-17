import { Request, Response } from "express";
import sql from "../database/connection";

interface UserParams {
  email: string;
}

export const getUserStreak = async (req: Request<UserParams>, res: Response): Promise<void> => {
  try {
    const { email } = req.params;

    if (!email) {
      res.status(400).json({ message: "O email é obrigatório." });
      return;
    }

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    const userId = user[0].id;

    const openings = await sql`
      SELECT DATE(opened_at) AS opened_date 
      FROM streaks 
      WHERE user_id = ${userId} 
      ORDER BY opened_at DESC`;

    const dates = openings.map((row) => row.opened_date);

    let streak = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]).getTime() - new Date(dates[i + 1]).getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        streak++;
      } else {
        break;
      }
    }

    res.status(200).json({ email, name: user[0].name, streak, history: dates });
  } catch (error) {
    console.error("Erro ao calcular streak:", error);
    res.status(500).json({ error: "Erro ao calcular streak." });
  }
};

interface UserParams {
  email: string;
}

interface UserBody {
  name: string;
}

export const updateUserName = async (req: Request<UserParams, {}, UserBody>, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const { name } = req.body;

    if (!email) {
      res.status(400).json({ message: "O email é obrigatório." });
      return;
    }

    if (!name || name.trim() === "") {
      res.status(400).json({ message: "O nome é obrigatório." });
      return;
    }

    const user = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }

    await sql`UPDATE users SET name = ${name} WHERE email = ${email}`;

    res.status(200).json({ message: "Nome atualizado com sucesso", email, name });
  } catch (error) {
    console.error("Erro ao atualizar o nome do usuário:", error);
    res.status(500).json({ error: "Erro ao atualizar o nome do usuário." });
  }
};
