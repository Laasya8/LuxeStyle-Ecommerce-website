import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useClerk, useAuth } from '@clerk/clerk-react';

/** Watches for ProtectedRoute's requireSignIn redirect and opens Clerk's sign-in modal. Renders nothing. */
export const SignInPrompt = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openSignIn } = useClerk();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded || isSignedIn || !location.state?.requireSignIn) return;

    const redirectUrl = location.state.from?.pathname || '/';
    openSignIn({ redirectUrl });
    navigate(location.pathname, { replace: true, state: null });
  }, [isLoaded, isSignedIn, location, navigate, openSignIn]);

  return null;
};
