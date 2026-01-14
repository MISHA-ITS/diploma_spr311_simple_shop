using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RenameCategoryEntityadvertisementEntityToadvertisementsCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryEntityadvertisementEntity_Categories_CategoriesId",
                table: "CategoryEntityadvertisementEntity");

            migrationBuilder.DropForeignKey(
                name: "FK_CategoryEntityadvertisementEntity_advertisements_advertisementsId",
                table: "CategoryEntityadvertisementEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CategoryEntityadvertisementEntity",
                table: "CategoryEntityadvertisementEntity");

            migrationBuilder.RenameTable(
                name: "CategoryEntityadvertisementEntity",
                newName: "advertisementsCategories");

            migrationBuilder.RenameIndex(
                name: "IX_CategoryEntityadvertisementEntity_advertisementsId",
                table: "advertisementsCategories",
                newName: "IX_advertisementsCategories_advertisementsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_advertisementsCategories",
                table: "advertisementsCategories",
                columns: new[] { "CategoriesId", "advertisementsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_advertisementsCategories_Categories_CategoriesId",
                table: "advertisementsCategories",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_advertisementsCategories_advertisements_advertisementsId",
                table: "advertisementsCategories",
                column: "advertisementsId",
                principalTable: "advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_advertisementsCategories_Categories_CategoriesId",
                table: "advertisementsCategories");

            migrationBuilder.DropForeignKey(
                name: "FK_advertisementsCategories_advertisements_advertisementsId",
                table: "advertisementsCategories");

            migrationBuilder.DropPrimaryKey(
                name: "PK_advertisementsCategories",
                table: "advertisementsCategories");

            migrationBuilder.RenameTable(
                name: "advertisementsCategories",
                newName: "CategoryEntityadvertisementEntity");

            migrationBuilder.RenameIndex(
                name: "IX_advertisementsCategories_advertisementsId",
                table: "CategoryEntityadvertisementEntity",
                newName: "IX_CategoryEntityadvertisementEntity_advertisementsId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CategoryEntityadvertisementEntity",
                table: "CategoryEntityadvertisementEntity",
                columns: new[] { "CategoriesId", "advertisementsId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryEntityadvertisementEntity_Categories_CategoriesId",
                table: "CategoryEntityadvertisementEntity",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryEntityadvertisementEntity_advertisements_advertisementsId",
                table: "CategoryEntityadvertisementEntity",
                column: "advertisementsId",
                principalTable: "advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
