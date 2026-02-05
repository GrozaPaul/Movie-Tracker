import * as watchedRepository from "./watched-repository.js";
import * as watchedDto from "./watched-dto.js";

export const markAsWatched = async (req, res) => {
  try {
    const { error, value } = watchedDto.saveWatchedMovie.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existing = await watchedRepository.findOne(
      value.userId,
      value.movieId,
    );
    const watched = await watchedRepository.saveOrUpdateWatched(value);

    const statusCode = existing ? 200 : 201;
    res.status(statusCode).json({ success: true, watched });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllWatchedMoviesOfUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const watchedMovies =
      await watchedRepository.getAllWatchedMoviesOfUser(userId);
    res.status(200).json({ success: true, watchedMovies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeWatchedMovie = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const result = await watchedRepository.removeWatchedMovie(userId, movieId);

    if (result.affected === 0) {
      return res.status(404).json({ error: "Movie not found in watched list" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
