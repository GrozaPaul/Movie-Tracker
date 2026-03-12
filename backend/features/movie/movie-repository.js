import { AppDataSource } from "../../typeorm-config.js";
import { Movie } from "./entities/movie-entity.js";

export const movieRepository = AppDataSource.getRepository(Movie);

export const getAllMovies = async () => {
  return await movieRepository.find({
    select: {
      movieId: true,
      title: true,
      releaseDate: true,
    },
  });
};

export const getById = async (movieId) => {
  return await movieRepository.findOne({
    where: { movieId: parseInt(movieId) },
    relations: ["genres"],
  });
};

// pagination needed
export const findByWordInTitle = async (searchTerm) => {
  return await movieRepository
    .createQueryBuilder("movie")
    .where("movie.title ILIKE :searchTerm", { searchTerm: `${searchTerm}` })
    .getMany();
};
