import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732016710989 implements MigrationInterface {
    name = 'InitialMigration1732016710989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "expiresAt"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "expiresAt" TIMESTAMP NOT NULL`);
    }

}
