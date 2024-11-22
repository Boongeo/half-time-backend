import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732244083161 implements MigrationInterface {
    name = 'InitialMigration1732244083161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."account_provider_enum" RENAME TO "account_provider_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."account_provider_enum" AS ENUM('local', 'google', 'github', 'linkedin')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" TYPE "public"."account_provider_enum" USING "provider"::"text"::"public"."account_provider_enum"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" SET DEFAULT 'local'`);
        await queryRunner.query(`DROP TYPE "public"."account_provider_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_provider_enum_old" AS ENUM('local', 'google', 'kakao', 'naver')`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" TYPE "public"."account_provider_enum_old" USING "provider"::"text"::"public"."account_provider_enum_old"`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "provider" SET DEFAULT 'local'`);
        await queryRunner.query(`DROP TYPE "public"."account_provider_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."account_provider_enum_old" RENAME TO "account_provider_enum"`);
    }

}
