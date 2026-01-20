export class AddColumnOnMovie1768910684902 {
  async up(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" ADD COLUMN "original_title" varchar(255)
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
      ALTER TABLE "movie" DROP COLUMN "original_title"
    `);
  }
}
