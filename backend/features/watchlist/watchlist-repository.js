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
  });
};
