import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732246712697 implements MigrationInterface {
    name = 'InitialMigration1732246712697'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."account_provider_enum" AS ENUM('local', 'google', 'github', 'linkedin')`);
        await queryRunner.query(`CREATE TABLE "account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" character varying NOT NULL, "provider" "public"."account_provider_enum" NOT NULL DEFAULT 'local', "socialId" character varying, "email" character varying, "password" character varying, "userId" uuid, CONSTRAINT "REL_60328bf27019ff5498c4b97742" UNIQUE ("userId"), CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_abfc676aa0318193747e9ba6e0" UNIQUE ("userId"), CONSTRAINT "PK_ff7d24b6bfee561452e7c31c04c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tech_stack" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tech" character varying NOT NULL, CONSTRAINT "PK_28ce6942fffe078dd648ae71d4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_tech_stack" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mentorId" uuid, "techStackId" uuid, CONSTRAINT "PK_dae00d57170bc7ece86cdda1097" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_df4bfe54f243bd089ea8fb66ed" UNIQUE ("userId"), CONSTRAINT "PK_9fcebd0a40237e9b6defcbd9d74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "profileImage" character varying, "nickname" character varying, CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_entity_role_enum" AS ENUM('user', 'mentor', 'admin')`);
        await queryRunner.query(`CREATE TABLE "role_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "role" "public"."role_entity_role_enum" NOT NULL, CONSTRAINT "PK_7bc1bd2364b6e9bf7c84b1e52e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_roles_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "role_id" uuid NOT NULL, CONSTRAINT "PK_ea622cfb33ae2afc4505f972936" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentoring_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfe67fea6498c985bed26f03459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bbe3ae22ff86f32256b3de2bd4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee" ADD CONSTRAINT "FK_abfc676aa0318193747e9ba6e03" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" ADD CONSTRAINT "FK_ad5bbeace4179bd5da8a5d0a2c7" FOREIGN KEY ("mentorId") REFERENCES "mentor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" ADD CONSTRAINT "FK_0d40b91c05efc09409c6f8be376" FOREIGN KEY ("techStackId") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD CONSTRAINT "FK_df4bfe54f243bd089ea8fb66ed0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_2e17f8a7a60f0122b61bf8ab283" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" ADD CONSTRAINT "FK_6af75a199b0a16315f83c255835" FOREIGN KEY ("role_id") REFERENCES "role_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_6af75a199b0a16315f83c255835"`);
        await queryRunner.query(`ALTER TABLE "user_roles_entity" DROP CONSTRAINT "FK_2e17f8a7a60f0122b61bf8ab283"`);
        await queryRunner.query(`ALTER TABLE "mentor" DROP CONSTRAINT "FK_df4bfe54f243bd089ea8fb66ed0"`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" DROP CONSTRAINT "FK_0d40b91c05efc09409c6f8be376"`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" DROP CONSTRAINT "FK_ad5bbeace4179bd5da8a5d0a2c7"`);
        await queryRunner.query(`ALTER TABLE "mentee" DROP CONSTRAINT "FK_abfc676aa0318193747e9ba6e03"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "mentor_availability"`);
        await queryRunner.query(`DROP TABLE "mentoring_session"`);
        await queryRunner.query(`DROP TABLE "user_roles_entity"`);
        await queryRunner.query(`DROP TABLE "role_entity"`);
        await queryRunner.query(`DROP TYPE "public"."role_entity_role_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "mentor"`);
        await queryRunner.query(`DROP TABLE "mentor_tech_stack"`);
        await queryRunner.query(`DROP TABLE "tech_stack"`);
        await queryRunner.query(`DROP TABLE "mentee"`);
        await queryRunner.query(`DROP TABLE "account"`);
        await queryRunner.query(`DROP TYPE "public"."account_provider_enum"`);
    }

}
