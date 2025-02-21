import sql from "../database/connection";

export const getTotalUsers = async (): Promise<number> => {
  const result = await sql`SELECT COUNT(*) FROM users`;
  return result[0].count || 0;
};

export const getMaxStreakUser = async () => {
  const result = await sql`
    SELECT users.id, users.name, users.email, COUNT(DISTINCT DATE(streaks.opened_at)) as streak
    FROM users
    LEFT JOIN streaks ON users.id = streaks.user_id
    GROUP BY users.id
    ORDER BY streak DESC
    LIMIT 1
  `;
  return result.length > 0 ? result[0] : null;
};

export const getMostViewedNewsletter = async () => {
  const result = await sql`
    SELECT newsletter_id, COUNT(*) as views
    FROM streaks
    GROUP BY newsletter_id
    ORDER BY views DESC
    LIMIT 1
  `;
  return result.length > 0 ? result[0] : null;
};

export const getAccessData = async () => {
  const weekdaysMap: Record<string, number> = {
    'seg.': 0, 'ter.': 0, 'qua.': 0, 'qui.': 0, 'sex.': 0, 'sab.': 0, 'dom.': 0,
  };

  const hoursMap: Record<number, number> = {};
  for (let i = 0; i < 24; i++) hoursMap[i] = 0;

  const accesses = await sql`SELECT opened_at FROM streaks`;
  accesses.forEach((access) => {
    const date = new Date(access.opened_at);
    const day = date.toLocaleString("pt-BR", { weekday: "short" });
    const hour = date.getHours();

    if (weekdaysMap[day] !== undefined) weekdaysMap[day] += 1;
    if (hoursMap[hour] !== undefined) hoursMap[hour] += 1;
  });

  return {
    weeklyData: Object.entries(weekdaysMap).map(([day, access]) => ({ day, access })),
    hourlyData: Object.entries(hoursMap).map(([hour, access]) => ({ hour: Number(hour), access })),
  };
};

export const getRankingData = async (query: any) => {
  const { type, order = "desc", start_date, end_date, page = "1", limit = "10" } = query;
  if (type !== "users" && type !== "newsletters") throw new Error("O parâmetro 'type' deve ser 'users' ou 'newsletters'.");

  const sortOrder = order === "asc" ? sql`ASC` : sql`DESC`;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * pageSize;

  const dateFilter = start_date && end_date ? sql`AND opened_at BETWEEN ${sql(start_date)} AND ${sql(end_date)}` : sql``;
  let rankingData, totalCount;

  if (type === "users") {
    rankingData = await sql`
      SELECT users.id, users.name, users.email, COUNT(DISTINCT DATE(streaks.opened_at)) AS streak
      FROM users
      LEFT JOIN streaks ON users.id = streaks.user_id
      WHERE TRUE ${dateFilter}
      GROUP BY users.id
      ORDER BY streak ${sortOrder}
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    totalCount = await sql`SELECT COUNT(*) AS total FROM users`;
  } else {
    rankingData = await sql`
      SELECT newsletter_id, COUNT(*) AS views
      FROM streaks
      WHERE TRUE ${dateFilter}
      GROUP BY newsletter_id
      ORDER BY views ${sortOrder}
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    totalCount = await sql`SELECT COUNT(DISTINCT newsletter_id) AS total FROM streaks`;
  }

  return {
    data: rankingData,
    pagination: {
      current_page: pageNumber,
      total_pages: Math.ceil(totalCount[0].total / pageSize),
      total_items: totalCount[0].total,
      per_page: pageSize,
    },
  };
};
