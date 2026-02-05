import express from "express";
import * as watchedController from "./watched-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, watchedController.markAsWatched);
router.get(
  "/:userId",
  authenticate,
  watchedController.getAllWatchedMoviesOfUser,
);
router.delete("/", authenticate, watchedController.removeWatchedMovie);

export default router;
