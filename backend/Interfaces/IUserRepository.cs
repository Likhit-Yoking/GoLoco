using System.Threading.Tasks;
using OnlineEventTicketManagement.Models;

namespace OnlineEventTicketManagement.Interfaces
{
    public interface IUserRepository : IGenericRepository<User>
    {
        Task<User?> GetByEmailAsync(string email);
    }
}
