using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RenameCategoryEntityProductEntityToProductsCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryEntityProductEntity_Categories_CategoriesId",
                table: "CategoryEntityProductEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_CategoryEntityProductEntity_Products_ProductsId",
                table: "CategoryEntityProductEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoryEntityProductEntity",
                table: "CategoryEntityProductEntity");

            migrationBuilder.RenameTable(
                name: "CategoryEntityProductEntity",
                newName: "ProductsCategories");

            migrationBuilder.RenameIndex(
                name: "IX_CategoryEntityProductEntity_ProductsId",
                table: "ProductsCategories",
                newName: "IX_ProductsCategories_ProductsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductsCategories",
                table: "ProductsCategories",
                columns: new[] { "CategoriesId", "ProductsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsCategories_Categories_CategoriesId",
                table: "ProductsCategories",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductsCategories_Products_ProductsId",
                table: "ProductsCategories",
                column: "ProductsId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductsCategories_Categories_CategoriesId",
                table: "ProductsCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductsCategories_Products_ProductsId",
                table: "ProductsCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductsCategories",
                table: "ProductsCategories");

            migrationBuilder.RenameTable(
                name: "ProductsCategories",
                newName: "CategoryEntityProductEntity");

            migrationBuilder.RenameIndex(
                name: "IX_ProductsCategories_ProductsId",
                table: "CategoryEntityProductEntity",
                newName: "IX_CategoryEntityProductEntity_ProductsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoryEntityProductEntity",
                table: "CategoryEntityProductEntity",
                columns: new[] { "CategoriesId", "ProductsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryEntityProductEntity_Categories_CategoriesId",
                table: "CategoryEntityProductEntity",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryEntityProductEntity_Products_ProductsId",
                table: "CategoryEntityProductEntity",
                column: "ProductsId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
