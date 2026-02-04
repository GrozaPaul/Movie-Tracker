import { Watched } from "./watched-entity.js";
import { AppDataSource } from "../../typeorm-config.js";

const watchedRepository = AppDataSource.getRepository(Watched);

export const saveOrUpdateWatched = async (watchedData) => {
  const existing = await watchedRepository.findOne({
    where: {
      userId: watchedData.userId,
      movieId: watchedData.movieId,
    },
  });

  const updates = {};
  if (existing) {
    if (watchedData.rating !== undefined) updates.rating = watchedData.rating;
    if (watchedData.review !== undefined) updates.review = watchedData.review;
    if (watchedData.isFavorite !== undefined)
      updates.isFavorite = watchedData.isFavorite;

    if (Object.keys(updates).length > 0) {
      await watchedRepository.update(
        { userId: watchedData.userId, movieId: watchedData.movieId },
        updates,
      );
    }

    return await findOne(watchedData.userId, watchedData.movieId);
  }

  return await watchedRepository.save(watchedData);
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
  });
};
