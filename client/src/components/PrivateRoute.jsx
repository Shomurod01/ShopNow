import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a loading spinner while we check the auth state
  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  // If the user isn't logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the component
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  // Wait for auth to finish loading
  if (loading) {
    return <LoadingSpinner fullPage />;
  }

  // Redirect unauthorized users to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Restrict access to admin users only
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // User is an admin, so allow access
  return children;
};
