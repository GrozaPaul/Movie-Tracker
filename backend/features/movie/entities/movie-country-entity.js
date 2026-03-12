import { EntitySchema } from "typeorm";

export const MovieCountry = new EntitySchema({
  name: "MovieCountry",
  tableName: "movie_country",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    countryName: {
      type: "varchar",
      primary: true,
      name: "country_name",
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
