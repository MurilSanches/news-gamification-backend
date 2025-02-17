import express, { Router } from "express";
import { getUserStreak, updateUserName } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/:email", getUserStreak);
router.put("/:email/name", updateUserName);

export default router;
