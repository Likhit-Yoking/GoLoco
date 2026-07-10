using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace OnlineEventTicketManagement.Interfaces
{
    /// <summary>
    /// Abstraction over Azure Blob Storage for uploading, replacing, and deleting event images.
    /// </summary>
    public interface IBlobStorageService
    {
        /// <summary>Uploads an image and returns its public Blob URL.</summary>
        Task<string> UploadImageAsync(IFormFile file, string blobName);

        /// <summary>Deletes a blob by its full URL. No-ops if the URL is null/empty.</summary>
        Task DeleteImageAsync(string? blobUrl);
    }
}
