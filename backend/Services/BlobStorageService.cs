using System;
using System.IO;
using System.Threading.Tasks;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using OnlineEventTicketManagement.Interfaces;

namespace OnlineEventTicketManagement.Services
{
    /// <summary>
    /// Wraps Azure Blob Storage operations for event images.
    /// Reads connection string and container name from AzureBlobStorage config section.
    /// </summary>
    public class BlobStorageService : IBlobStorageService
    {
        private readonly BlobContainerClient _containerClient;

        private static bool _isInitialized = false;

        public BlobStorageService(IConfiguration configuration)
        {
            string connectionString = configuration["AzureBlobStorage:ConnectionString"]
                ?? throw new InvalidOperationException("AzureBlobStorage:ConnectionString is not configured.");
            string containerName = configuration["AzureBlobStorage:ContainerName"]
                ?? throw new InvalidOperationException("AzureBlobStorage:ContainerName is not configured.");

            _containerClient = new BlobContainerClient(connectionString, containerName);

            // Ensure the container exists
            // Do this only once per application lifetime to prevent severe performance degradation on every scoped request
            if (!_isInitialized)
            {
                _containerClient.CreateIfNotExists();
                _isInitialized = true;
            }
        }

        /// <summary>
        /// Uploads an image file to Blob Storage and returns the public URL.
        /// blobName should be unique per event (e.g. "events/{eventId}/poster.jpg").
        /// </summary>
        public async Task<string> UploadImageAsync(IFormFile file, string blobName)
        {
            BlobClient blobClient = _containerClient.GetBlobClient(blobName);

            await using Stream stream = file.OpenReadStream();
            await blobClient.UploadAsync(stream, new BlobHttpHeaders
            {
                ContentType = file.ContentType   // Preserves MIME type so browsers can render it
            });

            return blobClient.Uri.ToString();
        }

        /// <summary>
        /// Deletes a blob by its absolute URL.
        /// Silently no-ops if blobUrl is null or empty.
        /// </summary>
        public async Task DeleteImageAsync(string? blobUrl)
        {
            if (string.IsNullOrWhiteSpace(blobUrl)) return;

            // Extract the blob name from the full URL
            // E.g. https://ethnusstorage.blob.core.windows.net/event-images/events/5/poster.jpg
            //      → "events/5/poster.jpg"
            Uri uri = new Uri(blobUrl);
            string blobName = uri.AbsolutePath.TrimStart('/');

            // Remove the container name prefix that is part of the path
            int slashIndex = blobName.IndexOf('/');
            if (slashIndex >= 0)
                blobName = blobName[(slashIndex + 1)..];

            BlobClient blobClient = _containerClient.GetBlobClient(blobName);
            await blobClient.DeleteIfExistsAsync();
        }
    }
}
