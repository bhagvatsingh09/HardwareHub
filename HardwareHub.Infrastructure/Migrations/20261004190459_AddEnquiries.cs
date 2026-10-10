using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HardwareHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEnquiries : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Enquiries",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "Enquiries",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Enquiries",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Enquiries_ProductId",
                table: "Enquiries",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_Enquiries_Products_ProductId",
                table: "Enquiries",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Enquiries_Products_ProductId",
                table: "Enquiries");

            migrationBuilder.DropIndex(
                name: "IX_Enquiries_ProductId",
                table: "Enquiries");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "Enquiries");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Enquiries");

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Enquiries",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }
    }
}
