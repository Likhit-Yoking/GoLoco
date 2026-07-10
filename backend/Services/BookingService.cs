using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OnlineEventTicketManagement.DTOs;
using OnlineEventTicketManagement.Interfaces;
using OnlineEventTicketManagement.Models;
using QRCoder;

namespace OnlineEventTicketManagement.Services
{
    /// <summary>
    /// Implements the booking business logic layer.
    /// Validates event and ticket type existence, calculates pricing, creates the booking entity,
    /// and maps the persisted entity to a safe DTO for the HTTP response.
    /// </summary>
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IEventRepository _eventRepository;

        public BookingService(IBookingRepository bookingRepository, IEventRepository eventRepository)
        {
            _bookingRepository = bookingRepository;
            _eventRepository = eventRepository;
        }

        /// <summary>
        /// Returns all bookings with user, event, and ticket type details.
        /// </summary>
        public async Task<IEnumerable<BookingDto>> GetAllBookingsAsync()
        {
            var bookings = await _bookingRepository.GetAllWithDetailsAsync();
            return bookings.Select(MapToDto);
        }

        /// <summary>
        /// Returns a single booking by ID with user, event, and ticket type details.
        /// </summary>
        public async Task<BookingDto?> GetBookingByIdAsync(int id)
        {
            var booking = await _bookingRepository.GetByIdWithDetailsAsync(id);
            return booking == null ? null : MapToDto(booking);
        }

        /// <summary>
        /// Returns bookings for a specific user.
        /// </summary>
        public async Task<IEnumerable<BookingDto>> GetBookingsForUserAsync(int userId)
        {
            var bookings = await _bookingRepository.GetBookingsByUserIdAsync(userId);
            return bookings.Select(MapToDto);
        }

