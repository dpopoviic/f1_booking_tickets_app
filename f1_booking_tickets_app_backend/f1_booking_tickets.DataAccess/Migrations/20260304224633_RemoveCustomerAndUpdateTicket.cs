using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace f1_booking_tickets.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class RemoveCustomerAndUpdateTicket : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_Customers_CustomerId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_PromoCodes_PromoCodeCreatedId",
                table: "Tickets");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_PromoCodes_PromoCodeUsedId",
                table: "Tickets");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CustomerId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_PromoCodeCreatedId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_PromoCodeUsedId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "CustomerId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PromoCodeCreatedId",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "PromoCodeUsedId",
                table: "Tickets",
                newName: "UsedPromoCodeId");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Tickets",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "Tickets",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Tickets",
                type: "nvarchar(256)",
                maxLength: 256,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Tickets",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Tickets",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Tickets",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "TicketCode",
                table: "Tickets",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "DiscountDeadline",
                table: "Races",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CreatedByTicketId",
                table: "PromoCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsedByTicketId",
                table: "PromoCodes",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_Email",
                table: "Tickets",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_TicketCode",
                table: "Tickets",
                column: "TicketCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_UsedPromoCodeId",
                table: "Tickets",
                column: "UsedPromoCodeId",
                unique: true,
                filter: "[UsedPromoCodeId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodes_CreatedByTicketId",
                table: "PromoCodes",
                column: "CreatedByTicketId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PromoCodes_UsedByTicketId",
                table: "PromoCodes",
                column: "UsedByTicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_PromoCodes_Tickets_CreatedByTicketId",
                table: "PromoCodes",
                column: "CreatedByTicketId",
                principalTable: "Tickets",
                principalColumn: "TicketId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_PromoCodes_UsedPromoCodeId",
                table: "Tickets",
                column: "UsedPromoCodeId",
                principalTable: "PromoCodes",
                principalColumn: "PromoCodeId",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PromoCodes_Tickets_CreatedByTicketId",
                table: "PromoCodes");

            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_PromoCodes_UsedPromoCodeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_Email",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_TicketCode",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_UsedPromoCodeId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_PromoCodes_CreatedByTicketId",
                table: "PromoCodes");

            migrationBuilder.DropIndex(
                name: "IX_PromoCodes_UsedByTicketId",
                table: "PromoCodes");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Country",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "TicketCode",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "DiscountDeadline",
                table: "Races");

            migrationBuilder.DropColumn(
                name: "CreatedByTicketId",
                table: "PromoCodes");

            migrationBuilder.DropColumn(
                name: "UsedByTicketId",
                table: "PromoCodes");

            migrationBuilder.RenameColumn(
                name: "UsedPromoCodeId",
                table: "Tickets",
                newName: "PromoCodeUsedId");

            migrationBuilder.AddColumn<int>(
                name: "CustomerId",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PromoCodeCreatedId",
                table: "Tickets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    CustomerId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Country = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    Email = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "nvarchar(256)", maxLength: 256, nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.CustomerId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CustomerId",
                table: "Tickets",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_PromoCodeCreatedId",
                table: "Tickets",
                column: "PromoCodeCreatedId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_PromoCodeUsedId",
                table: "Tickets",
                column: "PromoCodeUsedId",
                unique: true,
                filter: "[PromoCodeUsedId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_Email",
                table: "Customers",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_Customers_CustomerId",
                table: "Tickets",
                column: "CustomerId",
                principalTable: "Customers",
                principalColumn: "CustomerId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_PromoCodes_PromoCodeCreatedId",
                table: "Tickets",
                column: "PromoCodeCreatedId",
                principalTable: "PromoCodes",
                principalColumn: "PromoCodeId",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_PromoCodes_PromoCodeUsedId",
                table: "Tickets",
                column: "PromoCodeUsedId",
                principalTable: "PromoCodes",
                principalColumn: "PromoCodeId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
