export class AddEmbeddingJsonToMovie1770818546271 {
  async up(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie" 
    ADD COLUMN "embedding_json" JSON
  `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie"
    DROP COLUMN "embedding_json"
    `);
  }
}
