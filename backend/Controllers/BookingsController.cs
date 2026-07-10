using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnlineEventTicketManagement.DTOs;
using OnlineEventTicketManagement.Interfaces;

namespace OnlineEventTicketManagement.Controllers
{
    public class BookingsController : BaseApiController
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        /// <summary>
        /// GET /api/bookings
        /// Returns all bookings. Restricted to Organizers for admin oversight.
        /// </summary>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        /// <summary>
        /// GET /api/bookings/my
        /// Returns bookings for the authenticated user only.
        /// </summary>
        [HttpGet("my")]
        [Authorize]
        public async Task<IActionResult> GetMyBookings()
        {
            try
            {
                int currentUserId = GetCurrentUserId();
                var bookings = await _bookingService.GetBookingsForUserAsync(currentUserId);
                return Ok(bookings);
            }
            catch (UnauthorizedAccessException ex)
            {
                return StatusCode(403, new { message = ex.Message });
            }
        }

        /// <summary>
        /// GET /api/bookings/{id}
        /// Returns a specific booking by ID.
        /// Any authenticated user can call this endpoint.
        /// </summary>
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetBooking(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            if (booking == null) return NotFound(new { message = $"Booking with ID {id} was not found." });
            return Ok(booking);
        }

        /// <summary>
        /// POST /api/bookings
        /// Creates a new booking for the authent   icated Attendee.
        /// The UserId is extracted from the JWT token claim,
        /// so it cannot be spoofed by the client.
        /// </summary>
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                int currentUserId = GetCurrentUserId();
                var booking = await _bookingService.CreateBookingAsync(createBookingDto, currentUserId);
                return CreatedAtAction(nameof(GetBooking), new { id = booking.Id }, booking);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the booking.", details = ex.Message });
            }
        }

        /// <summary>
        /// Private helper: extracts the authenticated user's ID from JWT claims.
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
