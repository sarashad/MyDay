using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyDay.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHabitTargetCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TargetCount",
                table: "Habits",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "HabitLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TargetCount",
                table: "Habits");

            migrationBuilder.DropColumn(
                name: "Count",
                table: "HabitLogs");
        }
    }
}
