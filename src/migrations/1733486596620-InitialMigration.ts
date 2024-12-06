import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1733486596620 implements MigrationInterface {
    name = 'InitialMigration1733486596620'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."mentor_accept_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "accept" "public"."mentor_accept_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "rejectReason" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "rejectReason"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "accept"`);
        await queryRunner.query(`DROP TYPE "public"."mentor_accept_enum"`);
    }

}
