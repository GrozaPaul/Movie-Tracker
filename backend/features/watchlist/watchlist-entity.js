import { EntitySchema } from "typeorm";

export const Watchlist = new EntitySchema({
  name: "Watchlist",
  tableName: "watch_list",
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
    addedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      name: "added_at",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: {
        name: "user_id",
        referencedColumnName: "userId",
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
