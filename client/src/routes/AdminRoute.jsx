import { Navigate, Outlet } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import { Spinner } from '../components/ui/Spinner.jsx';
import { isClerkConfigured } from '../utils/constants.js';
import { SetupNotice } from '../components/ui/SetupNotice.jsx';

const AdminRouteInner = () => {
  const { user, loading, isLoaded, isSignedIn } = useCurrentUser();

  if (!isLoaded || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isSignedIn || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const AdminRoute = () => {
  if (!isClerkConfigured) {
    return <SetupNotice />;
  }

  return <AdminRouteInner />;
};
