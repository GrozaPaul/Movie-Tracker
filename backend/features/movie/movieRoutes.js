import express from "express";
import * as movieController from "./movieController.js";

const router = express.Router();

router.get("/tmdb", movieController.saveMovieFromTMDB);

export default router;
