import { Response } from "express";
import { AppError } from "../middleware/errorMiddleware";
import logger from "./logger";
import { messages } from "../constants/messages";

export const handleErrorResponse = (error: unknown, res: Response) => {
  logger.error(error);
  res.status(error instanceof AppError ? error.statusCode : 500).json({
    error: error instanceof Error ? error.message : messages.internalError,
  });
};