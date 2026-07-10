using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineEventTicketManagement.DTOs;
using OnlineEventTicketManagement.Interfaces;

namespace OnlineEventTicketManagement.Controllers
{
    public class EventsController : BaseApiController
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        /// <summary>
        /// Retrieve all events. (Public endpoint)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetEvents()
        {
            var events = await _eventService.GetAllEventsAsync();
            return Ok(events);
        }

        /// <summary>
        /// Retrieve a specific event by ID. (Public endpoint)
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEvent(int id)
        {
            var @event = await _eventService.GetEventByIdAsync(id);
            if (@event == null) return NotFound();
            return Ok(@event);
        }

        /// <summary>
        /// Retrieve ticket types for a specific event. (Public endpoint)
        /// </summary>
        [HttpGet("{id}/ticket-types")]
        public async Task<IActionResult> GetEventTicketTypes(int id)
        {
            var ticketTypes = await _eventService.GetTicketTypesForEventAsync(id);
            return Ok(ticketTypes);
        }

        /// <summary>
        /// Retrieve all seats for a specific event. (Public endpoint)
        /// </summary>
        [HttpGet("{id}/seats")]
        public async Task<IActionResult> GetEventSeats(int id)
        {
            var seats = await _eventService.GetSeatsForEventAsync(id);
            return Ok(seats);
        }

        /// <summary>
        /// Create a new event with an optional poster image. (Restricted to Organizers)
        /// Accepts multipart/form-data. TicketTypes use indexed form fields:
        ///   TicketTypes[0].Name, TicketTypes[0].Price, TicketTypes[0].Capacity, etc.
        /// </summary>
        [HttpPost]
        [Authorize(Roles = "Organizer")]
        public async Task<IActionResult> CreateEvent([FromForm] CreateEventDto createEventDto, IFormFile? image = null)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                int currentUserId = GetCurrentUserId();
                var createdEvent = await _eventService.CreateEventAsync(createEventDto, currentUserId, image);
                return CreatedAtAction(nameof(GetEvent), new { id = createdEvent.Id }, createdEvent);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the event.", details = ex.Message });
            }
        }

        /// <summary>
        /// Update an event. Supplying a new image replaces the old poster in Azure Blob Storage.
        /// (Restricted to Organizers; must own the event)
        /// Accepts multipart/form-data.
        /// </summary>
        [HttpPut("{id}")]
        [Authorize(Roles = "Organizer")]
        public async Task<IActionResult> UpdateEvent(int id, [FromForm] CreateEventDto updateEventDto, IFormFile? image = null)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                int currentUserId = GetCurrentUserId();
                var result = await _eventService.UpdateEventAsync(id, updateEventDto, currentUserId, image);
                if (!result) return NotFound();

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the event.", details = ex.Message });
            }
        }

        /// <summary>
        /// Delete an event. (Restricted to Organizers; must own the event)
        /// </summary>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Organizer")]
        public async Task<IActionResult> DeleteEvent(int id)
        {
            try
            {
                int currentUserId = GetCurrentUserId();
                var result = await _eventService.DeleteEventAsync(id, currentUserId);
                if (!result) return NotFound();

                return NoContent();
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the event.", details = ex.Message });
            }
        }

        /// <summary>
        /// Helper to extract the authenticated user ID from JWT claims.
        /// </summary>
        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("You must be logged in to perform this action.");
            }
            return userId;
        }
    }
}
