import { AppDataSource } from "../../typeorm-config.js";
import { Movie } from "./movie-entity.js";

const movieRepository = AppDataSource.getRepository(Movie);

export const saveMovieFromTMDB = async (movieData) => {
  const movie = movieRepository.create(movieData);
  return await movieRepository.save(movie);
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
