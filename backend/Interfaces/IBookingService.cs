using System.Collections.Generic;
using System.Threading.Tasks;
using OnlineEventTicketManagement.DTOs;

namespace OnlineEventTicketManagement.Interfaces
{
    /// <summary>
    /// Defines the business logic contract for the Booking module.
    /// Controllers depend on this abstraction, never on the concrete service,
    /// keeping the layers loosely coupled and testable.
    /// </summary>
    public interface IBookingService
    {
        Task<IEnumerable<BookingDto>> GetAllBookingsAsync();
        Task<BookingDto?> GetBookingByIdAsync(int id);
        Task<IEnumerable<BookingDto>> GetBookingsForUserAsync(int userId);
        Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto, int userId);
    }
}
