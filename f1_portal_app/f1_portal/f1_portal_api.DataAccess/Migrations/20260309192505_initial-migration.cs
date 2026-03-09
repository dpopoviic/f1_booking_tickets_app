using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace f1_portal_api.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class initialmigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TicketsByPurchaseDate",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PurchaseDate = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TicketCount = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketsByPurchaseDate", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TicketsByRaceDay",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RaceDayId = table.Column<long>(type: "bigint", nullable: false),
                    RaceDayName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RaceDayDate = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TicketCount = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketsByRaceDay", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TicketsByPurchaseDate_PurchaseDate",
                table: "TicketsByPurchaseDate",
                column: "PurchaseDate",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketsByRaceDay_RaceDayId",
                table: "TicketsByRaceDay",
                column: "RaceDayId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketsByPurchaseDate");

            migrationBuilder.DropTable(
                name: "TicketsByRaceDay");
        }
    }
}
