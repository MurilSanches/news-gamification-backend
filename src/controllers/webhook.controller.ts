import { Request, Response } from "express";

import { AppError } from "../middleware/errorMiddleware";
import { handleErrorResponse } from "../utils/handleError";
import { createUser, getUserByEmail } from "../services/userServices";
import { messages } from "../constants/messages";
import { addStreak, getStreak } from "../services/streakService";

export const receiveWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, id } = req.query as { email?: string; id?: string };

    if (!email || !id) {
      throw new AppError(messages.invalidIdAndEmail, 400);
    }

    let user = await getUserByEmail(email);
    if (user.length === 0) {
      user = await createUser(email)
    }

    const userId = user[0].id;

    const existingStreak = await getStreak(userId, id)

    if (existingStreak.length > 0) {
      throw new AppError(messages.userHasStreak, 400);
    }

    await addStreak(userId, id)

    res.status(200).json({
      data: {
        id,
        email,
      },
    });
  } catch (error) {
    handleErrorResponse(error, res);
  }
};
