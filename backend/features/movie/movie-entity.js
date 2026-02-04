import { EntitySchema } from "typeorm";

export const Movie = new EntitySchema({
  name: "Movie",
  tableName: "movie",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    title: {
      type: "varchar",
      length: 255,
    },
    overview: {
      type: "text",
    },
    releaseDate: {
      type: "varchar",
      length: 255,
      name: "release_date",
    },
    backdropPath: {
      type: "varchar",
      length: 255,
      name: "backdrop_path",
    },
    posterPath: {
      type: "varchar",
      length: 255,
      name: "poster_path",
    },
    runtime: {
      type: "bigint",
    },
    originalLanguage: {
      type: "varchar",
      length: 50,
      name: "original_language",
    },
    spokenLanguages: {
      type: "varchar",
      array: true,
      name: "spoken_languages",
    },
    originalTitle: {
      type: "varchar",
      length: 255,
      name: "original_title",
    },
    tagline: {
      type: "varchar",
      length: 255,
    },
  },
  relations: {
    genres: {
      type: "one-to-many",
      target: "MovieGenre",
      inverseSide: "movie",
    },
    actors: {
      type: "one-to-many",
      target: "MovieActor",
      inverseSide: "movie",
    },
    directors: {
      type: "one-to-many",
      target: "MovieDirector",
      inverseSide: "movie",
    },
    studios: {
      type: "one-to-many",
      target: "StudioMovies",
      inverseSide: "movie",
    },
    country: {
      type: "one-to-many",
      target: "MovieCountry",
      inverseSide: "movie",
    },
    watchedByUsers: {
      type: "one-to-many",
      target: "Watched",
      inverseSide: "movie",
    },
  },
});
