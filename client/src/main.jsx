import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { WishlistProvider } from './context/WishlistContext.jsx';
import { AuthTokenProvider } from './context/AuthTokenProvider.jsx';
import { CLERK_PUBLISHABLE_KEY, isClerkConfigured } from './utils/constants.js';

const AppShell = () => (
  <>
    <App />
    <Toaster
      position="bottom-right"
      toastOptions={{
        className: 'text-sm',
      }}
    />
  </>
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CartProvider>
        <WishlistProvider>
          {isClerkConfigured ? (
            <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} afterSignOutUrl="/">
              <AuthTokenProvider>
                <BrowserRouter>
                  <AppShell />
                </BrowserRouter>
              </AuthTokenProvider>
            </ClerkProvider>
          ) : (
            <BrowserRouter>
              <AppShell />
            </BrowserRouter>
          )}
        </WishlistProvider>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>
);
