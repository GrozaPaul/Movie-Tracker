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

export const getMovie = async (req, res) => {
  try {
    const { movieId, userId } = req.body;
    const result = await movieService.getMovie(
      parseInt(movieId),
      parseInt(userId),
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
