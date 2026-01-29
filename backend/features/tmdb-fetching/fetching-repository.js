import { Movie } from "../movie/movie-entity.js";
import { Person } from "../person/person-entity.js";
import { MovieGenre } from "../movie/movie-genre-entity.js";
import { MovieActor } from "../person/movie-actor-entity.js";
import { MovieDirector } from "../person/movie-director-entity.js";
import { StudioMovies } from "../movie/studio-movies-entity.js";
import { MovieCountry } from "../movie/movie-country-entity.js";
import { AppDataSource, initializeDatabase } from "../../typeorm-config.js";

const movieRepository = AppDataSource.getRepository(Movie);
const personRepository = AppDataSource.getRepository(Person);
const movieGenreRepository = AppDataSource.getRepository(MovieGenre);
const movieActorRepository = AppDataSource.getRepository(MovieActor);
const movieDirectorRepository = AppDataSource.getRepository(MovieDirector);
const studioMovieRepository = AppDataSource.getRepository(StudioMovies);
const movieCountryRepository = AppDataSource.getRepository(MovieCountry);

export const movieExists = async (movieId) => {
  return await movieRepository.existsBy({ movieId });
};

// export const getAllExistingMovieIds = async () => {
//   const movies = await movieRepository.find({
//     select: ["movieId"],
//   });
//   return movies.map((movie) => movie.movieId);
// };

export const getAllExistingMovieIds = async () => {
  const movies = await movieRepository.find({
    select: ["movieId"],
  });

  return movies.map((movie) => Number(movie.movieId));
};

export const getAllExistingPersonIds = async () => {
  const people = await personRepository.find({
    select: ["personId"],
  });

  return people.map((person) => Number(person.personId));
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
  if (!genres || genres.length === 0) return [];

  const genreRecords = genres.map((genre) => ({
    movieId,
    genreName: genre.name,
  }));

  return await movieGenreRepository
    .createQueryBuilder()
    .insert()
    .into(MovieGenre)
    .values(genreRecords)
    .orIgnore()
    .execute();
};

export const saveActorsForMovie = async (movieId, actors) => {
  if (!actors || actors.length === 0) return [];

  const actorRecords = actors.map((actor) => ({
    movieId,
    characterName: actor.character || "",
    personId: actor.id,
  }));

  return await movieActorRepository
    .createQueryBuilder()
    .insert()
    .into(MovieActor)
    .values(actorRecords)
    .orIgnore()
    .execute();
};

export const saveDirectorsForMovie = async (movieId, directors) => {
  if (!directors || directors.length === 0) return [];

  const directorRecords = directors.map((director) => ({
    movieId,
    personId: director.id,
  }));

  return await movieDirectorRepository
    .createQueryBuilder()
    .insert()
    .into(MovieDirector)
    .values(directorRecords)
    .orIgnore()
    .execute();
};

export const saveStudiosForMovie = async (movieId, studios) => {
  if (!studios || studios.length === 0) return [];

  const studioRecords = studios.map((studio) => ({
    movieId,
    studioName: studio.name,
  }));

  return await studioMovieRepository
    .createQueryBuilder()
    .insert()
    .into(StudioMovies)
    .values(studioRecords)
    .orIgnore()
    .execute();
};

export const saveCountryForMovie = async (movieId, country) => {
  if (!country || country.length === 0) return [];

  const countryRecords = country.map((c) => ({
    movieId,
    countryName: c,
  }));

  return await movieCountryRepository
    .createQueryBuilder()
    .insert()
    .into(MovieCountry)
    .values(countryRecords)
    .orIgnore()
    .execute();
};
