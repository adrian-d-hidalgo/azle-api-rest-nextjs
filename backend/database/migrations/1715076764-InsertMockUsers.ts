import { MigrationInterface, QueryRunner } from "typeorm";

export class InsertMockUsers1715076764 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO user (username) VALUES ('John Doe')`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM user WHERE username = 'John Doe'`);
  }
}
