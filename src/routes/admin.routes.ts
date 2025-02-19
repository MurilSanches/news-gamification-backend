import express from "express";
import { getAccessAnalytics, getAdminStats, getRanking } from "../controllers/admin.controller";

const router = express.Router();

router.get("/stats", getAdminStats);
router.get("/graphic", getAccessAnalytics);
router.get("/ranking", getRanking);

export default router;
