import * as movieService from "./movie-service.js";

export const getAllMovies = async (req, res) => {
  try {
    const allMovies = await movieService.getAllMovies();

    res.status(200).json({
      allMovies,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
