import API_BASE_URL from '../config/api';

/**
 * Custom error class for API response errors.
 * Captures status code and parsed error response payload if available.
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Standard fetch client wrapper to request API endpoints.
 * Handles headers, request bodies, auth tokens, parsing, and standardized error catching.
 * 
 * @param {string} endpoint - API path (e.g. '/events' or '/auth/login')
 * @param {Object} options - Standard fetch options overrides
 */
export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Initialize headers
  const headers = new Headers(options.headers || {});
  
  // Format body and Content-Type automatically for JSON requests
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  // Inject Bearer Authorization header if token exists in LocalStorage
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Dynamically parse response content
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401) {
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      // Standardize ASP.NET validation or generic errors
      const errorMessage = (data && (data.message || data.title)) || data || `Request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Handle offline network errors or CORS failures
    throw new ApiError(error.message || 'Network connectivity error', 500, null);
  }
}
