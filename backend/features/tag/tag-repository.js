import { Tag } from "./tag-entity.js";
import { Watched } from "../watched/watched-entity.js";
import { AppDataSource } from "../../typeorm-config.js";

const tagRepository = AppDataSource.getRepository(Tag);
const watchedRepository = AppDataSource.getRepository(Watched);

export const getAllTags = async (userId) => {
  return await tagRepository.find({
    where: { userId },
    select: {
      tagName: true,
    },
  });
};

export const getAllMoviesForTag = async (userId, tagName) => {
  const tags = await tagRepository.find({
    where: { userId, tagName },
    select: {
      movieId: true,
    },
  });

  const result = await Promise.all(
    tags.map(async (tag) => {
      const watched = await watchedRepository.findOne({
        where: { userId, movieId: tag.movieId },
        select: {
          isFavorite: true,
          rating: true,
        },
      });

      return {
        tagName,
        movieId: tag.movieId,
        isFavorite: watched?.isFavorite ?? false,
        rating: watched?.rating ?? null,
      };
    }),
  );

  return result;
};

export const addTagToMovie = async (tagData) => {};

export const removeTagFromMovie = async (tagData) => {};
