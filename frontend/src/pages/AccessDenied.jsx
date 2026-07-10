import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import '../App.css';

export default function AccessDenied() {
  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="bg-gradient-glow" />
      
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', maxWidth: '450px', zIndex: 10 }}>
        <ShieldAlert size={64} color="#ef4444" style={{ margin: '0 auto 1.5rem', opacity: 0.8 }} />
        <h2 style={{ marginBottom: '1rem' }}>Access Denied</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          You do not have permission to view the Organizer Dashboard. This area is restricted to verified event organizers.
        </p>
        
        <Link 
          to="/events" 
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
            background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
            color: '#fff', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: 600
          }}
        >
          <ArrowLeft size={18} />
          Return to Events
        </Link>
      </div>
    </div>
  );
}
