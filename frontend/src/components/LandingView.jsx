import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Star, Users, MapPin, CalendarDays, ArrowRight, ShieldCheck, Ticket, Calendar, PlusCircle, BarChart3 } from 'lucide-react';
import Hero from './Hero';
import EventCard from './EventCard';
import styles from './LandingView.module.css';

export default function LandingView({ eventList, onBookEvent }) {
  const navigate = useNavigate();
  // Get top 3 trending events or fallback to first 3
  const trendingEvents = React.useMemo(() => {
    const trendList = eventList.filter(e => e.trending);
    return trendList.length > 0 ? trendList.slice(0, 3) : eventList.slice(0, 3);
  }, [eventList]);

  const stats = [
    { id: 1, icon: <CalendarDays size={24} />, number: "250+", label: "Live Events" },
    { id: 2, icon: <Users size={24} />, number: "15K+", label: "Tickets Sold" },
    { id: 3, icon: <MapPin size={24} />, number: "120+", label: "Cities" },
    { id: 4, icon: <Star size={24} fill="#FBBF24" stroke="#FBBF24" />, number: "4.9/5", label: "Avg Rating" }
  ];

  const statsContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const statCardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <div className={styles.landingContainer}>
      <Hero />

      {/* Featured Statistics */}
      <section className={styles.statsSection}>
        <motion.div 
          className={styles.statsGrid}
          variants={statsContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map(stat => (
            <motion.div 
              key={stat.id} 
              className={`${styles.statCard} glass-card`}
              variants={statCardVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 25px rgba(124, 58, 237, 0.15)' }}
            >
              <div className={styles.statIcon}>{stat.icon}</div>
              <div>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending / Featured Showcase */}
      <section className={styles.trendingSection}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.sectionSubtitle}>Handpicked Highlights</span>
            <h2 className={styles.sectionTitle}>Trending Events</h2>
          </div>
          <button className={styles.exploreBtn} onClick={() => navigate('/events')}>
            <span>Explore All Events</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className={styles.eventsGrid}>
          {trendingEvents.map(event => (
            <div key={event.id} className={styles.cardWrapper}>
              <EventCard event={event} onBook={onBookEvent} viewMode="grid" />
            </div>
          ))}
        </div>

        <div className={styles.middleCtaBanner} onClick={() => navigate('/events')}>
          <div className={styles.bannerGlow} />
          <div className={styles.bannerContent}>
            <h3>Looking for something specific?</h3>
            <p>Use our advanced filters to find events by location, date, price, and category.</p>
          </div>
          <button className={styles.bannerBtn}>
            <span>Browse All Events</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Platform Features / Roles Overview */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionCenterHeader}>
          <span className={styles.sectionSubtitle}>A Platform Built For Everyone</span>
          <h2 className={styles.sectionTitle}>Two Sides, One Seamless Experience</h2>
        </div>

        <div className={styles.featuresGrid}>
          {/* Attendee Side */}
          <div className={`${styles.featureCard} glass-card`}>
            <div className={`${styles.roleBadge} ${styles.attendeeBadge}`}>ATTENDEES</div>
            <h3>For Event Goers</h3>
            <p className={styles.roleDesc}>Discover local and online experiences, book securely, and manage all your digital passes in one place.</p>
            
            <ul className={styles.featureList}>
              <li>
                <Ticket className={styles.listIcon} size={18} />
                <span><strong>Instant Booking:</strong> Purchase tickets in under 30 seconds.</span>
              </li>
              <li>
                <Calendar className={styles.listIcon} size={18} />
                <span><strong>Flexible Filters:</strong> Find events by category, date, price, or city.</span>
              </li>
              <li>
                <ShieldCheck className={styles.listIcon} size={18} />
                <span><strong>Secure Passes:</strong> Offline-ready QR codes for seamless entry.</span>
              </li>
            </ul>

            {/* Pass role as router state so Login preselects it */}
            <button className={styles.roleBtnPrimary} onClick={() => navigate('/login', { state: { role: 'Attendee' } })}>
              <span>Browse Events</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Organizer Side */}
          <div className={`${styles.featureCard} glass-card`}>
            <div className={`${styles.roleBadge} ${styles.organizerBadge}`}>ORGANIZERS</div>
            <h3>For Event Hosts</h3>
            <p className={styles.roleDesc}>List your events, sell out seats, and monitor sales trends with comprehensive dashboard metrics.</p>

            <ul className={styles.featureList}>
              <li>
                <PlusCircle className={styles.listIcon} size={18} />
                <span><strong>Effortless Creation:</strong> Form-based listings published instantly.</span>
              </li>
              <li>
                <BarChart3 className={styles.listIcon} size={18} />
                <span><strong>Real-time Analytics:</strong> Track ticket revenue, counts, and ratings.</span>
              </li>
              <li>
                <Users className={styles.listIcon} size={18} />
                <span><strong>Attendee Oversight:</strong> View seat occupancy rates and statuses.</span>
              </li>
            </ul>

            {/* Pass role as router state so Login preselects it */}
            <button className={styles.roleBtnSecondary} onClick={() => navigate('/login', { state: { role: 'Organizer' } })}>
              <span>Go to Host Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
