import sql from "../database/connection";

export const addStreak = async (userId: number, newsletterId: string) => {
    return await sql`INSERT INTO streaks (user_id, newsletter_id) VALUES (${userId}, ${newsletterId})`;
}
  
export const getStreak = async (userId: number, newsletterId: string) => {
    return await sql`
      SELECT * FROM streaks
      WHERE user_id = ${userId} AND newsletter_id = ${newsletterId}
      LIMIT 1`;
}

export const getStreakCountFromUser = async (userId: string) => {
    return await sql`SELECT COUNT(*) AS total FROM streaks WHERE user_id = ${userId}`;
}

export const getPaginateStreakHistoryFromUser = async (userId: string, limit: number, offset: number) => {
    return await sql`
        SELECT id, newsletter_id, opened_at 
        FROM streaks 
        WHERE user_id = ${userId}
        ORDER BY opened_at DESC
        LIMIT ${limit} OFFSET ${offset}
    `;
}

export const getAllStreaksHistoryFromUser = async (userId: string) => {
    return await sql`
        SELECT DATE(opened_at) AS opened_date 
        FROM streaks 
        WHERE user_id = ${userId} 
        ORDER BY opened_at DESC`;
}   