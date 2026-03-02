export class AddIndexOnEmbeddings1772194106847 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE INDEX idx_movie_embedding_json ON movie USING HASH ((embedding_json::text));
  `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    DROP INDEX idx_movie_embedding_json;
    `);
  }
}
