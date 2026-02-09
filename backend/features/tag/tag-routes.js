import express from "express";
import * as tagController from "./tag-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, tagController.get);
router.post("/", authenticate, tagController.addTagToMovie);
router.delete("/", authenticate, tagController.removeTagFromMovie);

export default router;
