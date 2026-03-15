import express from "express";
import * as movieController from "./movie-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/all", authenticate, movieController.getAllMovies);
router.get("/", authenticate, movieController.getMovie);

export default router;
