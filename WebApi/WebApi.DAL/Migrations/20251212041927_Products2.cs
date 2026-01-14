using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class advertisements2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_advertisementImageEntity_advertisements_advertisementId",
                table: "advertisementImageEntity");

            migrationBuilder.DropPrimaryKey(
                name: "PK_advertisementImageEntity",
                table: "advertisementImageEntity");

            migrationBuilder.RenameTable(
                name: "advertisementImageEntity",
                newName: "advertisementImages");

            migrationBuilder.RenameIndex(
                name: "IX_advertisementImageEntity_advertisementId",
                table: "advertisementImages",
                newName: "IX_advertisementImages_advertisementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_advertisementImages",
                table: "advertisementImages",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_advertisementImages_advertisements_advertisementId",
                table: "advertisementImages",
                column: "advertisementId",
                principalTable: "advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_advertisementImages_advertisements_advertisementId",
                table: "advertisementImages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_advertisementImages",
                table: "advertisementImages");

            migrationBuilder.RenameTable(
                name: "advertisementImages",
                newName: "advertisementImageEntity");

            migrationBuilder.RenameIndex(
                name: "IX_advertisementImages_advertisementId",
                table: "advertisementImageEntity",
                newName: "IX_advertisementImageEntity_advertisementId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_advertisementImageEntity",
                table: "advertisementImageEntity",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_advertisementImageEntity_advertisements_advertisementId",
                table: "advertisementImageEntity",
                column: "advertisementId",
                principalTable: "advertisements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
