import express from "express";
import * as movieController from "./movie-controller.js";

const router = express.Router();

router.get("/tmdb", movieController.initSaveMoviesFromTMDB);

export default router;
