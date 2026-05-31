using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyDay.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddDailySpark : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DailySparks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TaskText = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MotivationalMessage = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsCompleted = table.Column<bool>(type: "bit", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailySparks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailySparks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SparkBadges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    BadgeKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EarnedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SparkBadges", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SparkBadges_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SparkStreaks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CurrentStreak = table.Column<int>(type: "int", nullable: false),
                    LongestStreak = table.Column<int>(type: "int", nullable: false),
                    LastCompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TotalCompleted = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SparkStreaks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SparkStreaks_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailySparks_UserId",
                table: "DailySparks",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SparkBadges_UserId",
                table: "SparkBadges",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SparkStreaks_UserId",
                table: "SparkStreaks",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailySparks");

            migrationBuilder.DropTable(
                name: "SparkBadges");

            migrationBuilder.DropTable(
                name: "SparkStreaks");
        }
    }
}
