import { Request, Response } from "express";
import { messages } from "../constants/messages";
import { AppError } from "../middleware/errorMiddleware";
import logger from "../utils/logger";
import { getTotalUsers, getMaxStreakUser, getMostViewedNewsletter, getAccessData, getRankingData } from "../services/adminService";

const handleErrorResponse = (error: unknown, res: Response) => {
  logger.error(error);
  res.status(error instanceof AppError ? error.statusCode : 500).json({
    error: error instanceof Error ? error.message : messages.internalError,
  });
};

export const getAdminStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await getTotalUsers();
    const maxStreakUser = await getMaxStreakUser();
    const mostViewedNewsletter = await getMostViewedNewsletter();

    res.status(200).json({
      total_users: totalUsers,
      max_streak_user: maxStreakUser,
      most_viewed_newsletter: mostViewedNewsletter,
    });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

export const getAccessAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const { weeklyData, hourlyData } = await getAccessData();
    res.status(200).json({ weeklyData, hourlyData });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

export const getRanking = async (req: Request, res: Response): Promise<void> => {
  try {
    const rankingResult = await getRankingData(req.query);
    res.status(200).json(rankingResult);
  } catch (error) {
    handleErrorResponse(error, res);
  }
};
