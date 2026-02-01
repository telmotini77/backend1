import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial20260201010101 implements MigrationInterface {
  name = 'Initial20260201010101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Use generic SQL types so this migration can run on Postgres and SQLite

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "users" (
      "id" varchar PRIMARY KEY,
      "email" character varying NOT NULL,
      "password" character varying NOT NULL,
      "role" character varying NOT NULL DEFAULT 'cliente',
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`);

    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_email" ON "users" ("email")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "categories" (
      "id" varchar PRIMARY KEY,
      "name" character varying NOT NULL,
      "description" text
    )`);

    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_categories_name" ON "categories" ("name")`);

    await queryRunner.query(`CREATE TABLE IF NOT EXISTS "products" (
      "id" varchar PRIMARY KEY,
      "sku" character varying NOT NULL,
      "name" character varying NOT NULL,
      "description" text,
      "price" numeric(10,2) NOT NULL,
      "stock" integer NOT NULL DEFAULT 0,
      "categoryId" varchar
    )`);

    await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_products_sku" ON "products" ("sku")`);

    await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_products_category" FOREIGN KEY ("categoryId") REFERENCES "categories"("id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "FK_products_category"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_products_sku"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_categories_name"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "categories"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_users_email"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
  }
}
