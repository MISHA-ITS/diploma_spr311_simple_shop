using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class advertisementImageFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "advertisementImages");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "advertisementImages");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "advertisementImages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "advertisementImages");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "advertisementImages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "advertisementImages",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
