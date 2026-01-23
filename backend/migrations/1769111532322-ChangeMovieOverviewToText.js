export class ChangeMovieOverviewToText1769111532322 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" 
      ALTER COLUMN "overview" TYPE TEXT;
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" 
      ALTER COLUMN "overview" TYPE VARCHAR(255);
    `);
  }
}
