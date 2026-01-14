using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace WebApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class advertisements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "advertisementEntityId",
                table: "Categories",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "advertisements",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: true),
                    Price = table.Column<decimal>(type: "numeric", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advertisements", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "advertisementImageEntity",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Path = table.Column<string>(type: "text", nullable: false),
                    advertisementId = table.Column<long>(type: "bigint", nullable: false),
                    CreateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_advertisementImageEntity", x => x.Id);
                    table.ForeignKey(
                        name: "FK_advertisementImageEntity_advertisements_advertisementId",
                        column: x => x.advertisementId,
                        principalTable: "advertisements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Categories_advertisementEntityId",
                table: "Categories",
                column: "advertisementEntityId");

            migrationBuilder.CreateIndex(
                name: "IX_advertisementImageEntity_advertisementId",
                table: "advertisementImageEntity",
                column: "advertisementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_advertisements_advertisementEntityId",
                table: "Categories",
                column: "advertisementEntityId",
                principalTable: "advertisements",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_advertisements_advertisementEntityId",
                table: "Categories");

            migrationBuilder.DropTable(
                name: "advertisementImageEntity");

            migrationBuilder.DropTable(
                name: "advertisements");

            migrationBuilder.DropIndex(
                name: "IX_Categories_advertisementEntityId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "advertisementEntityId",
                table: "Categories");
        }
    }
}
