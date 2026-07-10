import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { isClerkConfigured } from '../utils/constants.js';
import { SetupNotice } from '../components/ui/SetupNotice.jsx';

const ProtectedRouteInner = () => {
  const location = useLocation();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Navigate to="/" replace state={{ from: location, requireSignIn: true }} />;
  }

  return <Outlet />;
};

export const ProtectedRoute = () => {
  if (!isClerkConfigured) {
    return <SetupNotice />;
  }

  return <ProtectedRouteInner />;
};
