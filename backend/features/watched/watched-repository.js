import { Watched } from "./watched-entity.js";
import { AppDataSource } from "../../typeorm-config.js";
import * as watchlistRepository from "../watchlist/watchlist-repository.js";
import { tagRepository } from "../tag/tag-repository.js";

const watchedRepository = AppDataSource.getRepository(Watched);

export const saveOrUpdateWatched = async (watchedData) => {
  const userId = watchedData.userId;
  const movieId = watchedData.movieId;

  let removedFromWatchlist = false;
  const isMovieInWatchlist = await watchlistRepository.movieExistsInWatchlist(
    userId,
    movieId,
  );
  if (isMovieInWatchlist !== null) {
    removedFromWatchlist = true;
    await watchlistRepository.removeFromWatchlist({ userId, movieId });
  }

  const existing = await watchedRepository.findOne({
    where: { userId, movieId },
  });

  const updates = {};
  if (existing) {
    if (watchedData.rating !== undefined) updates.rating = watchedData.rating;
    if (watchedData.review !== undefined) updates.review = watchedData.review;
    if (watchedData.isFavorite !== undefined)
      updates.isFavorite = watchedData.isFavorite;

    if (Object.keys(updates).length > 0) {
      await watchedRepository.update({ userId, movieId }, updates);
    }

    return await findOne(userId, movieId);
  }

  const saved = await watchedRepository.save(watchedData);
  return {
    saved,
    "Removed from watchlist": removedFromWatchlist,
  };
};

export const findOne = async (userId, movieId) => {
  return await watchedRepository.findOne({
    where: { userId, movieId },
  });
};

export const getAllWatchedMoviesOfUser = async (userId) => {
  return await watchedRepository.find({
    where: { userId },
    order: { watchedAt: "DESC" },
    relations: ["movie"],
    select: {
      userId: true,
      isFavorite: true,
      rating: true,
      review: true,
      watchedAt: true,
      movie: {
        movieId: true,
        title: true,
        releaseDate: true,
        runtime: true,
      },
    },
  });
};

export const removeWatchedMovie = async (userId, movieId) => {
  const tagResult = await tagRepository.delete({ userId, movieId });

  const watchedResult = await watchedRepository.delete({ userId, movieId });

  return {
    movieDeletedFromWatched: movieId,
    watchedDeleted: watchedResult.affected,
    tagsDeletedOnMovie: tagResult.affected,
  };
};
