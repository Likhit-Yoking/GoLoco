import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Ticket, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { handleAuthRedirect } from '../utils/authRedirect';
import '../App.css';

/**
 * Login page — consumes `useAuth` context to talk to the ASP.NET Core backend.
 * 
 * Flow:
 * 1. User submits email + password.
 * 2. login() function from AuthContext POSTs credentials to /api/auth/login.
 * 3. AuthContext updates state with the token & profile, and stores them in localStorage.
 * 4. Navigates the user to their target dashboard depending on their role:
 *    - Organizer -> /organizer
 *    - Attendee -> /attendee
 * 5. Handles API errors (like 401 Unauthorized) gracefully and shows them inline.
 */
export default function Login() {
  const location = useLocation();
  // Read the role passed from the landing page via navigate state.
  // If no role was passed (e.g. direct URL visit), intendedRole is null and
  // the user sees a generic sign-in screen.
  const intendedRole = location.state?.role ?? null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Trigger login through AuthContext
      const response = await login(email, password);
      
      // Perform role validation and redirect using shared utility
      handleAuthRedirect(response?.role, navigate, setError);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
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
    <div
      className="app-container"
      style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}
    >
      <div className="bg-gradient-glow" />

      <div
        className="glass-card"
        style={{ width: '100%', maxWidth: '420px', padding: '2.5rem', position: 'relative', zIndex: 10 }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
          <Link
            to="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', color: '#fff' }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
                padding: '0.5rem',
                borderRadius: '50%',
                display: 'flex',
              }}
            >
              <Ticket size={24} />
            </span>
            <span style={{ fontSize: '1.6rem', fontWeight: 700, letterSpacing: '-0.5px' }}>GoLoco!</span>
          </Link>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.4rem', fontSize: '1.5rem' }}>Welcome Back</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: intendedRole ? '1rem' : '2rem', fontSize: '0.9rem' }}>
          {intendedRole === 'Organizer'
            ? 'Sign in to your Organizer account to manage your events.'
            : intendedRole === 'Attendee'
            ? 'Sign in to your Attendee account to browse and book events.'
            : 'Sign in to manage your events or tickets.'}
        </p>

        {/* Role badge — shown and locked when arriving from the landing page */}
        {intendedRole && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '0.5rem', marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            background: intendedRole === 'Organizer'
              ? 'rgba(124, 58, 237, 0.15)'
              : 'rgba(59, 130, 246, 0.15)',
            border: `1px solid ${intendedRole === 'Organizer' ? 'rgba(124,58,237,0.4)' : 'rgba(59,130,246,0.4)'}`,
            borderRadius: '0.5rem',
          }}>
            <span style={{
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em',
              color: intendedRole === 'Organizer' ? '#A78BFA' : '#60A5FA',
            }}>
              {intendedRole === 'Organizer' ? '🎤 Signing in as Organizer' : '🎟️ Signing in as Attendee'}
            </span>
            <Link
              to="/login"
              replace
              state={{}} // clear state → generic login
              style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-secondary)', textDecoration: 'underline' }}
            >
              Change
            </Link>
          </div>
        )}

        {/* Error Message Display */}
        {error && (
          <div
            role="alert"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              color: '#f87171',
              padding: '0.8rem 1rem',
              borderRadius: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.5',
            }}
          >
            {error}
          </div>
        )}

        <form id="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Email input */}
          <div>
            <label
              htmlFor="login-email"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}
            >
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          {/* Password input with show/hide toggle */}
          <div>
            <label
              htmlFor="login-password"
              style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{ ...inputStyle, paddingRight: '3rem' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginTop: '0.25rem',
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, var(--accent-blue) 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
            }}
          >
            {loading ? (
              <>
                <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Signing in…
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          {/* Forward the same role state so Signup pre-selects and locks it too */}
          <Link to="/signup" state={intendedRole ? { role: intendedRole } : undefined} style={{ color: 'var(--accent-purple)', textDecoration: 'none', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
