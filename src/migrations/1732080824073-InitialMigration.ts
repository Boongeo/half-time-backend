import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732080824073 implements MigrationInterface {
    name = 'InitialMigration1732080824073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_6129383ca5e5443e4c974e6b46e"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_37d2feb695f1a5df9e404452ca3"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD "user_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD "role_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "role_entity" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_2e17f8a7a60f0122b61bf8ab283" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_6af75a199b0a16315f83c255835" FOREIGN KEY ("role_id") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_6af75a199b0a16315f83c255835"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_2e17f8a7a60f0122b61bf8ab283"`);
        await queryRunner.query(`ALTER TABLE "role_entity" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP COLUMN "user_id"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'mentor', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD "roleId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_37d2feb695f1a5df9e404452ca3" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_6129383ca5e5443e4c974e6b46e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
