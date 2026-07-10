import React, { useState, useEffect } from 'react';
import { Ticket, Menu, X } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar({ currentView, setView }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view) => {
    setView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logoContainer} onClick={handleLogoClick}>
        <span className={styles.logoIcon}>
          <Ticket size={28} strokeWidth={2.5} />
        </span>
        <span>GoLoco!</span>
      </div>

      <div className={styles.navLinks}>
        <button 
          className={`${styles.navLink} ${currentView === 'landing' ? styles.activeNavLink : ''}`}
          onClick={() => handleNavigate('landing')}
        >
          Home
        </button>
        <button 
          className={`${styles.navLink} ${currentView === 'attendee' ? styles.activeNavLink : ''}`}
          onClick={() => handleNavigate('attendee')}
        >
          Browse Events
        </button>
        <button 
          className={`${styles.navLink} ${currentView === 'organizer' ? styles.activeNavLink : ''}`}
          onClick={() => handleNavigate('organizer')}
        >
          Organizer Portal
        </button>
      </div>

      <div className={styles.authButtons}>
        <button className={styles.loginBtn}>Login</button>
        <button className={styles.signUpBtn}>Sign Up</button>
      </div>

      <button 
        className={styles.mobileMenuBtn} 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Drawer (Glassmorphic) */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: 0,
          right: 0,
          background: 'rgba(11, 15, 25, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          gap: '1.5rem',
          zIndex: 999
        }}>
          <button 
            onClick={() => handleNavigate('landing')} 
            style={{ 
              color: currentView === 'landing' ? 'var(--accent-purple)' : 'var(--text-primary)', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Home
          </button>
          <button 
            onClick={() => handleNavigate('attendee')} 
            style={{ 
              color: currentView === 'attendee' ? 'var(--accent-purple)' : 'var(--text-primary)', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Browse Events
          </button>
          <button 
            onClick={() => handleNavigate('organizer')} 
            style={{ 
              color: currentView === 'organizer' ? 'var(--accent-purple)' : 'var(--text-primary)', 
              fontSize: '1.1rem', 
              fontWeight: 600, 
              textAlign: 'left',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Organizer Portal
          </button>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '0.5rem 0' }} />
          <button style={{ color: '#fff', padding: '0.8rem', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>Login</button>
          <button style={{ background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)', color: '#fff', padding: '0.8rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>Sign Up</button>
        </div>
      )}
    </nav>
  );
}
