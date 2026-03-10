import express from "express";
import { authenticate } from "../../middleware/auth.js";
import * as statsController from "./stats-controller.js";

const router = express.Router();

router.get("/", authenticate, statsController.statsController);
router.get("/test", statsController.getActors);

export default router;
