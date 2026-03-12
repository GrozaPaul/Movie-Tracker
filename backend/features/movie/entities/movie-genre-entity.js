import { EntitySchema } from "typeorm";

export const MovieGenre = new EntitySchema({
  name: "MovieGenre",
  tableName: "movie_genre",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    genreName: {
      type: "varchar",
      primary: true,
      name: "genre_name",
    },
  },
  relations: {
    movie: {
      type: "many-to-one",
      target: "Movie",
      joinColumn: {
        name: "movie_id",
        referencedColumnName: "movieId",
      },
    },
  },
});
