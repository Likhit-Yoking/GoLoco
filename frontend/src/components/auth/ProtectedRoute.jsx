import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route Guard that protects private routes.
 * 
 * Flow:
 * 1. Checks if the application is currently checking/initializing the user session.
 *    If loading, it displays a loading placeholder to prevent flash redirects.
 * 2. If the user is unauthenticated, they are redirected to `/login`.
 * 3. If a specific `allowedRole` is defined and the user's role does not match, 
 *    they are redirected to `/unauthorized` (Access Denied).
 * 4. Otherwise, it renders the protected component.
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const { isAuthenticated, user, loading } = useAuth();

  // Prevent UI flashing/redirect loops while restoring token status on page refresh
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        background: '#0B0F19',
        color: '#fff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid var(--accent-purple, #7C3AED)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: 'var(--text-secondary, #94A3B8)', fontSize: '0.9rem' }}>Verifying session...</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    // User is not logged in
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // User is logged in but doesn't have the correct authorization role
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? children : <Outlet />;
}
