import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusCircle, BarChart3, Users, DollarSign, Star, Calendar, MapPin, 
  Trash2, Sparkles, CheckCircle2, AlertCircle, Image as ImageIcon, ArrowLeft
} from 'lucide-react';
import styles from './OrganizerPortal.module.css';

export default function OrganizerPortal({ eventList, setEventList, bookedTickets }) {
  // Form states
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('GoLoco Live');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('19:00 - 22:00');
  const [location, setLocation] = useState('Mumbai');
  const [category, setCategory] = useState('Music');
  const [price, setPrice] = useState('₹1000');
  const [isFree, setIsFree] = useState(false);
  const [totalSeats, setTotalSeats] = useState(150);
  const [description, setDescription] = useState('');
  const [imagePreset, setImagePreset] = useState('music');
  const [customImage, setCustomImage] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  // Image Presets mapping
  const presets = {
    music: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800",
    tech: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
    food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=800",
    sports: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    comedy: "https://images.unsplash.com/photo-1585699324551-f6c309eed262?auto=format&fit=crop&q=80&w=800",
    workshop: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800"
  };

  // 1. Calculate Analytics Dynamic Metrics
  const metrics = React.useMemo(() => {
    // Total Revenue calculation
    let revenue = 0;
    let ticketsCount = 0;
    
    bookedTickets.forEach(booking => {
      ticketsCount += booking.quantity;
      if (booking.amount !== 'Free') {
        // Strip out non-numeric characters for calculation
        const numAmount = parseFloat(booking.amount.replace(/[^0-9.]/g, '')) || 0;
        // The booking amount contains the booking fee (e.g. 49), let's subtract the booking fee per order or calculate base revenue
        // Let's assume booking.amount is the total. Let's calculate base price * quantity:
        const basePrice = parseFloat(booking.event.price.replace(/[^0-9.]/g, '')) || 0;
        revenue += basePrice * booking.quantity;
      }
    });

    // Mock initial stats to look full
    const totalListedEvents = eventList.length;
    const initialTicketsSold = 1845;
    const initialRevenue = 245000;
    
    // Average rating
    const totalRating = eventList.reduce((acc, curr) => acc + curr.rating, 0);
    const avgRating = totalListedEvents > 0 ? (totalRating / totalListedEvents).toFixed(1) : "0.0";

    return {
      listedEvents: totalListedEvents,
      ticketsSold: initialTicketsSold + ticketsCount,
      revenue: initialRevenue + revenue,
      avgRating: avgRating
    };
  }, [eventList, bookedTickets]);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim() || !date.trim() || !description.trim()) {
      setFormError('Please fill out all required fields (Title, Date, and Description).');
      return;
    }

    const priceVal = isFree ? 'Free' : (price.startsWith('₹') ? price : `₹${price}`);
    const finalImage = customImage.trim() !== '' ? customImage : presets[imagePreset];

    // Create the new event object
    const newEvent = {
      id: Date.now(), // Unique ID
      title: title,
      image: finalImage,
      date: new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      time: time,
      location: location,
      category: category,
      price: priceVal,
      seatsLeft: totalSeats,
      totalSeats: totalSeats,
      rating: 5.0, // New host events start with a solid 5 stars
      description: description,
      organizer: organizer,
      type: location === 'Remote' ? 'Online' : 'In-Person',
      trending: false,
      startsInDays: Math.max(2, Math.floor(Math.random() * 25) + 3) // Mock relative starts value
    };

    setEventList(prev => [newEvent, ...prev]);
    setFormSuccess(true);
    
    // Reset Form fields
    setTitle('');
    setDescription('');
    setDate('');
    setPrice('₹1000');
    setIsFree(false);
    setCustomImage('');

    setTimeout(() => {
      setFormSuccess(false);
    }, 4000);
  };

  const handleDeleteEvent = (id) => {
    if (window.confirm('Are you sure you want to cancel and remove this event? All active attendee listings will be lost.')) {
      setEventList(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Dashboard Top Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <span className={styles.badge}><BarChart3 size={12} /> HOST CONTROL CENTER</span>
          <h1>Organizer Dashboard</h1>
          <p>Monitor event performance, oversee attendee registration lists, and publish new experiences to the platform.</p>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className={styles.analyticsGrid}>
        <div className={`${styles.metricCard} glass-card`}>
          <div className={styles.metricHeader}>
            <span>Listed Events</span>
            <PlusCircle className={styles.metricIconPurple} size={20} />
          </div>
          <div className={styles.metricValue}>{metrics.listedEvents}</div>
          <div className={styles.metricSubtext}>Currently active events</div>
        </div>

        <div className={`${styles.metricCard} glass-card`}>
          <div className={styles.metricHeader}>
            <span>Total Tickets Sold</span>
            <Users className={styles.metricIconBlue} size={20} />
          </div>
          <div className={styles.metricValue}>{metrics.ticketsSold.toLocaleString()}</div>
          <div className={styles.metricSubtext}>+ {bookedTickets.reduce((a,c)=>a+c.quantity, 0)} sold this session</div>
        </div>

        <div className={`${styles.metricCard} glass-card`}>
          <div className={styles.metricHeader}>
            <span>Estimated Revenue</span>
            <DollarSign className={styles.metricIconGreen} size={20} />
          </div>
          <div className={styles.metricValue}>₹{metrics.revenue.toLocaleString()}</div>
          <div className={styles.metricSubtext}>Base ticket sales (platform fees excl.)</div>
        </div>

        <div className={`${styles.metricCard} glass-card`}>
          <div className={styles.metricHeader}>
            <span>Average Rating</span>
            <Star className={styles.metricIconGold} size={20} fill="#FBBF24" stroke="#FBBF24" />
          </div>
          <div className={styles.metricValue}>{metrics.avgRating} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ 5.0</span></div>
          <div className={styles.metricSubtext}>Based on user feedback logs</div>
        </div>
      </div>

      <div className={styles.panelGrid}>
        {/* Left Panel: Event Creation Form */}
        <div className={`${styles.formPanel} glass-card`}>
          <div className={styles.panelHeader}>
            <PlusCircle className={styles.panelHeaderIcon} size={22} />
            <h2>Publish New Event</h2>
          </div>

          <form onSubmit={handleCreateEvent} className={styles.eventForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="title">Event Title <span className={styles.required}>*</span></label>
              <input 
                id="title"
                type="text" 
                placeholder="e.g. Sunburn Beach Festival" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="organizer">Organizer Name</label>
                <input 
                  id="organizer"
                  type="text" 
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="category">Category</label>
                <select 
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Music">Music</option>
                  <option value="Tech">Tech</option>
                  <option value="Food">Food</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Comedy">Comedy</option>
                  <option value="Festival">Festival</option>
                  <option value="Education">Education</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="date">Date <span className={styles.required}>*</span></label>
                <input 
                  id="date"
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="time">Time Slot</label>
                <input 
                  id="time"
                  type="text" 
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 18:00 - 21:30"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="location">Location / City</label>
                <select 
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="Mumbai">Mumbai</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Pune">Pune</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Remote">Online (Remote)</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="capacity">Total Capacity</label>
                <input 
                  id="capacity"
                  type="number" 
                  value={totalSeats}
                  onChange={(e) => setTotalSeats(parseInt(e.target.value) || 100)}
                  min="10"
                />
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.inputGroup} style={{flex: 2}}>
                <label htmlFor="price">Ticket Price</label>
                <input 
                  id="price"
                  type="text" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. ₹799"
                  disabled={isFree}
                />
              </div>

              <div className={styles.checkboxGroup}>
                <input 
                  id="isFree"
                  type="checkbox" 
                  checked={isFree}
                  onChange={(e) => setIsFree(e.target.checked)}
                />
                <label htmlFor="isFree">This event is Free</label>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Event Cover Image</label>
              <div className={styles.presetContainer}>
                {Object.keys(presets).map((key) => (
                  <button
                    key={key}
                    type="button"
                    className={`${styles.presetBtn} ${imagePreset === key && !customImage ? styles.presetActive : ''}`}
                    onClick={() => {
                      setImagePreset(key);
                      setCustomImage('');
                    }}
                  >
                    <span className={styles.presetText}>{key.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              <div className={styles.customUrlInput}>
                <ImageIcon size={16} className={styles.urlIcon} />
                <input 
                  type="text" 
                  placeholder="Or paste custom image Unsplash URL..." 
                  value={customImage}
                  onChange={(e) => setCustomImage(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="description">Event Description <span className={styles.required}>*</span></label>
              <textarea 
                id="description"
                rows="4" 
                placeholder="Give a summary of your event features, VIP upgrades, special attendees, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <AnimatePresence>
              {formError && (
                <motion.div 
                  className={styles.errorBanner}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <AlertCircle size={18} />
                  <span>{formError}</span>
                </motion.div>
              )}

              {formSuccess && (
                <motion.div 
                  className={styles.successBanner}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <CheckCircle2 size={18} />
                  <span>Event created and listed successfully!</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" className={styles.submitBtn}>
              <PlusCircle size={20} />
              <span>List Event Live</span>
            </button>
          </form>
        </div>

        {/* Right Panel: Listings Manager */}
        <div className={`${styles.listingsPanel} glass-card`}>
          <div className={styles.panelHeader}>
            <Users className={styles.panelHeaderIcon} size={22} />
            <h2>Your Listed Events ({eventList.length})</h2>
          </div>

          <div className={styles.listingsTableWrapper}>
            {eventList.length > 0 ? (
              <div className={styles.listingsList}>
                {eventList.map((event) => {
                  const seatsSold = event.totalSeats - event.seatsLeft;
                  const percentSold = ((seatsSold / event.totalSeats) * 100);
                  
                  return (
                    <div key={event.id} className={styles.listingRow}>
                      <img src={event.image} alt={event.title} className={styles.listingImg} />
                      <div className={styles.listingInfo}>
                        <div className={styles.listingMain}>
                          <h3>{event.title}</h3>
                          <span className={styles.listingCategory}>{event.category}</span>
                        </div>
                        <div className={styles.listingMeta}>
                          <div className={styles.listingMetaItem}>
                            <Calendar size={12} />
                            <span>{event.date}</span>
                          </div>
                          <div className={styles.listingMetaItem}>
                            <MapPin size={12} />
                            <span>{event.location}</span>
                          </div>
                          <div className={styles.listingPrice}>{event.price}</div>
                        </div>

                        {/* Occupancy tracker */}
                        <div className={styles.occupancyContainer}>
                          <div className={styles.occupancyHeader}>
                            <span>Tickets Sold</span>
                            <span><strong>{seatsSold}</strong> / {event.totalSeats} ({percentSold.toFixed(0)}%)</span>
                          </div>
                          <div className={styles.barBg}>
                            <div 
                              className={styles.barFill} 
                              style={{ width: `${percentSold}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteEvent(event.id)}
                        aria-label="Delete event"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyListings}>
                <AlertCircle size={32} />
                <p>No active event listings found.</p>
                <span>Use the form on the left to publish your first event!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
