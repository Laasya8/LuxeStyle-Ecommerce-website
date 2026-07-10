import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'luxestyle-wishlist';

const loadInitialState = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

function wishlistReducer(state, action) {
  switch (action.type) {
    case 'TOGGLE': {
      const exists = state.some((p) => p._id === action.payload._id);
      return exists
        ? state.filter((p) => p._id !== action.payload._id)
        : [...state, action.payload];
    }
    case 'REMOVE':
      return state.filter((p) => p._id !== action.payload.productId);
    case 'CLEAR':
      return [];
    default:
      return state;
  }
}

export const WishlistProvider = ({ children }) => {
  const [items, dispatch] = useReducer(wishlistReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      isWishlisted: (productId) => items.some((p) => p._id === productId),
      toggleWishlist: (product) => dispatch({ type: 'TOGGLE', payload: product }),
      removeFromWishlist: (productId) => dispatch({ type: 'REMOVE', payload: { productId } }),
      clearWishlist: () => dispatch({ type: 'CLEAR' }),
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};
