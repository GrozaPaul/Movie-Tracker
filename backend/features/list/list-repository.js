import { AppDataSource } from "../../typeorm-config.js";
import { List } from "./list-entity.js";
import { ListMovie } from "./list-movie-entity.js";

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
  });

  return listMovies.map((l) => l.movie);
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
