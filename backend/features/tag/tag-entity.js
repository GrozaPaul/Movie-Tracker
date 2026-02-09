import { EntitySchema } from "typeorm";

export const Tag = new EntitySchema({
  name: "Tag",
  tableName: "tag",
  columns: {
    userId: {
      type: "bigint",
      primary: true,
      name: "user_id",
    },
    movieId: {
      type: "bigint",
      primary: true,
      name: "movie_id",
    },
    tagName: {
      type: "varchar",
      primary: true,
      length: 255,
      name: "tag_name",
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
      onDelete: "CASCADE",
    },
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "userId",
      },
      onDelete: "CASCADE",
    },
  },
});
