import express, { Router } from "express";
import { getUserStreak, updateUserName } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/:id", getUserStreak);
router.put("/:id/name", updateUserName);

export default router;
