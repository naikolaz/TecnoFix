using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TecnoFixBack.Migrations
{
    /// <inheritdoc />
    public partial class AddBudgetToOrders : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Orders" DROP CONSTRAINT IF EXISTS "FK_Orders_Users_ClientId";
                DROP INDEX IF EXISTS "IX_Orders_ClientId";
                ALTER TABLE "Orders" DROP COLUMN IF EXISTS "ClientId";
                ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "diagnosis" text;
                ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "laborCost" numeric;
                ALTER TABLE "Orders" ADD COLUMN IF NOT EXISTS "partsCost" numeric;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "diagnosis",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "laborCost",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "partsCost",
                table: "Orders");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Orders",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ClientId",
                table: "Orders",
                column: "ClientId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_ClientId",
                table: "Orders",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "ID");
        }
    }
}
