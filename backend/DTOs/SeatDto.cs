namespace OnlineEventTicketManagement.DTOs
{
    /// <summary>
    /// DTO returned when querying seat availability for an event's ticket type.
    /// </summary>
    public class SeatDto
    {
        public int Id { get; set; }
        public string SeatNumber { get; set; } = string.Empty;
        public bool IsReserved { get; set; }
        public int TicketTypeId { get; set; }
        public string TicketTypeName { get; set; } = string.Empty;
    }
}
