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
    actorName: {
      type: "varchar",
      primary: true,
      name: "actor_name",
    },
    characterName: {
      type: "varchar",
      name: "character_name",
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
