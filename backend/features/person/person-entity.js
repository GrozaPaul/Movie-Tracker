import { EntitySchema } from "typeorm";

export const Person = new EntitySchema({
  name: "Person",
  tableName: "person",
  columns: {
    personId: {
      type: "bigint",
      primary: true,
      name: "person_id",
    },
    name: {
      type: "varchar",
      length: 255,
    },
    biography: {
      type: "text",
    },
    profilePicturePath: {
      type: "varchar",
      length: 255,
      name: "profile_picture_path",
    },
  },
  relations: {
    actedInMovies: {
      type: "one-to-many",
      target: "MovieActor",
      inverseSide: "person",
    },
    directedMovies: {
      type: "one-to-many",
      target: "MovieDirector",
      inverseSide: "person",
    },
  },
});
