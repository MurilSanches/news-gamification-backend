import { Request, Response } from "express";
import sql from "../database/connection";

export const receiveWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, id } = req.query as { email?: string; id?: string };

    if (!email || !id) {
      res.status(400).json({ error: "Email e ID são obrigatórios." });
      return;
    }

    let user = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  
    if (user.length === 0) {
      user = await sql`
        INSERT INTO users (email) 
        VALUES (${email}) 
        RETURNING *`;
    }

    const userId = user[0].id;

    let existingStreak = await sql`
    SELECT * FROM streaks 
    WHERE user_id = ${userId} AND newsletter_id = ${id} 
    LIMIT 1`;

    if (existingStreak.length > 0) {
      res.status(400).json({ error: "O usuário já registrou abertura para essa newsletter." });
      return;
    }

    await sql`
      INSERT INTO streaks (user_id, newsletter_id) 
      VALUES (${userId}, ${id})`;

    res.status(200).json({ data: {
      id: id,
      email: email,
    } });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    res.status(500).json({ error: "Erro ao processar webhook." });
  }
};
