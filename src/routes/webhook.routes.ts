import express from "express";
import { receiveWebhook } from "../controllers/webhook.controller";

const router = express.Router();

router.post("/", receiveWebhook);

export default router;
