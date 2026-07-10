using System.Collections.Generic;
using System.Threading.Tasks;
using OnlineEventTicketManagement.Models;

namespace OnlineEventTicketManagement.Interfaces
{
    /// <summary>
    /// Extends the generic repository with booking-specific data access methods
    /// that require eager-loading of User and Event navigation properties.
    /// </summary>
    public interface IBookingRepository : IGenericRepository<Booking>
    {
        Task<IEnumerable<Booking>> GetAllWithDetailsAsync();
        Task<Booking?> GetByIdWithDetailsAsync(int id);
        Task<IEnumerable<Booking>> GetBookingsByUserIdAsync(int userId);
        Task<IEnumerable<Booking>> GetBookingsByEventIdAsync(int eventId);
    }
}
