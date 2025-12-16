using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class CategoriesProductsRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_Products_ProductEntityId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_ProductEntityId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "ProductEntityId",
                table: "Categories");

            migrationBuilder.CreateTable(
                name: "CategoryEntityProductEntity",
                columns: table => new
                {
                    CategoriesId = table.Column<long>(type: "bigint", nullable: false),
                    ProductsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CategoryEntityProductEntity", x => new { x.CategoriesId, x.ProductsId });
                    table.ForeignKey(
                        name: "FK_CategoryEntityProductEntity_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CategoryEntityProductEntity_Products_ProductsId",
                        column: x => x.ProductsId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CategoryEntityProductEntity_ProductsId",
                table: "CategoryEntityProductEntity",
                column: "ProductsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CategoryEntityProductEntity");

            migrationBuilder.AddColumn<long>(
                name: "ProductEntityId",
                table: "Categories",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_ProductEntityId",
                table: "Categories",
                column: "ProductEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_Products_ProductEntityId",
                table: "Categories",
                column: "ProductEntityId",
                principalTable: "Products",
                principalColumn: "Id");
        }
    }
}
