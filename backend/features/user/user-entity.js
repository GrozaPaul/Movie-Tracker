import { EntitySchema } from "typeorm";

export const User = new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    userId: {
      type: "bigint",
      primary: true,
      generated: "increment",
      name: "user_id",
    },
    username: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    email: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    password: {
      type: "varchar",
      length: 255,
      nullable: false,
    },
    description: {
      type: "text",
      default: "",
    },
    profilePicture: {
      type: "varchar",
      length: 500,
      nullable: true,
      name: "profile_picture",
    },
  },
  relations: {
    watchedMovies: {
      type: "one-to-many",
      target: "Watched",
      inverseSide: "user",
    },
    watchlistedMovies: {
      type: "one-to-many",
      target: "Watchlist",
      inverseSide: "user",
    },
    taggedMovies: {
      type: "one-to-many",
      target: "Tag",
      inverseSide: "user",
    },
    lists: {
      type: "one-to-many",
      target: "List",
      inverseSide: "user",
    },
  },
});
