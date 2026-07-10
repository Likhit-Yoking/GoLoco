using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnlineEventTicketManagement.DTOs
{
    /// <summary>
    /// DTO for creating a new booking.
    /// The UserId is extracted from the JWT claim.
    /// Now includes TicketTypeId to select specific pricing tier.
    /// </summary>
    public class CreateBookingDto
    {
        [Required(ErrorMessage = "EventId is required")]
        public int EventId { get; set; }

        [Required(ErrorMessage = "TicketTypeId is required")]
        public int TicketTypeId { get; set; }

        [Range(1, 20, ErrorMessage = "You can book between 1 and 20 tickets at a time")]
        public int NumberOfTickets { get; set; } = 1;

        /// <summary>
        /// Optional list of seat numbers to reserve (e.g. ["A-1", "A-2"]).
        /// When provided, count must match NumberOfTickets.
        /// When omitted, booking proceeds without specific seat assignment.
        /// </summary>
        public List<string>? SeatNumbers { get; set; }
    }
}
