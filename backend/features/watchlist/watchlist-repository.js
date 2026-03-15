import { Watchlist } from "./watchlist-entity.js";
import { AppDataSource } from "../../typeorm-config.js";

const watchlistRepository = AppDataSource.getRepository(Watchlist);

export const movieExistsInWatchlist = async (userId, movieId) => {
  return await watchlistRepository.findOne({
    where: { userId, movieId },
  });
};

export const addToWatchlist = async (watchlistData) => {
  return await watchlistRepository.save(watchlistData);
};

export const removeFromWatchlist = async (watchlistData) => {
  return await watchlistRepository.delete(watchlistData);
};

export const getAllWatchlistedMoviesOfUser = async (userId) => {
  return await watchlistRepository.find({
    where: { userId },
    order: { addedAt: "DESC" },
    relations: ["movie"],
    select: {
      movieId: true,
      addedAt: true,
      movie: {
        movieId: true,
        title: true,
        releaseDate: true,
      },
    },
  });
};

export const getLastThreeAdded = async (userId) => {
  return await watchlistRepository.find({
    where: { userId },
    select: { movieId: true },
    order: { addedAt: "DESC" },
    take: 3,
  });
};

export const noOfWatchlistedMovies = async (userId) => {
  return await watchlistRepository.count({
    where: { userId },
  });
};
