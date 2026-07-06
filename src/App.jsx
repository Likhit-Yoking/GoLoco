import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingView from './components/LandingView';
import AttendeePortal from './components/AttendeePortal';
import OrganizerPortal from './components/OrganizerPortal';
import Footer from './components/Footer';
import { events } from './data/events';
import { Ticket, X, CheckCircle, ShieldCheck } from 'lucide-react';
import './App.css';

const initialFilters = {
  search: '',
  location: 'All Locations',
  date: 'All Dates',
  category: 'All Categories',
  price: 'All Prices',
  availability: 'all',
  sortBy: 'popular'
};

export default function App() {
  // Global States
  const [eventList, setEventList] = useState(events);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'attendee', 'organizer'
  const [bookedTickets, setBookedTickets] = useState([]);
  
  // Attendee Search Filters
  const [filters, setFilters] = useState(initialFilters);
  const [activeChip, setActiveChip] = useState('all');

  // Booking Modal States
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Sync quick filter chips with category selection
  const handleSetActiveChip = (value) => {
    setActiveChip(value);
    if (value === 'all') {
      setFilters(prev => ({ ...prev, category: 'All Categories' }));
    } else {
      const formattedCategory = value.charAt(0).toUpperCase() + value.slice(1);
      setFilters(prev => ({ ...prev, category: formattedCategory }));
    }
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
    setActiveChip('all');
  };

  const handleBookEvent = (event) => {
    // Lookup latest event details from state in case capacity changed
    const freshEvent = eventList.find(e => e.id === event.id) || event;
    setSelectedEvent(freshEvent);
    setTicketQuantity(1);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = () => {
    // 1. Decrement seat capacity in global list
    setEventList(prevList => prevList.map(e => {
      if (e.id === selectedEvent.id) {
        return {
          ...e,
          seatsLeft: Math.max(0, e.seatsLeft - ticketQuantity)
        };
      }
      return e;
    }));

    // 2. Append ticket receipt object to attendee wallet
    const ticketId = `GOLOCO-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      id: ticketId,
      event: selectedEvent,
      quantity: ticketQuantity,
      amount: selectedEvent.price === 'Free' ? 'Free' : `₹${((getNumericPrice(selectedEvent.price) * ticketQuantity) + (selectedEvent.price !== 'Free' ? 49.00 : 0)).toFixed(2)}`,
      date: selectedEvent.date,
      time: selectedEvent.time,
      location: selectedEvent.location
    };
    setBookedTickets(prev => [newBooking, ...prev]);

    // 3. Mark modal screen confirmed
    setBookingConfirmed(true);
  };

  const closeModal = () => {
    setSelectedEvent(null);
    setBookingConfirmed(false);
  };

  // Convert price string to integer value for sorting and pricing calculations
  const getNumericPrice = (priceStr) => {
    if (!priceStr || priceStr.toLowerCase().includes('free')) return 0;
    return parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
  };

  // Live filtering and sorting logic
  const filteredAndSortedEvents = useMemo(() => {
    let result = [...eventList];

    // 1. Filter by Search Query
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
      result = result.filter(e => 
        e.title.toLowerCase().includes(query) ||
        e.description.toLowerCase().includes(query) ||
        e.organizer.toLowerCase().includes(query)
      );
    }

    // 2. Filter by Location
    if (filters.location !== 'All Locations') {
      result = result.filter(e => e.location.toLowerCase() === filters.location.toLowerCase());
    }

    // 3. Filter by Category
    if (filters.category !== 'All Categories') {
      result = result.filter(e => e.category.toLowerCase() === filters.category.toLowerCase());
    }

    // 4. Filter by Date
    if (filters.date !== 'All Dates') {
      result = result.filter(e => {
        if (filters.date === 'Today') return e.startsInDays === 0 || e.startsInDays === 1;
        if (filters.date === 'Tomorrow') return e.startsInDays === 1 || e.startsInDays === 2;
        if (filters.date === 'This Weekend') return e.startsInDays <= 3;
        if (filters.date === 'This Month') return e.startsInDays <= 30;
        return true;
      });
    }

    // 5. Filter by Price
    if (filters.price !== 'All Prices') {
      result = result.filter(e => {
        const numeric = getNumericPrice(e.price);
        if (filters.price === 'Free') return numeric === 0;
        if (filters.price === 'Under ₹500') return numeric > 0 && numeric < 500;
        if (filters.price === '₹500–₹1000') return numeric >= 500 && numeric <= 1000;
        if (filters.price === '₹1000–₹3000') return numeric > 1000 && numeric <= 3000;
        if (filters.price === 'Premium') return numeric > 3000;
        return true;
      });
    }

    // 6. Filter by Availability
    if (filters.availability === 'available') {
      result = result.filter(e => e.seatsLeft > 0);
    } else if (filters.availability === 'soldout') {
      result = result.filter(e => e.seatsLeft === 0);
    }

    // 7. Sorting
    result.sort((a, b) => {
      const priceA = getNumericPrice(a.price);
      const priceB = getNumericPrice(b.price);

      switch (filters.sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-low':
          return priceA - priceB;
        case 'price-high':
          return priceB - priceA;
        case 'closest':
          return a.startsInDays - b.startsInDays;
        case 'seats':
          return b.seatsLeft - a.seatsLeft;
        case 'newest':
          return b.id - a.id;
        case 'popular':
        default:
          return (b.rating * 10 - b.startsInDays) - (a.rating * 10 - a.startsInDays);
      }
    });

    return result;
  }, [eventList, filters]);

  const totalPrice = selectedEvent ? getNumericPrice(selectedEvent.price) * ticketQuantity : 0;
  const bookingFee = selectedEvent && selectedEvent.price !== 'Free' ? 49.00 : 0;
  const latestSelectedEventInState = selectedEvent ? (eventList.find(e => e.id === selectedEvent.id) || selectedEvent) : null;

  return (
    <div className="app-container">
      {/* Background glow graphics */}
      <div className="bg-gradient-glow" />
      <div className="floating-gradients-container">
        <div className="glow-sphere sphere-1" />
        <div className="glow-sphere sphere-2" />
        <div className="glow-sphere sphere-3" />
      </div>

      {/* Navigation */}
      <Navbar currentView={currentView} setView={setCurrentView} />

      {/* Main Content with dynamic transitions */}
      <main style={{ marginTop: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          {currentView === 'landing' && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <LandingView 
                eventList={eventList} 
                setView={setCurrentView} 
                onBookEvent={handleBookEvent} 
              />
            </motion.div>
          )}

          {currentView === 'attendee' && (
            <motion.div
              key="attendee"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <AttendeePortal
                eventList={eventList}
                filters={filters}
                setFilters={setFilters}
                onResetFilters={handleResetFilters}
                filteredEvents={filteredAndSortedEvents}
                onBookEvent={handleBookEvent}
                activeChip={activeChip}
                setActiveChip={handleSetActiveChip}
                bookedTickets={bookedTickets}
                setView={setCurrentView}
              />
            </motion.div>
          )}

          {currentView === 'organizer' && (
            <motion.div
              key="organizer"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              <OrganizerPortal
                eventList={eventList}
                setEventList={setEventList}
                bookedTickets={bookedTickets}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Booking Drawer/Modal */}
      {selectedEvent && latestSelectedEventInState && (
        <div className="modal-overlay">
          <div className="modal-content glass-card">
            <button className="modal-close" onClick={closeModal} aria-label="Close modal">
              <X size={24} />
            </button>

            {!bookingConfirmed ? (
              <>
                <div className="modal-header">
                  <Ticket className="modal-icon" size={32} />
                  <h2>Select Tickets</h2>
                </div>
                
                <div className="event-summary">
                  <img src={selectedEvent.image} alt={selectedEvent.title} className="summary-img" />
                  <div>
                    <h3>{selectedEvent.title}</h3>
                    <p className="summary-details">{selectedEvent.date} &bull; {selectedEvent.time}</p>
                    <p className="summary-loc">{selectedEvent.location}</p>
                  </div>
                </div>

                <div className="booking-options">
                  <div className="ticket-tier">
                    <div>
                      <h4>General Admission</h4>
                      <p className="tier-desc">Standard access to all main stages and event activities.</p>
                    </div>
                    <div className="price-tag">{selectedEvent.price}</div>
                  </div>

                  <div className="quantity-selector">
                    <span>Number of Tickets:</span>
                    <div className="qty-controls">
                      <button 
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        disabled={ticketQuantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty-number">{ticketQuantity}</span>
                      <button 
                        onClick={() => setTicketQuantity(Math.min(latestSelectedEventInState.seatsLeft, ticketQuantity + 1))}
                        disabled={ticketQuantity >= latestSelectedEventInState.seatsLeft}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="billing-summary">
                    <div className="bill-row">
                      <span>Subtotal</span>
                      <span>{selectedEvent.price === 'Free' ? 'Free' : `₹${totalPrice.toFixed(2)}`}</span>
                    </div>
                    <div className="bill-row">
                      <span>Booking Fee</span>
                      <span>{selectedEvent.price === 'Free' ? 'Free' : `₹${bookingFee.toFixed(2)}`}</span>
                    </div>
                    <hr className="divider" />
                    <div className="bill-row total">
                      <span>Total Amount</span>
                      <span>{selectedEvent.price === 'Free' ? 'Free' : `₹${(totalPrice + bookingFee).toFixed(2)}`}</span>
                    </div>
                  </div>
                </div>

                <button 
                  className="confirm-btn" 
                  onClick={handleConfirmBooking}
                  disabled={latestSelectedEventInState.seatsLeft <= 0}
                  style={{ opacity: latestSelectedEventInState.seatsLeft <= 0 ? 0.5 : 1 }}
                >
                  {latestSelectedEventInState.seatsLeft <= 0 ? 'Sold Out' : 'Confirm & Pay Now'}
                </button>
                <div className="secure-checkout">
                  <ShieldCheck size={14} />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
              </>
            ) : (
              <div className="success-screen">
                <CheckCircle size={64} className="success-icon" />
                <h2>Booking Confirmed!</h2>
                <p className="success-message">
                  Thank you for booking with GoLoco. Your tickets have been sent to your email.
                </p>

                <div className="success-receipt">
                  <div className="receipt-row">
                    <span>Event</span>
                    <strong>{selectedEvent.title}</strong>
                  </div>
                  <div className="receipt-row">
                    <span>Date & Time</span>
                    <span>{selectedEvent.date} at {selectedEvent.time}</span>
                  </div>
                  <div className="receipt-row">
                    <span>Tickets Purchased</span>
                    <span>{ticketQuantity}x General Admission</span>
                  </div>
                  <div className="receipt-row">
                    <span>Amount Paid</span>
                    <span>{selectedEvent.price === 'Free' ? 'Free' : `₹${(totalPrice + bookingFee).toFixed(2)}`}</span>
                  </div>

                  <div className="qr-container">
                    <div className="qr-code">
                      <div className="qr-corner qr-tl"></div>
                      <div className="qr-corner qr-tr"></div>
                      <div className="qr-corner qr-bl"></div>
                      <div className="qr-dot dot-1"></div>
                      <div className="qr-dot dot-2"></div>
                      <div className="qr-dot dot-3"></div>
                      <div className="qr-dot dot-4"></div>
                    </div>
                    <span className="qr-label">TICKET ID: {bookedTickets[0]?.id || `GOLOCO-${Math.floor(100000 + Math.random() * 900000)}`}</span>
                  </div>
                </div>

                <button className="done-btn" onClick={closeModal}>
                  Back to Events
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

