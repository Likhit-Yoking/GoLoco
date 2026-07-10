using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnlineEventTicketManagement.Models
{
    public class User : BaseEntity
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Role { get; set; } = "Attendee"; // e.g., "Organizer", "Attendee", "Admin"

        // Navigation properties
        
        // Relationship: One organizer (User) creates many events
        public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();

        // Relationship: One attendee (User) can make many bookings
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}
