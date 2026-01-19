import { EntitySchema } from "typeorm";

export const StudioMovies = new EntitySchema({
  name: "StudioMovies",
  tableName: "studio_movies",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    studioName: {
      type: "varchar",
      primary: true,
      name: "studio_name",
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
