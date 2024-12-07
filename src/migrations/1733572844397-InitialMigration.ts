import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1733572844397 implements MigrationInterface {
    name = 'InitialMigration1733572844397'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" ADD "company" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "experience" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "hourlyRate" integer NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."mentor_mentoringtype_enum" AS ENUM('online', 'offline')`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "mentoringType" "public"."mentor_mentoringtype_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "preferredRegion" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD "careerProofPath" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "careerProofPath"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "preferredRegion"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "mentoringType"`);
        await queryRunner.query(`DROP TYPE "public"."mentor_mentoringtype_enum"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "hourlyRate"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "experience"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "company"`);
    }

}
