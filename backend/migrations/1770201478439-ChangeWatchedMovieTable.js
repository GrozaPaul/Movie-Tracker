export class ChangeWatchedMovieTable1770201478439 {
  async up(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "watched_movie" DROP COLUMN "watch_count"
  `);

    await queryRunner.query(`
    ALTER TABLE "watched_movie" DROP COLUMN "logged"
  `);

    await queryRunner.query(`
    ALTER TABLE "watched_movie" DROP COLUMN "preferred_poster"
  `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "watched_movie" ADD COLUMN "watch_count" bigint
    `);

    await queryRunner.query(`
    ALTER TABLE "watched_movie" ADD COLUMN "logged" bool
  `);

    await queryRunner.query(`
    ALTER TABLE "watched_movie" ADD COLUMN "preferred_poster" varchar(255)
  `);
  }
}
