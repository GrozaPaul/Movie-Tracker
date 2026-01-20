export class CreatePersonTable1768923558929 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "person" (
        "person_id" bigint PRIMARY KEY,
        "name" varchar(255),
        "biography" text,
        "profile_picture_path" varchar(255)
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "movie_director" (
        "movie_id" bigint,
        "person_id" bigint,
        PRIMARY KEY ("movie_id", "person_id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_director" ADD FOREIGN KEY ("movie_id") REFERENCES "movie" ("movie_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_director" ADD FOREIGN KEY ("person_id") REFERENCES "person" ("person_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" DROP CONSTRAINT "movie_actor_pkey"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" DROP COLUMN "actor_name"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" DROP COLUMN "profile_path"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD COLUMN "person_id" bigint NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD PRIMARY KEY ("movie_id", "person_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD FOREIGN KEY ("person_id") REFERENCES "person" ("person_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "movie" DROP COLUMN "director"
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" ADD COLUMN "director" varchar(255)
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" DROP CONSTRAINT "movie_actor_pkey"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" DROP COLUMN "person_id"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD COLUMN "actor_name" varchar(255) NOT NULL
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD COLUMN "profile_path" varchar(500)
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_actor" ADD PRIMARY KEY ("movie_id", "actor_name")
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "movie_director" CASCADE
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "person" CASCADE
    `);
  }
}
