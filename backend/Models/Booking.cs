using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineEventTicketManagement.Models
{
    public class Booking : BaseEntity
    {
        [Required]
        public DateTime BookingDate { get; set; } = DateTime.UtcNow;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.0, double.MaxValue)]
        public decimal TotalPrice { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending"; // e.g. "Pending", "Confirmed", "Cancelled"

        // Foreign Key: One attendee (User) can make many bookings
        [Required]
        public int UserId { get; set; }

        // Foreign Key: One event has many bookings
        [Required]
        public int EventId { get; set; }

        // Foreign Key: Link to the selected ticket category
        [Required]
        public int TicketTypeId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int NumberOfTickets { get; set; } = 1;

        // Navigation properties
        public User User { get; set; } = null!;
        public Event Event { get; set; } = null!;
        public TicketType TicketType { get; set; } = null!;
        
        // Relationship: One booking can contain many seats
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
