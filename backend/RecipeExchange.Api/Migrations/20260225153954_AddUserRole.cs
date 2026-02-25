using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RecipeExchange.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUserRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Column may already exist (added outside of EF migrations).
            // Use AlterColumn to set the default value on the existing column.
            migrationBuilder.AlterColumn<string>(
                name: "Role",
                table: "Users",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "user",
                oldClrType: typeof(string),
                oldType: "varchar(20)",
                oldMaxLength: 20);

            // Backfill any rows that have an empty or null Role.
            migrationBuilder.Sql("UPDATE `Users` SET `Role` = 'user' WHERE `Role` IS NULL OR `Role` = '';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");
        }
    }
}
