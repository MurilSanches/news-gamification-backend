import { Request, Response } from "express";
import sql from "../database/connection";

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await sql`SELECT COUNT(*) FROM users`;

    const maxStreakUser = await sql`
      SELECT users.id, users.name, users.email, COUNT(DISTINCT DATE(streaks.opened_at)) as streak
      FROM users
      LEFT JOIN streaks ON users.id = streaks.user_id
      GROUP BY users.id
      ORDER BY streak DESC
      LIMIT 1
    `;

    const mostViewedNewsletter = await sql`
      SELECT newsletter_id, COUNT(*) as views
      FROM streaks
      GROUP BY newsletter_id
      ORDER BY views DESC
      LIMIT 1
    `;

    res.status(200).json({
      total_users: totalUsers[0].count || 0,
      max_streak_user: maxStreakUser.length > 0 ? maxStreakUser[0] : null,
      most_viewed_newsletter: mostViewedNewsletter.length > 0 ? mostViewedNewsletter[0] : null,
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas do admin:", error);
    res.status(500).json({ error: "Erro ao buscar estatísticas do admin." });
  }
};

export const getAccessAnalytics = async (_req: Request, res: Response): Promise<void> => {
    try {      
      const weekdaysMap: Record<string, number> = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      };
  
      const hoursMap: Record<number, number> = {};
      for (let i = 0; i < 24; i++) hoursMap[i] = 0;
        
      const accesses = await sql`SELECT opened_at FROM streaks`;
       
      accesses.forEach((access) => {
        const date = new Date(access.opened_at);
        const day = date.toLocaleString("en-US", { weekday: "long" });
        const hour = date.getHours();
  
        weekdaysMap[day] += 1;
        hoursMap[hour] += 1;
      });
       
      const weeklyData = Object.keys(weekdaysMap).map((day) => ({ day, access: weekdaysMap[day] }));
      const hourlyData = Object.keys(hoursMap).map((hour) => ({ hour: Number(hour), access: hoursMap[Number(hour)] }));
  
      res.status(200).json({ weeklyData, hourlyData });
    } catch (error) {
      console.error("Erro ao buscar estatísticas de acesso:", error);
      res.status(500).json({ error: "Erro ao buscar estatísticas de acesso." });
    }
  };

export const getRanking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, order = "desc", start_date, end_date, page = "1", limit = "10" } = req.query;

    // Validação do tipo
    if (!type || (type !== "users" && type !== "newspapers")) {
      res.status(400).json({ error: "O parâmetro 'type' deve ser 'users' ou 'newspapers'." });
      return
    }

    // Define a direção da ordenação (ASC ou DESC)
    const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;

    // Paginação
    const pageNumber = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 10;
    const offset = (pageNumber - 1) * pageSize;

    // Condição de filtro por data
    const startDate = typeof start_date === "string" ? start_date : null;
    const endDate = typeof end_date === "string" ? end_date : null;
    
    const dateFilter = startDate && endDate 
      ? sql`AND opened_at BETWEEN ${sql(startDate)} AND ${sql(endDate)}` 
      : sql``;
    
  
    let rankingData;
    let totalCount;

    if (type === "users") {
      // Ranking de Usuários baseado no maior streak
      rankingData = await sql`
        SELECT users.id, users.name, users.email, COUNT(DISTINCT DATE(streaks.opened_at)) AS streak
        FROM users
        LEFT JOIN streaks ON users.id = streaks.user_id
        WHERE TRUE ${dateFilter} -- Filtro de período (se existir)
        GROUP BY users.id
        ORDER BY streak ${sortOrder}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalCount = await sql`
        SELECT COUNT(*) AS total FROM users
      `;
    } else {
      // Ranking de Newsletters mais acessadas
      rankingData = await sql`
        SELECT newsletter_id, COUNT(*) AS views
        FROM streaks
        WHERE TRUE ${dateFilter} -- Filtro de período (se existir)
        GROUP BY newsletter_id
        ORDER BY views ${sortOrder}
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      totalCount = await sql`
        SELECT COUNT(DISTINCT newsletter_id) AS total FROM streaks
      `;
    }

    res.status(200).json({
      data: rankingData,
      pagination: {
        current_page: pageNumber,
        total_pages: Math.ceil(totalCount[0].total / pageSize),
        total_items: totalCount[0].total,
        per_page: pageSize,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar ranking:", error);
    res.status(500).json({ error: "Erro ao buscar ranking." });
  }
};
