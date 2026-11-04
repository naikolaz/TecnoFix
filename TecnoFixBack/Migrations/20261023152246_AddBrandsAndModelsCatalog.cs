using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TecnoFixBack.Migrations
{
    /// <inheritdoc />
    public partial class AddBrandsAndModelsCatalog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Usuarios_clientId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Roles_idRole",
                table: "Usuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios");

            migrationBuilder.RenameTable(
                name: "Usuarios",
                newName: "Users");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_RUT",
                table: "Users",
                newName: "IX_Users_RUT");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_idRole",
                table: "Users",
                newName: "IX_Users_idRole");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_email",
                table: "Users",
                newName: "IX_Users_email");

            migrationBuilder.AddColumn<int>(
                name: "ClientId",
                table: "Orders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "ID");

            migrationBuilder.CreateTable(
                name: "Brands",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Brands", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    BrandId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Models_Brands_BrandId",
                        column: x => x.BrandId,
                        principalTable: "Brands",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Brands",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "Asus" },
                    { 2, "HP" },
                    { 3, "Lenovo" },
                    { 4, "Dell" },
                    { 5, "Apple" },
                    { 6, "Samsung" },
                    { 7, "Acer" },
                    { 8, "MSI" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ClientId",
                table: "Orders",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Models_BrandId",
                table: "Models",
                column: "BrandId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_ClientId",
                table: "Orders",
                column: "ClientId",
                principalTable: "Users",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_clientId",
                table: "Orders",
                column: "clientId",
                principalTable: "Users",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_idRole",
                table: "Users",
                column: "idRole",
                principalTable: "Roles",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_ClientId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_clientId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_idRole",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropTable(
                name: "Brands");

            migrationBuilder.DropIndex(
                name: "IX_Orders_ClientId",
                table: "Orders");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Orders");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Usuarios");

            migrationBuilder.RenameIndex(
                name: "IX_Users_RUT",
                table: "Usuarios",
                newName: "IX_Usuarios_RUT");

            migrationBuilder.RenameIndex(
                name: "IX_Users_idRole",
                table: "Usuarios",
                newName: "IX_Usuarios_idRole");

            migrationBuilder.RenameIndex(
                name: "IX_Users_email",
                table: "Usuarios",
                newName: "IX_Usuarios_email");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Usuarios",
                table: "Usuarios",
                column: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Usuarios_clientId",
                table: "Orders",
                column: "clientId",
                principalTable: "Usuarios",
                principalColumn: "ID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Roles_idRole",
                table: "Usuarios",
                column: "idRole",
                principalTable: "Roles",
                principalColumn: "ID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
