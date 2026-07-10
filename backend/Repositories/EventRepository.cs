using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OnlineEventTicketManagement.Data;
using OnlineEventTicketManagement.Interfaces;
using OnlineEventTicketManagement.Models;

namespace OnlineEventTicketManagement.Repositories
{
    public class EventRepository : GenericRepository<Event>, IEventRepository
    {
        public EventRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<Event?> GetEventWithTicketsAsync(int id)
        {
            return await _context.Events
                .Include(e => e.TicketTypes)
                    .ThenInclude(tt => tt.Seats)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<IEnumerable<Event>> GetAllEventsWithOrganizersAsync()
        {
            return await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.TicketTypes)
                .ToListAsync();
        }

        public async Task<Event?> GetEventWithOrganizerAsync(int id)
        {
            return await _context.Events
                .Include(e => e.Organizer)
                .Include(e => e.TicketTypes)
                .FirstOrDefaultAsync(e => e.Id == id);
        }
    }
}
