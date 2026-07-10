using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OnlineEventTicketManagement.Models
{
    public class TicketType : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; } = string.Empty; // e.g. "VIP", "General Admission"

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        [Range(0.0, double.MaxValue)]
        public decimal Price { get; set; }

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        // Foreign Key: One event has many ticket types
        [Required]
        public int EventId { get; set; }
        
        // Navigation properties
        public Event Event { get; set; } = null!;

        // Relationship: One ticket type has many seats
        public ICollection<Seat> Seats { get; set; } = new List<Seat>();
    }
}
