import { watchedRepository } from "../watched/watched-repository.js";
import { AppDataSource } from "../../typeorm-config.js";
import { MovieActor } from "../person/movie-actor-entity.js";
import { In } from "typeorm";

const movieActorRepository = AppDataSource.getRepository(MovieActor);

export const watchedMovies = async (userId) => {
  const watched = await watchedRepository.find({
    where: { userId },
    order: { watchedAt: "DESC" },
    relations: [
      "movie",
      "movie.country",
      "movie.directors",
      "movie.directors.person",
      "movie.genres",
    ],
    select: {
      rating: true,
      movieId: true,
      movie: {
        title: true,
        runtime: true,
        country: {
          countryName: true,
        },
        directors: {
          personId: true,
          person: {
            name: true,
            profilePicturePath: true,
          },
        },
        genres: {
          genreName: true,
        },
      },
    },
  });

  watched.forEach((el) => {
    el.movie.rating = el.rating;
    el.movie.movieId = el.movieId;
    delete el.rating;
  });

  return watched.map((m) => m.movie);
  //return watched;
};

export const watchedActors = async (userId) => {
  const watchedMovies = await watchedRepository.find({
    where: { userId },
    select: { movieId: true },
  });

  const movieIds = watchedMovies.map(({ movieId }) => movieId);

  const actors = await Promise.all(
    movieIds.map(async (movId) => {
      const list = await movieActorRepository.find({
        where: { movieId: movId },
        relations: ["person"],
      });

      return {
        movieId: movId,
        actors: list.slice(0, 15).map((l) => ({
          name: l.person.name,
          profilePicturePath: l.person.profilePicturePath,
        })),
      };
    }),
  );

  return actors;
};

export const watchedActorsCount = async (userId) => {
  const watchedMovies = await watchedRepository.find({
    where: { userId },
    select: { movieId: true },
  });

  const movieIds = watchedMovies.map(({ movieId }) => movieId);

  const actors = await movieActorRepository.find({
    where: { movieId: In(movieIds) },
    select: { personId: true },
  });

  return new Set(actors.map((a) => a.personId)).size;
};
