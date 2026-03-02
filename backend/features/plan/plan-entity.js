import { EntitySchema } from "typeorm";

export const Plan = new EntitySchema({
  name: "Plan",
  tableName: "plan",
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
    plannedDate: {
      type: "timestamp",
      primary: true,
      name: "planned_date",
    },
    isCompleted: {
      type: "boolean",
      default: false,
      name: "is_completed",
      nullable: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "user",
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
