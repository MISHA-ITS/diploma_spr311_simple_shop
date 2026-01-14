using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class CreaterefCategoryandadvertisements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_advertisements_advertisementEntityId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_advertisementEntityId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "advertisementEntityId",
                table: "Categories");

            migrationBuilder.CreateTable(
                name: "advertisementCategories",
                columns: table => new
                {
                    CategoriesId = table.Column<long>(type: "bigint", nullable: false),
                    advertisementsId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advertisementCategories", x => new { x.CategoriesId, x.advertisementsId });
                    table.ForeignKey(
                        name: "FK_advertisementCategories_Categories_CategoriesId",
                        column: x => x.CategoriesId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_advertisementCategories_advertisements_advertisementsId",
                        column: x => x.advertisementsId,
                        principalTable: "advertisements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_advertisementCategories_advertisementsId",
                table: "advertisementCategories",
                column: "advertisementsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "advertisementCategories");

            migrationBuilder.AddColumn<long>(
                name: "advertisementEntityId",
                table: "Categories",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_advertisementEntityId",
                table: "Categories",
                column: "advertisementEntityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_advertisements_advertisementEntityId",
                table: "Categories",
                column: "advertisementEntityId",
                principalTable: "advertisements",
                principalColumn: "Id");
        }
    }
}
