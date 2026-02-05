import * as watchlistRepository from "./watchlist-repository.js";

export const addToWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const added = await watchlistRepository.addToWatchlist({ userId, movieId });

    res.status(201).json({ success: true, added });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllWatchlistedMoviesOfUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const watchlistedMovies =
      await watchlistRepository.getAllWatchlistedMoviesOfUser(userId);
    res.status(200).json({ success: true, watchlistedMovies });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeMovieFromWatchlist = async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const result = await watchlistRepository.removeFromWatchlist({
      userId,
      movieId,
    });

    if (result.affected === 0) {
      return res.status(404).json({ error: "Movie not found in watchlist" });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
