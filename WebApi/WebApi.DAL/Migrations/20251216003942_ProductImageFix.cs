using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class ProductImageFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "ProductImages");

            migrationBuilder.DropColumn(
                name: "Path",
                table: "ProductImages");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "ProductImages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "ProductImages");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "ProductImages",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Path",
                table: "ProductImages",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
