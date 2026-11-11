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
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_ClientId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ClientId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Orders");

            migrationBuilder.AddColumn<string>(
                name: "diagnosis",
                table: "Orders",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "laborCost",
                table: "Orders",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "partsCost",
                table: "Orders",
                type: "numeric",
                nullable: true);
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
