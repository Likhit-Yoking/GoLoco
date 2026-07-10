import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, X, Calendar, MapPin, QrCode, Search, Award, Info } from 'lucide-react';
import EventDiscovery from './EventDiscovery';
import EventList from './EventList';
import styles from './AttendeePortal.module.css';

export default function AttendeePortal({
  eventList,
  filters,
  setFilters,
  onResetFilters,
  filteredEvents,
  onBookEvent,
  activeChip,
  setActiveChip,
  bookedTickets,
  setView
}) {
  const [showWallet, setShowWallet] = useState(false);
  const [focusedTicket, setFocusedTicket] = useState(null);

  const handleOpenWallet = () => {
    setShowWallet(true);
  };

  const handleCloseWallet = () => {
    setShowWallet(false);
    setFocusedTicket(null);
  };

  return (
    <div className={styles.portalContainer}>
      {/* Attendee Portal Header Banner */}
      <div className={styles.portalHeader}>
        <div className={styles.headerGlow} />
        <div className={styles.headerContent}>
          <span className={styles.badge}><Award size={12} /> ATTENDEE HUB</span>
          <h1>Find Your Next Experience</h1>
          <p>Browse through hundreds of events, filter by date, location, or pricing, and book your tickets instantly.</p>
        </div>
        <div className={styles.headerIllustration}>
          <div className={styles.miniCard1}>
            <Ticket size={24} className={styles.miniIcon} />
            <span>Premium Passes</span>
          </div>
          <div className={styles.miniCard2}>
            <QrCode size={24} className={styles.miniIcon} />
            <span>Fast Entry</span>
          </div>
        </div>
      </div>

      {/* Discovery & Filters */}
      <EventDiscovery 
        filters={filters} 
        setFilters={setFilters} 
        onReset={onResetFilters}
      />

      {/* Events Grid and Sorting */}
      <EventList 
        filteredEvents={filteredEvents} 
        onBookEvent={onBookEvent}
        activeChip={activeChip}
        setActiveChip={setActiveChip}
        sortBy={filters.sortBy}
        setSortBy={(val) => setFilters(prev => ({ ...prev, sortBy: val }))}
      />

      {/* Floating Ticket Wallet Trigger */}
      {bookedTickets.length > 0 && (
        <motion.button 
          className={styles.walletTrigger}
          onClick={handleOpenWallet}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          layout
        >
          <div className={styles.pulseGlow} />
          <Ticket size={22} />
          <span className={styles.walletCount}>{bookedTickets.length}</span>
          <span className={styles.walletLabel}>My Tickets</span>
        </motion.button>
      )}

      {/* Ticket Wallet Sidebar Drawer */}
      <AnimatePresence>
        {showWallet && (
          <div className={styles.drawerOverlay} onClick={handleCloseWallet}>
            <motion.div 
              className={`${styles.drawerContent} glass-card`}
              onClick={(e) => e.stopPropagation()}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className={styles.drawerHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Ticket className={styles.drawerHeaderIcon} size={24} />
                  <h2>My Ticket Wallet</h2>
                </div>
                <button className={styles.closeBtn} onClick={handleCloseWallet}>
                  <X size={20} />
                </button>
              </div>

              <div className={styles.walletInfo}>
                <Info size={16} />
                <span>Show these QR codes at the event gates for validation.</span>
              </div>

              <div className={styles.ticketsList}>
                {bookedTickets.map((ticket) => {
                  const isFocused = focusedTicket?.id === ticket.id;
                  return (
                    <div 
                      key={ticket.id} 
                      className={`${styles.ticketCard} ${isFocused ? styles.focusedTicketCard : ''}`}
                    >
                      <div className={styles.ticketMain}>
                        <img 
                          src={ticket.event.image} 
                          alt={ticket.event.title} 
                          className={styles.ticketImg} 
                        />
                        <div className={styles.ticketDetails}>
                          <h3>{ticket.event.title}</h3>
                          <div className={styles.ticketMeta}>
                            <div className={styles.ticketMetaItem}>
                              <Calendar size={12} />
                              <span>{ticket.date}</span>
                            </div>
                            <div className={styles.ticketMetaItem}>
                              <MapPin size={12} />
                              <span>{ticket.location}</span>
                            </div>
                          </div>
                          <div className={styles.ticketQtyRow}>
                            <span>Qty: <strong>{ticket.quantity}</strong></span>
                            <span>Paid: <strong>{ticket.amount}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className={styles.ticketActions}>
                        <button 
                          className={styles.viewPassBtn}
                          onClick={() => setFocusedTicket(isFocused ? null : ticket)}
                        >
                          <QrCode size={14} />
                          <span>{isFocused ? 'Hide Pass' : 'View Pass QR'}</span>
                        </button>
                        <span className={styles.ticketId}>{ticket.id}</span>
                      </div>

                      {/* Expandable Pass Details and QR Code */}
                      <AnimatePresence>
                        {isFocused && (
                          <motion.div 
                            className={styles.qrExpandArea}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className={styles.qrWrapper}>
                              <div className={styles.qrCodeGraphic}>
                                <div className={styles.qrCornerInside + ' ' + styles.qrTl}></div>
                                <div className={styles.qrCornerInside + ' ' + styles.qrTr}></div>
                                <div className={styles.qrCornerInside + ' ' + styles.qrBl}></div>
                                <div className={styles.qrDotInside + ' ' + styles.dot1}></div>
                                <div className={styles.qrDotInside + ' ' + styles.dot2}></div>
                                <div className={styles.qrDotInside + ' ' + styles.dot3}></div>
                                <div className={styles.qrDotInside + ' ' + styles.dot4}></div>
                              </div>
                              <span className={styles.qrCodeId}>{ticket.id}</span>
                              <span className={styles.qrScanText}>SCAN FOR ENTRY</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
