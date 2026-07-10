import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { attachAuthInterceptor } from '../services/api.js';

/** Wires Clerk's session token into every outgoing API request. Renders nothing. */
export const AuthTokenProvider = ({ children }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    const detach = attachAuthInterceptor(getToken);
    return detach;
  }, [getToken]);

  return children;
};
