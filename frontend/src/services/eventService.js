import { request } from './apiClient';

/**
 * Service to manage event CRUD operations and searches.
 * All write operations (POST, PUT, DELETE) require an Organizer JWT,
 * which apiClient automatically attaches from localStorage.
 */
export const eventService = {
  /**
   * Fetch all events (public endpoint — no auth required).
   * @param {Object} filters - Optional query parameters
   */
  async getAllEvents(filters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/events${queryString}`);
  },

  /**
   * Fetch events belonging to a specific organizer.
   * The backend GET /api/events is a public endpoint that returns all events.
   * We filter client-side by organizerId to show only the logged-in organizer's events.
   * @param {number} organizerId - The ID of the current organizer from JWT
   */
  async getMyEvents(organizerId) {
    const allEvents = await request('/events');
    if (!Array.isArray(allEvents)) return [];
    return allEvents.filter(e => e.organizerId === organizerId);
  },

  /**
   * Fetch event details by ID.
   * @param {string|number} id - Event ID
   */
  async getEventById(id) {
    return request(`/events/${id}`);
  },

  /**
   * Fetch ticket types for a specific event.
   * @param {string|number} id - Event ID
   */
  async getEventTicketTypes(id) {
    return request(`/events/${id}/ticket-types`).catch(() => {
      // Temporary fallback in case backend hasn't deployed this endpoint yet
      return [
        { id: 1, name: "General Admission", price: 1000, capacity: 100 },
        { id: 2, name: "VIP Pass", price: 3000, capacity: 20 }
      ];
    });
  },

  /**
   * Fetch all seats for a specific event (for seat map).
   * @param {string|number} id - Event ID
   * @returns {Promise<SeatDto[]>} Array of { id, seatNumber, isReserved, ticketTypeId, ticketTypeName }
   */
  async getEventSeats(id) {
    return request(`/events/${id}/seats`);
  },

  /**
   * Create a new event. (Requires Organizer JWT)
   * Maps to POST /api/events with CreateEventDto body.
   * @param {Object} eventData - { title, description, date (ISO), location, totalCapacity }
   */
  async createEvent(eventData) {
    return request('/events', {
      method: 'POST',
      body: eventData,
    });
  },

  /**
   * Update an existing event. (Requires Organizer JWT; must own the event)
   * Maps to PUT /api/events/{id} with CreateEventDto body.
   * @param {string|number} id - Event ID to update
   * @param {Object} eventData - { title, description, date (ISO), location, totalCapacity }
   */
  async updateEvent(id, eventData) {
    return request(`/events/${id}`, {
      method: 'PUT',
      body: eventData,
    });
  },

  /**
   * Delete an event from the platform. (Requires Organizer JWT; must own the event)
   * Maps to DELETE /api/events/{id}.
   * @param {string|number} id - Event ID to delete
   */
  async deleteEvent(id) {
    return request(`/events/${id}`, {
      method: 'DELETE',
    });
  },
};

export default eventService;
