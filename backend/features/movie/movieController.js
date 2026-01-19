import { fetchMovieFromTMDBDto } from "./movieDto.js";
import * as movieService from "./movieService.js";
import { fetchMovieDataTMDB } from "./movieService.js";

export const saveMovieFromTMDB = async (_, res) => {
  try {
    const movieReceived = await movieService.fetchMovieDataTMDB();

    const { error, value } = fetchMovieFromTMDBDto.validate(movieReceived);

    if (error) {
      return res.status(400).json({
        errors: error.details.map((detail) => detail.message),
      });
    }

    const movie = await movieService.saveMovieFromTMDB(value);

    res.status(200).json({
      message: "Movie saved successfully!",
      movie,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
