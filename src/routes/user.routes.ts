import express, { Router } from "express";
import { getUserStreak, updateUserName, getUser  } from "../controllers/user.controller";

const router: Router = express.Router();

router.get('/:email', getUser)
router.get("/streak/:id", getUserStreak);
router.put("/:id/name", updateUserName);

export default router;
