import { request } from './apiClient';
import { parseJwt } from '../utils/jwtHelper';

// ASP.NET Core serializes C# PascalCase property names to camelCase by default.
// So AuthResponseDto { Token, Name, Email, Role } becomes { token, name, email, role }.

/**
 * Service to manage authentication and user sessions.
 * Wired directly to POST /api/auth/login and POST /api/auth/register
 * on the ASP.NET Core backend.
 */
export const authService = {
  /**
   * Step 1: POST credentials to /api/auth/login.
   * Step 2: Receive { token, name, email, role } from AuthResponseDto.
   * Step 3: Persist token and user profile to localStorage.
   * Step 4: Return the full response so the caller can redirect.
   *
   * @param {Object} credentials - { email: string, password: string }
   * @returns {Promise<{ token: string, name: string, email: string, role: string }>}
   */
  async login(credentials) {
    // apiClient.request() automatically:
    //   - Sets Content-Type: application/json
    //   - JSON.stringifies the body
    //   - Throws ApiError on non-2xx responses (e.g. 401 Unauthorized)
    const data = await request('/auth/login', {
      method: 'POST',
      body: credentials,
    });

    if (data && data.token) {
      // Persist the raw JWT so apiClient injects it as "Authorization: Bearer <token>"
      // on all subsequent protected API requests automatically.
      localStorage.setItem('token', data.token);

      // Persist the user profile separately so UI components can display
      // the user's name, email, and role without decoding the JWT each time.
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
      }));
    }

    return data;
  },

  /**
   * POST to /api/auth/register.
   * The backend creates the user, hashes the password with BCrypt, and
   * returns the same AuthResponseDto shape as login on success.
   *
   * @param {Object} userData - { name, email, password, role }
   */
  async register(userData) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: userData,
    });

    // Auto-login after successful registration (backend returns a token immediately)
    if (data && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
      }));
    }

    return data;
  },

  /**
   * Clear localStorage to log out the user.
   * The JWT is stateless on the backend, so removing it from the client
   * is sufficient to end the session.
   */
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Check if there is a valid (non-expired) JWT stored locally.
   * Used by ProtectedRoute and Navbar to conditionally render auth UI.
   *
   * @returns {boolean}
   */
  isAuthenticated() {
    const token = localStorage.getItem('token');
    if (!token) return false;

    // Verify the token hasn't expired by inspecting the 'exp' claim
    const payload = parseJwt(token);
    if (!payload || !payload.exp) return false;

    const isExpired = payload.exp * 1000 < Date.now();
    if (isExpired) {
      // Silently clean up the stale token
      this.logout();
      return false;
    }

    return true;
  },

  /**
   * Read the stored user profile from localStorage.
   * This is set during login/register from the AuthResponseDto fields.
   *
   * @returns {{ name: string, email: string, role: string } | null}
   */
  getUser() {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  /**
   * Get the current user's role.
   * Falls back to decoding the JWT payload directly if the 'user' item
   * in localStorage is missing or corrupted.
   *
   * ASP.NET Core uses ClaimTypes.Role which serializes to the long
   * Microsoft URI in the JWT payload. We check multiple keys to be safe.
   *
   * @returns {string | null}
   */
  getRole() {
    // First try the stored profile (fast, no decoding)
    const user = this.getUser();
    if (user?.role) return user.role;

    // Fallback: decode JWT and extract role claim
    const token = localStorage.getItem('token');
    if (!token) return null;

    const payload = parseJwt(token);
    // ASP.NET ClaimTypes.Role maps to this URI inside the JWT
    return (
      payload?.role ||
      payload?.Role ||
      payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      null
    );
  },
};

export default authService;
