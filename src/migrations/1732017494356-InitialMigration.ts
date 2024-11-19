import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732017494356 implements MigrationInterface {
    name = 'InitialMigration1732017494356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nickname" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "nickname" SET NOT NULL`);
    }

}
