import { AppDataSource } from "../../typeorm-config.js";
import { List } from "./list-entity.js";
import { ListMovie } from "./list-movie-entity.js";
import { getImageUrl } from "../../minio.js";

const listRepository = AppDataSource.getRepository(List);
const listMovieRepository = AppDataSource.getRepository(ListMovie);

export const getUserLists = async (userId) => {
  return await listRepository.find({
    where: { userId },
    order: { createdAt: "DESC" },
  });
};

export const getListMovies = async (listId) => {
  const listMovies = await listMovieRepository.find({
    where: { listId },
    relations: ["movie"],
    select: {
      movieId: true,
      movie: {
        title: true,
        releaseDate: true,
      },
    },
  });

  return listMovies.map((m) => ({
    movieId: m.movieId,
    title: m.movie.title,
    releaseDate: m.movie.releaseDate,
    posterUrl: getImageUrl(`posters/${m.movieId}_poster.jpg`),
  }));
};

export const getFirstMoviesInList = async (listId) => {
  const urls = await listMovieRepository.find({
    where: { listId },
    select: {
      movieId: true,
    },
    take: 3,
  });

  return urls.map((m) => getImageUrl(`posters/${m.movieId}_poster.jpg`));
};

export const createList = async (listData) => {
  return await listRepository.save(listData);
};

export const addMovieToList = async (listId, movieId) => {
  return await listMovieRepository.save({ listId, movieId });
};

export const removeMovieFromList = async (listId, movieId) => {
  return await listMovieRepository.delete({ listId, movieId });
};

export const deleteList = async (listId) => {
  return await listRepository.delete({ listId });
};
