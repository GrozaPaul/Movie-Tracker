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
      type: "varchar",
      length: 255,
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
    country: {
      type: "varchar",
      length: 20,
    },
    originalLanguage: {
      type: "varchar",
      length: 50,
    },
    spokenLanguages: {
      type: "varchar",
      array: true,
      name: "spoken_languages",
    },
    director: {
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
    studios: {
      type: "one-to-many",
      target: "StudioMovies",
      inverseSide: "movie",
    },
  },
});
