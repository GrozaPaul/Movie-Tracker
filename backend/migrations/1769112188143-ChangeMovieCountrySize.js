export class ChangeMovieCountrySize1769112188143 {
  async up(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie" 
      ALTER COLUMN "country" TYPE VARCHAR(500);
  `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie" 
      ALTER COLUMN "country" TYPE VARCHAR(20);
    `);
  }
}
