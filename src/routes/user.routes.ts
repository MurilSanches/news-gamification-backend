import express, { Router } from "express";
import { getUserStreak } from "../controllers/user.controller";

const router: Router = express.Router();

router.get("/:email", getUserStreak);

export default router;
