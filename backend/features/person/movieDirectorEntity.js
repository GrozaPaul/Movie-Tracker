import { EntitySchema } from "typeorm";

export const MovieDirector = new EntitySchema({
  name: "MovieDirector",
  tableName: "movie_director",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    personId: {
      type: "bigint",
      primary: true,
      name: "person_id",
    },
  },
  relations: {
    person: {
      type: "many-to-one",
      target: "Person",
      joinColumn: {
        name: "person_id",
        referencedColumnName: "personId",
      },
    },
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
