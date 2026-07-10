using System.ComponentModel.DataAnnotations;

namespace OnlineEventTicketManagement.Models
{
    public class Seat : BaseEntity
    {
        [Required]
        [StringLength(20)]
        public string SeatNumber { get; set; } = string.Empty; // e.g. "A-12"

        public bool IsReserved { get; set; }

        // Foreign Key: One ticket type has many seats
        [Required]
        public int TicketTypeId { get; set; }

        // Foreign Key: One booking can contain many reserved seats (nullable if unbooked)
        public int? BookingId { get; set; }

        // Navigation properties
        public TicketType TicketType { get; set; } = null!;
        public Booking? Booking { get; set; }
    }
}
