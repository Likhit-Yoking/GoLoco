import React, { useState } from 'react';
import { Pencil, Trash2, Calendar, MapPin, Users, Loader2 } from 'lucide-react';
import eventService from '../../services/eventService';

/**
 * OrganizerEventRow
 *
 * A reusable card for a single event inside the Organizer Dashboard listings panel.
 * Renders event metadata, a capacity progress bar, an Edit button, and a Delete button.
 *
 * Props:
 *   event          — EventDto object from the backend
 *   onEdit(event)  — called when the user clicks Edit (parent opens EditEventModal)
 *   onDeleted()    — called after a successful DELETE so the parent can refresh
 */
export default function OrganizerEventRow({ event, onEdit, onDeleted }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Remove "${event.title}"?\n\nAll attendee bookings for this event will be voided.`)) return;

    setDeleting(true);
    try {
      // DELETE /api/events/{id} — apiClient auto-attaches Authorization: Bearer <JWT>
      await eventService.deleteEvent(event.id);
      onDeleted();   // trigger parent to decrement list / refresh
    } catch (err) {
      if (err.status === 403) {
        alert('You can only delete events you own.');
      } else if (err.status === 401) {
        alert('Session expired. Please log in again.');
      } else {
        alert(err.message || 'Failed to delete event. Please try again.');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Safe capacity math — guard against undefined fields from backend response
  const capacity  = event.totalCapacity ?? event.totalSeats ?? 0;
  const seatsLeft = event.seatsLeft ?? capacity;
  const sold      = Math.max(0, capacity - seatsLeft);
  const pct       = capacity > 0 ? Math.min(100, (sold / capacity) * 100) : 0;

  // Format ISO date string to readable form if it's still in ISO format
  const displayDate = (() => {
    try {
      return event.date?.includes('T')
        ? new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : event.date;
    } catch { return event.date; }
  })();

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1rem',
      borderRadius: '0.75rem',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      transition: 'border-color 0.2s',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Event image — falls back to a gradient placeholder */}
      {event.image ? (
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '0.5rem', flexShrink: 0 }}
        />
      ) : (
        <div style={{
          width: '72px', height: '72px', borderRadius: '0.5rem', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem',
        }}>
          🎟️
        </div>
      )}

      {/* Main info column */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '220px' }}>
            {event.title}
          </h3>
          {event.category && (
            <span style={{
              fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem',
              background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: '9999px', color: '#A78BFA', letterSpacing: '0.04em',
            }}>
              {event.category.toUpperCase()}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '0.6rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={12} /> {displayDate}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={12} /> {event.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Users size={12} /> {capacity} seats
          </span>
          {event.price && (
            <span style={{ color: '#34d399', fontWeight: 600 }}>{event.price}</span>
          )}
        </div>

        {/* Capacity progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>
            <span>Tickets Sold</span>
            <span><strong style={{ color: '#fff' }}>{sold}</strong> / {capacity} ({pct.toFixed(0)}%)</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: pct > 80
                ? 'linear-gradient(90deg, #FBBF24, #F59E0B)'
                : 'linear-gradient(90deg, var(--accent-purple), var(--accent-blue))',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Action buttons column */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
        <button
          onClick={() => onEdit(event)}
          title="Edit event"
          style={{
            padding: '0.45rem 0.7rem',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: '0.4rem',
            color: '#A78BFA',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.8rem', fontWeight: 600,
          }}
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          title="Delete event"
          style={{
            padding: '0.45rem 0.7rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            borderRadius: '0.4rem',
            color: '#f87171',
            cursor: deleting ? 'not-allowed' : 'pointer',
            opacity: deleting ? 0.6 : 1,
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            fontSize: '0.8rem', fontWeight: 600,
          }}
        >
          {deleting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
          {deleting ? '...' : 'Delete'}
        </button>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
