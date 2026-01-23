import { Movie } from "../movie/movie-entity.js";
import { Person } from "../person/person-entity.js";
import { MovieGenre } from "../movie/movie-genre-entity.js";
import { MovieActor } from "../person/movie-actor-entity.js";
import { MovieDirector } from "../person/movie-director-entity.js";
import { StudioMovies } from "../movie/studio-movies-entity.js";
import { AppDataSource, initializeDatabase } from "../../typeorm-config.js";

const movieRepository = AppDataSource.getRepository(Movie);
const personRepository = AppDataSource.getRepository(Person);
const movieGenreRepository = AppDataSource.getRepository(MovieGenre);
const movieActorRepository = AppDataSource.getRepository(MovieActor);
const movieDirectorRepository = AppDataSource.getRepository(MovieDirector);
const studioMovieRepository = AppDataSource.getRepository(StudioMovies);

export const movieExists = async (movieId) => {
  return await movieRepository.existsBy({ movieId });
};

export const personExists = async (personId) => {
  return await personRepository.existsBy({ personId });
};

export const savePerson = async (person) => {
  try {
    return await personRepository.save(person);
  } catch (error) {
    if (error.code === "23505") return null; // duplicate key error postgresql
    throw error;
  }
};

export const saveMovie = async (movie) => {
  try {
    return await movieRepository.save(movie);
  } catch (error) {
    if (error.code === "23505") return null;
    throw error;
  }
};

export const saveGenresForMovie = async (movieId, genres) => {
  const genreRecords = genres.map((genre) => ({
    movieId,
    genreName: genre.name,
  }));

  try {
    return await movieGenreRepository.save(genreRecords);
  } catch (error) {
    if (error.code === "23505") return null;
    throw error;
  }
};

export const saveActorsForMovie = async (movieId, actors) => {
  const actorRecords = actors.map((actor) => ({
    movieId,
    characterName: actor.character,
    personId: actor.id,
  }));

  try {
    return await movieActorRepository.save(actorRecords);
  } catch (error) {
    if (error.code === "23505") return null;
    throw error;
  }
};

export const saveDirectorsForMovie = async (movieId, directors) => {
  const directorRecords = directors.map((director) => ({
    movieId,
    personId: director.id,
  }));

  try {
    return await movieDirectorRepository.save(directorRecords);
  } catch (error) {
    if (error.code === "23505") return null;
    throw error;
  }
};

export const saveStudiosForMovie = async (movieId, studios) => {
  const studioRecords = studios.map((studio) => ({
    movieId,
    studioName: studio.name,
  }));

  try {
    return await studioMovieRepository.save(studioRecords);
  } catch (error) {
    if (error.code === "23505") return null;
    throw error;
  }
};
