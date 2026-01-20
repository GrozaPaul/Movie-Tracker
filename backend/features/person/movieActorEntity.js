import { EntitySchema } from "typeorm";

export const MovieActor = new EntitySchema({
  name: "MovieActor",
  tableName: "movie_actor",
  columns: {
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    characterName: {
      type: "varchar",
      name: "character_name",
      length: 255,
    },
    personId: {
      type: "bigint",
      primary: true,
      name: "person_id",
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
    person: {
      type: "many-to-one",
      target: "Person",
      joinColumn: {
        name: "person_id",
        referencedColumnName: "personId",
      },
    },
  },
});
