import express from "express";
import * as watchlistController from "./watchlist-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get(
  "/:userId",
  authenticate,
  watchlistController.getAllWatchlistedMoviesOfUser,
);

router.post("/", authenticate, watchlistController.addToWatchlist);

router.delete("/", authenticate, watchlistController.removeMovieFromWatchlist);

export default router;
