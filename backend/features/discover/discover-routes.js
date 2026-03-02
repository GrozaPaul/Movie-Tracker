import express from "express";
import * as discoverController from "./discover-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, discoverController.semanticSearch);

export default router;
