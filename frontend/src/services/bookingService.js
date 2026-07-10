import { request } from './apiClient';

/**
 * Service to manage ticket bookings and reservations.
 */
export const bookingService = {
  /**
   * Fetch all bookings for the currently authenticated user.
   */
  async getUserBookings() {
    return request('/bookings');
  },

  /**
   * Retrieve specific booking information by its ID.
   * @param {string|number} id - Booking ID
   */
  async getBookingById(id) {
    return request(`/bookings/${id}`);
  },

  /**
   * Book tickets for an event.
   * @param {Object} bookingData - { eventId, ticketQuantity }
   */
  async createBooking(bookingData) {
    return request('/bookings', {
      method: 'POST',
      body: bookingData,
    });
  },

  /**
   * Cancel an existing booking.
   * @param {string|number} id - Booking ID
   */
  async cancelBooking(id) {
    return request(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  }
};

export default bookingService;
