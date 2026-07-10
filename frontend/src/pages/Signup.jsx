import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Ticket, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleAuthRedirect } from '../utils/authRedirect';
import '../App.css'; 

/**
 * Signup page — consumes `useAuth` context to register a new user in ASP.NET Core.
 */
export default function Signup() {
  const location = useLocation();
  // Inherit the role chosen on the landing page (passed via navigate state).
  // Fall back to 'Attendee' when the page is visited directly.
  const intendedRole = location.state?.role ?? null;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Seed the role from navigation state so it is pre-selected on mount.
  const [role, setRole] = useState(intendedRole ?? 'Attendee');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Trigger registration. This POSTs to /api/auth/register, receives the session
      // token + role, stores it, and logs the user in immediately.
      const response = await register({ name, email, password, role });
      
      // Perform role validation and redirect using shared utility
      handleAuthRedirect(response?.role, navigate, setError);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
    color: '#fff',
    outline: 'none',
    fontSize: '1rem',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div className="bg-gradient-glow" />
      
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: '#fff' }}>
            <span style={{ background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
              <Ticket size={24} />
            </span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700 }}>GoLoco!</span>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {intendedRole === 'Organizer'
            ? 'Create your Organizer account to start hosting events.'
            : intendedRole === 'Attendee'
            ? 'Create your Attendee account to start booking events.'
            : 'Join the GoLoco community today.'}
        </p>

        {/* Error message banner */}
        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            color: '#ef4444', 
            padding: '0.75rem', 
            borderRadius: '0.5rem', 
            marginBottom: '1.5rem', 
            fontSize: '0.9rem' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Role selector — locked when user arrived from the landing page */}
          {intendedRole ? (
            // Arriving from landing page: show a locked read-only badge instead of the toggle
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.6rem 1rem',
              background: intendedRole === 'Organizer' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(59, 130, 246, 0.15)',
              border: `1px solid ${intendedRole === 'Organizer' ? 'rgba(124,58,237,0.4)' : 'rgba(59,130,246,0.4)'}`,
              borderRadius: '0.5rem',
            }}>
              <span style={{
                fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em',
                color: intendedRole === 'Organizer' ? '#A78BFA' : '#60A5FA',
              }}>
                {intendedRole === 'Organizer' ? '🎤 Registering as Organizer' : '🎟️ Registering as Attendee'}
              </span>
              <Link
                to="/signup"
                replace
                state={{}} // clear state → free toggle
                style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}
              >
                Change
              </Link>
            </div>
          ) : (
            // Direct visit: show the free Attendee / Organizer toggle
            <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRole('Attendee')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: 'none', fontWeight: 600, cursor: 'pointer',
                  background: role === 'Attendee' ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: role === 'Attendee' ? '#fff' : 'var(--text-secondary)'
                }}
              >
                Attendee
              </button>
              <button
                type="button"
                onClick={() => setRole('Organizer')}
                style={{
                  flex: 1, padding: '0.5rem', borderRadius: '0.25rem', border: 'none', fontWeight: 600, cursor: 'pointer',
                  background: role === 'Organizer' ? 'rgba(124, 58, 237, 0.2)' : 'transparent',
                  color: role === 'Organizer' ? 'var(--accent-purple)' : 'var(--text-secondary)'
                }}
              >
                Organizer
              </button>
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              placeholder="••••••••"
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
              color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
