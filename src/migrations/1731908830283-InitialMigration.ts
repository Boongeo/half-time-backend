import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1731908830283 implements MigrationInterface {
    name = 'InitialMigration1731908830283'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1"`);
        await queryRunner.query(`CREATE TABLE "mentee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "REL_abfc676aa0318193747e9ba6e0" UNIQUE ("userId"), CONSTRAINT "PK_ff7d24b6bfee561452e7c31c04c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tech_stack" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "tech" character varying NOT NULL, CONSTRAINT "PK_28ce6942fffe078dd648ae71d4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_tech_stack" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mentorId" uuid, "techStackId" uuid, CONSTRAINT "PK_dae00d57170bc7ece86cdda1097" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying NOT NULL, "userId" uuid, CONSTRAINT "REL_df4bfe54f243bd089ea8fb66ed" UNIQUE ("userId"), CONSTRAINT "PK_9fcebd0a40237e9b6defcbd9d74" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentoring_session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bfe67fea6498c985bed26f03459" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_bbe3ae22ff86f32256b3de2bd4e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "body" character varying NOT NULL, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "REL_68d3c22dbd95449360fdbf7a3f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "accountId"`);
        await queryRunner.query(`ALTER TABLE "account" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "UQ_60328bf27019ff5498c4b977421" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD "profileImage" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "nickname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname")`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'guest')`);
        await queryRunner.query(`ALTER TABLE "user" ADD "role" "public"."user_role_enum" NOT NULL DEFAULT 'guest'`);
        await queryRunner.query(`ALTER TABLE "account" ADD CONSTRAINT "FK_60328bf27019ff5498c4b977421" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee" ADD CONSTRAINT "FK_abfc676aa0318193747e9ba6e03" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" ADD CONSTRAINT "FK_ad5bbeace4179bd5da8a5d0a2c7" FOREIGN KEY ("mentorId") REFERENCES "mentor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" ADD CONSTRAINT "FK_0d40b91c05efc09409c6f8be376" FOREIGN KEY ("techStackId") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor" ADD CONSTRAINT "FK_df4bfe54f243bd089ea8fb66ed0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentor" DROP CONSTRAINT "FK_df4bfe54f243bd089ea8fb66ed0"`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" DROP CONSTRAINT "FK_0d40b91c05efc09409c6f8be376"`);
        await queryRunner.query(`ALTER TABLE "mentor_tech_stack" DROP CONSTRAINT "FK_ad5bbeace4179bd5da8a5d0a2c7"`);
        await queryRunner.query(`ALTER TABLE "mentee" DROP CONSTRAINT "FK_abfc676aa0318193747e9ba6e03"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "FK_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "account" DROP CONSTRAINT "UQ_60328bf27019ff5498c4b977421"`);
        await queryRunner.query(`ALTER TABLE "account" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "accountId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "REL_68d3c22dbd95449360fdbf7a3f" UNIQUE ("accountId")`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "mentor_availability"`);
        await queryRunner.query(`DROP TABLE "mentoring_session"`);
        await queryRunner.query(`DROP TABLE "mentor"`);
        await queryRunner.query(`DROP TABLE "mentor_tech_stack"`);
        await queryRunner.query(`DROP TABLE "tech_stack"`);
        await queryRunner.query(`DROP TABLE "mentee"`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_68d3c22dbd95449360fdbf7a3f1" FOREIGN KEY ("accountId") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
