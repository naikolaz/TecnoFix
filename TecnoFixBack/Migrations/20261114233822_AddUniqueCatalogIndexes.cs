using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TecnoFixBack.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueCatalogIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Normalize whitespace so visually identical names collide in the unique indexes.
            migrationBuilder.Sql("""
                UPDATE "Brands"
                SET "Name" = regexp_replace(btrim("Name"), '\s+', ' ', 'g')
                WHERE "Name" <> regexp_replace(btrim("Name"), '\s+', ' ', 'g');

                UPDATE "Models"
                SET "Name" = regexp_replace(btrim("Name"), '\s+', ' ', 'g')
                WHERE "Name" <> regexp_replace(btrim("Name"), '\s+', ' ', 'g');
                """);

            // Reassign models from duplicate brands to the oldest brand with the same normalized name.
            migrationBuilder.Sql("""
                WITH ranked AS (
                    SELECT "Id",
                           first_value("Id") OVER (
                               PARTITION BY lower(btrim("Name"))
                               ORDER BY "Id"
                           ) AS keep_id
                    FROM "Brands"
                )
                UPDATE "Models" AS m
                SET "BrandId" = r.keep_id
                FROM ranked AS r
                WHERE m."BrandId" = r."Id" AND r."Id" <> r.keep_id;
                """);

            // Remove duplicated models inside the same brand.
            migrationBuilder.Sql("""
                DELETE FROM "Models" AS m
                USING (
                    SELECT "Id",
                           row_number() OVER (
                               PARTITION BY "BrandId", lower(btrim("Name"))
                               ORDER BY "Id"
                           ) AS rn
                    FROM "Models"
                ) AS d
                WHERE m."Id" = d."Id" AND d.rn > 1;
                """);

            // Remove duplicated brands, keeping the oldest one.
            migrationBuilder.Sql("""
                DELETE FROM "Brands" AS b
                USING (
                    SELECT "Id",
                           row_number() OVER (
                               PARTITION BY lower(btrim("Name"))
                               ORDER BY "Id"
                           ) AS rn
                    FROM "Brands"
                ) AS d
                WHERE b."Id" = d."Id" AND d.rn > 1;
                """);

            // Functional unique indexes: case-insensitive and ignoring surrounding whitespace.
            migrationBuilder.Sql("""
                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Brands_Name_Normalized"
                ON "Brands" (lower(btrim("Name")));

                CREATE UNIQUE INDEX IF NOT EXISTS "IX_Models_BrandId_Name_Normalized"
                ON "Models" ("BrandId", lower(btrim("Name")));
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_Models_BrandId_Name_Normalized";
                DROP INDEX IF EXISTS "IX_Brands_Name_Normalized";
                """);
        }
    }
}
