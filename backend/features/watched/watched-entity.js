import { EntitySchema } from "typeorm";

export const Watched = new EntitySchema({
  name: "Watched",
  tableName: "watched_movie",
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
    isFavorite: {
      type: "bool",
      default: false,
      name: "is_favorite",
    },
    rating: {
      type: "bigint",
      nullable: true,
    },
    review: {
      type: "text",
      nullable: true,
    },
    watchedAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      name: "watched_at",
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
