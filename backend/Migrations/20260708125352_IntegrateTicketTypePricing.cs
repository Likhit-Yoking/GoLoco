using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlineEventTicketManagement.Migrations
{
    /// <inheritdoc />
    public partial class IntegrateTicketTypePricing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clear existing bookings to prevent foreign key constraint violations for new non-nullable columns
            migrationBuilder.Sql("DELETE FROM Bookings;");

            migrationBuilder.AddColumn<int>(
                name: "NumberOfTickets",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TicketTypeId",
                table: "Bookings",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TicketTypeId",
                table: "Bookings",
                column: "TicketTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Bookings_TicketTypes_TicketTypeId",
                table: "Bookings",
                column: "TicketTypeId",
                principalTable: "TicketTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Bookings_TicketTypes_TicketTypeId",
                table: "Bookings");

            migrationBuilder.DropIndex(
                name: "IX_Bookings_TicketTypeId",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "NumberOfTickets",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "TicketTypeId",
                table: "Bookings");
        }
    }
}
