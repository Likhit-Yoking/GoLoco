using System.Threading.Tasks;
using OnlineEventTicketManagement.DTOs;

namespace OnlineEventTicketManagement.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
