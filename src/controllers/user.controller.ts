import { Request, Response } from "express";
import { getUserByEmail, getUserById, updateUser } from "../services/userServices";
import { messages } from "../constants/messages";
import { AppError } from "../middleware/errorMiddleware";
import { handleErrorResponse } from "../utils/handleError";
import { getAllStreaksHistoryFromUser, getPaginateStreakHistoryFromUser, getStreakCountFromUser } from "../services/streakService";

export const getUser = async (req: Request<{ email: string }>, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    if (!email) throw new AppError(messages.invalidEmail, 400);

    const user = await getUserByEmail(email);
    if (user.length === 0) throw new AppError(messages.userNotFound, 404);

    res.status(200).json({ id: user[0].id, email: user[0].email, name: user[0].name });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

export const getUserStreak = async (req: Request<{ id: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError(messages.invalidId, 400);

    const user = await getUserById(id);
    if (user.length === 0) throw new AppError(messages.userNotFound, 404);

    const openings = await getAllStreaksHistoryFromUser(id)

    const dates = openings.map((row) => row.opened_date);
    let streak = 1;

    for (let i = 1; i < dates.length; i++) {
      const diffDays = (new Date(dates[i - 1]).getTime() - new Date(dates[i]).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    res.status(200).json({ id, streak, history: dates });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

export const updateUserName = async (req: Request<{ id: string }, {}, { name: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!id) throw new AppError(messages.invalidId, 400);
    if (!name || name.trim() === "") throw new AppError(messages.invalidName, 400);

    const user = await getUserById(id);
    if (user.length === 0) throw new AppError(messages.userNotFound, 404);

    await updateUser(id, name);
    res.status(200).json({ message: messages.userUpdated, id, name });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};

export const getUserHistory = async (req: Request<{ id: string }, {}, {}, { page?: string; limit?: string }>, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) throw new AppError(messages.invalidId, 400);

    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const offset = (page - 1) * limit;

    const history = await getPaginateStreakHistoryFromUser(id, limit, offset)
    const [{ total }] = await getStreakCountFromUser(id)

    res.status(200).json({
      history,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        per_page: limit,
      },
    });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};
