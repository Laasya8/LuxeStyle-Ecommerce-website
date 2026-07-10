import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'luxestyle-cart';

const loadInitialState = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1 } = action.payload;
      const existing = state.find((item) => item.product._id === product._id);
      if (existing) {
        return state.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...state, { product, quantity, savedForLater: false }];
    }
    case 'REMOVE_ITEM':
      return state.filter((item) => item.product._id !== action.payload.productId);
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.product._id === action.payload.productId
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    case 'SAVE_FOR_LATER':
      return state.map((item) =>
        item.product._id === action.payload.productId
          ? { ...item, savedForLater: !item.savedForLater }
          : item
      );
    case 'CLEAR':
      return [];
    case 'SET':
      return action.payload;
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadInitialState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => {
    const activeItems = items.filter((item) => !item.savedForLater);
    const subtotal = activeItems.reduce(
      (sum, item) => sum + (item.product.discountPrice || item.product.price) * item.quantity,
      0
    );

    return {
      items,
      activeItems,
      savedItems: items.filter((item) => item.savedForLater),
      itemCount: activeItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      addItem: (product, quantity) => dispatch({ type: 'ADD_ITEM', payload: { product, quantity } }),
      removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', payload: { productId } }),
      updateQuantity: (productId, quantity) =>
        dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } }),
      toggleSaveForLater: (productId) => dispatch({ type: 'SAVE_FOR_LATER', payload: { productId } }),
      clearCart: () => dispatch({ type: 'CLEAR' }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};
