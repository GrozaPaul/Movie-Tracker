import { EntitySchema } from "typeorm";

export const ListMovie = new EntitySchema({
  name: "ListMovie",
  tableName: "list_movie",
  columns: {
    listId: {
      type: "bigint",
      primary: true,
      name: "list_id",
    },
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
  },
  relations: {
    list: {
      type: "many-to-one",
      target: "List",
      joinColumn: {
        name: "list_id",
        referencedColumnName: "listId",
      },
      onDelete: "CASCADE",
    },
    movie: {
      type: "many-to-one",
      target: "Movie",
      joinColumn: {
        name: "movie_id",
        referencedColumnName: "movieId",
      },
      onDelete: "CASCADE",
    },
  },
});
