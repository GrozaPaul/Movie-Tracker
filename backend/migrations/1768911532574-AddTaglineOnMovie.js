export class AddTaglineOnMovie1768911532574 {
  async up(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie" ADD COLUMN "tagline" varchar(255)
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie" DROP COLUMN "tagline"
    `);
  }
}
