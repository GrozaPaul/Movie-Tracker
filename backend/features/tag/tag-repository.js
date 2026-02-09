import { Tag } from "./tag-entity.js";
import { Watched } from "../watched/watched-entity.js";
import { AppDataSource } from "../../typeorm-config.js";

export const tagRepository = AppDataSource.getRepository(Tag);
const watchedRepository = AppDataSource.getRepository(Watched);

export const getUserTags = async (userId) => {
  const tags = await tagRepository.find({
    where: { userId },
    select: {
      tagName: true,
    },
  });

  const tagNames = tags.map((tag) => tag.tagName);
  return [...new Set(tagNames)];
};

export const getMovieTags = async (userId, movieId) => {
  const tags = await tagRepository.find({
    where: { userId, movieId },
    select: {
      tagName: true,
    },
  });

  return tags.map((tag) => tag.tagName);
};

export const getMoviesByTag = async (userId, tagName) => {
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

export const addTagToMovie = async (tagData) => {
  return await tagRepository.save(tagData);
};

export const removeTagFromMovie = async (tagData) => {
  return await tagRepository.delete(tagData);
};
