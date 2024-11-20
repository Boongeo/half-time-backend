import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732078210956 implements MigrationInterface {
    name = 'InitialMigration1732078210956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."role_entity_role_enum" AS ENUM('user', 'mentor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "role_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."role_entity_role_enum" NOT NULL DEFAULT 'user', "userRolesId" uuid, CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, "roleId" uuid, CONSTRAINT "PK_ea622cfb33ae2afc4505f972936" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum" RENAME TO "user_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('user', 'mentor', 'admin')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum" USING "role"::"text"::"public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "role_entity" ADD CONSTRAINT "FK_ba2e2c24ec32724b8928b8a0314" FOREIGN KEY ("userRolesId") REFERENCES "user_roles_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_6129383ca5e5443e4c974e6b46e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_37d2feb695f1a5df9e404452ca3" FOREIGN KEY ("roleId") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_37d2feb695f1a5df9e404452ca3"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_6129383ca5e5443e4c974e6b46e"`);
        await queryRunner.query(`ALTER TABLE "role_entity" DROP CONSTRAINT "FK_ba2e2c24ec32724b8928b8a0314"`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum_old" AS ENUM('admin', 'guest')`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" TYPE "public"."user_role_enum_old" USING "role"::"text"::"public"."user_role_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "role" SET DEFAULT 'guest'`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_role_enum_old" RENAME TO "user_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_roles_entity"`);
        await queryRunner.query(`DROP TABLE "role_entity"`);
        await queryRunner.query(`DROP TYPE "public"."role_entity_role_enum"`);
    }

}
