import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api } from '../services/api.js';

/** Fetches the synced Mongo user (role, addresses, wishlist, cart) for the signed-in Clerk session. */
export const useCurrentUser = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api
      .get('/users/me')
      .then((res) => {
        if (!cancelled) setUser(res.data.data);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isSignedIn, isLoaded]);

  return { user, loading, isSignedIn, isLoaded };
};
