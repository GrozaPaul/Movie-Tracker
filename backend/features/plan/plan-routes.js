import express from "express";
import * as planController from "./plan-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, planController.getAllPlanned);
router.post("/", authenticate, planController.addMovieToPlan);
router.post("/mark", authenticate, planController.markMovieAsWatched);
router.delete("/", authenticate, planController.removeFromPlan);

export default router;
