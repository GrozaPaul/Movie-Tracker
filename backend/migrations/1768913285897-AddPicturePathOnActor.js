export class AddPicturePathOnActor1768913285897 {
  async up(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie_actor" ADD COLUMN "profile_path" varchar(500)
    `);
  }

  async down(queryRunner) {
    await queryRunner.query(`
    ALTER TABLE "movie_actor" DROP COLUMN "profile_path"
    `);
  }
}
