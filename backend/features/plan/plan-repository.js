import { AppDataSource } from "../../typeorm-config.js";
import { Plan } from "./plan-entity.js";

const planRepository = AppDataSource.getRepository(Plan);

export const getAllPlanned = async (userId) => {
  return await planRepository.find({
    where: { userId },
    order: { plannedDate: "CRESC" },
    relations: ["movie"],
    select: {
      movieId: true,
      plannedDate: true,
      isCompleted: true,
      movie: {
        movieId: true,
        posterPath: true,
        title: true,
        releaseDate: true,
      },
    },
  });
};

export const addMovieToPlan = async (planData) => {
  return await planRepository.save(planData);
};

export const markMovieAsWatched = async ({ userId, movieId, plannedDate }) => {
  return await planRepository.update(
    { userId, movieId, plannedDate },
    { isCompleted: true },
  );
};

export const removeFromPlan = async ({ userId, movieId, plannedDate }) => {
  return await planRepository.delete({ userId, movieId, plannedDate });
};