        /// <summary>
        /// Creates a new booking for the authenticated user.
        /// Validates the event, ensures the selected ticket type belongs to the event,
        /// validates and assigns specific seats if requested,
        /// calculates the total price dynamically, and persists the booking.
        /// </summary>
        public async Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto, int userId)
        {
            // 1. Fetch the Event including its TicketTypes and their Seats
            var @event = await _eventRepository.GetEventWithTicketsAsync(createBookingDto.EventId);
            if (@event == null)
            {
                throw new KeyNotFoundException($"Event with ID {createBookingDto.EventId} was not found.");
            }

            // 2. Locate the selected TicketType within the event's collection
            var ticketType = @event.TicketTypes.FirstOrDefault(tt => tt.Id == createBookingDto.TicketTypeId);
            if (ticketType == null)
            {
                throw new ArgumentException($"TicketType with ID {createBookingDto.TicketTypeId} does not belong to Event with ID {createBookingDto.EventId}.");
            }

            // 3. Validate seat availability to prevent overbooking
            if (ticketType.Capacity < createBookingDto.NumberOfTickets)
            {
                throw new ArgumentException(
                    ticketType.Capacity <= 0
                        ? $"TicketType '{ticketType.Name}' is sold out."
                        : $"Not enough seats available for '{ticketType.Name}'. Requested: {createBookingDto.NumberOfTickets}, Available: {ticketType.Capacity}");
            }

            // 4. Reduce available seats on the TicketType only.
            ticketType.Capacity -= createBookingDto.NumberOfTickets;

            // 5. Calculate the total price based on ticket tier price and quantity
            decimal totalPrice = ticketType.Price * createBookingDto.NumberOfTickets;

            // 6. Build the Booking entity
            var booking = new Booking
            {
                UserId = userId,
                EventId = createBookingDto.EventId,
                TicketTypeId = createBookingDto.TicketTypeId,
                NumberOfTickets = createBookingDto.NumberOfTickets,
                BookingDate = DateTime.UtcNow,
                TotalPrice = totalPrice,
                Status = "Confirmed",
                CreatedAt = DateTime.UtcNow
            };

            // 7. Validate and assign specific seats if requested
            if (createBookingDto.SeatNumbers != null && createBookingDto.SeatNumbers.Count > 0)
            {
                if (createBookingDto.SeatNumbers.Count != createBookingDto.NumberOfTickets)
                {
                    throw new ArgumentException(
                        $"SeatNumbers count ({createBookingDto.SeatNumbers.Count}) must match NumberOfTickets ({createBookingDto.NumberOfTickets}).");
                }

                // Check for duplicate seat numbers in the request
                var distinctSeats = createBookingDto.SeatNumbers.Distinct().ToList();
                if (distinctSeats.Count != createBookingDto.SeatNumbers.Count)
                {
                    throw new ArgumentException("Duplicate seat numbers are not allowed.");
                }

                foreach (var seatNumber in createBookingDto.SeatNumbers)
                {
                    var seat = ticketType.Seats.FirstOrDefault(s => s.SeatNumber == seatNumber);
                    if (seat == null)
                    {
                        throw new ArgumentException($"Seat '{seatNumber}' does not exist for TicketType '{ticketType.Name}'.");
                    }
                    if (seat.IsReserved)
                    {
                        throw new ArgumentException($"Seat '{seatNumber}' is already reserved.");
                    }

                    // Reserve the seat and link it to this booking
                    seat.IsReserved = true;
                    seat.Booking = booking;
                }
            }

            // 8. Persist booking + seat assignments in one transaction
            await _bookingRepository.AddAsync(booking);
            await _bookingRepository.SaveChangesAsync();

            // 9. Re-fetch with all navigation details for DTO representation
            var savedBooking = await _bookingRepository.GetByIdWithDetailsAsync(booking.Id);
            return MapToDto(savedBooking!);
        }

        /// <summary>
        /// Private helper: maps a Booking entity to a BookingDto.
        /// </summary>
        private static BookingDto MapToDto(Booking b) => new BookingDto
        {
            Id = b.Id,
            BookingDate = b.BookingDate,
            TotalPrice = b.TotalPrice,
            Status = b.Status,
            UserId = b.UserId,
            UserName = b.User?.Name ?? "Unknown",
            EventId = b.EventId,
            EventTitle = b.Event?.Title ?? "Unknown",
            EventDate = b.Event?.Date ?? DateTime.MinValue,
            EventLocation = b.Event?.Location ?? "Unknown",
            EventImageUrl = b.Event?.ImageUrl,
            TicketTypeId = b.TicketTypeId,
            TicketTypeName = b.TicketType?.Name ?? "Unknown",
            TicketPrice = b.TicketType?.Price ?? 0.00m,
            NumberOfTickets = b.NumberOfTickets,
            SelectedSeats = b.Seats?.Where(s => s.IsReserved).Select(s => s.SeatNumber).ToList() ?? new List<string>(),
            QrCodeDataUrl = GenerateQrCode(b)
        };

        /// <summary>
        /// Generates a lightweight PNG QR Code containing booking information as a Base64 Data URI.
        /// </summary>
        private static string GenerateQrCode(Booking b)
        {
            var selectedSeats = b.Seats?.Where(s => s.IsReserved).Select(s => s.SeatNumber).ToList() ?? new List<string>();
            string seatsStr = selectedSeats.Any() ? string.Join(", ", selectedSeats) : "None";
            
            // Encode the requested fields
            string payload = $"BookingId: {b.Id}\nEventId: {b.EventId}\nUserId: {b.UserId}\nSeats: {seatsStr}";

            using var qrGenerator = new QRCodeGenerator();
            using var qrCodeData = qrGenerator.CreateQrCode(payload, QRCodeGenerator.ECCLevel.Q);
            
            // PngByteQRCode is native to QRCoder and doesn't require System.Drawing.Common
            using var qrCode = new PngByteQRCode(qrCodeData);
            
            // 5 is the pixel size of each module (square)
            byte[] qrCodeImage = qrCode.GetGraphic(5);
            
            return $"data:image/png;base64,{Convert.ToBase64String(qrCodeImage)}";
        }
    }
}
