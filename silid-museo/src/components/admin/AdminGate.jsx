import { Navigate } from 'react-router-dom';

/**
 * Route guard that checks for admin session.
 * Wraps dashboard pages — if not authenticated, redirects to /admin login.
 */
export default function AdminGate({ children }) {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
