using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TecnoFixBack.Migrations
{
    /// <inheritdoc />
    public partial class CleanupLegacyColumnsAndBackfillLogActors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Preserve the actor stored in the legacy "responsibleId" column.
            //    The column only exists in databases that drifted from the EF model.
            migrationBuilder.Sql("""
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_schema = 'public' AND table_name = 'Loggers' AND column_name = 'responsibleId'
                    ) THEN
                        EXECUTE '
                            UPDATE "Loggers" AS l
                            SET "userId" = l."responsibleId"
                            WHERE l."userId" IS NULL
                              AND l."responsibleId" IS NOT NULL
                              AND EXISTS (SELECT 1 FROM "Users" u WHERE u."ID" = l."responsibleId")';
                    END IF;
                END $$;
                """);

            // 2. Recover the actor from old log messages that embedded the user ID.
            migrationBuilder.Sql("""
                UPDATE "Loggers" AS l
                SET "userId" = substring(l."action" FROM '([0-9]+)$')::int
                WHERE l."userId" IS NULL
                  AND l."action" LIKE 'Order created in system by user ID:%'
                  AND EXISTS (
                      SELECT 1 FROM "Users" u
                      WHERE u."ID" = substring(l."action" FROM '([0-9]+)$')::int
                  );
                """);

            // 3. Complete the status of historical log entries from their action text.
            migrationBuilder.Sql("""
                UPDATE "Loggers" SET "newStatus" = 'Recibida'
                WHERE "newStatus" IS NULL
                  AND ("action" LIKE 'Recepción de equipo%' OR "action" LIKE 'Order created in system%');

                UPDATE "Loggers" SET "newStatus" = 'En diagnóstico'
                WHERE "newStatus" IS NULL
                  AND ("action" LIKE 'Inicio de diagnóstico%' OR "action" LIKE 'Diagnóstico iniciado%');

                UPDATE "Loggers" SET "newStatus" = 'Presupuestada'
                WHERE "newStatus" IS NULL
                  AND ("action" LIKE 'Presupuesto generado%' OR "action" LIKE 'Diagnóstico y presupuesto%');

                UPDATE "Loggers" SET "newStatus" = 'En reparación'
                WHERE "newStatus" IS NULL
                  AND "action" LIKE 'Presupuesto aprobado%';

                UPDATE "Loggers" SET "newStatus" = 'Rechazada'
                WHERE "newStatus" IS NULL
                  AND "action" LIKE 'Presupuesto rechazado%';
                """);

            // 4. Normalize the legacy "Ingresado" state to the ERS state "Recibida".
            migrationBuilder.Sql("""
                UPDATE "Orders" SET "status" = 'Recibida' WHERE "status" = 'Ingresado';
                """);

            // 5. Normalize empty optional values to NULL.
            migrationBuilder.Sql("""
                UPDATE "Users" SET "RUT" = NULL WHERE trim("RUT") = '';
                UPDATE "Users" SET "telephoneNumber" = NULL WHERE trim("telephoneNumber") = '';
                UPDATE "Users" SET "specialization" = NULL WHERE trim("specialization") = '';
                """);

            // 6. Drop columns that are not part of the EF Core model and were never used
            //    by the current application (all their values were NULL or redundant).
            migrationBuilder.Sql("""
                DROP INDEX IF EXISTS "IX_Loggers_responsibleId";
                ALTER TABLE "Loggers" DROP COLUMN IF EXISTS "responsibleId";
                ALTER TABLE "Loggers" DROP COLUMN IF EXISTS "responsibleName";
                ALTER TABLE "Orders" DROP COLUMN IF EXISTS "budgetDecision";
                ALTER TABLE "Orders" DROP COLUMN IF EXISTS "budgetDecidedAt";
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Recreate the legacy columns so the migration can be reverted structurally.
            // Their historical values cannot be restored.
            migrationBuilder.Sql("""
                ALTER TABLE "Loggers" ADD COLUMN IF NOT EXISTS "responsibleId" integer;
                ALTER TABLE "Loggers" ADD COLUMN IF NOT EXISTS "responsibleName" character varying(200);
                CREATE INDEX IF NOT EXISTS "IX_Loggers_responsibleId" ON "Loggers" ("responsibleId");

                ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "budgetDecision" character varying(20);
                ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "budgetDecidedAt" timestamp with time zone;
                """);
        }
    }
}
