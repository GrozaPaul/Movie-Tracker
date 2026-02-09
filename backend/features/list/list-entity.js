import { EntitySchema } from "typeorm";

export const List = new EntitySchema({
  name: "List",
  tableName: "list",
  columns: {
    listId: {
      type: "bigint",
      primary: true,
      generated: "increment",
      name: "list_id",
    },
    userId: {
      type: "bigint",
      name: "user_id",
    },
    listName: {
      type: "varchar",
      length: 255,
      name: "list_name",
    },
    description: {
      type: "text",
      nullable: true,
    },
    createdAt: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      name: "created_at",
    },
    public: {
      type: "bool",
      default: false,
      name: "is_public",
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
    moviesListed: {
      type: "one-to-many",
      target: "ListMovie",
      inverseSide: "list",
    },
  },
});
