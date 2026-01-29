export class CreateMovieCountryTable1769416545819 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE "movie_country" (
      "movie_id" bigint,
      "country_name" varchar(500),
      PRIMARY KEY ("movie_id", "country_name")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "movie_country" ADD CONSTRAINT "fk_movie_country_movie"
      FOREIGN KEY ("movie_id")
      REFERENCES "movie" ("movie_id")
    `);

    await queryRunner.query(`
      ALTER TABLE "movie" DROP COLUMN "country"
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie_country"
        DROP CONSTRAINT "fk_movie_country_movie"
    `);

    await queryRunner.query(`
      DROP TABLE IF EXISTS "movie_country"
    `);

    await queryRunner.query(`
      ALTER TABLE "movie" ADD COLUMN "country" varchar(500)
    `);
  }
}
