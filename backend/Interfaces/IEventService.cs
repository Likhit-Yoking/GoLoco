using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using OnlineEventTicketManagement.DTOs;

namespace OnlineEventTicketManagement.Interfaces
{
    public interface IEventService
    {
        Task<IEnumerable<EventDto>> GetAllEventsAsync();
        Task<EventDto?> GetEventByIdAsync(int id);
        Task<IEnumerable<TicketTypeDto>> GetTicketTypesForEventAsync(int eventId);
        Task<IEnumerable<SeatDto>> GetSeatsForEventAsync(int eventId);
        Task<EventDto> CreateEventAsync(CreateEventDto createEventDto, int organizerId, IFormFile? image = null);
        Task<bool> UpdateEventAsync(int id, CreateEventDto updateEventDto, int organizerId, IFormFile? image = null);
        Task<bool> DeleteEventAsync(int id, int organizerId);
    }
}
