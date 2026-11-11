using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TecnoFixBack.Migrations
{
    /// <inheritdoc />
    public partial class AddTotalCostAndOrderLogDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "totalCost" numeric;""");

            migrationBuilder.Sql("""
                UPDATE "Orders"
                SET "totalCost" = "laborCost" + "partsCost"
                WHERE "totalCost" IS NULL AND "laborCost" IS NOT NULL AND "partsCost" IS NOT NULL;
                """);

            migrationBuilder.AddColumn<string>(
                name: "newStatus",
                table: "Loggers",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "userId",
                table: "Loggers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Loggers_userId",
                table: "Loggers",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Loggers_Users_userId",
                table: "Loggers",
                column: "userId",
                principalTable: "Users",
                principalColumn: "ID");

            migrationBuilder.Sql("""
                UPDATE "Loggers" SET "newStatus" = 'Recibida'
                WHERE "newStatus" IS NULL AND "action" LIKE 'Recepción de equipo%';

                UPDATE "Loggers" SET "newStatus" = 'En diagnóstico'
                WHERE "newStatus" IS NULL AND "action" LIKE 'Inicio de diagnóstico%';

                UPDATE "Loggers" SET "newStatus" = 'Presupuestada'
                WHERE "newStatus" IS NULL AND "action" LIKE 'Presupuesto generado%';

                UPDATE "Loggers" AS l
                SET "newStatus" = 'En reparación', "userId" = o."clientId", "action" = 'Presupuesto aprobado por el cliente'
                FROM "Orders" AS o
                WHERE o."id" = l."orderId" AND l."action" LIKE 'Presupuesto aprobado por el cliente%';

                UPDATE "Loggers" AS l
                SET "newStatus" = 'Rechazada', "userId" = o."clientId", "action" = 'Presupuesto rechazado por el cliente'
                FROM "Orders" AS o
                WHERE o."id" = l."orderId" AND l."action" LIKE 'Presupuesto rechazado por el cliente%';
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Loggers_Users_userId",
                table: "Loggers");

            migrationBuilder.DropIndex(
                name: "IX_Loggers_userId",
                table: "Loggers");

            migrationBuilder.Sql("""ALTER TABLE "Orders" DROP COLUMN IF EXISTS "totalCost";""");

            migrationBuilder.DropColumn(
                name: "newStatus",
                table: "Loggers");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "Loggers");
        }
    }
}
