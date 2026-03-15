import { AppDataSource } from "../../typeorm-config.js";
import { Movie } from "./entities/movie-entity.js";
import { MovieActor } from "../person/movie-actor-entity.js";
import { MovieDirector } from "../person/movie-director-entity.js";
import { MovieCountry } from "./entities/movie-country-entity.js";
import { StudioMovies } from "./entities/studio-movies-entity.js";
import { Person } from "../person/person-entity.js";
import { watchedRepository } from "../watched/watched-repository.js";

export const movieRepository = AppDataSource.getRepository(Movie);
const actorRepository = AppDataSource.getRepository(MovieActor);
const directorRepository = AppDataSource.getRepository(MovieDirector);
const countryRepository = AppDataSource.getRepository(MovieCountry);
const studioRepository = AppDataSource.getRepository(StudioMovies);

export const getAllMovies = async () => {
  return await movieRepository.find({
    //order: { releaseDate: "DESC" },
    relations: ["genres"],
    select: {
      movieId: true,
      title: true,
      releaseDate: true,
      genres: {
        genreName: true,
      },
    },
  });
};

export const getMovieDetails = async (movieId) => {
  return await movieRepository.findOne({
    where: { movieId },
    select: {
      movieId: true,
      title: true,
      overview: true,
      releaseDate: true,
      runtime: true,
      originalLanguage: true,
      spokenLanguages: true,
      originalTitle: true,
      tagline: true,
    },
  });
};

export const getMovieActors = async (movieId) => {
  return await actorRepository.find({
    relations: ["person"],
    where: { movieId },
    select: {
      characterName: true,
      personId: true,
      person: {
        name: true,
      },
    },
  });
};

export const getMovieDirector = async (movieId) => {
  return await directorRepository.find({
    relations: ["person"],
    where: { movieId },
    select: {
      personId: true,
      person: {
        name: true,
      },
    },
  });
};

export const getMovieCountries = async (movieId) => {
  return await countryRepository.find({
    where: { movieId },
    select: {
      countryName: true,
    },
  });
};

export const getMovieStudios = async (movieId) => {
  return await studioRepository.find({
    where: { movieId },
    select: {
      studioName: true,
    },
  });
};

export const getRatingsAndReviews = async (movieId) => {
  return await watchedRepository.find({
    where: { movieId },
    select: {
      userId: true,
      review: true,
      rating: true,
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
