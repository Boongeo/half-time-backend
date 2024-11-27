import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732697681118 implements MigrationInterface {
    name = 'InitialMigration1732697681118'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "mentee_interest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "menteeId" uuid, "interestId" uuid, CONSTRAINT "PK_7ae18ddb414bdfce2cf5de4ae92" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "interest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "interest" character varying NOT NULL, CONSTRAINT "PK_6619d627e204e0596968653011f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_interest" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "mentorId" uuid, "interestId" uuid, CONSTRAINT "PK_a40d615714c3951c5cf19685a69" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentee_tech_stack" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "menteeId" uuid, "techStackId" uuid, CONSTRAINT "PK_4d8ca2812426a98f53833fe3d17" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mentee" ADD "description" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "mentee_interest" ADD CONSTRAINT "FK_31e0699d7e0699bd54339b0544a" FOREIGN KEY ("menteeId") REFERENCES "mentee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee_interest" ADD CONSTRAINT "FK_e52372327d50c041e36e5021f56" FOREIGN KEY ("interestId") REFERENCES "interest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_interest" ADD CONSTRAINT "FK_fa3e1b754e022e5c98e5a20c56a" FOREIGN KEY ("mentorId") REFERENCES "mentor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_interest" ADD CONSTRAINT "FK_96b0800f7c95c25e1f45120ff18" FOREIGN KEY ("interestId") REFERENCES "interest"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee_tech_stack" ADD CONSTRAINT "FK_e33d6f03396d2d4b3cec5f66443" FOREIGN KEY ("menteeId") REFERENCES "mentee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee_tech_stack" ADD CONSTRAINT "FK_cf1185e04b267b1318c92ca3d3c" FOREIGN KEY ("techStackId") REFERENCES "tech_stack"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentee_tech_stack" DROP CONSTRAINT "FK_cf1185e04b267b1318c92ca3d3c"`);
        await queryRunner.query(`ALTER TABLE "mentee_tech_stack" DROP CONSTRAINT "FK_e33d6f03396d2d4b3cec5f66443"`);
        await queryRunner.query(`ALTER TABLE "mentor_interest" DROP CONSTRAINT "FK_96b0800f7c95c25e1f45120ff18"`);
        await queryRunner.query(`ALTER TABLE "mentor_interest" DROP CONSTRAINT "FK_fa3e1b754e022e5c98e5a20c56a"`);
        await queryRunner.query(`ALTER TABLE "mentee_interest" DROP CONSTRAINT "FK_e52372327d50c041e36e5021f56"`);
        await queryRunner.query(`ALTER TABLE "mentee_interest" DROP CONSTRAINT "FK_31e0699d7e0699bd54339b0544a"`);
        await queryRunner.query(`ALTER TABLE "mentee" DROP COLUMN "description"`);
        await queryRunner.query(`DROP TABLE "mentee_tech_stack"`);
        await queryRunner.query(`DROP TABLE "mentor_interest"`);
        await queryRunner.query(`DROP TABLE "interest"`);
        await queryRunner.query(`DROP TABLE "mentee_interest"`);
    }

}
