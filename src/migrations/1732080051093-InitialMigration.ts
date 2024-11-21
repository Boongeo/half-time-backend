import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1732080051093 implements MigrationInterface {
    name = 'InitialMigration1732080051093'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_entity" DROP CONSTRAINT "FK_ba2e2c24ec32724b8928b8a0314"`);
        await queryRunner.query(`ALTER TABLE "role_entity" DROP COLUMN "userRolesId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "role_entity" ADD "userRolesId" uuid`);
        await queryRunner.query(`ALTER TABLE "role_entity" ADD CONSTRAINT "FK_ba2e2c24ec32724b8928b8a0314" FOREIGN KEY ("userRolesId") REFERENCES "user_roles_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
