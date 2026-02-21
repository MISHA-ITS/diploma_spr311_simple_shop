using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ChangeAdvertisementCategoryToOneToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdvertisementEntityCategoryEntity");

            migrationBuilder.AddColumn<long>(
                name: "CategoryId",
                table: "Advertisements",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_Advertisements_CategoryId",
                table: "Advertisements",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Advertisements_Categories_CategoryId",
                table: "Advertisements",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Advertisements_Categories_CategoryId",
                table: "Advertisements");

            migrationBuilder.DropIndex(
                name: "IX_Advertisements_CategoryId",
                table: "Advertisements");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Advertisements");

            migrationBuilder.CreateTable(
                name: "AdvertisementEntityCategoryEntity",
                columns: table => new
                {
                    AdvertisementsId = table.Column<long>(type: "bigint", nullable: false),
                    CategoriesId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvertisementEntityCategoryEntity", x => new { x.AdvertisementsId, x.CategoriesId });
                    table.ForeignKey(
                        name: "FK_AdvertisementEntityCategoryEntity_Advertisements_Advertisem~",
                        column: x => x.AdvertisementsId,
                        principalTable: "Advertisements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AdvertisementEntityCategoryEntity_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdvertisementEntityCategoryEntity_CategoriesId",
                table: "AdvertisementEntityCategoryEntity",
                column: "CategoriesId");
        }
    }
}
