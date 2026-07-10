/**
 * Shared utility to handle user routing after successful login or registration.
 * Centralizing this logic avoids duplication and ensures consistent error handling.
 * 
 * @param {string} role - The user role returned from the backend (Attendee or Organizer)
 * @param {function} navigate - React Router's useNavigate function
 * @param {function} setError - State setter for handling error messages locally in forms
 */
export const handleAuthRedirect = (role, navigate, setError) => {
  // Validate that the role is returned
  if (!role) {
    setError('Authentication was successful, but no role information was returned by the server. Please contact support.');
    return;
  }

  const normalizedRole = role.trim();

  // Route accordingly
  if (normalizedRole === 'Organizer') {
    navigate('/organizer');
  } else if (normalizedRole === 'Attendee') {
    navigate('/attendee');
  } else {
    // Show error for unrecognized roles
    setError(`Access denied. The role "${role}" is not authorized for this application.`);
  }
};
