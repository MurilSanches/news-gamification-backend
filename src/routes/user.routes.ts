import express, { Router } from "express";
import { getUserStreak, updateUserName, getUser, getUserHistory } from "../controllers/user.controller";

const router: Router = express.Router();

router.get('/:email', getUser)
router.get("/streak/:id", getUserStreak);
router.put("/:id/name", updateUserName);
router.get("/history/:id", getUserHistory);

export default router;
