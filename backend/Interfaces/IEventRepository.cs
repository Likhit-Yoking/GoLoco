using System.Collections.Generic;
using System.Threading.Tasks;
using OnlineEventTicketManagement.Models;

namespace OnlineEventTicketManagement.Interfaces
{
    public interface IEventRepository : IGenericRepository<Event>
    {
        Task<Event?> GetEventWithTicketsAsync(int id);
        Task<IEnumerable<Event>> GetAllEventsWithOrganizersAsync();
        Task<Event?> GetEventWithOrganizerAsync(int id);
    }
}
