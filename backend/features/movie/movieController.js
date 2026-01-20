import * as movieService from "./movieService.js";
import { fetchMovieDataTMDB } from "./movieService.js";

export const initSaveMoviesFromTMDB = async (_, res) => {
  try {
    const movieReceived = await movieService.fetchMovieDataTMDB();

    const movie = await movieService.saveMovieFromTMDB(movieReceived);

    res.status(200).json({
      message: "Movie saved successfully!",
      movie,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
