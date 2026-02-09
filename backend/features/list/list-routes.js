import express from "express";
import * as listController from "./list-controller.js";
import { authenticate } from "../../middleware/auth.js";

const router = express.Router();

router.get("/", authenticate, listController.getUserLists);
router.get("/movies", authenticate, listController.getListMovies);
router.post("/", authenticate, listController.createList);
router.post("/add-movie", authenticate, listController.addMovieToList);
router.delete("/", authenticate, listController.deleteList);
router.delete(
  "/remove-movie",
  authenticate,
  listController.removeMovieFromList,
);

export default router;
