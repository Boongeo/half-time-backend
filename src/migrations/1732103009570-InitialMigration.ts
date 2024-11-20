import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732103009570 implements MigrationInterface {
    name = 'InitialMigration1732103009570'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ADD "socialId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "socialId"`);
    }

}
